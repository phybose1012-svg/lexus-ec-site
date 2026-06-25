import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { chromium } from "playwright-core";
import sharp from "sharp";

const minViewportVisual = Number(process.argv.find((arg) => arg.startsWith("--min="))?.split("=")[1] || 88);
const minViewportAverage = Number(process.argv.find((arg) => arg.startsWith("--avg="))?.split("=")[1] || 90);
const workspace = path.resolve(process.cwd(), "..");
const dist = path.resolve(process.cwd(), "dist");
const cachedRoot = path.join(workspace, "reports", "similarity-gates");

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

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

const routeFromIndex = (file) => {
  const rel = path.relative(dist, path.dirname(file)).replaceAll(path.sep, "/");
  return rel === "" ? "/" : `/${rel}/`;
};

const safeName = (route) => route.replace(/^\/|\/$/g, "").replace(/[^\w-]+/g, "-") || "home";

const normalizedRaw = async (imageLike, width, height) => {
  let resized = await sharp(imageLike).resize({ width, withoutEnlargement: false }).removeAlpha().toBuffer();
  const meta = await sharp(resized).metadata();
  if (meta.height > height) resized = await sharp(resized).extract({ left: 0, top: 0, width, height }).toBuffer();
  return sharp({
    create: { width, height, channels: 3, background: { r: 255, g: 255, b: 255 } },
  })
    .composite([{ input: resized, left: 0, top: 0 }])
    .raw()
    .toBuffer();
};

const visualSimilarity = async (leftImage, rightImage) => {
  const leftMeta = await sharp(leftImage).metadata();
  const rightMeta = await sharp(rightImage).metadata();
  const width = Math.min(leftMeta.width, rightMeta.width);
  const height = Math.min(leftMeta.height, rightMeta.height);
  const leftRaw = await normalizedRaw(leftImage, width, height);
  const rightRaw = await normalizedRaw(rightImage, width, height);
  let diff = 0;
  for (let index = 0; index < leftRaw.length; index += 1) diff += Math.abs(leftRaw[index] - rightRaw[index]);
  return Math.max(0, 100 - ((diff / leftRaw.length) / 255) * 100);
};

const captureLocal = async (browser, url, viewport) => {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1, isMobile: viewport.width < 600 });
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 70000 });
    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => undefined);
    await page.waitForTimeout(250);
    const screenshot = await page.screenshot({ fullPage: false });
    const data = await page.evaluate(() => ({
      title: document.title,
      h1: document.querySelector("h1")?.textContent?.trim() || "",
      height: document.documentElement.scrollHeight,
      scripts: document.scripts.length,
      iframes: document.querySelectorAll("iframe").length,
    }));
    return { screenshot, data };
  } finally {
    await page.close();
  }
};

const routes = walk(dist)
  .filter((file) => path.basename(file) === "index.html")
  .map(routeFromIndex)
  .sort((a, b) => a.localeCompare(b));

const server = staticServer(dist);
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const localBase = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const viewports = [
  { name: "desktop-1440", width: 1440, height: 1100 },
  { name: "mobile-390", width: 390, height: 900 },
];
const reports = [];

for (const route of routes) {
  const routeName = safeName(route);
  const cases = [];
  const failures = [];
  for (const viewport of viewports) {
    const livePath = path.join(cachedRoot, routeName, `live-${viewport.name}.png`);
    if (!fs.existsSync(livePath)) {
      failures.push(`missingCachedLive:${viewport.name}`);
      cases.push({ viewport: viewport.name, viewportVisual: 0, missingCachedLive: true });
      continue;
    }
    const local = await captureLocal(browser, `${localBase}${route}`, viewport);
    const viewportVisual = await visualSimilarity(livePath, local.screenshot);
    cases.push({
      viewport: viewport.name,
      viewportVisual: Number(viewportVisual.toFixed(1)),
      local: local.data,
    });
  }
  const scores = cases.map((item) => item.viewportVisual);
  const lowestViewportVisual = Math.min(...scores);
  const averageViewportVisual = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  if (lowestViewportVisual < minViewportVisual) failures.push(`lowestViewportVisual ${lowestViewportVisual.toFixed(1)} < ${minViewportVisual}`);
  if (averageViewportVisual < minViewportAverage) failures.push(`averageViewportVisual ${averageViewportVisual.toFixed(1)} < ${minViewportAverage}`);
  reports.push({
    route,
    lowestViewportVisual: Number(lowestViewportVisual.toFixed(1)),
    averageViewportVisual: Number(averageViewportVisual.toFixed(1)),
    failures,
    cases,
  });
}

await browser.close();
server.close();

const failing = reports.filter((report) => report.failures.length > 0);
const worst = [...reports]
  .sort((a, b) => a.averageViewportVisual - b.averageViewportVisual || a.lowestViewportVisual - b.lowestViewportVisual)
  .slice(0, 20)
  .map((report) => ({
    route: report.route,
    averageViewportVisual: report.averageViewportVisual,
    lowestViewportVisual: report.lowestViewportVisual,
    failures: report.failures,
  }));

console.log(
  JSON.stringify(
    {
      measuredAt: new Date().toISOString(),
      liveSource: "cached similarity-gates screenshots",
      localSource: "dist served from temporary local server",
      thresholds: { minViewportVisual, minViewportAverage },
      routes: reports.length,
      failing: failing.length,
      worst,
    },
    null,
    2,
  ),
);
