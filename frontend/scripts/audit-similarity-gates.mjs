import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { chromium } from "playwright-core";
import sharp from "sharp";

const workspace = path.resolve(process.cwd(), "..");
const dist = path.resolve(process.cwd(), "dist");
const outRoot = path.join(workspace, "reports", "similarity-gates");
const minViewportVisual = Number(process.argv.find((arg) => arg.startsWith("--min="))?.split("=")[1] || 88);
const minViewportAverage = Number(process.argv.find((arg) => arg.startsWith("--avg="))?.split("=")[1] || 90);

fs.mkdirSync(outRoot, { recursive: true });

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

const normText = (value = "") => value.normalize("NFKC").replace(/\s+/g, " ").trim();

const captureViewport = async (browser, url, shotPath, viewport) => {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1, isMobile: viewport.width < 600 });
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 70000 });
    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => undefined);
    await page.waitForTimeout(300);
    await page.screenshot({ path: shotPath, fullPage: false });
    return await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll("h1,h2,h3"))
        .map((node) => node.textContent || "")
        .map((text) => text.trim())
        .filter(Boolean)
        .slice(0, 6);
      const firstText = Array.from(document.body.querySelectorAll("main, h1, h2, p, a, button"))
        .map((node) => node.textContent || "")
        .map((text) => text.replace(/\s+/g, " ").trim())
        .filter((text) => text.length >= 2)
        .slice(0, 10)
        .join(" / ");
      return {
        title: document.title,
        h1: document.querySelector("h1")?.textContent?.trim() || "",
        headings,
        firstText,
        height: document.documentElement.scrollHeight,
        scripts: document.scripts.length,
        iframes: document.querySelectorAll("iframe").length,
      };
    });
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
const { port } = server.address();
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });

const viewports = [
  { name: "desktop-1440", width: 1440, height: 1100 },
  { name: "mobile-390", width: 390, height: 900 },
];

const reports = [];
for (const [index, route] of routes.entries()) {
  const routeOut = path.join(outRoot, safeName(route));
  fs.mkdirSync(routeOut, { recursive: true });
  const cases = [];
  for (const viewport of viewports) {
    const livePath = path.join(routeOut, `live-${viewport.name}.png`);
    const localPath = path.join(routeOut, `local-${viewport.name}.png`);
    const live = await captureViewport(browser, `https://lexus-ec.com${route}`, livePath, viewport);
    const local = await captureViewport(browser, `http://127.0.0.1:${port}${route}`, localPath, viewport);
    const viewportVisual = await visualSimilarity(livePath, localPath);
    cases.push({
      viewport: viewport.name,
      viewportVisual: Number(viewportVisual.toFixed(1)),
      live: { ...live, screenshot: path.relative(workspace, livePath) },
      local: { ...local, screenshot: path.relative(workspace, localPath) },
      h1Matches: normText(live.h1) === normText(local.h1),
    });
  }
  const scores = cases.map((item) => item.viewportVisual);
  const lowestViewportVisual = Math.min(...scores);
  const averageViewportVisual = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const h1Mismatch = cases.some((item) => !item.h1Matches);
  const failures = [];
  if (lowestViewportVisual < minViewportVisual) failures.push(`lowestViewportVisual ${lowestViewportVisual.toFixed(1)} < ${minViewportVisual}`);
  if (averageViewportVisual < minViewportAverage) failures.push(`averageViewportVisual ${averageViewportVisual.toFixed(1)} < ${minViewportAverage}`);
  if (h1Mismatch) failures.push("h1Mismatch");
  const pageReport = {
    route,
    lowestViewportVisual: Number(lowestViewportVisual.toFixed(1)),
    averageViewportVisual: Number(averageViewportVisual.toFixed(1)),
    h1Mismatch,
    passed: failures.length === 0,
    failures,
    cases,
  };
  reports.push(pageReport);
  console.log(
    `[${index + 1}/${routes.length}] ${route} avg=${pageReport.averageViewportVisual} min=${pageReport.lowestViewportVisual} ${pageReport.passed ? "PASS" : `FAIL ${failures.join(", ")}`}`,
  );
}

await browser.close();
server.close();

const summary = {
  measuredAt: new Date().toISOString(),
  routes: reports.length,
  thresholds: { minViewportVisual, minViewportAverage },
  failing: reports.filter((item) => !item.passed).length,
  worst: [...reports]
    .sort((a, b) => a.averageViewportVisual - b.averageViewportVisual || a.lowestViewportVisual - b.lowestViewportVisual)
    .slice(0, 15)
    .map((item) => ({
      route: item.route,
      averageViewportVisual: item.averageViewportVisual,
      lowestViewportVisual: item.lowestViewportVisual,
      failures: item.failures,
    })),
  reports,
};

fs.writeFileSync(path.join(outRoot, "summary.json"), JSON.stringify(summary, null, 2));
console.log(JSON.stringify({ routes: summary.routes, failing: summary.failing, worst: summary.worst }, null, 2));
