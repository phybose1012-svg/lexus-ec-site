import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { chromium } from "playwright-core";
import sharp from "sharp";

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .map((arg) => arg.match(/^--([^=]+)=(.*)$/))
    .filter(Boolean)
    .map((match) => [match[1], match[2]]),
);

const pagePath = args.path || "/";
const reportName = args.name || pagePath.replace(/^\/|\/$/g, "").replace(/[^\w-]+/g, "-") || "home";
const noFiles = args.noFiles === "true";
const workspace = path.resolve(process.cwd(), "..");
const dist = path.resolve(process.cwd(), "dist");
const out = path.join(workspace, "reports", "similarity", reportName);
const cachedLiveRoot = path.join(workspace, "reports", "similarity-gates", pagePath.replace(/^\/|\/$/g, "").replace(/[^\w-]+/g, "-") || "home");
if (!noFiles) fs.mkdirSync(out, { recursive: true });

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

const normalizedRaw = async (file, width, height) => {
  let resized = await sharp(file).resize({ width, withoutEnlargement: false }).removeAlpha().toBuffer();
  const meta = await sharp(resized).metadata();
  if (meta.height > height) resized = await sharp(resized).extract({ left: 0, top: 0, width, height }).toBuffer();
  return sharp({
    create: { width, height, channels: 3, background: { r: 255, g: 255, b: 255 } },
  })
    .composite([{ input: resized, left: 0, top: 0 }])
    .raw()
    .toBuffer();
};

const visualSimilarity = async (leftPath, rightPath) => {
  const leftMeta = await sharp(leftPath).metadata();
  const rightMeta = await sharp(rightPath).metadata();
  const width = Math.min(leftMeta.width, rightMeta.width);
  const height = Math.min(leftMeta.height, rightMeta.height);
  const leftRaw = await normalizedRaw(leftPath, width, height);
  const rightRaw = await normalizedRaw(rightPath, width, height);
  let diff = 0;
  for (let index = 0; index < leftRaw.length; index += 1) diff += Math.abs(leftRaw[index] - rightRaw[index]);
  return Math.max(0, 100 - ((diff / leftRaw.length) / 255) * 100);
};

const captureLocal = async (browser, url, shotPath, viewport) => {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1, isMobile: viewport.width < 600 });
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 70000 });
    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => undefined);
    await page.waitForTimeout(300);
    const screenshot = noFiles ? await page.screenshot({ fullPage: false }) : await page.screenshot({ path: shotPath, fullPage: false });
    const local = await page.evaluate(() => ({
      title: document.title,
      h1: document.querySelector("h1")?.textContent?.trim() || "",
      firstText: Array.from(document.body.querySelectorAll("main, h1, h2, p, a, button"))
        .map((node) => node.textContent || "")
        .map((text) => text.replace(/\s+/g, " ").trim())
        .filter((text) => text.length >= 2)
        .slice(0, 10)
        .join(" / "),
      height: document.documentElement.scrollHeight,
      scripts: document.scripts.length,
      iframes: document.querySelectorAll("iframe").length,
    }));
    return { ...local, screenshot };
  } finally {
    await page.close();
  }
};

const server = args.localBase ? null : staticServer(dist);
if (server) await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const localBase = (args.localBase || `http://127.0.0.1:${server.address().port}`).replace(/\/$/, "");

const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const viewports = [
  { name: "desktop-1440", width: 1440, height: 1100 },
  { name: "mobile-390", width: 390, height: 900 },
];
const cases = [];

for (const viewport of viewports) {
  const livePath = path.join(cachedLiveRoot, `live-${viewport.name}.png`);
  if (!fs.existsSync(livePath)) throw new Error(`Cached live screenshot not found: ${livePath}`);
  const localPath = path.join(out, `local-${viewport.name}.png`);
  const local = await captureLocal(browser, `${localBase}${pagePath}`, localPath, viewport);
  const viewportVisual = await visualSimilarity(livePath, noFiles ? local.screenshot : localPath);
  delete local.screenshot;
  cases.push({
    viewport: viewport.name,
    viewportVisual: Number(viewportVisual.toFixed(1)),
    local,
    liveScreenshot: path.relative(workspace, livePath),
    localScreenshot: noFiles ? null : path.relative(workspace, localPath),
  });
}

await browser.close();
server?.close();

const scores = cases.map((item) => item.viewportVisual);
const lowestViewportVisual = Math.min(...scores);
const averageViewportVisual = scores.reduce((sum, score) => sum + score, 0) / scores.length;
const report = {
  measuredAt: new Date().toISOString(),
  liveSource: "cached similarity-gates screenshot",
  localUrl: `${localBase}${pagePath}`,
  lowestViewportVisual: Number(lowestViewportVisual.toFixed(1)),
  averageViewportVisual: Number(averageViewportVisual.toFixed(1)),
  passedVisualGate: lowestViewportVisual >= 88 && averageViewportVisual >= 90,
  cases,
};

if (!noFiles) fs.writeFileSync(path.join(out, `${reportName}-cached-live-similarity.json`), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
