import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const siteOrigin = "https://lexus-ec.com";
const root = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const workspace = path.resolve(root, "..");
const inventoryPath = path.join(workspace, "reports", "post-inventory.json");
const outDir = path.join(root, "src", "data", "generated");
const outPath = path.join(outDir, "voiceInterviewPosts.json");
const reportPath = path.join(workspace, "reports", "voice-interview-generation.json");

const USER_AGENT = "Mozilla/5.0 (compatible; LEXUS-EC-voice-interview-generator/1.0)";
const REQUEST_DELAY_MS = 80;
const FETCH_TIMEOUT_MS = 15_000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number.parseInt(num, 10)))
    .replace(/&([a-z]+);/gi, (_, name) => decodeEntityMap[name] ?? `&${name};`);
}

function stripTags(value = "") {
  return decodeEntities(
    value
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

function normalizeAssetUrl(value = "") {
  if (!value) return "";
  try {
    const url = new URL(decodeEntities(value), siteOrigin);
    if (url.origin === siteOrigin && url.pathname.startsWith("/wp-content/uploads/")) {
      return `/assets/legacy${decodeURI(url.pathname)}`;
    }
    return url.href;
  } catch {
    return value;
  }
}

function normalizeInternalHref(value = "") {
  if (!value) return "";
  try {
    const url = new URL(decodeEntities(value), siteOrigin);
    if (url.origin === siteOrigin) return `${decodeURI(url.pathname)}${url.search}`;
    return url.href;
  } catch {
    return value;
  }
}

function normalizeLegacyAssetReference(assetPath = "") {
  try {
    return `/assets/legacy${decodeURI(assetPath)}`;
  } catch {
    return `/assets/legacy${assetPath}`;
  }
}

function titleText(title) {
  return stripTags(title).replace(/\s+/g, " ").trim();
}

function slugifyHeading(value, index) {
  const ascii = value
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 52);
  return ascii || `section-${index + 1}`;
}

function headingRows(html) {
  return [...html.matchAll(/<h([1-4])\b[^>]*>([\s\S]*?)<\/h\1>/gi)]
    .map((match) => ({
      level: Number(match[1]),
      text: stripTags(match[2]),
      index: match.index ?? 0,
    }))
    .filter((heading) => heading.text);
}

function cleanUniversityName(value = "") {
  return value
    .replace(/医学部/g, "")
    .replace(/合格/g, "")
    .replace(/他$/g, "")
    .replace(/[｜|].*$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function titleParts(record, headings) {
  const title = titleText(record.title);
  const [catchRaw, schoolRaw = ""] = title.split(/[｜|]/).map((item) => item.trim());
  const headingSchool = headings.find((heading) => /医学部/.test(heading.text) && !/インタビュー/.test(heading.text))?.text || "";
  const universityName = cleanUniversityName(schoolRaw || headingSchool) || "医学部";
  const catchCopy = catchRaw || title || "合格者インタビュー";
  const schoolLine =
    universityName === "医学部" ? "医学部合格者インタビュー" : `${universityName} 医学部 合格者インタビュー`;
  return {
    title,
    universityName,
    catchCopy,
    displayTitle: `${schoolLine}｜${catchCopy}`,
    displayTitleLines: [schoolLine, catchCopy],
  };
}

function isLegacyChromeImageTag(tag) {
  const src = decodeEntities(attr(tag, "src") || attr(tag, "data-lazy-src"));
  const alt = stripTags(attr(tag, "alt"));
  const combined = `${src} ${alt}`;
  return (
    combined.includes("キミも先輩に続け") ||
    combined.includes("社名ロゴ") ||
    combined.includes("背景ロゴ") ||
    combined.includes("アイコン-") ||
    combined.includes("カラフル-スマホ") ||
    combined.includes("placeholder.png") ||
    combined.includes("/wp-content/plugins/elementor/") ||
    alt === "ロゴ"
  );
}

function isGenericHeroImage(image) {
  const combined = `${decodeEntities(image.src || "")} ${image.alt || ""}`;
  return (
    combined.includes("キミも先輩に続け") ||
    combined.includes("社名ロゴ") ||
    combined.includes("背景ロゴ") ||
    combined.includes("アイコン-") ||
    combined.includes("placeholder.png") ||
    combined.includes("カラフル-スマホ")
  );
}

function extractImages(html) {
  return [...html.matchAll(/<img\b[^>]*>/gi)]
    .map((match) => {
      const tag = match[0];
      return {
        src: normalizeAssetUrl(attr(tag, "data-lazy-src") || attr(tag, "src")),
        alt: stripTags(attr(tag, "alt")) || "合格者インタビュー写真",
        width: Number(attr(tag, "width")) || undefined,
        height: Number(attr(tag, "height")) || undefined,
        rawTag: tag,
      };
    })
    .filter((image) => image.src && !image.src.startsWith("data:image"));
}

function pickHeroImage(restPost, rawContent) {
  const featured = restPost?._embedded?.["wp:featuredmedia"]?.[0];
  const candidates = [];
  if (featured?.source_url) {
    candidates.push({
      src: normalizeAssetUrl(featured.source_url),
      alt: stripTags(featured.alt_text || featured.title?.rendered || "合格者インタビュー写真"),
      width: featured.media_details?.width || undefined,
      height: featured.media_details?.height || undefined,
    });
  }
  candidates.push(...extractImages(extractVoiceBody(rawContent)).map(({ rawTag, ...image }) => image));
  return candidates.find((image) => !isGenericHeroImage(image)) || null;
}

function extractVoiceBody(rawContent) {
  let end = rawContent.length;
  const markers = [
    /◆\s*他の「合格者の声」もご覧ください\s*◆/i,
    /他の「合格者の声」/i,
    /elementor-widget-posts/i,
    /elementor-posts-container/i,
    /elementor-button-wrapper/i,
  ];
  for (const marker of markers) {
    const match = rawContent.match(marker);
    if (match && typeof match.index === "number") end = Math.min(end, match.index);
  }
  return rawContent.slice(0, end);
}

function firstUsefulParagraph(rawContent) {
  const paragraphs = [...rawContent.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => stripTags(match[1]))
    .filter((text) => text && text.length >= 18 && !/More\s*»/i.test(text));
  return paragraphs[0] || "";
}

function trimLead(value) {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= 180) return text;
  const clipped = text.slice(0, 180);
  const punctuation = Math.max(
    clipped.lastIndexOf("。"),
    clipped.lastIndexOf("！"),
    clipped.lastIndexOf("？"),
    clipped.lastIndexOf("."),
  );
  return punctuation >= 80 ? clipped.slice(0, punctuation + 1) : `${clipped}...`;
}

function metaVoiceQuote(record) {
  const meta = record.htmlAudit?.metaDescription || record.excerpt || "";
  const text = stripTags(meta)
    .replace(/\s+/g, " ")
    .replace(/- レクサス教育センター.*$/g, "")
    .trim();
  const quote = text.match(/合格者のリアルな体験談-\s*(.+)$/)?.[1]?.trim();
  return quote || text;
}

function buildLead(record, rawContent, parts) {
  const quote = metaVoiceQuote(record);
  if (quote && quote.length >= 30) return trimLead(quote);
  const first = firstUsefulParagraph(extractVoiceBody(rawContent));
  if (first) return trimLead(first);
  return trimLead(`${parts.catchCopy}。合格者本人の言葉から、学習の転機とレクサスでの過ごし方を整理します。`);
}

function acceptedLabel(headings, parts, rawContent) {
  const heading =
    headings.find((item) => /合格/.test(item.text) && !/レクサス合格者インタビュー/.test(item.text))?.text ||
    firstUsefulParagraph(extractVoiceBody(rawContent)).match(/20\d{2}年.*?合格/)?.[0] ||
    `${parts.universityName} 医学部 合格`;
  return heading.replace(/\s+/g, " ").trim();
}

function buildInfoItems(parts, accepted, profileText) {
  const year = profileText.match(/20\d{2}年/)?.[0] || "";
  const items = [
    { label: "大学", value: parts.universityName === "医学部" ? "医学部" : parts.universityName },
    { label: "学部", value: "医学部" },
    { label: "合格情報", value: accepted },
    { label: "記事種別", value: "合格者インタビュー" },
  ];
  if (year) items.splice(2, 0, { label: "合格年度", value: year });
  return items;
}

function cleanArticleHtml(rawContent) {
  let html = extractVoiceBody(rawContent);

  html = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<link\b[\s\S]*?>/gi, " ")
    .replace(/<meta\b[\s\S]*?>/gi, " ")
    .replace(/<form\b[\s\S]*?<\/form>/gi, " ")
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, " ")
    .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, " ")
    .replace(/<video\b[\s\S]*?<\/video>/gi, " ")
    .replace(/<input\b[\s\S]*?>/gi, " ");

  html = html
    .replace(/<p\b(?=[^>]*class=["'][^"']*interview-subtitle)[^>]*>([\s\S]*?)<\/p>/gi, "<h3>$1</h3>")
    .replace(/<h[1-3]\b[^>]*>\s*レクサス合格者インタビュー\s*<\/h[1-3]>/gi, " ")
    .replace(/<h[1-3]\b[^>]*>\s*([^<]*?)\s*医学部\s*<\/h[1-3]>/gi, " ")
    .replace(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi, "<h2>$1</h2>")
    .replace(/\sdata-lazy-src=(["'])(.*?)\1/gi, (_, quote, src) => ` src=${quote}${src}${quote}`)
    .replace(/\sdata-lazy-srcset=(["'])(.*?)\1/gi, "")
    .replace(/\s(?:srcset|sizes|loading|decoding|fetchpriority)=(["'])(.*?)\1/gi, "")
    .replace(/\son[a-z]+=(["'])(.*?)\1/gi, "")
    .replace(/\sstyle=(["'])(.*?)\1/gi, "")
    .replace(/href=(["'])(https:\/\/lexus-ec\.com[^"']*)\1/gi, (_match, _quote, href) => `href="${normalizeInternalHref(href)}"`)
    .replace(/src=(["'])(https:\/\/lexus-ec\.com\/wp-content\/uploads\/[^"']*)\1/gi, (_match, _quote, src) => `src="${normalizeAssetUrl(src)}"`)
    .replace(/https:\/\/lexus-ec\.com(\/wp-content\/uploads\/[^"'<>\s)]+)/gi, (_match, src) => normalizeLegacyAssetReference(src))
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<img\b([^>]*)>/gi, (tag) => {
      if (!/src=["'][^"']+["']/i.test(tag)) return "";
      if (isLegacyChromeImageTag(tag)) return "";
      return tag.replace(/\s*\/?>$/, ' loading="lazy" decoding="async">');
    })
    .replace(/<a\b[^>]*>\s*More\s*»\s*<\/a>/gi, " ")
    .replace(/<\/?div\b[^>]*>/gi, " ")
    .replace(/<\/?span\b[^>]*>/gi, "")
    .replace(/<\/?button\b[^>]*>/gi, " ")
    .replace(/\s(?:class|data-[\w:-]+|id|role|tabindex|aria-[\w:-]+)=(["'])(.*?)\1/gi, "")
    .replace(/<p>\s*<\/p>/gi, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  const toc = [];
  const usedIds = new Set();
  let headingIndex = 0;
  html = html.replace(/<h([23])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_match, level, inner) => {
    const text = stripTags(inner);
    if (!text || text.length > 120) return "";
    let id = slugifyHeading(text, headingIndex);
    let suffix = 2;
    while (usedIds.has(id)) {
      id = `${id}-${suffix}`;
      suffix += 1;
    }
    usedIds.add(id);
    headingIndex += 1;
    if (toc.length < 18) toc.push({ id, text, level: Number(level) });
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });

  return { html, toc };
}

async function fetchRestPost(id) {
  const url = `${siteOrigin}/wp-json/wp/v2/posts/${id}?_embed=wp:featuredmedia`;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        headers: { "user-agent": USER_AGENT },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      if (attempt === 3) throw error;
      await sleep(500 * attempt);
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error(`Failed to fetch ${url}`);
}

function buildPost(record, restPost) {
  const rawContent = restPost.content?.rendered || "";
  const headings = headingRows(rawContent);
  const parts = titleParts(record, headings);
  const { html, toc } = cleanArticleHtml(rawContent);
  const lead = buildLead(record, rawContent, parts);
  const profileText = firstUsefulParagraph(extractVoiceBody(rawContent));
  const accepted = acceptedLabel(headings, parts, rawContent);
  const heroImage = pickHeroImage(restPost, rawContent);

  return {
    id: record.id,
    slug: record.slug,
    path: record.path,
    url: record.url,
    template: "voice-interview",
    title: titleText(restPost.title?.rendered || record.title),
    displayTitle: parts.displayTitle,
    displayTitleLines: parts.displayTitleLines,
    description: trimLead(record.htmlAudit?.metaDescription || lead),
    canonical: record.htmlAudit?.canonical || record.url,
    date: restPost.date || record.date,
    modified: restPost.modified || record.modified,
    categories: record.categories || [],
    tags: record.tags || [],
    lead,
    heroVariant: "interview",
    heroBadge: "VOICE",
    heroMessage: "合格者本人の言葉から、伸びるきっかけを探す。",
    heroMessageLines: ["合格者本人の言葉から、伸びるきっかけを探す。"],
    heroImage,
    keyPoints: [
      "合格者本人の言葉をもとに、学習の転機とレクサスでの過ごし方を整理しています。",
      "入塾前の悩み、伸びたきっかけ、受験期の習慣を一続きのストーリーとして読めます。",
      "同じ状況の受験生が、次の一手を考えるための参考記事です。",
    ],
    infoItems: buildInfoItems(parts, accepted, profileText),
    toc,
    contentHtml: html,
    sourceMetrics: {
      htmlBytes: Buffer.byteLength(html),
      tocCount: toc.length,
      imageCount: (html.match(/<img\b/gi) || []).length,
      originalHtmlBytes: Buffer.byteLength(rawContent),
    },
  };
}

const inventory = JSON.parse(await readFile(inventoryPath, "utf8"));
const records = (inventory.records || [])
  .filter((record) => record.recommendedTemplate === "voice-interview")
  .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

const posts = [];
const failures = [];

for (const [index, record] of records.entries()) {
  try {
    const restPost = await fetchRestPost(record.id);
    posts.push(buildPost(record, restPost));
    console.log(`[${index + 1}/${records.length}] ${record.path}`);
  } catch (error) {
    failures.push({ id: record.id, path: record.path, message: error.message });
    console.error(`[failed] ${record.path}: ${error.message}`);
  }
  await sleep(REQUEST_DELAY_MS);
}

await mkdir(outDir, { recursive: true });
await mkdir(path.dirname(reportPath), { recursive: true });
await writeFile(outPath, `${JSON.stringify(posts, null, 2)}\n`, "utf8");
await writeFile(
  reportPath,
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      records: records.length,
      generated: posts.length,
      failures,
      output: outPath,
    },
    null,
    2,
  )}\n`,
  "utf8",
);

if (failures.length > 0) {
  console.error(`${failures.length} voice-interview posts failed.`);
  process.exitCode = 1;
} else {
  console.log(`Generated ${posts.length} voice-interview posts.`);
}
