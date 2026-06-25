import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const siteOrigin = "https://lexus-ec.com";
const root = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const workspace = path.resolve(root, "..");
const inventoryPath = path.join(workspace, "reports", "post-inventory.json");
const outDir = path.join(root, "src", "data", "generated");
const outPath = path.join(outDir, "universityStrategyPosts.json");
const reportPath = path.join(workspace, "reports", "university-strategy-generation.json");

const USER_AGENT = "Mozilla/5.0 (compatible; LEXUS-EC-university-strategy-generator/1.0)";
const REQUEST_DELAY_MS = 80;
const FETCH_TIMEOUT_MS = 15_000;
const heroImage = {
  src: "/illustrations/characters/yuki-sensei-cheer.png",
  alt: "鬼特訓イメージキャラクター",
  width: 376,
  height: 376,
};

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

function slugifyHeading(value, index) {
  const ascii = value
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 52);
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

function extractStrategyBody(rawContent) {
  let html = rawContent;
  const guideStart = html.search(/<div\b[^>]*class=["'][^"']*ut-guide-container/i);
  if (guideStart >= 0) {
    const openEnd = html.indexOf(">", guideStart);
    html = html.slice(openEnd + 1);
  }

  const markers = [
    /丁寧にご説明します。/i,
    /まずは、お問合せください/i,
    /<p\b[^>]*>\s*NEW\s*<\/p>/i,
    /医学部入試情報\s*ほぼ毎日更新/i,
  ];
  let end = html.length;
  for (const marker of markers) {
    const match = html.match(marker);
    if (match && typeof match.index === "number") end = Math.min(end, match.index);
  }

  return html.slice(0, end);
}

function normalizeHeadingLevels(html) {
  return html.replace(/<\/?h([1-4])\b([^>]*)>/gi, (match, level, attrs = "") => {
    const closing = match.startsWith("</");
    const currentLevel = Number(level);
    const nextLevel = currentLevel === 1 ? 2 : Math.min(currentLevel + 1, 4);
    return closing ? `</h${nextLevel}>` : `<h${nextLevel}${attrs}>`;
  });
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
  return punctuation >= 80 ? clipped.slice(0, punctuation + 1) : `${clipped}...`;
}

function titleText(title) {
  return stripTags(title).replace(/\s+/g, " ").trim();
}

function legacyAdmissionTitleParts(title) {
  const text = titleText(title);
  const match =
    text.match(/^(20\d{2})\s+(.+?)\s+(医学部)(?:情報)?(?:｜|$)/) ||
    text.match(/^(20\d{2})\s+(.+?)\s+(一般選抜)(?:｜|$)/);
  return match
    ? {
        year: `${match[1]}年度`,
        universityName: match[2].trim(),
        faculty: match[3] === "医学部" ? "医学部" : "医学部",
      }
    : null;
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

function cleanArticleHtml(rawContent) {
  let html = normalizeHeadingLevels(extractStrategyBody(rawContent));

  html = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<link\b[\s\S]*?>/gi, " ")
    .replace(/<meta\b[\s\S]*?>/gi, " ")
    .replace(/<form\b[\s\S]*?<\/form>/gi, " ")
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, " ")
    .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, " ")
    .replace(/<video\b[\s\S]*?<\/video>/gi, " ");

  html = html
    .replace(/\sdata-lazy-src=(["'])(.*?)\1/gi, (_, quote, src) => ` src=${quote}${src}${quote}`)
    .replace(/\sdata-lazy-srcset=(["'])(.*?)\1/gi, "")
    .replace(/\s(?:srcset|sizes|loading|decoding|fetchpriority)=(["'])(.*?)\1/gi, "")
    .replace(/\son[a-z]+=(["'])(.*?)\1/gi, "")
    .replace(/\sstyle=(["'])(.*?)\1/gi, "")
    .replace(/\s(?:class|data-[\w:-]+|id|role|tabindex|aria-[\w:-]+)=(["'])(.*?)\1/gi, "")
    .replace(/href=(["'])https:\/\/lexus-ec\.com([^"']*)\1/gi, (_match, _quote, href) => `href="${normalizeInternalHref(href)}"`)
    .replace(/src=(["'])https:\/\/lexus-ec\.com(\/wp-content\/uploads\/[^"']*)\1/gi, (_match, _quote, src) => `src="${normalizeAssetUrl(src)}"`)
    .replace(/https:\/\/lexus-ec\.com(\/wp-content\/uploads\/[^"'<>\s)]+)/gi, (_match, src) => normalizeLegacyAssetReference(src))
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<\/?div\b[^>]*>/gi, " ")
    .replace(/<\/?span\b[^>]*>/gi, "")
    .replace(/<\/?button\b[^>]*>/gi, " ")
    .replace(/<img\b([^>]*)>/gi, (tag) => {
      if (!/src=["'][^"']+["']/i.test(tag)) return "";
      const src = attr(tag, "src");
      const alt = stripTags(attr(tag, "alt"));
      if (isLegacyChromeImage(tag) || alt === "ロゴ" || src.includes("背景ロゴだらけメニュー透明3")) return "";
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
  return legacyAdmissionTitleParts(title)?.universityName || titleText(title).split("｜")[0]?.trim() || titleText(title);
}

function getFaculty(title) {
  const legacyParts = legacyAdmissionTitleParts(title);
  if (legacyParts) return legacyParts.faculty;
  const parts = stripTags(title).split("｜").map((part) => part.trim()).filter(Boolean);
  return parts[1] || "医学部";
}

function getTargetYear(title) {
  return legacyAdmissionTitleParts(title)?.year || stripTags(title).match(/20\d{2}年度/)?.[0] || "2027年度";
}

function getExamType(title) {
  const text = stripTags(title);
  if (text.includes("医学部入試のQ")) return "入試Q&A";
  if (text.includes("日程と会場")) return "日程・会場";
  if (text.includes("出願")) return "出願情報";
  if (text.includes("大学のポリシー")) return "大学のポリシー";
  if (text.includes("後期")) return "一般選抜（後期）";
  if (text.includes("前期")) return "一般選抜（前期）";
  return "一般選抜";
}

function getDisplayTopic(examType) {
  if (["入試Q&A", "日程・会場", "出願情報", "大学のポリシー"].includes(examType)) return examType;
  return `${examType}の傾向と対策`;
}

function buildLead(record, restPost, rawBody) {
  const opening = firstParagraph(extractStrategyBody(rawBody));
  if (opening) return trimLead(opening);
  const excerpt = stripTags(restPost.excerpt?.rendered || "")
    .replace(/\s*\[(?:...|…)\]\s*$/g, "")
    .replace(/\s*…\s*$/g, "")
    .trim();
  if (excerpt) return trimLead(excerpt);
  const description = record.htmlAudit?.metaDescription || "";
  if (description) return trimLead(description);
  return `${getUniversityName(record.title)}医学部の入試傾向と科目別対策を、受験準備で確認しやすい形に整理しています。`;
}

function buildKeyPoints({ universityName, targetYear, examType }) {
  if (examType === "入試Q&A") {
    return [
      "医学部入試でよくある疑問を、受験準備の流れに沿って整理しています。",
      "出願、試験当日、合格発表前後の判断材料として確認できます。",
      "個別の年度・大学情報は、必ず大学公式の募集要項・入試要項で最新情報を確認してください。",
    ];
  }
  return [
    `${universityName}${targetYear}${examType}の科目別傾向を、読みやすい構成に整理しています。`,
    "英語・数学・理科を中心に、時間配分と得点戦略の観点から確認できます。",
    "出願前には、必ず大学公式の募集要項・入試要項で最新情報を確認してください。",
  ];
}

function buildDisplayTitleLines({ targetYear, universityName, faculty, examType }) {
  if (examType === "入試Q&A") return ["医学部入試のQ&A"];
  return [targetYear, `${universityName} ${faculty}`, getDisplayTopic(examType)];
}

function buildInfoItems({ targetYear, universityName, faculty, examType }) {
  if (examType === "入試Q&A") {
    return [
      { label: "テーマ", value: "医学部入試Q&A" },
      { label: "用途", value: "受験準備の確認" },
    ];
  }
  return [
    { label: "年度", value: targetYear },
    { label: "大学", value: universityName },
    { label: "学部", value: faculty },
    { label: "入試方式", value: examType },
  ];
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
    .filter((record) => record.recommendedTemplate === "university-entrance-strategy")
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  const posts = [];
  const failures = [];

  console.log(`Generating university-entrance-strategy posts: ${records.length}`);

  for (let index = 0; index < records.length; index += 1) {
    const record = records[index];
    try {
      const url = new URL(`/wp-json/wp/v2/posts/${record.id}`, siteOrigin);
      url.searchParams.set("_embed", "wp:featuredmedia");
      const restPost = await fetchJson(url.href);
      const rawContent = restPost.content?.rendered || "";
      const { html, toc } = cleanArticleHtml(rawContent);
      const images = extractImages(rawContent);
      const universityName = getUniversityName(record.title);
      const faculty = getFaculty(record.title);
      const targetYear = getTargetYear(record.title);
      const examType = getExamType(record.title);
      const displayTitleLines = buildDisplayTitleLines({ targetYear, universityName, faculty, examType });
      const lead = buildLead(record, restPost, rawContent);

      posts.push({
        id: record.id,
        slug: record.slug,
        path: record.path,
        url: record.url,
        template: "university-entrance-strategy",
        title: record.title,
        displayTitle: displayTitleLines.join(" "),
        displayTitleLines,
        description: record.htmlAudit?.metaDescription || lead,
        canonical: record.htmlAudit?.canonical || record.url,
        date: record.date,
        modified: record.modified,
        categories: record.categories || [],
        tags: record.tags || [],
        lead,
        heroVariant: "oni",
        heroBadge: "HOT",
        heroMessage: "君ならできる！\n最後まで自分を信じて走り抜け!!",
        heroMessageLines: ["君ならできる！", "最後まで自分を信じて走り抜け!!"],
        heroImage,
        keyPoints: buildKeyPoints({ universityName, targetYear, examType }),
        infoItems: buildInfoItems({ targetYear, universityName, faculty, examType }),
        toc: toc.slice(0, 18),
        contentHtml: html,
        sourceMetrics: {
          htmlBytes: Buffer.byteLength(html),
          tocCount: toc.length,
          imageCount: images.length,
          originalHtmlBytes: record.htmlAudit?.htmlBytes || 0,
          alreadyInStaticBaseline: Boolean(record.alreadyInStaticBaseline),
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

    if ((index + 1) % 10 === 0 || index + 1 === records.length) {
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
        template: "university-entrance-strategy",
        sourceRecords: records.length,
        generated: posts.length,
        failed: failures.length,
        staticBaselineOverrides: posts.filter((post) => post.sourceMetrics?.alreadyInStaticBaseline).length,
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
