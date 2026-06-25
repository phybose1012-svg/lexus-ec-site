import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { chromium } from "playwright-core";

const root = path.resolve(process.cwd(), "dist");
const workspace = path.resolve(process.cwd(), "..");
const outRoot = path.join(workspace, "reports", "visual-snapshots");
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const outDir = path.join(outRoot, stamp);

const routes = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      "/",
      "/top/voice/",
      "/top/teacher/",
      "/top/results/",
      "/lexus-premier/",
      "/top/course/",
      "/reservation/",
      "/request-documents/",
      "/top/faq/",
      "/top/access/",
    ];

const viewports = [
  { label: "desktop", width: 1366, height: 900 },
  { label: "mobile", width: 390, height: 900 },
];

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

const safeFileForRequest = (requestUrl) => {
  const url = new URL(requestUrl || "/", "http://127.0.0.1");
  const pathname = decodeURIComponent(url.pathname);
  let file = path.resolve(root, `.${pathname}`);
  if (!file.startsWith(root)) return null;
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  return file;
};

const server = http.createServer((req, res) => {
  const file = safeFileForRequest(req.url);
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

const slugFor = (route) => {
  if (route === "/") return "home";
  return route.replace(/^\/|\/$/g, "").replace(/[\\/]+/g, "__").replace(/[^a-z0-9_-]+/gi, "-");
};

fs.mkdirSync(outDir, { recursive: true });
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const origin = `http://127.0.0.1:${port}`;

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});

const report = [];

for (const route of routes) {
  for (const viewport of viewports) {
    const page = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    let status = null;
    try {
      const response = await page.goto(`${origin}${route}`, { waitUntil: "domcontentloaded", timeout: 30000 });
      status = response?.status() || null;
      await page.waitForTimeout(900);
      await page.evaluate(() => window.scrollTo(0, 0));
      const filename = `${slugFor(route)}--${viewport.label}.png`;
      const output = path.join(outDir, filename);
      await page.screenshot({ path: output, fullPage: false });
      const metrics = await page.evaluate(() => ({
        title: document.title,
        bodyHeight: document.body.scrollHeight,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        h1: document.querySelector("h1")?.textContent?.trim() || "",
      }));
      report.push({ route, viewport: viewport.label, status, output, errors, ...metrics });
    } catch (error) {
      report.push({ route, viewport: viewport.label, status, output: "", errors: [error.message] });
    } finally {
      await page.close();
    }
  }
}

await browser.close();
server.close();

const reportPath = path.join(outDir, "visual-snapshots.json");
fs.writeFileSync(reportPath, JSON.stringify({ createdAt: new Date().toISOString(), routes, report }, null, 2));
console.log(JSON.stringify({ outDir, reportPath, captures: report.length, errors: report.filter((item) => item.errors.length) }, null, 2));
