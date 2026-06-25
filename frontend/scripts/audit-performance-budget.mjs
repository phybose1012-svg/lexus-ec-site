import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import zlib from "node:zlib";
import { chromium } from "playwright-core";

const root = path.resolve(process.cwd(), "dist");
const srcRoot = path.resolve(process.cwd(), "src");
const workspace = path.resolve(process.cwd(), "..");
const reportDir = path.join(workspace, "reports");
fs.mkdirSync(reportDir, { recursive: true });

const mime = (file) => {
  if (file.endsWith(".html")) return "text/html; charset=utf-8";
  if (file.endsWith(".css")) return "text/css";
  if (file.endsWith(".js")) return "text/javascript";
  if (file.endsWith(".svg")) return "image/svg+xml";
  if (file.endsWith(".png")) return "image/png";
  if (file.endsWith(".jpg") || file.endsWith(".jpeg")) return "image/jpeg";
  if (file.endsWith(".webp")) return "image/webp";
  if (file.endsWith(".ico")) return "image/x-icon";
  return "application/octet-stream";
};

const walk = (dir, predicate = () => true) => {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(file, predicate));
    else if (entry.isFile() && predicate(file)) files.push(file);
  }
  return files;
};

const htmlFiles = walk(root, (file) => path.basename(file) === "index.html");
const routeFor = (file) => {
  const route = `/${path.relative(root, file).replace(/\\/g, "/").replace(/index\.html$/, "")}`;
  return route || "/";
};
const routes = htmlFiles.map(routeFor).sort((a, b) => a.localeCompare(b));

const safeFileForRequest = (requestUrl) => {
  const url = new URL(requestUrl, "http://127.0.0.1");
  const pathname = decodeURIComponent(url.pathname);
  let file = path.resolve(root, `.${pathname}`);
  if (!file.startsWith(root)) return null;
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  return file;
};

const server = http.createServer((req, res) => {
  const file = safeFileForRequest(req.url || "/");
  if (!file) {
    res.writeHead(403);
    res.end("forbidden");
    return;
  }
  if (!fs.existsSync(file)) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("not found");
    return;
  }
  const stat = fs.statSync(file);
  res.writeHead(200, {
    "content-type": mime(file),
    "content-length": String(stat.size),
    "cache-control": "public, max-age=31536000, immutable",
  });
  fs.createReadStream(file).pipe(res);
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const origin = `http://127.0.0.1:${port}`;

const assetRecord = (file) => {
  const buffer = fs.readFileSync(file);
  return {
    file: path.relative(root, file).replace(/\\/g, "/"),
    bytes: buffer.byteLength,
    gzipBytes: zlib.gzipSync(buffer).byteLength,
    brotliBytes: zlib.brotliCompressSync(buffer).byteLength,
  };
};

const distAssets = {
  html: htmlFiles.map(assetRecord),
  css: walk(root, (file) => file.endsWith(".css")).map(assetRecord),
  js: walk(root, (file) => file.endsWith(".js")).map(assetRecord),
};

const sourceFiles = walk(srcRoot, (file) => /\.(astro|ts|tsx|js|mjs|css)$/.test(file));

const countMatches = (text, pattern) => [...text.matchAll(pattern)].length;
const cssSourceFiles = sourceFiles.filter((file) => file.endsWith(".css"));
const cssAudit = cssSourceFiles.map((file) => {
  const text = fs.readFileSync(file, "utf8");
  const relative = path.relative(process.cwd(), file).replace(/\\/g, "/");
  return {
    file: relative,
    bytes: Buffer.byteLength(text),
    approximateRules: countMatches(text, /\{[^}]*\}/g),
    importantCount: countMatches(text, /!important\b/g),
    customPropertyDefinitions: countMatches(text, /--[a-z0-9-]+\s*:/gi),
    mediaQueryCount: countMatches(text, /@media\b/g),
    cssUrlCount: countMatches(text, /url\(/g),
    externalCssUrlCount: countMatches(text, /url\(["']?https?:\/\//g),
  };
});

const sourceAudit = sourceFiles.map((file) => {
  const text = fs.readFileSync(file, "utf8");
  const relative = path.relative(process.cwd(), file).replace(/\\/g, "/");
  return {
    file: relative,
    inlineStyleAttrs: countMatches(text, /\sstyle=/g),
    styleTags: countMatches(text, /<style(?:\s|>)/g),
    scriptTags: countMatches(text, /<script(?:\s|>)/g),
    externalScriptTags: countMatches(text, /<script[^>]+src=/g),
    iframeTags: countMatches(text, /<iframe(?:\s|>)/g),
    elementorMentions: countMatches(text, /elementor/gi),
    wpContentMentions: countMatches(text, /wp-content/gi),
  };
});

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});

const sumBytes = (items) => items.reduce((total, item) => total + (item.bytes || 0), 0);
const sumGzipBytes = (items) => items.reduce((total, item) => total + (item.gzipBytes || 0), 0);
const sumBrotliBytes = (items) => items.reduce((total, item) => total + (item.brotliBytes || 0), 0);

const results = [];

for (const route of routes) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
  const requests = [];
  const byRequest = new Map();

  page.on("request", (request) => {
    const url = request.url();
    let parsed = null;
    try {
      parsed = new URL(url);
    } catch {
      // Ignore non-URL request schemes in summaries.
    }
    const record = {
      url,
      host: parsed?.host || "",
      pathname: parsed?.pathname || "",
      resourceType: request.resourceType(),
      method: request.method(),
      isLocal: url.startsWith(origin),
      status: null,
      bytes: 0,
      failed: "",
    };
    byRequest.set(request, record);
    requests.push(record);
  });

  page.on("response", (response) => {
    const record = byRequest.get(response.request());
    if (!record) return;
    record.status = response.status();
    const contentLength = response.headers()["content-length"];
    record.bytes = Number.parseInt(contentLength || "0", 10) || 0;
  });

  page.on("requestfailed", (request) => {
    const record = byRequest.get(request);
    if (!record) return;
    record.failed = request.failure()?.errorText || "failed";
  });

  let navigationStatus = null;
  let navigationError = "";
  try {
    const response = await page.goto(`${origin}${route}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    navigationStatus = response?.status() || null;
    await page.waitForTimeout(350);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
  } catch (error) {
    navigationError = error.message;
  }

  const dom = await page.evaluate(() => {
    const encoder = new TextEncoder();
    const inlineScripts = Array.from(document.scripts).filter((script) => !script.src);
    const jsonLdScripts = inlineScripts.filter((script) => script.type === "application/ld+json");
    const functionalInlineScripts = inlineScripts.filter((script) => script.type !== "application/ld+json");
    const bytesFor = (scripts) =>
      scripts.reduce((total, script) => total + encoder.encode(script.textContent || "").byteLength, 0);

    return {
      title: document.title,
      stylesheetLinks: Array.from(document.querySelectorAll('link[rel~="stylesheet"]')).map((link) => link.href),
      scriptSrcs: Array.from(document.scripts).map((script) => script.src).filter(Boolean),
      inlineScriptCount: inlineScripts.length,
      inlineScriptBytes: bytesFor(inlineScripts),
      functionalInlineScriptCount: functionalInlineScripts.length,
      functionalInlineScriptBytes: bytesFor(functionalInlineScripts),
      jsonLdCount: jsonLdScripts.length,
      jsonLdBytes: bytesFor(jsonLdScripts),
      styleTagCount: document.querySelectorAll("style").length,
      inlineStyleAttrs: document.querySelectorAll("[style]").length,
      iframeCount: document.querySelectorAll("iframe").length,
      imageCount: document.images.length,
      lazyImageCount: Array.from(document.images).filter((image) => image.loading === "lazy").length,
    };
  });

  const unique = (items) => [...new Set(items)];
  const localRequests = requests.filter((request) => request.isLocal);
  const externalRequests = requests.filter((request) => !request.isLocal && /^https?:\/\//.test(request.url));
  const localCss = localRequests.filter((request) => request.pathname.endsWith(".css"));
  const localJs = localRequests.filter((request) => request.pathname.endsWith(".js"));
  const hostSummary = {};
  for (const request of externalRequests) {
    hostSummary[request.host] ||= { total: 0, byType: {}, failed: 0 };
    hostSummary[request.host].total += 1;
    hostSummary[request.host].byType[request.resourceType] = (hostSummary[request.host].byType[request.resourceType] || 0) + 1;
    if (request.failed) hostSummary[request.host].failed += 1;
  }

  results.push({
    route,
    navigationStatus,
    navigationError,
    title: dom.title,
    dom,
    requestSummary: {
      total: requests.length,
      localTotal: localRequests.length,
      externalTotal: externalRequests.length,
      localCssFiles: unique(localCss.map((request) => request.pathname)).sort(),
      localCssBytes: sumBytes(localCss),
      localJsFiles: unique(localJs.map((request) => request.pathname)).sort(),
      localJsBytes: sumBytes(localJs),
      externalHosts: hostSummary,
      localBadResponses: localRequests
        .filter((request) => (request.status || 0) >= 400 || request.failed)
        .map((request) => `${request.status || request.failed} ${request.pathname}`),
      externalFailures: externalRequests
        .filter((request) => request.failed)
        .map((request) => `${request.host}${request.pathname} :: ${request.failed}`),
    },
  });

  await page.close();
}

await browser.close();
server.close();

const mergeHosts = (pages) => {
  const merged = {};
  for (const page of pages) {
    for (const [host, data] of Object.entries(page.requestSummary.externalHosts)) {
      merged[host] ||= { total: 0, byType: {}, failed: 0 };
      merged[host].total += data.total;
      merged[host].failed += data.failed;
      for (const [type, count] of Object.entries(data.byType)) {
        merged[host].byType[type] = (merged[host].byType[type] || 0) + count;
      }
    }
  }
  return Object.fromEntries(Object.entries(merged).sort((a, b) => b[1].total - a[1].total));
};

const sortBy = (selector) => [...results].sort((a, b) => selector(b) - selector(a));
const report = {
  auditedAt: new Date().toISOString(),
  pages: results.length,
  distAssets: {
    htmlFilesTotal: distAssets.html.length,
    htmlBytesTotal: sumBytes(distAssets.html),
    htmlGzipBytesTotal: sumGzipBytes(distAssets.html),
    htmlBrotliBytesTotal: sumBrotliBytes(distAssets.html),
    largestHtmlFiles: [...distAssets.html].sort((a, b) => b.bytes - a.bytes).slice(0, 10),
    cssFiles: distAssets.css,
    jsFiles: distAssets.js,
    cssBytesTotal: sumBytes(distAssets.css),
    cssGzipBytesTotal: sumGzipBytes(distAssets.css),
    cssBrotliBytesTotal: sumBrotliBytes(distAssets.css),
    jsBytesTotal: sumBytes(distAssets.js),
    jsGzipBytesTotal: sumGzipBytes(distAssets.js),
    jsBrotliBytesTotal: sumBrotliBytes(distAssets.js),
  },
  cssAudit,
  sourceAuditSummary: {
    filesWithInlineStyleAttrs: sourceAudit.filter((item) => item.inlineStyleAttrs > 0),
    filesWithStyleTags: sourceAudit.filter((item) => item.styleTags > 0),
    filesWithScriptTags: sourceAudit.filter((item) => item.scriptTags > 0),
    filesWithExternalScriptTags: sourceAudit.filter((item) => item.externalScriptTags > 0),
    filesWithIframeTags: sourceAudit.filter((item) => item.iframeTags > 0),
    filesWithElementorMentions: sourceAudit.filter((item) => item.elementorMentions > 0),
    filesWithWpContentMentions: sourceAudit.filter((item) => item.wpContentMentions > 0),
  },
  pageSummary: {
    maxLocalCssBytes: sortBy((page) => page.requestSummary.localCssBytes).slice(0, 5).map((page) => ({
      route: page.route,
      bytes: page.requestSummary.localCssBytes,
      files: page.requestSummary.localCssFiles,
    })),
    maxLocalJsBytes: sortBy((page) => page.requestSummary.localJsBytes).slice(0, 5).map((page) => ({
      route: page.route,
      bytes: page.requestSummary.localJsBytes,
      files: page.requestSummary.localJsFiles,
    })),
    maxInlineScriptBytes: sortBy((page) => page.dom.functionalInlineScriptBytes).slice(0, 10).map((page) => ({
      route: page.route,
      functionalInlineScriptBytes: page.dom.functionalInlineScriptBytes,
      functionalInlineScriptCount: page.dom.functionalInlineScriptCount,
      jsonLdBytes: page.dom.jsonLdBytes,
    })),
    maxExternalRequests: sortBy((page) => page.requestSummary.externalTotal).slice(0, 10).map((page) => ({
      route: page.route,
      externalTotal: page.requestSummary.externalTotal,
      hosts: page.requestSummary.externalHosts,
    })),
    pagesWithIframes: results.filter((page) => page.dom.iframeCount > 0).map((page) => ({
      route: page.route,
      iframeCount: page.dom.iframeCount,
    })),
    pagesWithInlineDomStyles: results.filter((page) => page.dom.inlineStyleAttrs > 0).map((page) => ({
      route: page.route,
      inlineStyleAttrs: page.dom.inlineStyleAttrs,
    })),
    pagesWithLocalBadResponses: results.filter((page) => page.requestSummary.localBadResponses.length > 0).map((page) => ({
      route: page.route,
      localBadResponses: page.requestSummary.localBadResponses,
    })),
  },
  externalHostsTotal: mergeHosts(results),
  results,
};

const reportPath = path.join(reportDir, "performance-audit.json");
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log(JSON.stringify({
  pages: report.pages,
  reportPath,
  distAssets: report.distAssets,
  cssAudit: report.cssAudit,
  sourceAuditSummary: {
    inlineStyleFiles: report.sourceAuditSummary.filesWithInlineStyleAttrs.length,
    styleTagFiles: report.sourceAuditSummary.filesWithStyleTags.length,
    scriptTagFiles: report.sourceAuditSummary.filesWithScriptTags.length,
    externalScriptTagFiles: report.sourceAuditSummary.filesWithExternalScriptTags.length,
    iframeTagFiles: report.sourceAuditSummary.filesWithIframeTags.length,
    elementorMentionFiles: report.sourceAuditSummary.filesWithElementorMentions.length,
    wpContentMentionFiles: report.sourceAuditSummary.filesWithWpContentMentions.length,
  },
  pageSummary: report.pageSummary,
  externalHostsTotal: report.externalHostsTotal,
}, null, 2));
