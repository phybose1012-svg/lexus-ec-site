import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const workspace = path.resolve(root, "..");
const outDir = path.join(workspace, "reports", "home-containers");
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const targetUrl = process.argv[2] || "https://lexus-ec.com/";

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: ["--disable-gpu", "--no-sandbox"],
});

const page = await browser.newPage({
  viewport: { width: 1440, height: 1200 },
  deviceScaleFactor: 1,
  locale: "ja-JP",
});

await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 90_000 });
await page.waitForLoadState("networkidle", { timeout: 45_000 }).catch(() => {});
await page.evaluate(async () => {
  await document.fonts?.ready?.catch?.(() => {});
  window.scrollTo(0, 0);
});
await page.waitForTimeout(800);

const inventory = await page.evaluate(() => {
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
    return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
  };
  const classList = (el) => [...el.classList].join(" ");
  const pickStyle = (el) => {
    const style = window.getComputedStyle(el);
    return {
      display: style.display,
      position: style.position,
      backgroundColor: style.backgroundColor,
      backgroundImage: style.backgroundImage,
      color: style.color,
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      padding: style.padding,
      margin: style.margin,
      minHeight: style.minHeight,
      textAlign: style.textAlign,
    };
  };
  const elementorId = (el) => el.getAttribute("data-id") || [...el.classList].find((name) => name.startsWith("elementor-element-"))?.replace("elementor-element-", "") || "";
  const widgetType = (el) => el.getAttribute("data-widget_type") || "";
  const elementType = (el) => el.getAttribute("data-element_type") || "";
  const summarize = (root) => {
    const headings = [...root.querySelectorAll("h1,h2,h3")]
      .filter(visible)
      .map((el) => ({
        tag: el.tagName.toLowerCase(),
        text: clean(el.textContent),
        rect: rectOf(el),
        style: pickStyle(el),
      }));
    const images = [...root.querySelectorAll("img")]
      .filter(visible)
      .map((el) => ({
        alt: clean(el.alt),
        src: el.currentSrc || el.src || el.dataset.lazySrc || "",
        lazySrc: el.dataset.lazySrc || "",
        rect: rectOf(el),
      }));
    const links = [...root.querySelectorAll("a[href]")]
      .filter(visible)
      .map((el) => ({
        text: clean(el.textContent),
        href: el.href,
        rect: rectOf(el),
      }))
      .filter((link) => link.text || link.href)
      .slice(0, 40);
    const widgets = [...root.querySelectorAll(".elementor-element[data-widget_type]")]
      .filter(visible)
      .map((el) => ({
        id: elementorId(el),
        type: widgetType(el),
        classes: classList(el),
        rect: rectOf(el),
        text: clean(el.textContent).slice(0, 180),
        images: [...el.querySelectorAll("img")].map((img) => img.currentSrc || img.src || img.dataset.lazySrc || "").filter(Boolean),
        links: [...el.querySelectorAll("a[href]")].map((a) => ({ text: clean(a.textContent), href: a.href })).filter((link) => link.text || link.href),
      }));
    const inlineStyleCount = root.querySelectorAll("[style]").length;
    const widgetTypes = [...new Set(widgets.map((widget) => widget.type).filter(Boolean))];
    const backgroundNodes = [root, ...root.querySelectorAll(".elementor-element")]
      .map((el) => ({
        id: elementorId(el),
        type: elementType(el) || widgetType(el),
        classes: classList(el),
        backgroundImage: window.getComputedStyle(el).backgroundImage,
        backgroundColor: window.getComputedStyle(el).backgroundColor,
      }))
      .filter((item) => item.backgroundImage && item.backgroundImage !== "none");

    return { headings, images, links, widgets, inlineStyleCount, widgetTypes, backgroundNodes };
  };

  const topContainers = [...document.querySelectorAll(".elementor-element[data-element_type='container'], .elementor-element[data-element_type='section']")]
    .filter(visible)
    .filter((el) => {
      const parentContainer = el.parentElement?.closest(".elementor-element[data-element_type='container'], .elementor-element[data-element_type='section']");
      return el.classList.contains("e-parent") || !parentContainer || el.parentElement?.classList.contains("elementor") || el.parentElement?.classList.contains("elementor-element");
    })
    .filter((el) => {
      const rect = el.getBoundingClientRect();
      return rect.height >= 80;
    })
    .map((el, index) => {
      const summary = summarize(el);
      return {
        index: index + 1,
        id: elementorId(el),
        elementType: elementType(el),
        classes: classList(el),
        rect: rectOf(el),
        style: pickStyle(el),
        textSample: clean(el.textContent).slice(0, 260),
        ...summary,
      };
    })
    .sort((a, b) => a.rect.y - b.rect.y);

  const cssLinks = [...document.querySelectorAll("link[rel='stylesheet']")].map((link) => link.href);
  const scripts = [...document.querySelectorAll("script[src]")].map((script) => script.src);

  return {
    url: location.href,
    title: document.title,
    document: {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    },
    cssLinks,
    scripts,
    topContainers,
  };
});

await writeFile(path.join(outDir, "elementor-containers.json"), JSON.stringify(inventory, null, 2), "utf8");

const markdown = [
  "# Home Elementor container inventory",
  "",
  `URL: ${inventory.url}`,
  `Document: ${inventory.document.width}x${inventory.document.height}`,
  `Top containers: ${inventory.topContainers.length}`,
  `Stylesheets: ${inventory.cssLinks.length}`,
  `External scripts: ${inventory.scripts.length}`,
  "",
  "| # | id | y | h | widget types | headings | images | links | inline styles | text sample |",
  "|---:|---|---:|---:|---|---:|---:|---:|---:|---|",
  ...inventory.topContainers.map((container) => {
    const sample = container.textSample.replace(/\|/g, "\\|");
    return `| ${container.index} | ${container.id} | ${container.rect.y} | ${container.rect.height} | ${container.widgetTypes.join(", ")} | ${container.headings.length} | ${container.images.length} | ${container.links.length} | ${container.inlineStyleCount} | ${sample} |`;
  }),
  "",
].join("\n");

await writeFile(path.join(outDir, "elementor-containers.md"), markdown, "utf8");
await browser.close();

console.log(`Wrote ${path.join(outDir, "elementor-containers.md")}`);
