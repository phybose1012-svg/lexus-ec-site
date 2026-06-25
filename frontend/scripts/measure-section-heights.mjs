import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { chromium } from "playwright-core";

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .map((arg) => arg.match(/^--([^=]+)=(.*)$/))
    .filter(Boolean)
    .map((match) => [match[1], match[2]]),
);

const pagePath = args.path || "/";
const width = Number(args.width || 390);
const height = Number(args.height || 900);
const workspace = path.resolve(process.cwd(), "..");
const dist = path.resolve(process.cwd(), "dist");
const reportPath = path.join(workspace, "reports", "section-heights.json");

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

const staticServer = (root) =>
  http.createServer((req, res) => {
    const url = new URL(req.url || "/", "http://127.0.0.1");
    let file = path.join(root, decodeURIComponent(url.pathname));
    if (!file.startsWith(root)) {
      res.writeHead(403);
      res.end("forbidden");
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) file = path.join(root, "index.html");
    res.writeHead(200, { "content-type": mime(file) });
    fs.createReadStream(file).pipe(res);
  });

const collect = async (page, url) => {
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(700);
  return page.evaluate(() => {
    const labelFor = (element, index) => {
      const heading = element.querySelector("h1,h2,h3");
      const headingText = heading?.textContent?.trim().replace(/\s+/g, " ");
      const className = String(element.className || "").trim().replace(/\s+/g, ".");
      return headingText || (className ? `.${className}` : `${element.tagName.toLowerCase()}#${index + 1}`);
    };
    const sections = [...document.querySelectorAll("main > section, header.site-header, nav.mega-nav")].map((element, index) => {
      const rect = element.getBoundingClientRect();
      return {
        index,
        label: labelFor(element, index),
        tag: element.tagName.toLowerCase(),
        className: String(element.className || ""),
        height: Math.round(rect.height),
        top: Math.round(rect.top + window.scrollY),
      };
    });
    return {
      url: location.href,
      title: document.title,
      bodyHeight: Math.round(document.documentElement.scrollHeight),
      sections,
    };
  });
};

const server = staticServer(dist);
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const localUrl = `http://127.0.0.1:${server.address().port}${pagePath}`;
const liveUrl = `https://lexus-ec.com${pagePath}`;

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});

try {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const live = await collect(page, liveUrl);
  const local = await collect(page, localUrl);
  await context.close();

  const max = Math.max(live.sections.length, local.sections.length);
  const comparison = Array.from({ length: max }, (_, index) => {
    const liveSection = live.sections[index];
    const localSection = local.sections[index];
    return {
      index,
      live: liveSection ? { label: liveSection.label, height: liveSection.height } : null,
      local: localSection ? { label: localSection.label, height: localSection.height } : null,
      delta: (localSection?.height || 0) - (liveSection?.height || 0),
    };
  });

  const report = {
    measuredAt: new Date().toISOString(),
    pagePath,
    viewport: { width, height },
    live: { url: live.url, bodyHeight: live.bodyHeight },
    local: { url: local.url, bodyHeight: local.bodyHeight },
    comparison,
  };

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({
    pagePath,
    viewport: report.viewport,
    liveBodyHeight: live.bodyHeight,
    localBodyHeight: local.bodyHeight,
    reportPath,
    largestDeltas: comparison
      .filter((item) => Math.abs(item.delta) > 100)
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
      .slice(0, 10),
  }, null, 2));
} finally {
  await browser.close();
  server.close();
}
