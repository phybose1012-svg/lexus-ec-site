import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const workspace = path.resolve(root, "..");
const publicDir = path.join(root, "public");
const dataPath = path.join(root, "src", "data", "generated", "admissionInfoPosts.json");
const reportDir = path.join(workspace, "reports", "information-posts");
const reportPath = path.join(reportDir, "qa.json");
const markdownPath = path.join(workspace, "docs", "information-posts-qa.md");

const posts = JSON.parse(await readFile(dataPath, "utf8"));
const targets = posts.filter((post) => /^\/information-[^/]+\/$/.test(post.path || ""));

const legacyMarkupPattern =
  /(elementor|aria-controls|aria-labelledby|aria-valuenow|aria-selected|<video\b|<button\b|<div\b|<span\b|Read More|More\s*ﾂｻ|邯壹″繧定ｪｭ繧|<article\b|<iframe\b|<script\b|<style\b)/i;
const externalInlineImagePattern = /<img\b[^>]*src=["']https?:\/\//i;
const suspiciousBrokenPattern = /<\/h[234]>\s*<\/h[234]>|<h[234][^>]*>\s*<\/h[234]>/i;
const mojibakePattern =
  /驍ｵ・ｺ|髯具ｽｹ|髫ｴ・埼ｫｫ・ｧ|髯斷ｻ髯樊ｯｫ|鬯ｯ・ｯ|驛｢・ｧ|髣培鬯ｮ・ｱ|鬨ｾ諤翻髮弱・|髯滓葎|鬮ｮ譌ｨ|鬮ｴ繝ｻ|郢ｧ|邵ｺ|隴斈髫ｧ|陷ｷ蝓毫陋ｹ・ｻ|陞滂ｽｧ/;

const stripTags = (html = "") =>
  html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const imageRefs = (post) => {
  const refs = [];
  const add = (src) => {
    if (src?.startsWith("/")) refs.push(src);
  };
  add(post.heroImage?.src);
  for (const match of (post.contentHtml || "").matchAll(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi)) add(match[1]);
  return [...new Set(refs)];
};

const localMissingImages = (post) => imageRefs(post).filter((src) => !existsSync(path.join(publicDir, src)));

const hasNestedTable = (html = "") => {
  let depth = 0;
  for (const match of html.matchAll(/<\/?table\b[^>]*>/gi)) {
    if (match[0].startsWith("</")) {
      depth = Math.max(0, depth - 1);
      continue;
    }
    depth += 1;
    if (depth > 1) return true;
  }
  return false;
};

const hasMojibakeField = (post) => {
  const fieldValues = [
    post.title,
    post.displayTitle,
    post.description,
    post.lead,
    post.heroBadge,
    post.heroMessage,
    ...(post.displayTitleLines || []),
    ...(post.heroMessageLines || []),
    ...(post.keyPoints || []),
    ...(post.infoItems || []).flatMap((item) => [item.label, item.value]),
  ];
  return fieldValues.some((value) => mojibakePattern.test(String(value || "")));
};

const hardChecks = {
  missingHero: (post) => !post.heroImage?.src,
  localMissingImages: (post) => localMissingImages(post).length > 0,
  externalInlineImages: (post) => externalInlineImagePattern.test(post.contentHtml || ""),
  legacyMarkup: (post) => legacyMarkupPattern.test(post.contentHtml || ""),
  suspiciousBrokenHtml: (post) => suspiciousBrokenPattern.test(post.contentHtml || "") || hasNestedTable(post.contentHtml || ""),
  weakToc: (post) => !Array.isArray(post.toc) || post.toc.length < 6,
  missingLead: (post) => !(post.lead || "").trim(),
  missingInfoItems: (post) => !Array.isArray(post.infoItems) || post.infoItems.length < 4,
  mojibakeFields: hasMojibakeField,
};

const noteChecks = {
  thinBody: (post) => stripTags(post.contentHtml || "").length < 1000,
};

const rows = targets.map((post) => ({
  path: post.path,
  title: post.title,
  displayTitle: post.displayTitleLines?.join(" / ") || post.displayTitle || post.title,
  heroImage: post.heroImage?.src || "",
  tocCount: post.toc?.length || 0,
  textLength: stripTags(post.contentHtml || "").length,
  imageCount: ((post.contentHtml || "").match(/<img\b/gi) || []).length,
  missingImages: localMissingImages(post),
  issues: Object.entries(hardChecks)
    .filter(([, check]) => check(post))
    .map(([name]) => name),
  notes: Object.entries(noteChecks)
    .filter(([, check]) => check(post))
    .map(([name]) => name),
}));

const hardSummary = Object.fromEntries(Object.entries(hardChecks).map(([name, check]) => [name, targets.filter(check).length]));
const noteSummary = Object.fromEntries(Object.entries(noteChecks).map(([name, check]) => [name, targets.filter(check).length]));
const summary = { ...hardSummary, ...noteSummary };
const issueRows = rows.filter((row) => row.issues.length > 0);
const noteRows = rows.filter((row) => row.notes.length > 0);

const report = {
  generatedAt: new Date().toISOString(),
  total: targets.length,
  hardIssueCount: issueRows.length,
  noteCount: noteRows.length,
  summary,
  rows,
};

await mkdir(reportDir, { recursive: true });
await mkdir(path.dirname(markdownPath), { recursive: true });
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

const escapeCell = (value = "") => String(value).replace(/\|/g, " / ").replace(/\n/g, " ");
const hardIssueSection = issueRows.length
  ? [
      "| Path | Title | Issues | TOC | Text | Hero |",
      "| --- | --- | --- | ---: | ---: | --- |",
      ...issueRows.map(
        (row) =>
          `| ${escapeCell(row.path)} | ${escapeCell(row.displayTitle)} | ${escapeCell(row.issues.join(", "))} | ${row.tocCount} | ${row.textLength} | ${escapeCell(row.heroImage)} |`,
      ),
    ]
  : ["No hard issues found."];

const md = [
  "# /information-* 81 QA",
  "",
  `Generated at: ${report.generatedAt}`,
  "",
  "## Hard Checks",
  "",
  `- Target pages: ${report.total}`,
  ...Object.entries(hardSummary).map(([name, count]) => `- ${name}: ${count}`),
  "",
  "## Hard Issues",
  "",
  ...hardIssueSection,
  "",
  "## Notes",
  "",
  "- thinBody is informational: some university info pages are intentionally compact after legacy cleanup.",
  ...Object.entries(noteSummary).map(([name, count]) => `- ${name}: ${count}`),
  "",
  "| Path | Title | Notes | TOC | Text |",
  "| --- | --- | --- | ---: | ---: |",
  ...noteRows.map(
    (row) =>
      `| ${escapeCell(row.path)} | ${escapeCell(row.displayTitle)} | ${escapeCell(row.notes.join(", "))} | ${row.tocCount} | ${row.textLength} |`,
  ),
  "",
  "## All Pages",
  "",
  "| Path | Title | TOC | Text | Images | Notes |",
  "| --- | --- | ---: | ---: | ---: | --- |",
  ...rows.map(
    (row) =>
      `| ${escapeCell(row.path)} | ${escapeCell(row.displayTitle)} | ${row.tocCount} | ${row.textLength} | ${row.imageCount} | ${escapeCell(row.notes.join(", "))} |`,
  ),
  "",
];
await writeFile(markdownPath, `${md.join("\n")}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      total: targets.length,
      hardIssueRows: issueRows.length,
      noteRows: noteRows.length,
      ...summary,
      reportPath,
      markdownPath,
    },
    null,
    2,
  ),
);
for (const row of issueRows.slice(0, 30)) {
  console.log(`${row.path}\t${row.issues.join(", ")}\t${row.displayTitle}`);
}
