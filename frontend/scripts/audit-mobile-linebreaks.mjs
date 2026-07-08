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

const routes = walk(root).map(routeFor).sort((a, b) => a.localeCompare(b));

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

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});

const auditInPage = () => {
  const candidateSelector = [
    "h1",
    "h2",
    "h3",
    "h4",
    "button",
    ".button",
    "a.button",
    "nav a",
    ".article-hero__message",
    ".article-hero__lead",
    ".article-keypoints li",
    ".section-heading h2",
    ".section-heading p",
    ".home-hero__title",
    ".home-hero__lead",
    ".fixed-page h1",
    ".fixed-page h2",
  ].join(",");

  const badLineStart = /^[、。，．・：；？！!?)）\]}」』】〉》ぁぃぅぇぉっゃゅょァィゥェォッャュョー]/;
  const badLineEnd = /[（「『【〈《\[{]$/;
  const orphanParticles = new Set(["が", "を", "に", "へ", "と", "で", "の", "は", "も", "や", "か", "ね", "よ"]);

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
      const value = node.nodeValue || "";
      for (let index = 0; index < value.length; index += 1) {
        const char = value[index];
        if (!char || /\s/.test(char)) continue;
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
      .map((row) => row.text.trim())
      .filter(Boolean);
  };

  const elements = [...document.querySelectorAll(candidateSelector)].filter(isVisible);
  const elementIssues = [];

  for (const el of elements) {
    const text = (el.innerText || "").replace(/\s+/g, " ").trim();
    if (text.length < 2 || text.length > 180) continue;
    const rect = el.getBoundingClientRect();
    const tag = el.tagName.toLowerCase();
    const isHeading = /^h[1-4]$/.test(tag) || el.matches(".home-hero__title,.section-heading h2,.fixed-page h1,.fixed-page h2");
    const isControl = el.matches("button,.button,a.button,nav a");
    const lines = lineTexts(el);
    const issues = [];

    lines.forEach((line, index) => {
      if (line.length === 1 && /[\p{Letter}\p{Number}ー]/u.test(line)) issues.push(`single-char-line:${index + 1}:${line}`);
      if (orphanParticles.has(line)) issues.push(`orphan-particle:${index + 1}:${line}`);
      if (badLineStart.test(line)) issues.push(`bad-line-start:${index + 1}:${line}`);
      if (badLineEnd.test(line)) issues.push(`bad-line-end:${index + 1}:${line}`);
    });

    const last = lines.at(-1) || "";
    if ((isHeading || isControl) && lines.length >= 2 && last.length <= 2) issues.push(`tiny-last-line:${lines.length}:${last}`);
    if (isHeading && lines.length > 5) issues.push(`heading-too-many-lines:${lines.length}`);
    if (isControl && lines.length > 2) issues.push(`control-too-many-lines:${lines.length}`);
    if (el.scrollWidth > el.clientWidth + 2) issues.push(`element-overflow:${el.scrollWidth - el.clientWidth}px`);

    if (issues.length) {
      elementIssues.push({
        selector: tag + (el.id ? `#${el.id}` : el.className ? `.${String(el.className).trim().split(/\s+/).slice(0, 2).join(".")}` : ""),
        text,
        lines,
        issues,
        rect: {
          top: Math.round(rect.top),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
      });
    }
  }

  const overflowElements = [...document.querySelectorAll("body *")]
    .filter(isVisible)
    .map((el) => {
      const rect = el.getBoundingClientRect();
      const rightOverflow = rect.right - window.innerWidth;
      const leftOverflow = -rect.left;
      if (rightOverflow <= 2 && leftOverflow <= 2 && el.scrollWidth <= el.clientWidth + 2) return null;
      return {
        selector: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : el.className ? `.${String(el.className).trim().split(/\s+/).slice(0, 2).join(".")}` : ""),
        text: (el.innerText || "").replace(/\s+/g, " ").trim().slice(0, 90),
        rightOverflow: Math.round(Math.max(0, rightOverflow)),
        leftOverflow: Math.round(Math.max(0, leftOverflow)),
        scrollOverflow: Math.round(Math.max(0, el.scrollWidth - el.clientWidth)),
      };
    })
    .filter(Boolean)
    .slice(0, 20);

  return {
    title: document.title,
    viewportWidth: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    pageOverflow: document.documentElement.scrollWidth > window.innerWidth + 2,
    auditedElements: elements.length,
    elementIssues: elementIssues.slice(0, 30),
    overflowElements,
  };
};

const results = [];
for (const [index, route] of routes.entries()) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true });
  let status = null;
  let navigationError = "";
  let dom = null;
  try {
    const response = await page.goto(`${origin}${route}`, { waitUntil: "domcontentloaded", timeout: 45000 });
    status = response?.status() || null;
    await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
    dom = await page.evaluate(auditInPage);
  } catch (error) {
    navigationError = error.message;
  }
  await page.close();

  const issueCount = (dom?.elementIssues.length || 0) + (dom?.overflowElements.length || 0) + (dom?.pageOverflow ? 1 : 0);
  results.push({
    route,
    status,
    navigationError,
    title: dom?.title || "",
    auditedElements: dom?.auditedElements || 0,
    issueCount,
    pageOverflow: dom?.pageOverflow || false,
    documentWidth: dom?.documentWidth || 0,
    elementIssues: dom?.elementIssues || [],
    overflowElements: dom?.overflowElements || [],
  });

  if ((index + 1) % 50 === 0) console.log(`[mobile-audit] ${index + 1}/${routes.length}`);
}

await browser.close();
server.close();

const flagged = results.filter((result) => result.status !== 200 || result.navigationError || result.issueCount > 0);
const severe = flagged.filter((result) => result.status !== 200 || result.navigationError || result.pageOverflow || result.overflowElements.length > 0);

const report = {
  auditedAt: new Date().toISOString(),
  viewport: { width: 390, height: 844 },
  pages: results.length,
  flaggedPages: flagged.length,
  severePages: severe.length,
  severe,
  flagged,
  results,
};

fs.writeFileSync(path.join(reportDir, "mobile-linebreak-audit.json"), JSON.stringify(report, null, 2));

const escapeCell = (value = "") => String(value).replace(/\|/g, " / ").replace(/\n/g, " ");
const md = [
  "# Mobile Line Break Audit",
  "",
  `Audited: ${report.auditedAt}`,
  "",
  `- Pages: ${report.pages}`,
  `- Flagged pages: ${report.flaggedPages}`,
  `- Severe pages: ${report.severePages}`,
  "",
  "## Severe / Overflow",
  "",
  "| Route | Status | Issues | First issue |",
  "| --- | ---: | ---: | --- |",
  ...severe
    .slice(0, 120)
    .map((item) => {
      const first =
        item.navigationError ||
        item.overflowElements[0]?.text ||
        item.elementIssues[0]?.text ||
        (item.pageOverflow ? `document width ${item.documentWidth}` : "");
      return `| ${escapeCell(item.route)} | ${item.status || ""} | ${item.issueCount} | ${escapeCell(first)} |`;
    }),
  "",
  "## All Flagged Pages",
  "",
  "| Route | Issues | Sample |",
  "| --- | ---: | --- |",
  ...flagged
    .slice(0, 220)
    .map((item) => {
      const sample = item.elementIssues[0]?.issues?.join(", ") || item.overflowElements[0]?.selector || item.navigationError || "";
      return `| ${escapeCell(item.route)} | ${item.issueCount} | ${escapeCell(sample)} |`;
    }),
  "",
];
fs.writeFileSync(path.join(reportDir, "mobile-linebreak-audit.md"), `${md.join("\n")}\n`);

console.log(
  JSON.stringify(
    {
      pages: report.pages,
      flaggedPages: report.flaggedPages,
      severePages: report.severePages,
      topSevere: severe.slice(0, 20).map((item) => ({ route: item.route, issueCount: item.issueCount })),
    },
    null,
    2,
  ),
);
