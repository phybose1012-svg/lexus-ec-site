import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const siteOrigin = "https://lexus-ec.com";
const root = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const workspace = path.resolve(root, "..");
const reportsDir = path.join(workspace, "reports");
const baselineManifestPath = path.join(workspace, "baseline", "pages", "manifest.json");

const USER_AGENT = "Mozilla/5.0 (compatible; LEXUS-EC-post-inventory/1.0)";
const REQUEST_DELAY_MS = 80;
const HTML_CONCURRENCY = 4;
const FETCH_TIMEOUT_MS = 15_000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const decodeEntityMap = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeEntities(value = "") {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number.parseInt(num, 10)))
    .replace(/&([a-z]+);/gi, (_, name) => decodeEntityMap[name] ?? `&${name};`);
}

function cleanXmlValue(value = "") {
  return decodeEntities(value.trim().replace(/^<!\[CDATA\[/i, "").replace(/\]\]>$/i, "").trim());
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

function textFromRendered(rendered) {
  return stripTags(rendered || "");
}

function escapeMarkdown(value = "") {
  return String(value).replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function csvCell(value) {
  const text = value == null ? "" : Array.isArray(value) ? value.join("; ") : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function normalizeUrl(value) {
  try {
    const url = new URL(value, siteOrigin);
    url.hash = "";
    return url.href;
  } catch {
    return value;
  }
}

function pathFromUrl(value) {
  try {
    const url = new URL(value, siteOrigin);
    return decodeURI(url.pathname);
  } catch {
    return "";
  }
}

function recordKeyFromUrl(value) {
  const pathname = pathFromUrl(value).replace(/\/+$/g, "");
  return pathname || normalizeUrl(value);
}

function isPostTypeSitemapUrl(value) {
  try {
    const url = new URL(value, siteOrigin);
    return (
      /\/wp-sitemap-posts-post-\d+\.xml$/i.test(url.pathname) ||
      /\/post-sitemap\d*\.xml$/i.test(url.pathname)
    );
  } catch {
    return false;
  }
}

async function fetchWithRetry(url, options = {}, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "user-agent": USER_AGENT,
          accept: "text/html,application/xhtml+xml,application/xml,application/json;q=0.9,*/*;q=0.8",
          ...(options.headers || {}),
        },
      });
      clearTimeout(timeout);
      return response;
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;
      await sleep(250 * attempt);
    }
  }
  throw lastError;
}

async function fetchJson(url) {
  const response = await fetchWithRetry(url, { headers: { accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }
  return {
    data: await response.json(),
    headers: response.headers,
    status: response.status,
  };
}

async function fetchText(url) {
  const response = await fetchWithRetry(url);
  return {
    text: await response.text(),
    headers: response.headers,
    status: response.status,
    ok: response.ok,
  };
}

async function fetchWpCollection(endpoint, params = {}) {
  const records = [];
  let page = 1;
  let totalPages = null;

  while (totalPages == null || page <= totalPages) {
    const url = new URL(endpoint, siteOrigin);
    url.searchParams.set("per_page", "100");
    url.searchParams.set("page", String(page));
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }

    try {
      const { data, headers } = await fetchJson(url.href);
      if (!Array.isArray(data) || data.length === 0) break;
      records.push(...data);
      totalPages = Number(headers.get("x-wp-totalpages") || page);
      page += 1;
      await sleep(REQUEST_DELAY_MS);
    } catch (error) {
      if (page === 1) throw error;
      break;
    }
  }

  return records;
}

function parseSitemapEntries(xml) {
  const entries = [];
  const blocks = [...xml.matchAll(/<(url|sitemap)\b[\s\S]*?<\/\1>/gi)].map((match) => match[0]);

  if (blocks.length === 0) {
    return [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((match) => ({
      loc: cleanXmlValue(match[1]),
      lastmod: "",
    }));
  }

  for (const block of blocks) {
    const loc = block.match(/<loc>([\s\S]*?)<\/loc>/i)?.[1]?.trim();
    if (!loc) continue;
    const lastmod = block.match(/<lastmod>([\s\S]*?)<\/lastmod>/i)?.[1]?.trim() || "";
    entries.push({ loc: cleanXmlValue(loc), lastmod: cleanXmlValue(lastmod) });
  }

  return entries;
}

async function fetchPostSitemapUrls() {
  const candidates = [
    `${siteOrigin}/wp-sitemap.xml`,
    `${siteOrigin}/sitemap_index.xml`,
    `${siteOrigin}/post-sitemap.xml`,
  ];
  const sitemapUrls = new Map();
  const postEntries = new Map();

  for (const candidate of candidates) {
    try {
      const { text, ok } = await fetchText(candidate);
      if (!ok) continue;
      for (const entry of parseSitemapEntries(text)) {
        const loc = normalizeUrl(entry.loc);
        if (/sitemap/i.test(loc) && isPostTypeSitemapUrl(loc)) {
          sitemapUrls.set(loc, entry.lastmod);
        } else if (!/sitemap/i.test(loc)) {
          postEntries.set(loc, entry);
        }
      }
      if (/post-sitemap\.xml$/i.test(candidate)) {
        for (const entry of parseSitemapEntries(text)) {
          postEntries.set(normalizeUrl(entry.loc), entry);
        }
      }
    } catch {
      // Other discovery paths may still succeed.
    }
  }

  for (const sitemapUrl of sitemapUrls.keys()) {
    try {
      const { text, ok } = await fetchText(sitemapUrl);
      if (!ok) continue;
      for (const entry of parseSitemapEntries(text)) {
        postEntries.set(normalizeUrl(entry.loc), entry);
      }
      await sleep(REQUEST_DELAY_MS);
    } catch {
      // Keep inventory generation resilient.
    }
  }

  return [...postEntries.values()].map((entry) => ({
    ...entry,
    loc: normalizeUrl(entry.loc),
  }));
}

async function loadBaselinePaths() {
  try {
    const manifest = JSON.parse(await readFile(baselineManifestPath, "utf8"));
    return new Set(manifest.map((entry) => decodeURI(entry.path)));
  } catch {
    return new Set();
  }
}

function extractMeta(html, key, attr = "name") {
  const patterns = [
    new RegExp(`<meta[^>]+${attr}=["']${key}["'][^>]*content=["']([^"']*)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*${attr}=["']${key}["'][^>]*>`, "i"),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return decodeEntities(match[1].trim());
  }
  return "";
}

function extractLink(html, rel) {
  const patterns = [
    new RegExp(`<link[^>]+rel=["'][^"']*${rel}[^"']*["'][^>]*href=["']([^"']*)["'][^>]*>`, "i"),
    new RegExp(`<link[^>]+href=["']([^"']*)["'][^>]*rel=["'][^"']*${rel}[^"']*["'][^>]*>`, "i"),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return decodeEntities(match[1].trim());
  }
  return "";
}

function extractHeadings(html, tag) {
  return [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi"))]
    .map((match) => stripTags(match[1]))
    .filter(Boolean);
}

function extractImages(html) {
  return [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => {
    const tag = match[0];
    const attr = (name) => tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "i"))?.[1] || "";
    return {
      src: decodeEntities(attr("src") || attr("data-src") || attr("data-lazy-src")),
      alt: decodeEntities(attr("alt")),
      width: attr("width"),
      height: attr("height"),
    };
  });
}

function extractLinks(html) {
  return [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)]
    .map((match) => decodeEntities(match[1].trim()))
    .filter(Boolean)
    .map((href) => {
      try {
        return new URL(href, siteOrigin).href;
      } catch {
        return href;
      }
    });
}

function extractVideoUrls(html) {
  const urls = new Set();
  const patterns = [
    /<iframe\b[^>]*src=["']([^"']+)["'][^>]*>/gi,
    /<video\b[^>]*src=["']([^"']+)["'][^>]*>/gi,
    /<source\b[^>]*src=["']([^"']+\.(?:mp4|webm|mov)(?:\?[^"']*)?)["'][^>]*>/gi,
    /<a\b[^>]*href=["']([^"']+\.(?:mp4|webm|mov)(?:\?[^"']*)?)["'][^>]*>/gi,
  ];
  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      urls.add(decodeEntities(match[1].trim()));
    }
  }
  return [...urls];
}

function parseHtmlAudit(html) {
  const title = stripTags(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
  const headings = {
    h1: extractHeadings(html, "h1"),
    h2: extractHeadings(html, "h2"),
    h3: extractHeadings(html, "h3"),
  };
  const images = extractImages(html);
  const links = extractLinks(html);
  const internalLinks = [...new Set(links.filter((href) => {
    try {
      const url = new URL(href, siteOrigin);
      return url.origin === siteOrigin;
    } catch {
      return href.startsWith("/");
    }
  }).map((href) => pathFromUrl(href)).filter(Boolean))];
  const text = stripTags(html);
  const elementorCssIds = [...new Set([...html.matchAll(/uploads\/elementor\/css\/post-(\d+)\.css/gi)].map((match) => match[1]))];
  const wpUploadUrls = [...new Set([...html.matchAll(/https?:\/\/lexus-ec\.com\/wp-content\/uploads\/[^"'\s)]+/gi)].map((match) => decodeEntities(match[0])))];

  return {
    htmlBytes: Buffer.byteLength(html),
    title,
    canonical: extractLink(html, "canonical"),
    metaDescription: extractMeta(html, "description"),
    robots: extractMeta(html, "robots"),
    ogTitle: extractMeta(html, "og:title", "property"),
    ogDescription: extractMeta(html, "og:description", "property"),
    ogImage: extractMeta(html, "og:image", "property"),
    articlePublishedTime: extractMeta(html, "article:published_time", "property"),
    articleModifiedTime: extractMeta(html, "article:modified_time", "property"),
    headingCounts: {
      h1: headings.h1.length,
      h2: headings.h2.length,
      h3: headings.h3.length,
    },
    headingsPreview: {
      h1: headings.h1.slice(0, 3),
      h2: headings.h2.slice(0, 12),
      h3: headings.h3.slice(0, 12),
    },
    imageCount: images.length,
    imagesPreview: images.slice(0, 12),
    missingAltImageCount: images.filter((image) => !image.alt).length,
    wpUploadAssetCount: wpUploadUrls.length,
    wpUploadAssetsPreview: wpUploadUrls.slice(0, 20),
    videoUrls: extractVideoUrls(html),
    tableCount: (html.match(/<table\b/gi) || []).length,
    formCount: (html.match(/<form\b/gi) || []).length,
    iframeCount: (html.match(/<iframe\b/gi) || []).length,
    structuredDataCount: (html.match(/<script\b[^>]+application\/ld\+json/gi) || []).length,
    internalLinkCount: internalLinks.length,
    internalLinksPreview: internalLinks.slice(0, 25),
    externalLinkCount: links.length - internalLinks.length,
    elementorCssIds,
    textLength: text.length,
  };
}

function classifyPost({ slug, title, categories, tags, htmlAudit }) {
  const primary = [
    slug,
    title,
    ...(categories || []),
    ...(tags || []),
  ].join(" ");
  const secondary = [
    primary,
    ...(htmlAudit?.headingsPreview?.h1 || []),
    ...(htmlAudit?.headingsPreview?.h2 || []),
  ].join(" ");

  if (/^mail-\d+/i.test(slug) || /保護者|ご父母|父母|手紙|メール/.test(primary)) {
    return "parent-letter";
  }
  if (/繰り上げ|繰上|補欠|waitlist|合格発表/.test(primary)) {
    return "waitlist-info";
  }
  if (/interview-guide|面接/.test(primary)) {
    return "interview-prep-guide";
  }
  if (/analysis|過去問分析|時間配分/.test(primary)) {
    return "subject-analysis";
  }
  if (/^voice-\d+$/i.test(slug) || /合格者の声|合格体験|体験記|生徒の声/.test(primary)) {
    return "voice-interview";
  }
  if (/university-entrance-exam-measures|exam-guide|entrance-exam|medicine-strategy|2027|一般選抜|入試対策/.test(primary)) {
    return "university-entrance-strategy";
  }
  if (/共通テスト|二次試験|国公立医学部|私立医学部|大学別入試情報|入試情報|ボーダー|足きり/.test(primary)) {
    return "admission-info";
  }
  if (/FAQ|よくある質問|質問/.test(primary)) {
    return "faq-info";
  }
  if (/医学部入試|大学.*医学部|偏差値|推薦入試/.test(secondary)) {
    return "university-entrance-strategy";
  }
  if (/英語|数学|勉強|学習|暗記|思考|小論文|授業/.test(primary)) {
    return "general-column";
  }
  if (htmlAudit?.formCount > 0) {
    return "general-column";
  }
  return "general-column";
}

function estimateComplexity(record) {
  const audit = record.htmlAudit || {};
  let score = 0;
  if ((audit.elementorCssIds || []).length > 5) score += 1;
  if ((audit.imageCount || 0) > 30) score += 2;
  else if ((audit.imageCount || 0) > 12) score += 1;
  if ((audit.videoUrls || []).length > 0) score += 2;
  if ((audit.tableCount || 0) > 8) score += 2;
  else if ((audit.tableCount || 0) > 0) score += 1;
  if ((audit.formCount || 0) > 0) score += 2;
  if ((audit.iframeCount || 0) > 2) score += 1;
  if ((audit.textLength || 0) > 10000) score += 2;
  else if ((audit.textLength || 0) > 5000) score += 1;
  if ((audit.wpUploadAssetCount || 0) > 20) score += 1;
  if ((audit.missingAltImageCount || 0) > 10) score += 1;

  if (score >= 6) return "high";
  if (score >= 3) return "medium";
  return "low";
}

async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(items[index], index);
      await sleep(REQUEST_DELAY_MS);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function summarize(records, restPosts, sitemapEntries) {
  const byTemplate = {};
  const byComplexity = {};
  const byCategory = {};
  const sourceCoverage = {
    restOnly: 0,
    sitemapOnly: 0,
    both: 0,
  };

  for (const record of records) {
    byTemplate[record.recommendedTemplate] = (byTemplate[record.recommendedTemplate] || 0) + 1;
    byComplexity[record.migrationComplexity] = (byComplexity[record.migrationComplexity] || 0) + 1;
    for (const category of record.categories || []) {
      byCategory[category] = (byCategory[category] || 0) + 1;
    }
    if (record.sources.rest && record.sources.sitemap) sourceCoverage.both += 1;
    else if (record.sources.rest) sourceCoverage.restOnly += 1;
    else if (record.sources.sitemap) sourceCoverage.sitemapOnly += 1;
  }

  return {
    generatedAt: new Date().toISOString(),
    siteOrigin,
    counts: {
      records: records.length,
      restPosts: restPosts.length,
      sitemapPostUrls: sitemapEntries.length,
    },
    sourceCoverage,
    byTemplate,
    byComplexity,
    byCategory: Object.fromEntries(Object.entries(byCategory).sort((a, b) => b[1] - a[1])),
  };
}

function renderMarkdown(summary, records) {
  const highRisk = records
    .filter((record) => record.migrationComplexity === "high" || record.recommendedTemplate === "generic-column")
    .slice(0, 30);
  const sitemapOnly = records.filter((record) => record.sources.sitemap && !record.sources.rest);
  const restOnly = records.filter((record) => record.sources.rest && !record.sources.sitemap);
  const staticAlready = records.filter((record) => record.alreadyInStaticBaseline);

  const lines = [
    "# Post Migration Inventory",
    "",
    `Generated: ${summary.generatedAt}`,
    `Site: ${summary.siteOrigin}`,
    "",
    "## Summary",
    "",
    `- Inventory records: ${summary.counts.records}`,
    `- REST publish posts: ${summary.counts.restPosts}`,
    `- Sitemap post URLs: ${summary.counts.sitemapPostUrls}`,
    `- REST and sitemap: ${summary.sourceCoverage.both}`,
    `- REST only: ${summary.sourceCoverage.restOnly}`,
    `- Sitemap only: ${summary.sourceCoverage.sitemapOnly}`,
    `- Already present in fixed-page baseline: ${staticAlready.length}`,
    "",
    "## Template Buckets",
    "",
    "| Template | Count |",
    "| --- | ---: |",
    ...Object.entries(summary.byTemplate)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => `| ${name} | ${count} |`),
    "",
    "## Complexity",
    "",
    "| Complexity | Count |",
    "| --- | ---: |",
    ...Object.entries(summary.byComplexity)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => `| ${name} | ${count} |`),
    "",
    "## Category Buckets",
    "",
    "| Category | Count |",
    "| --- | ---: |",
    ...Object.entries(summary.byCategory)
      .slice(0, 40)
      .map(([name, count]) => `| ${escapeMarkdown(name)} | ${count} |`),
    "",
    "## High Priority Review",
    "",
    "| URL | Title | Template | Complexity | Images | Videos | Tables | Elementor CSS |",
    "| --- | --- | --- | --- | ---: | ---: | ---: | ---: |",
    ...highRisk.map((record) => [
      record.url,
      escapeMarkdown(record.title),
      record.recommendedTemplate,
      record.migrationComplexity,
      record.htmlAudit?.imageCount ?? 0,
      record.htmlAudit?.videoUrls?.length ?? 0,
      record.htmlAudit?.tableCount ?? 0,
      record.htmlAudit?.elementorCssIds?.length ?? 0,
    ].map((value, index) => (index === 0 ? `[link](${value})` : value)).join(" | ")).map((row) => `| ${row} |`),
    "",
    "## Source Mismatches",
    "",
    `- Sitemap only: ${sitemapOnly.length}`,
    `- REST only: ${restOnly.length}`,
    "",
    "### Sitemap Only",
    "",
    ...sitemapOnly.slice(0, 50).map((record) => `- ${record.url}`),
    "",
    "### REST Only",
    "",
    ...restOnly.slice(0, 50).map((record) => `- ${record.url}`),
    "",
    "## Full Inventory",
    "",
    "| URL | Title | Template | Complexity | Date | Modified | Categories | Static baseline |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ...records.map((record) => `| [link](${record.url}) | ${escapeMarkdown(record.title)} | ${record.recommendedTemplate} | ${record.migrationComplexity} | ${record.date || ""} | ${record.modified || ""} | ${escapeMarkdown((record.categories || []).join(", "))} | ${record.alreadyInStaticBaseline ? "yes" : "no"} |`),
    "",
  ];

  return `${lines.join("\n")}\n`;
}

function renderCsv(records) {
  const headers = [
    "url",
    "path",
    "id",
    "slug",
    "title",
    "date",
    "modified",
    "categories",
    "tags",
    "recommendedTemplate",
    "migrationComplexity",
    "alreadyInStaticBaseline",
    "sourceRest",
    "sourceSitemap",
    "htmlStatus",
    "canonical",
    "metaDescription",
    "h1Count",
    "h2Count",
    "imageCount",
    "missingAltImageCount",
    "videoCount",
    "tableCount",
    "formCount",
    "iframeCount",
    "elementorCssCount",
    "textLength",
  ];
  const rows = records.map((record) => [
    record.url,
    record.path,
    record.id,
    record.slug,
    record.title,
    record.date,
    record.modified,
    record.categories,
    record.tags,
    record.recommendedTemplate,
    record.migrationComplexity,
    record.alreadyInStaticBaseline,
    record.sources.rest,
    record.sources.sitemap,
    record.htmlStatus,
    record.htmlAudit?.canonical,
    record.htmlAudit?.metaDescription,
    record.htmlAudit?.headingCounts?.h1,
    record.htmlAudit?.headingCounts?.h2,
    record.htmlAudit?.imageCount,
    record.htmlAudit?.missingAltImageCount,
    record.htmlAudit?.videoUrls?.length,
    record.htmlAudit?.tableCount,
    record.htmlAudit?.formCount,
    record.htmlAudit?.iframeCount,
    record.htmlAudit?.elementorCssIds?.length,
    record.htmlAudit?.textLength,
  ]);

  return [
    headers.map(csvCell).join(","),
    ...rows.map((row) => row.map(csvCell).join(",")),
  ].join("\n");
}

async function main() {
  await mkdir(reportsDir, { recursive: true });

  console.log("Loading fixed-page baseline manifest...");
  const baselinePaths = await loadBaselinePaths();

  console.log("Fetching WordPress categories...");
  const categories = await fetchWpCollection("/wp-json/wp/v2/categories", { hide_empty: "false" }).catch((error) => {
    console.warn(`Category fetch failed: ${error.message}`);
    return [];
  });
  console.log(`Categories: ${categories.length}`);

  console.log("Fetching WordPress tags...");
  const tags = await fetchWpCollection("/wp-json/wp/v2/tags", { hide_empty: "false" }).catch((error) => {
    console.warn(`Tag fetch failed: ${error.message}`);
    return [];
  });
  console.log(`Tags: ${tags.length}`);

  console.log("Fetching WordPress REST posts...");
  const restPosts = await fetchWpCollection("/wp-json/wp/v2/posts", {
      status: "publish",
      orderby: "date",
      order: "desc",
      _embed: "wp:featuredmedia",
      _fields: "id,date,date_gmt,modified,modified_gmt,slug,link,type,status,title,excerpt,categories,tags,featured_media,_embedded",
    }).catch((error) => {
    console.warn(`REST post fetch failed: ${error.message}`);
    return [];
  });
  console.log(`REST posts: ${restPosts.length}`);

  console.log("Fetching post sitemap URLs...");
  const sitemapEntries = await fetchPostSitemapUrls();
  console.log(`Sitemap post URLs: ${sitemapEntries.length}`);

  const categoryById = new Map(categories.map((category) => [category.id, category.name]));
  const tagById = new Map(tags.map((tag) => [tag.id, tag.name]));
  const recordsByKey = new Map();

  for (const post of restPosts) {
    const url = normalizeUrl(post.link);
    recordsByKey.set(recordKeyFromUrl(url), {
      url,
      path: pathFromUrl(url),
      id: post.id,
      slug: post.slug,
      type: post.type,
      status: post.status,
      title: textFromRendered(post.title?.rendered),
      excerpt: textFromRendered(post.excerpt?.rendered),
      date: post.date,
      dateGmt: post.date_gmt,
      modified: post.modified,
      modifiedGmt: post.modified_gmt,
      categories: (post.categories || []).map((id) => categoryById.get(id) || String(id)),
      tags: (post.tags || []).map((id) => tagById.get(id) || String(id)),
      featuredMediaId: post.featured_media || null,
      featuredImage:
        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
        post._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.full?.source_url ||
        "",
      sources: {
        rest: true,
        sitemap: false,
      },
    });
  }

  for (const entry of sitemapEntries) {
    const url = normalizeUrl(entry.loc);
    const key = recordKeyFromUrl(url);
    const existing = recordsByKey.get(key);
    if (existing) {
      existing.sources.sitemap = true;
      existing.sitemapLastmod = entry.lastmod || "";
    } else {
      recordsByKey.set(key, {
        url,
        path: pathFromUrl(url),
        id: null,
        slug: pathFromUrl(url).replace(/^\/|\/$/g, ""),
        type: "post",
        status: "publish",
        title: "",
        excerpt: "",
        date: "",
        dateGmt: "",
        modified: "",
        modifiedGmt: "",
        categories: [],
        tags: [],
        featuredMediaId: null,
        featuredImage: "",
        sitemapLastmod: entry.lastmod || "",
        sources: {
          rest: false,
          sitemap: true,
        },
      });
    }
  }

  const records = [...recordsByKey.values()].sort((a, b) => {
    const left = b.date || b.sitemapLastmod || "";
    const right = a.date || a.sitemapLastmod || "";
    return left.localeCompare(right);
  });

  let auditedCount = 0;
  console.log(`Auditing post HTML: ${records.length} URLs with concurrency ${HTML_CONCURRENCY}...`);
  const audited = await mapLimit(records, HTML_CONCURRENCY, async (record) => {
    try {
      const { text, status, ok } = await fetchText(record.url);
      const htmlAudit = ok ? parseHtmlAudit(text) : null;
      const title = record.title || htmlAudit?.headingsPreview?.h1?.[0] || htmlAudit?.title || "";
      const nextRecord = {
        ...record,
        title,
        htmlStatus: status,
        htmlAudit,
        alreadyInStaticBaseline: baselinePaths.has(record.path),
      };
      nextRecord.recommendedTemplate = classifyPost(nextRecord);
      nextRecord.migrationComplexity = estimateComplexity(nextRecord);
      auditedCount += 1;
      if (auditedCount % 25 === 0 || auditedCount === records.length) {
        console.log(`Audited ${auditedCount}/${records.length}`);
      }
      return nextRecord;
    } catch (error) {
      const nextRecord = {
        ...record,
        htmlStatus: "fetch-error",
        htmlError: error.message,
        htmlAudit: null,
        alreadyInStaticBaseline: baselinePaths.has(record.path),
      };
      nextRecord.recommendedTemplate = classifyPost(nextRecord);
      nextRecord.migrationComplexity = "unknown";
      auditedCount += 1;
      if (auditedCount % 25 === 0 || auditedCount === records.length) {
        console.log(`Audited ${auditedCount}/${records.length}`);
      }
      return nextRecord;
    }
  });

  const summary = summarize(audited, restPosts, sitemapEntries);
  const output = { summary, records: audited };

  await writeFile(path.join(reportsDir, "post-inventory.json"), JSON.stringify(output, null, 2), "utf8");
  await writeFile(path.join(reportsDir, "post-inventory.md"), renderMarkdown(summary, audited), "utf8");
  await writeFile(path.join(reportsDir, "post-inventory.csv"), renderCsv(audited), "utf8");

  console.log(`Inventory records: ${summary.counts.records}`);
  console.log(`REST posts: ${summary.counts.restPosts}`);
  console.log(`Sitemap post URLs: ${summary.counts.sitemapPostUrls}`);
  console.log(`Reports written to ${reportsDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
