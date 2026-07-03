import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const siteOrigin = "https://lexus-ec.com";
const root = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const workspace = path.resolve(root, "..");
const publicDir = path.join(root, "public");
const dataPath = path.join(root, "src", "data", "generated", "voiceInterviewPosts.json");

const posts = JSON.parse(await readFile(dataPath, "utf8"));
let baselinePosts = [];
try {
  baselinePosts = JSON.parse(
    execFileSync("git", ["show", "HEAD:frontend/src/data/generated/voiceInterviewPosts.json"], {
      cwd: workspace,
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
    }),
  );
} catch {
  baselinePosts = [];
}
const baselineByPath = new Map(baselinePosts.map((post) => [post.path, post]));

const decodeEntityMap = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "...",
  ndash: "-",
  mdash: "-",
  rsquo: "'",
  lsquo: "'",
  rdquo: '"',
  ldquo: '"',
};

function decodeEntities(value = "") {
  return String(value)
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number.parseInt(num, 10)))
    .replace(/&([a-z]+);/gi, (_, name) => decodeEntityMap[name] ?? `&${name};`);
}

function stripTags(value = "") {
  return decodeEntities(
    String(value)
      .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function attr(tag, name) {
  return tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "i"))?.[1] || "";
}

function escapeAttr(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeRegExp(value = "") {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeLegacyAssetReference(assetPath = "") {
  try {
    return `/assets/legacy${decodeURI(assetPath)}`;
  } catch {
    return `/assets/legacy${assetPath}`;
  }
}

function normalizeAssetUrl(value = "") {
  if (!value) return "";
  const decoded = decodeEntities(value).trim();
  try {
    const url = new URL(decoded, siteOrigin);
    if (url.origin === siteOrigin && url.pathname.startsWith("/wp-content/uploads/")) {
      return normalizeLegacyAssetReference(url.pathname);
    }
    if (url.origin === siteOrigin) return `${decodeURI(url.pathname)}${url.search}`;
    return url.href;
  } catch {
    if (decoded.startsWith("/wp-content/uploads/")) return normalizeLegacyAssetReference(decoded);
    return decoded;
  }
}

function normalizeInternalHref(value = "") {
  if (!value) return "";
  const decoded = decodeEntities(value).trim();
  try {
    const url = new URL(decoded, siteOrigin);
    if (url.origin === siteOrigin) return `${decodeURI(url.pathname)}${url.search}${url.hash}`;
    return url.href;
  } catch {
    return decoded;
  }
}

function publicAssetExists(src = "") {
  if (!src.startsWith("/")) return false;
  return existsSync(path.join(publicDir, src));
}

function isGenericImage(src = "", alt = "") {
  const combined = `${decodeEntities(src)} ${decodeEntities(alt)}`.toLowerCase();
  return [
    "logo",
    "ロゴ",
    "背景",
    "メニュー",
    "menu",
    "icon",
    "アイコン",
    "placeholder",
    "/elementor/",
    "banner",
    "bnr",
    "transparent",
    "spacer",
  ].some((token) => combined.includes(token));
}

function sanitizeImageTag(tag) {
  const rawSrc = attr(tag, "data-lazy-src") || attr(tag, "src");
  const src = normalizeAssetUrl(rawSrc);
  if (!src || /^data:/i.test(src)) return "";
  if (/^https?:\/\//i.test(src)) return "";

  const alt = stripTags(attr(tag, "alt")) || "合格者インタビュー写真";
  if (isGenericImage(src, alt)) return "";
  if (src.startsWith("/") && !publicAssetExists(src)) return "";

  const width = attr(tag, "width").match(/^\d+$/)?.[0] || "";
  const height = attr(tag, "height").match(/^\d+$/)?.[0] || "";
  const sizeAttrs = `${width ? ` width="${width}"` : ""}${height ? ` height="${height}"` : ""}`;
  return `<img${sizeAttrs} src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" loading="lazy" decoding="async">`;
}

function tidyArticleBody(html = "") {
  let output = html;

  output = output
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<link\b[\s\S]*?>/gi, " ")
    .replace(/<meta\b[\s\S]*?>/gi, " ")
    .replace(/<form\b[\s\S]*?<\/form>/gi, " ")
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, " ")
    .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, " ")
    .replace(/<video\b[\s\S]*?<\/video>/gi, " ")
    .replace(/<button\b[\s\S]*?<\/button>/gi, " ")
    .replace(/<article\b[\s\S]*?<\/article>/gi, " ")
    .replace(/href=(["'])(https?:\/\/lexus-ec\.com[^"']*)\1/gi, (_match, _quote, href) => {
      return `href="${escapeAttr(normalizeInternalHref(href))}"`;
    })
    .replace(/src=(["'])(https?:\/\/lexus-ec\.com\/wp-content\/uploads\/[^"']*)\1/gi, (_match, _quote, src) => {
      return `src="${escapeAttr(normalizeAssetUrl(src))}"`;
    })
    .replace(/https?:\/\/lexus-ec\.com(\/wp-content\/uploads\/[^"'<>\s)]+)/gi, (_match, assetPath) => {
      return normalizeLegacyAssetReference(assetPath);
    })
    .replace(/\sdata-lazy-src=(["'])(.*?)\1/gi, (_match, quote, src) => ` src=${quote}${src}${quote}`)
    .replace(/\sdata-lazy-srcset=(["'])(.*?)\1/gi, "")
    .replace(/\s(?:srcset|sizes|loading|decoding|fetchpriority)=(["'])(.*?)\1/gi, "")
    .replace(/\son[a-z]+=(["'])(.*?)\1/gi, "")
    .replace(/\sstyle=(["'])(.*?)\1/gi, "")
    .replace(/<img\b[^>]*>/gi, sanitizeImageTag)
    .replace(/<a\b[^>]*>\s*(?:Read More|More\s*»|続きを読む)\s*<\/a>/gi, " ")
    .replace(/<a\b[^>]*>\s*<\/a>/gi, " ")
    .replace(/<\/?div\b[^>]*>/gi, " ")
    .replace(/<\/?span\b[^>]*>/gi, "")
    .replace(/\s(?:class|data-[\w:-]+|role|tabindex|aria-[\w:-]+)=(["'])(.*?)\1/gi, "")
    .replace(/<figure>\s*<\/figure>/gi, " ")
    .replace(/<p>\s*(?:&nbsp;|\s|<br\s*\/?>)*<\/p>/gi, " ")
    .replace(/<(?:p|figure|a|strong|em|div|span)\b[^<>]*$/i, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  if (/<div\b/i.test(output)) output = output.replace(/<div\b[\s\S]*$/i, " ").trim();
  return output;
}

function imageTags(html = "") {
  return [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => {
    const tag = match[0];
    return {
      src: normalizeAssetUrl(attr(tag, "src")),
      alt: stripTags(attr(tag, "alt")) || "合格者インタビュー写真",
      width: Number(attr(tag, "width")) || undefined,
      height: Number(attr(tag, "height")) || undefined,
    };
  });
}

function usableImage(image) {
  return (
    image?.src &&
    !/^https?:\/\//i.test(image.src) &&
    !isGenericImage(image.src, image.alt) &&
    (!image.src.startsWith("/") || publicAssetExists(image.src))
  );
}

function normalizeHeroImage(post, html) {
  const current = post.heroImage
    ? {
        ...post.heroImage,
        src: normalizeAssetUrl(post.heroImage.src),
        alt: stripTags(post.heroImage.alt) || "合格者インタビュー写真",
      }
    : null;
  if (usableImage(current)) return current;
  return imageTags(html).find(usableImage) || null;
}

function removeLeadingDuplicateHero(html, heroImage) {
  if (!heroImage?.src) return html;
  const src = escapeRegExp(heroImage.src);
  return html
    .replace(new RegExp(`^\\s*<figure>\\s*<img\\b[^>]*src=["']${src}["'][^>]*>\\s*</figure>\\s*`, "i"), "")
    .replace(new RegExp(`^\\s*<img\\b[^>]*src=["']${src}["'][^>]*>\\s*`, "i"), "")
    .trim();
}

function paragraphMatches(html = "") {
  return [...html.matchAll(/<p\b[^>]*>[\s\S]*?<\/p>/gi)].filter((match) => stripTags(match[0]).length >= 8);
}

function ensureReadableSections(html = "") {
  const headingCount = (html.match(/<h[23]\b/gi) || []).length;
  if (headingCount >= 4) return html;

  const paragraphs = paragraphMatches(html);
  if (paragraphs.length < 8) return html;

  const targets = [
    { index: 2, html: "<h2>合格までの歩み</h2>" },
    { index: Math.max(4, Math.floor(paragraphs.length * 0.38)), html: "<h2>レクサスで変わった学習</h2>" },
    { index: Math.max(6, Math.floor(paragraphs.length * 0.68)), html: "<h2>これから受験する人へ</h2>" },
  ]
    .filter((item, index, list) => item.index < paragraphs.length && list.findIndex((other) => other.index === item.index) === index)
    .sort((a, b) => b.index - a.index);

  let output = html;
  for (const target of targets) {
    const paragraph = paragraphs[target.index];
    output = `${output.slice(0, paragraph.index)}${target.html}${output.slice(paragraph.index)}`;
  }
  return output;
}

function ensureMinimumContext(post, html = "") {
  const textLength = stripTags(html).length;
  if (textLength >= 1200 || html.includes("このインタビューの読みどころ")) return html;

  const subject = post.displayTitleLines?.[0] || post.displayTitle || post.title || "合格者インタビュー";
  return `${html}
<h2>このインタビューの読みどころ</h2>
<p>${escapeAttr(subject)}の合格者が、入塾前の状況、レクサスで変わった学習リズム、受験期に支えになった考え方を短く振り返っています。本文はコンパクトですが、医学部受験で環境をどう使い切るかを考えるための参考になるインタビューです。</p>`.trim();
}

function slugifyHeading(value, index) {
  const ascii = value
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 52);
  return ascii || `section-${index + 1}`;
}

function rebuildToc(html = "") {
  const toc = [];
  const usedIds = new Set();
  let headingIndex = 0;

  const contentHtml = html.replace(/<h([23])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_match, level, inner) => {
    const text = stripTags(inner);
    if (!text) return "";

    let id = slugifyHeading(text, headingIndex);
    let suffix = 2;
    while (usedIds.has(id)) {
      id = `${id}-${suffix}`;
      suffix += 1;
    }
    usedIds.add(id);
    headingIndex += 1;

    if (toc.length < 18) {
      toc.push({
        id,
        text: text.length > 90 ? `${text.slice(0, 89)}...` : text,
        level: Number(level),
      });
    }
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });

  return { contentHtml, toc };
}

function cleanCategories(categories = []) {
  const unique = [...new Set(categories.filter(Boolean))];
  const withoutUncategorized =
    unique.length > 1 ? unique.filter((category) => category !== "未分類") : unique;
  return withoutUncategorized.length ? withoutUncategorized : ["合格者の声"];
}

let changed = 0;
let heroFilled = 0;
let heroRemovedAsUnsafe = 0;
let duplicateHeroRemoved = 0;
let readableSectionsAdded = 0;

for (const post of posts) {
  const before = JSON.stringify(post);
  const baselinePost = baselineByPath.get(post.path);
  const hadHero = Boolean(post.heroImage?.src);
  const beforeHtml = baselinePost?.contentHtml || post.contentHtml || "";
  const beforeHeadingCount = (beforeHtml.match(/<h[23]\b/gi) || []).length;

  post.template = "voice-interview";
  post.heroVariant = "interview";
  post.heroBadge = "VOICE";
  post.heroMessageLines = ["合格者本人の言葉から、", "伸びるきっかけを探す。"];
  post.heroMessage = post.heroMessageLines.join("\n");
  post.categories = cleanCategories(post.categories || []);
  post.keyPoints = [
    "合格者本人の言葉をもとに、学習の転機とレクサスでの過ごし方を整理しています。",
    "入塾前の悩み、伸びたきっかけ、受験期の習慣を一続きのストーリーとして読めます。",
    "同じ状況の受験生が、次の一手を考えるための参考記事です。",
  ];

  post.heroImage = post.heroImage?.src ? post.heroImage : baselinePost?.heroImage || null;

  let contentHtml = tidyArticleBody(beforeHtml);
  const nextHero = normalizeHeroImage(post, contentHtml);
  if (!hadHero && nextHero?.src) heroFilled += 1;
  if (hadHero && !nextHero?.src) heroRemovedAsUnsafe += 1;
  post.heroImage = nextHero;

  const beforeDuplicateRemoval = contentHtml;
  contentHtml = removeLeadingDuplicateHero(contentHtml, post.heroImage);
  if (contentHtml !== beforeDuplicateRemoval) duplicateHeroRemoved += 1;

  contentHtml = ensureReadableSections(contentHtml);
  if ((contentHtml.match(/<h[23]\b/gi) || []).length > beforeHeadingCount) readableSectionsAdded += 1;
  contentHtml = ensureMinimumContext(post, contentHtml);

  const rebuilt = rebuildToc(contentHtml);
  post.contentHtml = rebuilt.contentHtml;
  post.toc = rebuilt.toc;

  post.sourceMetrics = {
    ...(post.sourceMetrics || { originalHtmlBytes: 0 }),
    htmlBytes: Buffer.byteLength(post.contentHtml || ""),
    tocCount: post.toc.length,
    imageCount: ((post.contentHtml || "").match(/<img\b/gi) || []).length,
    originalHtmlBytes: post.sourceMetrics?.originalHtmlBytes || Buffer.byteLength(beforeHtml),
  };

  if (JSON.stringify(post) !== before) changed += 1;
}

await writeFile(dataPath, `${JSON.stringify(posts, null, 2)}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      total: posts.length,
      changed,
      heroFilled,
      heroRemovedAsUnsafe,
      duplicateHeroRemoved,
      readableSectionsAdded,
    },
    null,
    2,
  ),
);
