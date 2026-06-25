import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { chromium } from "playwright-core";

const workspace = path.resolve(process.cwd(), "..");
const distRoot = path.resolve(process.cwd(), "dist");
const outRoot = path.join(workspace, "reports", "header-audit");
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const outDir = path.join(outRoot, stamp);
const route = process.argv[2] || "/dokkyouika-university-entrance-exam-measures2027/";

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

const fileForRequest = (requestUrl) => {
  const url = new URL(requestUrl || "/", "http://127.0.0.1");
  let file = path.resolve(distRoot, `.${decodeURIComponent(url.pathname)}`);
  if (!file.startsWith(distRoot)) return null;
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  return file;
};

const server = http.createServer((req, res) => {
  const file = fileForRequest(req.url);
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
  res.writeHead(200, { "content-type": mime(file) });
  fs.createReadStream(file).pipe(res);
});

const collect = () => {
  const boxOf = (el) => {
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return {
      tag: el.tagName.toLowerCase(),
      className: String(el.className || ""),
      text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 120),
      x: Math.round(rect.x),
      y: Math.round(rect.y),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      lineHeight: style.lineHeight,
    };
  };
  const visible = (el) => {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
  };
  const topElements = [...document.querySelectorAll("header, nav, .site-header, .top-header, .mobile-fixed-nav, .mega-nav")]
    .filter(visible)
    .map(boxOf);
  const links = [...document.querySelectorAll("a, button")]
    .filter(visible)
    .filter((el) => el.getBoundingClientRect().top < 280)
    .map(boxOf)
    .slice(0, 80);
  const imgs = [...document.images]
    .filter(visible)
    .filter((el) => el.getBoundingClientRect().top < 260)
    .map((el) => ({
      ...boxOf(el),
      src: el.currentSrc || el.src,
      naturalWidth: el.naturalWidth,
      naturalHeight: el.naturalHeight,
    }))
    .slice(0, 40);
  return {
    url: location.href,
    title: document.title,
    viewport: { width: innerWidth, height: innerHeight },
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    topElements,
    links,
    imgs,
  };
};

fs.mkdirSync(outDir, { recursive: true });
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const localOrigin = `http://127.0.0.1:${server.address().port}`;
const targets = [
  { name: "original", url: `https://lexus-ec.com${route}` },
  { name: "local", url: `${localOrigin}${route}` },
];
const viewports = [
  { name: "desktop", width: 1366, height: 900 },
  { name: "mobile", width: 390, height: 900 },
];

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});
const report = [];
try {
  for (const viewport of viewports) {
    for (const target of targets) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1 });
      const errors = [];
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      const response = await page.goto(target.url, { waitUntil: "networkidle", timeout: 45000 }).catch((error) => {
        errors.push(error.message);
        return null;
      });
      await page.waitForTimeout(600);
      const data = await page.evaluate(collect).catch((error) => ({ error: error.message }));
      const screenshot = path.join(outDir, `${target.name}-${viewport.name}.png`);
      await page.screenshot({ path: screenshot, clip: { x: 0, y: 0, width: viewport.width, height: Math.min(viewport.height, 360) } });
      report.push({
        target: target.name,
        viewport: viewport.name,
        status: response?.status() || null,
        screenshot,
        errors,
        data,
      });
      await page.close();
    }
  }
} finally {
  await browser.close();
  server.close();
}

const reportPath = path.join(outDir, "header-audit.json");
fs.writeFileSync(reportPath, JSON.stringify({ createdAt: new Date().toISOString(), route, report }, null, 2));
console.log(JSON.stringify({ outDir, reportPath, captures: report.length }, null, 2));
