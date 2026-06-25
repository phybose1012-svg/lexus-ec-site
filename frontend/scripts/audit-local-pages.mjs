import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { chromium } from "playwright-core";

const root = path.resolve(process.cwd(), "dist");
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
  return "application/octet-stream";
};

const htmlFiles = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.isFile() && entry.name === "index.html") htmlFiles.push(file);
  }
};
walk(root);

const routeFor = (file) => {
  const route = `/${path.relative(root, file).replace(/\\/g, "/").replace(/index\.html$/, "")}`;
  return route || "/";
};

const routes = htmlFiles.map(routeFor).sort((a, b) => a.localeCompare(b));
const routeSet = new Set(routes);

const normalizeRoute = (href) => {
  const url = new URL(href, "http://local.test");
  let pathname = url.pathname;
  try {
    pathname = decodeURIComponent(pathname);
  } catch {
    // Keep the encoded route when decoding is not possible.
  }
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
};

const routeExists = (href) => routeSet.has(normalizeRoute(href));

const isSkippableLink = (href) =>
  !href ||
  href.startsWith("#") ||
  /^(mailto:|tel:|javascript:|data:)/i.test(href) ||
  /\.(pdf|jpg|jpeg|png|gif|webp|svg|zip)$/i.test(href.split("?")[0]);

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", "http://127.0.0.1");
  let file = path.join(root, decodeURIComponent(url.pathname));
  if (!file.startsWith(root)) {
    res.writeHead(403);
    res.end("forbidden");
    return;
  }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("not found");
    return;
  }
  res.writeHead(200, { "content-type": mime(file) });
  fs.createReadStream(file).pipe(res);
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const origin = `http://127.0.0.1:${port}`;

const localFileForUrl = (requestUrl) => {
  const url = new URL(requestUrl, origin);
  let file = path.join(root, decodeURIComponent(url.pathname));
  if (!file.startsWith(root)) return null;
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  return file;
};

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});

const results = [];

for (const route of routes) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
  const consoleErrors = [];
  const pageErrors = [];
  const localRequestFailures = [];
  const localBadResponses = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("requestfailed", (request) => {
    const url = request.url();
    if (url.startsWith(origin)) localRequestFailures.push(`${url.replace(origin, "")} :: ${request.failure()?.errorText || "failed"}`);
  });
  page.on("response", (response) => {
    const url = response.url();
    if (url.startsWith(origin) && response.status() >= 400) localBadResponses.push(`${response.status()} ${url.replace(origin, "")}`);
  });

  let navigationStatus = null;
  let navigationError = "";
  try {
    const response = await page.goto(`${origin}${route}`, { waitUntil: "load", timeout: 45000 });
    navigationStatus = response?.status() || null;
  } catch (error) {
    navigationError = error.message;
  }

  const dom = await page.evaluate(() => {
    const internalLinks = Array.from(document.links)
      .map((link) => link.getAttribute("href") || "")
      .filter(Boolean);
    const forms = Array.from(document.forms).map((form) => ({
      action: form.getAttribute("action") || "",
      method: (form.getAttribute("method") || "get").toLowerCase(),
      localPending: form.dataset.localForm === "pending",
    }));
    const localImages = Array.from(document.images)
      .map((image) => ({
        src: image.currentSrc || image.getAttribute("src") || "",
        loadedBroken: image.complete && image.currentSrc.startsWith(location.origin) && image.naturalWidth === 0,
      }))
      .filter((image) => image.src);
    return {
      title: document.title,
      h1Count: document.querySelectorAll("h1").length,
      bodyLength: document.body.innerText.trim().length,
      internalLinks,
      forms,
      localImages,
    };
  });

  const brokenLocalImages = [];
  for (const image of dom.localImages) {
    let url;
    try {
      url = new URL(image.src, origin);
    } catch {
      continue;
    }
    if (url.origin !== origin) continue;
    const file = localFileForUrl(url.href);
    if (!file || !fs.existsSync(file) || image.loadedBroken) brokenLocalImages.push(url.pathname);
  }

  const missingRelativeLinks = [];
  for (const href of dom.internalLinks) {
    if (isSkippableLink(href)) continue;
    let url;
    try {
      url = new URL(href, "http://local.test");
    } catch {
      continue;
    }
    if (url.hostname !== "local.test") continue;
    if (!routeExists(href)) missingRelativeLinks.push(url.pathname);
  }

  const missingFormActions = [];
  for (const form of dom.forms) {
    if (!form.action || form.localPending) continue;
    let url;
    try {
      url = new URL(form.action, "http://local.test");
    } catch {
      continue;
    }
    if (url.hostname !== "local.test") continue;
    if (!routeExists(form.action)) missingFormActions.push(`${form.method.toUpperCase()} ${url.pathname}`);
  }

  results.push({
    route,
    navigationStatus,
    navigationError,
    title: dom.title,
    h1Count: dom.h1Count,
    bodyLength: dom.bodyLength,
    consoleErrors: [...new Set(consoleErrors)],
    pageErrors: [...new Set(pageErrors)],
    localRequestFailures: [...new Set(localRequestFailures)],
    localBadResponses: [...new Set(localBadResponses)],
    brokenLocalImages: [...new Set(brokenLocalImages)],
    missingRelativeLinks: [...new Set(missingRelativeLinks)].sort(),
    missingFormActions: [...new Set(missingFormActions)].sort(),
  });

  await page.close();
}

await browser.close();
server.close();

const failing = results.filter(
  (item) =>
    item.navigationStatus !== 200 ||
    item.navigationError ||
    item.consoleErrors.length ||
    item.pageErrors.length ||
    item.localRequestFailures.length ||
    item.localBadResponses.length ||
    item.brokenLocalImages.length ||
    item.missingRelativeLinks.length ||
    item.missingFormActions.length,
);

const report = {
  auditedAt: new Date().toISOString(),
  pages: results.length,
  failingPages: failing.length,
  failing,
  results,
};

fs.writeFileSync(path.join(reportDir, "error-audit.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ pages: report.pages, failingPages: report.failingPages, failing: report.failing }, null, 2));
