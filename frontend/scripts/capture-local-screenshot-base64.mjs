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
const viewportName = args.viewport || "mobile-390";
const dist = path.resolve(process.cwd(), "dist");
const viewports = {
  "desktop-1440": { width: 1440, height: 1100 },
  "mobile-390": { width: 390, height: 900 },
};
const viewport = viewports[viewportName] || viewports["mobile-390"];

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

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", "http://127.0.0.1");
  let file = path.join(dist, decodeURIComponent(url.pathname));
  if (!file.startsWith(dist)) {
    res.writeHead(403);
    res.end("forbidden");
    return;
  }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) file = path.join(dist, "index.html");
  res.writeHead(200, { "content-type": mime(file) });
  fs.createReadStream(file).pipe(res);
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const page = await browser.newPage({ viewport, deviceScaleFactor: 1, isMobile: viewport.width < 600 });
try {
  await page.goto(`http://127.0.0.1:${server.address().port}${pagePath}`, { waitUntil: "domcontentloaded", timeout: 70000 });
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => undefined);
  await page.waitForTimeout(250);
  const buffer = await page.screenshot({ fullPage: false });
  process.stdout.write(buffer.toString("base64"));
} finally {
  await page.close();
  await browser.close();
  server.close();
}
