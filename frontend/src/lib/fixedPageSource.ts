import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { formPageConfigs } from "../data/fixedPages";
import { seo } from "../data/home";
import { getLegacyRedirectByPath } from "./legacyRedirects";

type PageManifestItem = {
  path: string;
  url: string;
  status: number;
  bytes: number;
  fileName: string;
};

export type ExtractedPage = {
  path: string;
  title: string;
  description: string;
  canonical: string;
  h1: string;
  headings: string[];
  paragraphs: string[];
  images: { src: string; alt: string }[];
  contentHtml: string;
  form?: (typeof formPageConfigs)[string];
};

const firstBaselineDir = (urls: URL[]) => {
  for (const url of urls) {
    const dir = fileURLToPath(url);
    if (existsSync(path.join(dir, "manifest.json"))) return dir;
  }
  return fileURLToPath(urls[0]);
};

const getBaselineDir = () =>
  firstBaselineDir([
    new URL("../../baseline/pages/", import.meta.url),
    new URL("../../../baseline/pages/", import.meta.url),
  ]);
const dedicatedPagePaths = new Set([
  "/test-entry/",
  "/top/information-shiritsu/",
  "/top/information-kokuritsu/",
  "/kuriage-information/",
  "/medical-math-training/",
  "/top/teacher/",
  "/top/course/",
  "/top/course/lexus-premiere-course/",
  "/top/course/high-level-geneki-course/",
  "/top/course/custom-made-course/",
  "/top/course/medical-prep/",
  "/top/course/medical-prep-junior/",
  "/top/voice/",
  "/top/results/",
  "/top/history/",
  "/top/faq/",
  "/top/access/",
  "/top/lexus-garden/",
  "/entrance/",
  "/lexus-premier/",
  "/medical-english-training/",
  "/request-documents/",
  "/top/reservation/",
  "/reservation/",
  "/top/contact/",
]);

let knownStaticPaths: Set<string> | undefined;

const routePathname = (value: string) => {
  try {
    return new URL(value).pathname;
  } catch {
    return value;
  }
};

const routeVariants = (value: string) => {
  const variants = new Set<string>();
  const add = (item: string) => {
    const pathname = routePathname(item).split(/[?#]/)[0] || "/";
    variants.add(pathname.endsWith("/") ? pathname : `${pathname}/`);
  };
  add(value);
  try {
    add(decodeURIComponent(value));
  } catch {
    // Keep the original encoded route when decoding is not possible.
  }
  return variants;
};

const getKnownStaticPaths = () => {
  if (knownStaticPaths) return knownStaticPaths;
  const baselineDir = getBaselineDir();
  const manifest = JSON.parse(readFileSync(path.join(baselineDir, "manifest.json"), "utf8")) as PageManifestItem[];
  knownStaticPaths = new Set(["/"]);
  for (const item of manifest) {
    for (const variant of routeVariants(item.path)) knownStaticPaths.add(variant);
  }
  for (const route of dedicatedPagePaths) {
    for (const variant of routeVariants(route)) knownStaticPaths.add(variant);
  }
  return knownStaticPaths;
};

const decodeEntities = (value = "") =>
  value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#039;/g, "'")
    .replace(/&rsquo;|&lsquo;/g, "'")
    .replace(/&rdquo;|&ldquo;/g, "\"")
    .replace(/&ndash;|&mdash;/g, "-");

const cleanText = (value = "") =>
  decodeEntities(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const unique = <T>(items: T[]) => [...new Set(items)];

const attr = (tag: string, name: string) => {
  const match = tag.match(new RegExp(`${name}=["']([^"']*)["']`, "i"));
  return match?.[1] || "";
};

const mainHtml = (html: string) => html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] || html;

const legacyPageTitle = (html: string) => {
  const title = cleanText(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
  return (
    title
      .replace(/\s+-\s+レクサス教育センター.*$/, "")
      .replace(/\s+-\s+医学部予備校.*$/, "")
      .trim() || seo.title
  );
};

void legacyPageTitle;

const pageDescription = (html: string) => {
  const tag = html.match(/<meta[^>]+name=["']description["'][^>]*>/i)?.[0] || "";
  return cleanText(attr(tag, "content") || seo.description);
};

const pageTitle = (html: string) => cleanText(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "") || seo.title;

const pageTitleOverrides: Record<string, string> = {
  "/information-faq/": "医学部入試のQ&A｜倍率・学費・卒業率を医学部予備校レクサスが解説",
};

const pageCanonical = (html: string, fallbackPath: string) => {
  const tag = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0] || "";
  return attr(tag, "href") || new URL(fallbackPath, "https://lexus-ec.com").href;
};

const normalizeAssetAttrs = (html: string) =>
  html
    .replace(/\ssrc=(["'])data:image[\s\S]*?\1/gi, "")
    .replace(/\sdata-lazy-src=(["'])(.*?)\1/gi, (_, _quote, src) => ` src="${src}"`)
    .replace(/\sdata-lazy-srcset=(["'])(.*?)\1/gi, "")
    .replace(/\s(?:srcset|sizes|loading|decoding)=(["'])(.*?)\1/gi, "");

const localFormPathForLink = (anchorHtml: string) => {
  const text = cleanText(anchorHtml);
  if (text.includes("資料")) return "/request-documents/";
  if (text.includes("問合") || text.includes("問い合わせ")) return "/top/contact/";
  if (text.includes("テスト") || text.includes("選抜")) return "/test-entry/";
  return "/top/reservation/";
};

const localLegacyAssetPath = (assetPath: string) => {
  try {
    return `/assets/legacy${decodeURI(assetPath)}`;
  } catch {
    return `/assets/legacy${assetPath}`;
  }
};

const normalizeInternalLinks = (html: string) =>
  html
    .replace(/<a\b([^>]*?)href=(["'])https:\/\/docs\.google\.com\/forms\/[^"']*\2([^>]*)>([\s\S]*?)<\/a>/gi, (_match, before, _quote, after, inner) =>
      `<a${before}href="${localFormPathForLink(inner)}"${after}>${inner}</a>`,
    )
    .replace(/(href|src)=(["'])https:\/\/lexus-ec\.com(\/wp-content\/uploads\/[^"']*)\2/gi, (_match, attrName, _quote, assetPath) =>
      `${attrName}="${localLegacyAssetPath(assetPath)}"`,
    )
    .replace(/(href|src)=(["'])(\/wp-content\/uploads\/[^"']*)\2/gi, (_match, attrName, _quote, assetPath) =>
      `${attrName}="${localLegacyAssetPath(assetPath)}"`,
    )
    .replace(/href=(["'])https:\/\/lexus-ec\.com([^"']*)\1/gi, (_match, _quote, href) => {
      const pathname = href || "/";
      const legacyRedirect = getLegacyRedirectByPath(pathname);
      if (legacyRedirect) return `href="${legacyRedirect.to}"`;
      const isMigrated = [...routeVariants(pathname)].some((variant) => getKnownStaticPaths().has(variant));
      return isMigrated ? `href="${pathname}"` : `href="https://lexus-ec.com${pathname}"`;
    })
    .replace(/src=(["'])https:\/\/lexus-ec\.com([^"']*)\1/gi, (_match, _quote, src) => `src="https://lexus-ec.com${src}"`);

const replaceExternalWidgets = (html: string) =>
  html.replace(
    /<img\b[^>]*src=(["'])https:\/\/scdn\.line-apps\.com\/n\/line_add_friends\/btn\/ja\.png\1[^>]*>/gi,
    '<span class="legacy-line-button">LINE</span>',
  );

// Elementor gallery widgets set each tile's image as an inline-style
// background-image, which stripUnsafeAttrs() later removes — leaving empty
// tiles. The image URL still lives on the wrapping <a href>; restore it as a
// real <img> inside the tile so the gallery renders.
const restoreGalleryImages = (html: string) =>
  html.replace(
    /<a\b([^>]*e-gallery-item[^>]*)>([\s\S]*?)<div\b([^>]*elementor-gallery-item__image[^>]*)>\s*<\/div>/gi,
    (match, aAttrs, between, imgAttrs) => {
      const href = attr(`<a${aAttrs}>`, "href");
      if (!href || !/\.(?:jpe?g|png|webp|gif|avif)$/i.test(href)) return match;
      const alt = (attr(`<div${imgAttrs}>`, "aria-label") || "").replace(/"/g, "&quot;");
      return `<a${aAttrs}>${between}<div${imgAttrs}><img src="${href}" alt="${alt}"></div>`;
    },
  );

const stripUnsafeAttrs = (html: string) =>
  html
    .replace(/\son[a-z]+=(["'])(.*?)\1/gi, "")
    .replace(/\sstyle=(["'])(.*?)\1/gi, "")
    .replace(/\s(?:id|data-[\w:-]+)=(["'])(.*?)\1/gi, "")
    .replace(/\s(?:role|tabindex|target|rel)=(["'])(.*?)\1/gi, "");

const escapeHtmlAttr = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const assetLabel = (href: string) => {
  const pathname = routePathname(href).split(/[?#]/)[0] || href;
  const fileName = pathname.split("/").filter(Boolean).pop() || "画像";
  const decoded = decodeEntities(fileName);
  let label = decoded;
  try {
    label = decodeURIComponent(decoded);
  } catch {
    label = decoded;
  }
  return label
    .replace(/\.(?:jpe?g|png|webp|gif|avif)$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim() || "画像";
};

const accessibleLinkLabel = (href: string) => {
  const pathname = routePathname(href);
  if (pathname.includes("/request-documents/")) return "資料請求ページを開く";
  if (/\.(?:jpe?g|png|webp|gif|avif)$/i.test(pathname.split(/[?#]/)[0] || "")) {
    return `画像を開く: ${assetLabel(href)}`;
  }
  return "";
};

const labelNamelessLinks = (html: string) =>
  html.replace(
    /<a\b([^>]*?)href=(["'])(.*?)\2([^>]*)>([\s\S]*?)<\/a>/gi,
    (match, before, quote, href, after, inner) => {
      if (/\saria-label=(["']).*?\1/i.test(`${before} ${after}`)) return match;
      if (cleanText(inner)) return match;
      const label = accessibleLinkLabel(href);
      if (!label) return match;
      return `<a${before}aria-label="${escapeHtmlAttr(label)}" href=${quote}${href}${quote}${after}>${inner}</a>`;
    },
  );

const addImageAltDefaults = (html: string) =>
  html.replace(/<img\b([^>]*)>/gi, (tag, attrs) => {
    const src = attr(tag, "src");
    if (!src) return tag;
    const hasAlt = /\salt=(["'])(.*?)\1/i.test(tag);
    if (hasAlt && !/\salt=(["'])\s*\1/i.test(tag)) return tag;
    const alt = assetLabel(src);
    if (hasAlt) return tag.replace(/\salt=(["'])\s*\1/i, ` alt="${escapeHtmlAttr(alt)}"`);
    const normalizedAttrs = String(attrs).replace(/\/\s*$/, "");
    return `<img${normalizedAttrs} alt="${escapeHtmlAttr(alt)}">`;
  });

const addMediaDefaults = (html: string) =>
  html
    .replace(/<img\b([^>]*)>/gi, (tag) => {
      if (!/src=["'][^"']+["']/i.test(tag)) return "";
      return tag.replace(/\s*\/?>$/, ' loading="lazy" decoding="async">');
    })
    .replace(/<video\b([^>]*)>/gi, (tag) =>
      tag
        .replace(/\sautoplay(=(["']).*?\2)?/gi, "")
        .replace(/\spreload=(["'])(.*?)\1/gi, "")
        .replace(/>$/, ' preload="none">'),
    );

const sanitizeSourceHtml = (content: string, options: { removeFirstH1?: boolean } = {}) => {
  let h1Removed = false;
  const withoutDynamic = content
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<link[\s\S]*?>/gi, " ")
    .replace(/<meta[\s\S]*?>/gi, " ")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, " ")
    .replace(/<form[\s\S]*?<\/form>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<input[\s\S]*?>/gi, " ")
    .replace(/<button[\s\S]*?<\/button>/gi, " ")
    .replace(/<h1\b([^>]*)>([\s\S]*?)<\/h1>/gi, (_match, attrs, inner) => {
      if (options.removeFirstH1 && !h1Removed) {
        h1Removed = true;
        return " ";
      }
      return `<h2${attrs}>${inner}</h2>`;
    });

  return addMediaDefaults(addImageAltDefaults(labelNamelessLinks(stripUnsafeAttrs(restoreGalleryImages(replaceExternalWidgets(normalizeInternalLinks(normalizeAssetAttrs(withoutDynamic))))))))
    .replace(/<div class=["']elementor-widget-container["']>\s*<\/div>/gi, " ")
    .replace(/<p>\s*<\/p>/gi, " ")
    .replace(/\s+([）」』】、。，．！？!?])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
};

const extractImages = (content: string) =>
  unique(
    [...content.matchAll(/<img[^>]+>/gi)]
      .map((match) => {
        const tag = match[0];
        const src = attr(tag, "data-lazy-src") || attr(tag, "src");
        return { src, alt: cleanText(attr(tag, "alt")) };
      })
      .filter((image) => image.src && !image.src.startsWith("data:image") && !image.src.includes("社名ロゴ") && !image.src.includes("アイコン-")),
  ).slice(0, 10);

const extractPage = (item: PageManifestItem): ExtractedPage => {
  const baselineDir = getBaselineDir();
  const html = readFileSync(path.join(baselineDir, item.fileName), "utf8");
  const content = mainHtml(html)
    .replace(/<form[\s\S]*?<\/form>/gi, " ")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");

  const title = pageTitleOverrides[item.path] || pageTitle(html);
  const description = pageDescription(html);
  const headingRows = [...content.matchAll(/<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi)]
    .map((match) => ({ tag: `h${match[1]}`, text: cleanText(match[2]) }))
    .filter((heading) => heading.text && heading.text.length < 120);
  const h1 = headingRows.find((heading) => heading.tag === "h1")?.text || headingRows[0]?.text || title;
  const headings = unique(
    headingRows
      .filter((heading) => heading.text !== h1)
      .map((heading) => heading.text)
      .filter((text) => text.length >= 4),
  ).slice(0, 12);
  const paragraphs = unique(
    [...content.matchAll(/<(p|li|td)[^>]*>([\s\S]*?)<\/\1>/gi)]
      .map((match) => cleanText(match[2]))
      .filter((text) => text.length >= 28)
      .filter((text) => !["アクセス", "個別相談", "お問合せ", "資料請求"].includes(text)),
  ).slice(0, 18);

  return {
    path: item.path,
    title,
    description,
    canonical: pageCanonical(html, item.path),
    h1,
    headings,
    paragraphs,
    images: extractImages(content),
    contentHtml: sanitizeSourceHtml(content, { removeFirstH1: Boolean(formPageConfigs[item.path]) && item.path !== "/test-entry/" }),
    form: formPageConfigs[item.path],
  };
};

export const getFixedPageStaticPaths = () => {
  const baselineDir = getBaselineDir();
  const manifest = JSON.parse(readFileSync(path.join(baselineDir, "manifest.json"), "utf8")) as PageManifestItem[];

  return manifest
    .filter((item) => item.status === 200 && !dedicatedPagePaths.has(item.path))
    .map((item) => ({
      params: { slug: decodeURIComponent(item.path).replace(/^\/|\/$/g, "") },
      props: { page: extractPage(item) },
    }));
};

export const getFixedPageByPath = (targetPath: string) => {
  const requestedVariants = routeVariants(targetPath);
  const baselineDir = getBaselineDir();
  const manifest = JSON.parse(readFileSync(path.join(baselineDir, "manifest.json"), "utf8")) as PageManifestItem[];
  const item = manifest.find(
    (entry) =>
      entry.status === 200 &&
      !dedicatedPagePaths.has(entry.path) &&
      [...routeVariants(entry.path)].some((variant) => requestedVariants.has(variant)),
  );

  return item ? extractPage(item) : undefined;
};

// Like getFixedPageByPath but ignores the dedicatedPagePaths guard, so a page
// being promoted to a dedicated .astro can still pull its extracted legacy body.
export const extractLegacyContentByPath = (targetPath: string) => {
  const requestedVariants = routeVariants(targetPath);
  const baselineDir = getBaselineDir();
  const manifest = JSON.parse(readFileSync(path.join(baselineDir, "manifest.json"), "utf8")) as PageManifestItem[];
  const item = manifest.find(
    (entry) =>
      entry.status === 200 &&
      [...routeVariants(entry.path)].some((variant) => requestedVariants.has(variant)),
  );
  return item ? extractPage(item) : undefined;
};
