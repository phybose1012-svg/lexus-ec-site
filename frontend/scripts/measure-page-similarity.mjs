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
const passScore = Number(args.pass || 68.5);
const minViewportVisual = Number(args.minViewportVisual || 88);
const minViewportVisualAverage = Number(args.minViewportVisualAverage || 90);
const localBase = args.localBase?.replace(/\/$/, "");
const workspace = path.resolve(process.cwd(), "..");
const dist = path.resolve(process.cwd(), "dist");
const out = path.join(workspace, "reports", "similarity", reportName);
fs.mkdirSync(out, { recursive: true });

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

const normText = (value = "") => value.normalize("NFKC").replace(/\s+/g, "").trim();

const basenameUrl = (src = "") => {
  try {
    const url = new URL(src, "https://lexus-ec.com");
    return decodeURIComponent(path.basename(url.pathname)).replace(/-\d+x\d+(?=\.[^.]+$)/, "");
  } catch {
    return src;
  }
};

const comparableHref = (href = "") => {
  const withoutOrigin = href.replace(/^https:\/\/lexus-ec\.com\/?/, "/");
  const localAsset = withoutOrigin.replace(/^\/assets\/legacy\/wp-content\//, "/wp-content/");
  return localAsset === "/" ? "" : localAsset;
};

const jaccard = (left, right) => {
  const a = new Set(left.filter(Boolean));
  const b = new Set(right.filter(Boolean));
  if (!a.size && !b.size) return 100;
  let intersection = 0;
  for (const item of a) if (b.has(item)) intersection += 1;
  return (intersection / (a.size + b.size - intersection)) * 100;
};

const containment = (live, local) => {
  const liveSet = [...new Set(live.filter(Boolean))];
  const localSet = new Set(local.filter(Boolean));
  if (!liveSet.length) return 100;
  return (liveSet.filter((item) => localSet.has(item)).length / liveSet.length) * 100;
};

const charNgrams = (text, n = 4) => {
  const normalized = normText(text);
  const grams = [];
  for (let index = 0; index <= normalized.length - n; index += 1) grams.push(normalized.slice(index, index + n));
  return grams;
};

const normalizedRaw = async (file, width, height) => {
  let resized = await sharp(file).resize({ width, withoutEnlargement: false }).removeAlpha().toBuffer();
  let meta = await sharp(resized).metadata();
  if (meta.height > height) resized = await sharp(resized).extract({ left: 0, top: 0, width, height }).toBuffer();
  return sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite([{ input: resized, left: 0, top: 0 }])
    .raw()
    .toBuffer();
};

const visualSimilarity = async (leftPath, rightPath, mode) => {
  const leftMeta = await sharp(leftPath).metadata();
  const rightMeta = await sharp(rightPath).metadata();
  const width = mode === "full" ? 720 : Math.min(leftMeta.width, rightMeta.width);
  const leftHeight = mode === "full" ? Math.round((leftMeta.height * width) / leftMeta.width) : Math.min(leftMeta.height, rightMeta.height);
  const rightHeight = mode === "full" ? Math.round((rightMeta.height * width) / rightMeta.width) : Math.min(leftMeta.height, rightMeta.height);
  const height = mode === "full" ? Math.min(24000, Math.max(leftHeight, rightHeight)) : Math.min(leftHeight, rightHeight);
  const leftRaw = await normalizedRaw(leftPath, width, height);
  const rightRaw = await normalizedRaw(rightPath, width, height);
  let diff = 0;
  for (let index = 0; index < leftRaw.length; index += 1) diff += Math.abs(leftRaw[index] - rightRaw[index]);
  return Math.max(0, 100 - ((diff / leftRaw.length) / 255) * 100);
};

const capture = async (page, url, prefix, viewport) => {
  await page.goto(url, { waitUntil: "networkidle", timeout: 70000 });
  const viewportPath = path.join(out, `${prefix}-${viewport.name}-viewport.png`);
  const fullPath = path.join(out, `${prefix}-${viewport.name}-full.png`);
  await page.screenshot({ path: viewportPath, fullPage: false });
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = Math.max(600, Math.floor(viewport.height * 0.8));
  for (let y = 0; y < pageHeight; y += step) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(80);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(120);
  await page.screenshot({ path: fullPath, fullPage: true });
  const data = await page.evaluate(() => {
    const comparableBody = document.body.cloneNode(true);
    comparableBody.querySelectorAll("script, style, noscript, [data-similarity-ignore], .google-form-lite").forEach((node) => node.remove());
    const texts = (selector) => Array.from(comparableBody.querySelectorAll(selector)).map((node) => node.textContent.trim()).filter(Boolean);
    const meta = (name) => document.querySelector(`meta[name="${name}"]`)?.getAttribute("content") || "";
    return {
      title: document.title,
      description: meta("description"),
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "",
      bodyText: comparableBody.innerText,
      headings: texts("h1,h2,h3,h4"),
      links: Array.from(comparableBody.querySelectorAll("a")).map((link) => link.getAttribute("href") || link.href).filter(Boolean),
      buttons: Array.from(comparableBody.querySelectorAll('a.button,a[class*="button"],.elementor-button,button,input[type="submit"]'))
        .map((node) => (node.value || node.textContent || "").trim())
        .filter((text) => text && !text.startsWith("<img") && !text.startsWith("Close ")),
      images: Array.from(document.images).map((image) => image.currentSrc || image.src).filter(Boolean),
      height: document.documentElement.scrollHeight,
      headingCount: document.querySelectorAll("h1,h2,h3,h4").length,
      linkCount: document.links.length,
      imageCount: document.images.length,
      scriptCount: document.scripts.length,
      iframeCount: document.querySelectorAll("iframe").length,
      initialVideoSrcCount: Array.from(document.querySelectorAll("video")).filter((video) => video.getAttribute("src")).length,
    };
  });
  return { data, viewportPath, fullPath };
};

const server = localBase ? null : staticServer(dist);
if (server) await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const port = server?.address().port;
const localUrl = localBase ? `${localBase}${pagePath}` : `http://127.0.0.1:${port}${pagePath}`;
const liveUrl = `https://lexus-ec.com${pagePath}`;
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const cases = [];

for (const viewport of [
  { name: "desktop-1440", width: 1440, height: 1100 },
  { name: "mobile-390", width: 390, height: 900 },
]) {
  const livePage = await browser.newPage({ viewport, deviceScaleFactor: 1, isMobile: viewport.width < 600 });
  const localPage = await browser.newPage({ viewport, deviceScaleFactor: 1, isMobile: viewport.width < 600 });
  const live = await capture(livePage, liveUrl, "live", viewport);
  const local = await capture(localPage, localUrl, "local", viewport);
  await livePage.close();
  await localPage.close();

  const viewportVisual = await visualSimilarity(live.viewportPath, local.viewportPath, "viewport");
  const fullVisual = await visualSimilarity(live.fullPath, local.fullPath, "full");
  const visual = viewportVisual * 0.45 + fullVisual * 0.55;
  const headingSimilarity = jaccard(live.data.headings.map(normText), local.data.headings.map(normText));
  const textCoverage = jaccard(charNgrams(live.data.bodyText), charNgrams(local.data.bodyText));
  const imageSetSimilarity = containment(live.data.images.map(basenameUrl), local.data.images.map(basenameUrl));
  const content = textCoverage * 0.5 + headingSimilarity * 0.3 + imageSetSimilarity * 0.2;
  const linkSimilarity = jaccard(
    live.data.links.map(comparableHref),
    local.data.links.map(comparableHref),
  );
  const buttonSimilarity = jaccard(live.data.buttons.map(normText), local.data.buttons.map(normText));
  const navigation = linkSimilarity * 0.55 + buttonSimilarity * 0.45;
  const seo =
    ((normText(live.data.title) === normText(local.data.title) ? 1 : 0) +
      (normText(live.data.description) === normText(local.data.description) ? 1 : 0) +
      (normText(live.data.canonical) === normText(local.data.canonical) ? 1 : 0)) /
    3 *
    100;
  const score = visual * 0.5 + content * 0.3 + navigation * 0.15 + seo * 0.05;

  cases.push({
    viewport: viewport.name,
    score: Number(score.toFixed(1)),
    components: {
      visual: Number(visual.toFixed(1)),
      viewportVisual: Number(viewportVisual.toFixed(1)),
      fullVisual: Number(fullVisual.toFixed(1)),
      content: Number(content.toFixed(1)),
      textCoverage: Number(textCoverage.toFixed(1)),
      headingSimilarity: Number(headingSimilarity.toFixed(1)),
      imageSetSimilarity: Number(imageSetSimilarity.toFixed(1)),
      navigation: Number(navigation.toFixed(1)),
      linkSimilarity: Number(linkSimilarity.toFixed(1)),
      buttonSimilarity: Number(buttonSimilarity.toFixed(1)),
      seo: Number(seo.toFixed(1)),
    },
    live: {
      height: live.data.height,
      headings: live.data.headingCount,
      links: live.data.linkCount,
      images: live.data.imageCount,
      scripts: live.data.scriptCount,
      iframes: live.data.iframeCount,
      viewportPath: path.relative(workspace, live.viewportPath),
      fullPath: path.relative(workspace, live.fullPath),
    },
    local: {
      height: local.data.height,
      headings: local.data.headingCount,
      links: local.data.linkCount,
      images: local.data.imageCount,
      scripts: local.data.scriptCount,
      iframes: local.data.iframeCount,
      initialVideoSrcCount: local.data.initialVideoSrcCount,
      viewportPath: path.relative(workspace, local.viewportPath),
      fullPath: path.relative(workspace, local.fullPath),
    },
  });
}

await browser.close();
server?.close();

const viewportVisuals = cases.map((item) => item.components.viewportVisual);
const lowestViewportVisual = Math.min(...viewportVisuals);
const averageViewportVisual = viewportVisuals.reduce((sum, value) => sum + value, 0) / viewportVisuals.length;
const criticalFailures = [];
if (lowestViewportVisual < minViewportVisual) {
  criticalFailures.push(`lowest viewport visual ${lowestViewportVisual.toFixed(1)} < ${minViewportVisual}`);
}
if (averageViewportVisual < minViewportVisualAverage) {
  criticalFailures.push(`average viewport visual ${averageViewportVisual.toFixed(1)} < ${minViewportVisualAverage}`);
}

const report = {
  measuredAt: new Date().toISOString(),
  liveUrl,
  localUrl,
  scoring: {
    overall: "desktop/mobile average",
    weights: { visual: 50, content: 30, navigation: 15, seo: 5 },
    passScore,
    minViewportVisual,
    minViewportVisualAverage,
    rule: "Page must be >= top-page baseline and must not fail first-viewport visual gates.",
  },
  overallScore: Number((cases.reduce((sum, item) => sum + item.score, 0) / cases.length).toFixed(1)),
  criticalFailures,
  passed: cases.every((item) => item.score >= passScore) && criticalFailures.length === 0,
  cases,
};

fs.writeFileSync(path.join(out, `${reportName}-similarity.json`), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
