import { chromium } from "playwright-core";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const workspace = path.resolve(root, "..");
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const targetUrl = process.argv[2] || "https://lexus-ec.com/";
const outName = process.argv[3] || "home-current";
const outDir = path.join(workspace, "reports", "visual", outName);

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: ["--disable-gpu", "--no-sandbox"],
});

async function captureViewport(name, viewport) {
  const page = await browser.newPage({
    viewport,
    deviceScaleFactor: 1,
    locale: "ja-JP",
    colorScheme: "light",
  });

  await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.waitForLoadState("networkidle", { timeout: 45_000 }).catch(() => {});
  await page.evaluate(async () => {
    await document.fonts?.ready?.catch?.(() => {});
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1000);

  const metrics = await page.evaluate(() => {
    const clean = (value) => String(value || "").replace(/\s+/g, " ").trim();
    const rectOf = (el) => {
      const rect = el.getBoundingClientRect();
      return {
        x: Math.round(rect.x + window.scrollX),
        y: Math.round(rect.y + window.scrollY),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
    };
    const visible = (el) => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
    };
    const stylePick = (el) => {
      const style = window.getComputedStyle(el);
      return {
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        color: style.color,
        backgroundColor: style.backgroundColor,
        textAlign: style.textAlign,
      };
    };

    const headings = [...document.querySelectorAll("h1,h2,h3")]
      .filter(visible)
      .map((el) => {
        const section = el.closest(".elementor-element, section, article, main, header, footer");
        return {
          tag: el.tagName.toLowerCase(),
          text: clean(el.textContent),
          rect: rectOf(el),
          style: stylePick(el),
          sectionClass: section?.getAttribute("class") || "",
          sectionId: section?.id || "",
        };
      });

    const images = [...document.images]
      .filter(visible)
      .map((el) => ({
        alt: clean(el.alt),
        src: el.currentSrc || el.src || el.dataset?.lazySrc || "",
        lazySrc: el.dataset?.lazySrc || "",
        rect: rectOf(el),
      }));

    const links = [...document.querySelectorAll("a[href]")]
      .filter(visible)
      .map((el) => ({
        text: clean(el.textContent),
        href: el.href,
        rect: rectOf(el),
      }))
      .filter((link) => link.text || link.href);

    const iframes = [...document.querySelectorAll("iframe")]
      .filter(visible)
      .map((el) => ({
        src: el.src,
        title: el.title || "",
        rect: rectOf(el),
      }));

    const bodyStyle = window.getComputedStyle(document.body);
    return {
      url: location.href,
      title: document.title,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      document: {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      },
      body: {
        fontFamily: bodyStyle.fontFamily,
        fontSize: bodyStyle.fontSize,
        color: bodyStyle.color,
        backgroundColor: bodyStyle.backgroundColor,
      },
      headings,
      images,
      links,
      iframes,
    };
  });

  await writeFile(path.join(outDir, `${name}.json`), JSON.stringify(metrics, null, 2), "utf8");
  await page.screenshot({ path: path.join(outDir, `${name}-full.png`), fullPage: true });

  const headingClips = metrics.headings
    .filter((heading) => ["h1", "h2"].includes(heading.tag))
    .filter((heading, index, all) => all.findIndex((other) => other.text === heading.text) === index)
    .slice(0, 22);

  for (let i = 0; i < headingClips.length; i++) {
    const heading = headingClips[i];
    const y = Math.max(0, heading.rect.y - 180);
    if (y >= metrics.document.height) {
      continue;
    }
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(150);
    await page.screenshot({
      path: path.join(outDir, `${name}-section-${String(i + 1).padStart(2, "0")}.png`),
    });
  }

  await page.close();
  return metrics;
}

const desktop = await captureViewport("desktop-1440", { width: 1440, height: 1200 });
const mobile = await captureViewport("mobile-390", { width: 390, height: 844 });

await writeFile(
  path.join(outDir, "summary.json"),
  JSON.stringify(
    {
      capturedAt: new Date().toISOString(),
      targetUrl,
      desktop: {
        document: desktop.document,
        headings: desktop.headings.length,
        images: desktop.images.length,
        links: desktop.links.length,
        iframes: desktop.iframes.length,
      },
      mobile: {
        document: mobile.document,
        headings: mobile.headings.length,
        images: mobile.images.length,
        links: mobile.links.length,
        iframes: mobile.iframes.length,
      },
    },
    null,
    2,
  ),
  "utf8",
);

await browser.close();
console.log(`Captured visual inventory in ${outDir}`);
