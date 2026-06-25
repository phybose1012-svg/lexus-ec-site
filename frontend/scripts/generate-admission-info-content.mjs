import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const siteOrigin = "https://lexus-ec.com";
const root = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const workspace = path.resolve(root, "..");
const inventoryPath = path.join(workspace, "reports", "post-inventory.json");
const outDir = path.join(root, "src", "data", "generated");
const outPath = path.join(outDir, "admissionInfoPosts.json");
const reportPath = path.join(workspace, "reports", "admission-info-generation.json");

const USER_AGENT = "Mozilla/5.0 (compatible; LEXUS-EC-admission-info-generator/1.0)";
const REQUEST_DELAY_MS = 80;
const FETCH_TIMEOUT_MS = 15_000;
const secondaryExamHeroImage = {
  src: "/illustrations/characters/yuki-sensei-cheer.png",
  alt: "鬼特訓イメージキャラクター",
  width: 376,
  height: 376,
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const assetPathReplacements = new Map([
  [
    "/assets/legacy/wp-content/uploads/2024/09/荵晏ｷ槫､ｧ蟄ｦ竭蟆・1024x669.jpg",
    "/assets/legacy/wp-content/uploads/2024/09/九州大学①小-1024x669.jpg",
  ],
  [
    "/assets/legacy/wp-content/uploads/2024/09/荵晏ｷ槫､ｧ蟄ｦ竭蟆・jpg",
    "/assets/legacy/wp-content/uploads/2024/09/九州大学①小.jpg",
  ],
  [
    "/assets/legacy/wp-content/uploads/2024/09/蟆乗眠貎溷､ｧ蟄ｦ蜀咏悄竭.jpg",
    "/assets/legacy/wp-content/uploads/2024/09/小新潟大学写真①.jpg",
  ],
  [
    "/assets/legacy/wp-content/uploads/2024/09/蟆乗眠貎溷､ｧ蟄ｦ蜀咏悄竭-1024x683.jpg",
    "/assets/legacy/wp-content/uploads/2024/09/小新潟大学写真①-1024x683.jpg",
  ],
  [
    "/assets/legacy/wp-content/uploads/2024/11/閭梧勹繝ｭ繧ｴ縺繧峨￠繝｡繝九Η繝ｼ騾乗・3-1024x74.png",
    "/assets/legacy/wp-content/uploads/2024/11/背景ロゴだらけメニュー透明3-1024x74.png",
  ],
  [
    "/assets/legacy/wp-content/uploads/2026/01/鬯ｼ-謖ｯ繧贋ｸ翫￡繧・2-e1768025542746.png",
    "/illustrations/characters/yuki-sensei-cheer.png",
  ],
]);

const decodeEntityMap = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
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
      const localPath = `/assets/legacy${decodeURI(url.pathname)}`;
      return assetPathReplacements.get(localPath) || localPath;
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

function slugifyHeading(value, index) {
  const ascii = value
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return ascii || `section-${index + 1}`;
}

function extractImages(html) {
  return [...html.matchAll(/<img\b[^>]*>/gi)]
    .map((match) => {
      const tag = match[0];
      return {
        src: normalizeAssetUrl(attr(tag, "data-lazy-src") || attr(tag, "src")),
        alt: stripTags(attr(tag, "alt")),
        width: Number(attr(tag, "width")) || undefined,
        height: Number(attr(tag, "height")) || undefined,
      };
    })
    .filter((image) => image.src && !image.src.startsWith("data:image"));
}

function extractListItems(listHtml = "") {
  return [...listHtml.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((match) => stripTags(match[1]))
    .filter((text) => text.length >= 8)
    .slice(0, 5);
}

function extractOriginalKeyPoints(content) {
  const block = content.match(
    /<div\b[^>]*>\s*<strong\b[^>]*>\s*記事の要点\s*<\/strong>\s*(<ul\b[\s\S]*?<\/ul>)\s*<\/div>/i,
  );
  return block ? extractListItems(block[1]) : [];
}

function firstParagraph(content) {
  const paragraph = content.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1] || "";
  return stripTags(paragraph);
}

function trimLead(value) {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= 180) return text;
  const clipped = text.slice(0, 180);
  const punctuation = Math.max(clipped.lastIndexOf("。"), clipped.lastIndexOf("！"), clipped.lastIndexOf("？"));
  return punctuation >= 80 ? clipped.slice(0, punctuation + 1) : `${clipped}…`;
}

function isLegacyChromeImage(tag) {
  const src = attr(tag, "src");
  const alt = stripTags(attr(tag, "alt"));
  return (
    alt === "ロゴ" ||
    alt.includes("社名ロゴ") ||
    alt.includes("個別相談") ||
    alt.includes("資料請求") ||
    alt.includes("お問い合わせ") ||
    src.includes("社名ロゴ") ||
    src.includes("アイコン-") ||
    src.includes("背景ロゴ") ||
    src.includes("カラフル-スマホ") ||
    src.includes("/wp-content/plugins/elementor/")
  );
}

function cleanArticleHtml(content) {
  let html = content
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<link\b[\s\S]*?>/gi, " ")
    .replace(/<meta\b[\s\S]*?>/gi, " ")
    .replace(/<form\b[\s\S]*?<\/form>/gi, " ")
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, " ")
    .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, " ")
    .replace(/<div\b[^>]*>\s*<strong\b[^>]*>\s*記事の要点\s*<\/strong>\s*<ul\b[\s\S]*?<\/ul>\s*<\/div>/gi, " ")
    .replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, " ");

  html = html
    .replace(/\sdata-lazy-src=(["'])(.*?)\1/gi, (_, quote, src) => ` src=${quote}${src}${quote}`)
    .replace(/\sdata-lazy-srcset=(["'])(.*?)\1/gi, "")
    .replace(/\s(?:srcset|sizes|loading|decoding)=(["'])(.*?)\1/gi, "")
    .replace(/\son[a-z]+=(["'])(.*?)\1/gi, "")
    .replace(/\sstyle=(["'])(.*?)\1/gi, "")
    .replace(/\s(?:class|data-[\w:-]+|id|role|tabindex)=(["'])(.*?)\1/gi, "")
    .replace(/href=(["'])https:\/\/lexus-ec\.com([^"']*)\1/gi, (_match, _quote, href) => `href="${normalizeInternalHref(href)}"`)
    .replace(/src=(["'])https:\/\/lexus-ec\.com(\/wp-content\/uploads\/[^"']*)\1/gi, (_match, _quote, src) => `src="${normalizeAssetUrl(src)}"`)
    .replace(/https:\/\/lexus-ec\.com(\/wp-content\/uploads\/[^"'<>\s)]+)/gi, (_match, src) => normalizeLegacyAssetReference(src))
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<\/?div>/gi, " ")
    .replace(/<img\b([^>]*)>/gi, (tag) => {
      if (!/src=["'][^"']+["']/i.test(tag)) return "";
      if (isLegacyChromeImage(tag)) return "";
      return tag.replace(/\s*\/?>$/, ' loading="lazy" decoding="async">');
    })
    .replace(/<h[23]\b[^>]*>\s*もくじ\s*<\/h[23]>/gi, " ")
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
    toc.push({ id, text, level: Number(level) });
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });

  return { html, toc };
}

function getUniversityName(title) {
  const match = title.match(/^2026\s+(.+?)\s+(?:医学部|一般選抜|入試情報)/);
  return match?.[1]?.trim() || title.split("｜")[0].replace(/^2026\s+/, "").trim();
}

function getExamType({ slug, title }) {
  if (slug.includes("kyoute") || title.includes("共通テスト")) return "共通テスト情報";
  if (slug.includes("niji") || title.includes("二次試験")) return "二次試験情報";
  if (title.includes("一般選抜")) return "一般選抜情報";
  return "入試情報";
}

function getRegion(categories) {
  const ignore = new Set(["共通テスト情報", "二次試験情報", "国公立医学部", "私立医学部", "大学別入試情報", "未分類"]);
  return categories.find((category) => !ignore.has(category)) || categories[0] || "";
}

function buildLead(record, restPost, rawContent) {
  const opening = firstParagraph(rawContent);
  if (opening) return trimLead(opening);
  const excerpt = stripTags(restPost.excerpt?.rendered || "")
    .replace(/\s*\[(?:…|\.\.\.)\]\s*$/g, "")
    .replace(/\s*…\s*$/g, "")
    .trim();
  if (excerpt) return trimLead(excerpt);
  const description = record.htmlAudit?.metaDescription || "";
  if (description) return trimLead(description);
  return `${getUniversityName(record.title)}医学部の入試情報を、受験準備で確認しやすい形に整理しています。`;
}

function buildKeyPoints(examType, universityName) {
  const points = [
    `${universityName}医学部の${examType}を確認できます。`,
    "出願前に確認したい日程、配点、難易度、対策の観点を整理しています。",
  ];
  if (examType === "共通テスト情報") {
    points.push("共通テスト配点、ボーダー、足きりの確認に使いやすい構成へ整えています。");
  } else if (examType === "二次試験情報") {
    points.push("二次試験の傾向、難易度、合格ラインを確認しやすい構成へ整えています。");
  }
  points.push("最新の大学発表・募集要項と照合しながら最終判断してください。");
  return points;
}

function buildDisplayTitleLines(examType, universityName, record) {
  const titleYear = stripTags(record.title || "").match(/20\d{2}/)?.[0];
  const yearLine = titleYear ? `${titleYear}年度` : "";
  const schoolLine = universityName.includes("医学部") ? universityName : `${universityName} 医学部`;
  if (examType === "二次試験情報") {
    return [yearLine, schoolLine, "二次試験の傾向と対策"].filter(Boolean);
  }
  if (examType === "共通テスト情報") {
    return [yearLine, schoolLine, "共通テスト配点・ボーダー"].filter(Boolean);
  }
  if (examType === "一般選抜情報") {
    return [yearLine, schoolLine, "一般選抜情報"].filter(Boolean);
  }
  return [yearLine, schoolLine, "入試情報"].filter(Boolean);
}

async function fetchJson(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "user-agent": USER_AGENT,
          accept: "application/json",
        },
      });
      clearTimeout(timeout);
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.json();
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;
      await sleep(250 * attempt);
    }
  }
  throw lastError;
}

async function main() {
  const inventory = JSON.parse(await readFile(inventoryPath, "utf8"));
  const records = inventory.records
    .filter((record) => record.recommendedTemplate === "admission-info")
    .filter((record) => !record.alreadyInStaticBaseline)
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  const posts = [];
  const failures = [];

  console.log(`Generating admission-info posts: ${records.length}`);

  for (let index = 0; index < records.length; index += 1) {
    const record = records[index];
    try {
      const url = new URL(`/wp-json/wp/v2/posts/${record.id}`, siteOrigin);
      url.searchParams.set("_embed", "wp:featuredmedia");
      const restPost = await fetchJson(url.href);
      const rawContent = restPost.content?.rendered || "";
      const originalKeyPoints = extractOriginalKeyPoints(rawContent);
      const { html, toc } = cleanArticleHtml(rawContent);
      const images = extractImages(rawContent);
      const featuredImage =
        normalizeAssetUrl(restPost._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "") ||
        images[0]?.src ||
        "";
      const universityName = getUniversityName(record.title);
      const examType = getExamType(record);
      const region = getRegion(record.categories || []);
      const lead = buildLead(record, restPost, rawContent);
      const displayTitleLines = buildDisplayTitleLines(examType, universityName, record);
      const usesSecondaryExamHero = examType === "二次試験情報";

      posts.push({
        id: record.id,
        slug: record.slug,
        path: record.path,
        url: record.url,
        template: "admission-info",
        title: record.title,
        ...(displayTitleLines.length > 0
          ? {
              displayTitle: displayTitleLines.join(" "),
              displayTitleLines,
            }
          : {}),
        description: record.htmlAudit?.metaDescription || lead,
        canonical: record.htmlAudit?.canonical || record.url,
        date: record.date,
        modified: record.modified,
        categories: record.categories || [],
        tags: record.tags || [],
        ...(usesSecondaryExamHero
          ? {
              heroVariant: "oni",
              heroBadge: "HOT",
              heroMessageLines: ["君ならできる！", "最後まで自分を信じて走り抜け!!"],
            }
          : {}),
        lead,
        keyPoints: originalKeyPoints.length > 0 ? originalKeyPoints : buildKeyPoints(examType, universityName),
        infoItems: [
          { label: "年度", value: "2026年度" },
          { label: "大学", value: universityName },
          { label: "種別", value: examType },
          ...(region ? [{ label: "地域", value: region }] : []),
        ],
        toc: toc.slice(0, 14),
        heroImage: usesSecondaryExamHero
          ? secondaryExamHeroImage
          : featuredImage
          ? {
              src: featuredImage,
              alt: `${universityName}医学部の入試情報`,
            }
          : null,
        contentHtml: html,
        sourceMetrics: {
          htmlBytes: Buffer.byteLength(html),
          tocCount: toc.length,
          imageCount: images.length,
          originalHtmlBytes: record.htmlAudit?.htmlBytes || 0,
        },
      });
    } catch (error) {
      failures.push({
        id: record.id,
        path: record.path,
        title: record.title,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    if ((index + 1) % 25 === 0 || index + 1 === records.length) {
      console.log(`Processed ${index + 1}/${records.length}`);
    }
    await sleep(REQUEST_DELAY_MS);
  }

  await mkdir(outDir, { recursive: true });
  await writeFile(outPath, `${JSON.stringify(posts, null, 2)}\n`, "utf8");
  await writeFile(
    reportPath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        template: "admission-info",
        sourceRecords: records.length,
        generated: posts.length,
        failed: failures.length,
        failures,
        output: outPath,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  console.log(`Generated: ${posts.length}`);
  console.log(`Failed: ${failures.length}`);
  console.log(`Output: ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
