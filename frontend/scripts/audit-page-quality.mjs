import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { chromium } from "playwright-core";

const root = path.resolve(process.cwd(), "dist");
const reportDir = path.resolve(process.cwd(), "reports");
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

const walk = (dir, files = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file, files);
    else if (entry.isFile() && entry.name === "index.html") files.push(file);
  }
  return files;
};

const routeFor = (file) => {
  const route = `/${path.relative(root, file).replace(/\\/g, "/").replace(/index\.html$/, "")}`;
  return route === "/" ? "/" : route;
};

const priorityFor = (route) => {
  if (route === "/") return { tier: 1, label: "homepage" };
  if (["/top/voice/", "/top/teacher/", "/top/results/", "/lexus-premier/"].includes(route)) return { tier: 1, label: "trust-cv" };
  if (route.startsWith("/top/course/") || ["/top/course/", "/reservation/", "/request-documents/", "/top/contact/", "/top/reservation/"].includes(route)) {
    return { tier: 2, label: "conversion" };
  }
  if (["/top/access/", "/top/lexus-garden/", "/top/history/", "/top/faq/"].includes(route)) return { tier: 2, label: "trust-support" };
  if (route.includes("information") || route.includes("university") || ["/kuriage-information/", "/information-faq/"].includes(route)) {
    return { tier: 3, label: "seo-info" };
  }
  return { tier: 4, label: "supporting" };
};

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

const routes = walk(root).map(routeFor).sort((a, b) => {
  const pa = priorityFor(a).tier;
  const pb = priorityFor(b).tier;
  if (pa !== pb) return pa - pb;
  return a.localeCompare(b);
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

const textAudit = () => {
  const selector = [
    "h1",
    "h2",
    "h3",
    "h4",
    ".button",
    "button",
    ".mega-nav a",
    ".mobile-shortcut",
    ".section-heading p",
    ".section-heading h2",
    "p",
    "li",
  ].join(",");
  const badStarts = /^[、。，．：；？！）」』】〕〉》）\]\}]/;
  const badEnds = /[（「『【〔〈《\[\{]$/;
  const particles = new Set(["へ", "に", "を", "が", "は", "と", "で", "の", "も", "や", "か", "ね", "よ", "ぞ", "です", "ます"]);

  const isVisible = (el) => {
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) !== 0 && rect.width > 8 && rect.height > 8;
  };

  const lineTexts = (el) => {
    const rows = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.parentElement?.closest("sub,sup")) continue;
      const value = node.nodeValue || "";
      for (let index = 0; index < value.length; index += 1) {
        const char = value[index];
        if (!char || char === "\n" || char === "\t") continue;
        const range = document.createRange();
        range.setStart(node, index);
        range.setEnd(node, index + 1);
        const rect = [...range.getClientRects()].find((item) => item.width || item.height);
        range.detach();
        if (!rect) continue;
        let row = rows.find((item) => Math.abs(item.top - rect.top) < 3);
        if (!row) {
          row = { top: rect.top, text: "" };
          rows.push(row);
        }
        row.text += char;
      }
    }
    return rows
      .sort((a, b) => a.top - b.top)
      .map((row) => row.text.replace(/\s+/g, " ").trim())
      .filter(Boolean);
  };

  return [...document.querySelectorAll(selector)]
    .filter(isVisible)
    .map((el) => {
      const text = (el.innerText || "").replace(/\s+/g, " ").trim();
      const rect = el.getBoundingClientRect();
      if (text.length < 2 || text.length > 220) return null;
      const lines = lineTexts(el);
      const tag = el.tagName.toLowerCase();
      const isHeading = /^h[1-4]$/.test(tag);
      const isControl = el.matches(".button, button, .mobile-shortcut");
      const issues = [];
      lines.forEach((line, index) => {
        const normalized = line.replace(/\s+/g, "");
        if (normalized.length === 1 && /[ぁ-んァ-ヶ一-龠A-Za-z0-9ー]/.test(normalized)) issues.push(`single-char-line:${index + 1}:${line}`);
        if (particles.has(normalized)) issues.push(`orphan-particle:${index + 1}:${line}`);
        if (badStarts.test(normalized)) issues.push(`bad-line-start:${index + 1}:${line}`);
        if (badEnds.test(normalized)) issues.push(`bad-line-end:${index + 1}:${line}`);
      });
      const last = lines.at(-1)?.replace(/\s+/g, "") || "";
      if ((isHeading || isControl) && lines.length >= 2 && last.length <= 2) issues.push(`tiny-last-line:${lines.length}:${lines.at(-1)}`);
      if (isControl && lines.length > 2) issues.push(`control-too-many-lines:${lines.length}`);
      if (isHeading && lines.length > 5) issues.push(`heading-too-many-lines:${lines.length}`);
      if (el.scrollWidth > el.clientWidth + 2) issues.push(`horizontal-overflow:${el.scrollWidth - el.clientWidth}`);
      if (!issues.length) return null;
      return {
        selector: tag + (el.id ? `#${el.id}` : el.className ? `.${String(el.className).trim().split(/\s+/).slice(0, 2).join(".")}` : ""),
        text,
        lines,
        issues,
        rect: {
          top: Math.round(rect.top),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
      };
    })
    .filter(Boolean)
    .slice(0, 40);
};

const pageAudit = async (route) => {
  const priority = priorityFor(route);
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  await page.route("**/*", (requestRoute) => {
    const url = requestRoute.request().url();
    const type = requestRoute.request().resourceType();
    if (!url.startsWith(origin) && ["font", "media"].includes(type)) return requestRoute.abort();
    return requestRoute.continue();
  });

  let status = null;
  let navigationError = "";
  try {
    const response = await page.goto(`${origin}${route}`, { waitUntil: "domcontentloaded", timeout: 45000 });
    status = response?.status() || null;
    await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
  } catch (error) {
    navigationError = error.message;
  }

  const dom = await page.evaluate((auditFn) => {
    const lineBreakIssues = Function(`return (${auditFn})`)()();
    const images = [...document.images];
    const buttons = [...document.querySelectorAll(".button, button, input[type='submit']")];
    const forms = [...document.forms];
    const headings = [...document.querySelectorAll("h1,h2,h3")].map((heading) => ({
      tag: heading.tagName.toLowerCase(),
      text: heading.innerText.replace(/\s+/g, " ").trim().slice(0, 120),
    }));
    const localImages = images
      .map((image) => ({
        src: image.currentSrc || image.getAttribute("src") || "",
        loadedBroken: image.complete && image.currentSrc.startsWith(location.origin) && image.naturalWidth === 0,
      }))
      .filter((image) => image.src);
    const visibleImages = images.filter((image) => {
      const rect = image.getBoundingClientRect();
      return rect.width > 20 && rect.height > 20;
    });
    return {
      title: document.title,
      h1Count: document.querySelectorAll("h1").length,
      bodyLength: document.body.innerText.trim().length,
      headings: headings.slice(0, 12),
      imageCount: images.length,
      visibleImageCount: visibleImages.length,
      localImages,
      buttonCount: buttons.length,
      formCount: forms.length,
      lineBreakIssues,
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    };
  }, textAudit.toString());

  await page.close();
  const localBrokenImages = [];
  for (const image of dom.localImages) {
    let url;
    try {
      url = new URL(image.src, origin);
    } catch {
      continue;
    }
    if (url.origin !== origin) continue;
    const file = localFileForUrl(url.href);
    if (!file || !fs.existsSync(file) || image.loadedBroken) localBrokenImages.push(url.pathname);
  }
  const mobileOverflow = dom.documentWidth > dom.viewportWidth + 2;
  const issueWeight = dom.lineBreakIssues.reduce((sum, item) => sum + item.issues.length, 0);
  const roughScore = Math.max(
    0,
    100 -
      issueWeight * 3 -
      (mobileOverflow ? 12 : 0) -
      (dom.h1Count !== 1 ? 8 : 0) -
      (status !== 200 || navigationError ? 30 : 0) -
      localBrokenImages.length * 8,
  );
  return {
    route,
    priority,
    status,
    navigationError,
    roughScore,
    mobileOverflow,
    ...dom,
    localBrokenImages: [...new Set(localBrokenImages)],
  };
};

const results = [];
for (const route of routes) {
  results.push(await pageAudit(route));
}

await browser.close();
server.close();

const byPriority = [...results].sort((a, b) => a.priority.tier - b.priority.tier || a.roughScore - b.roughScore);
const needsWork = byPriority.filter(
  (item) => item.roughScore < 80 || item.lineBreakIssues.length || item.mobileOverflow || item.h1Count !== 1
);

const report = {
  auditedAt: new Date().toISOString(),
  pages: results.length,
  needsWork: needsWork.length,
  results,
  priorityQueue: needsWork.map((item) => ({
    route: item.route,
    tier: item.priority.tier,
    label: item.priority.label,
    roughScore: item.roughScore,
    lineBreakIssues: item.lineBreakIssues.length,
    mobileOverflow: item.mobileOverflow,
    h1Count: item.h1Count,
    imageCount: item.imageCount,
    buttonCount: item.buttonCount,
    firstIssues: item.lineBreakIssues.slice(0, 5).map((issue) => ({
      selector: issue.selector,
      text: issue.text,
      lines: issue.lines,
      issues: issue.issues,
    })),
  })),
};

const summaryLines = [
  "# Page Quality Audit",
  "",
  `Audited: ${report.auditedAt}`,
  `Pages: ${report.pages}`,
  `Needs work: ${report.needsWork}`,
  "",
  "## Priority Queue",
  "",
  "| Route | Tier | Score | Line issues | Overflow | Notes |",
  "| --- | ---: | ---: | ---: | --- | --- |",
  ...report.priorityQueue.map((item) => {
    const notes = item.firstIssues
      .slice(0, 2)
      .map((issue) => `${issue.selector}: ${issue.issues.join(", ")}`)
      .join("<br>");
    return `| ${item.route} | ${item.tier} | ${item.roughScore} | ${item.lineBreakIssues} | ${item.mobileOverflow ? "yes" : "no"} | ${notes || "-"} |`;
  }),
  "",
];

fs.writeFileSync(path.join(reportDir, "page-quality-audit.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(reportDir, "page-quality-summary.md"), summaryLines.join("\n"));

console.log(
  JSON.stringify(
    {
      pages: report.pages,
      needsWork: report.needsWork,
      topQueue: report.priorityQueue.slice(0, 12),
    },
    null,
    2,
  ),
);
