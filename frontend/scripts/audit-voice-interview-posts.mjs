import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const dataPath = path.join(root, "src", "data", "generated", "voiceInterviewPosts.json");
const posts = JSON.parse(await readFile(dataPath, "utf8"));

const legacyMarkupPattern =
  /(elementor|aria-controls|aria-labelledby|aria-valuenow|aria-selected|<video\b|<button\b|<div\b|<span\b|Read More|More\s*»|続きを読む|<article\b|<iframe\b|<script\b|<style\b)/i;
const externalInlineImagePattern = /<img\b[^>]*src=["']https?:\/\//i;
const videoPattern = /(youtube\.com|youtu\.be|vimeo\.com|\.mp4|動画|video)/i;
const mojibakePattern =
  /縺|蛹|譁|隧|蟄|螟|蜈|蜷|鬯|繧|莠|髱|遞|驛|諠|逕|逶|豈|蠎|竭|螳|逡|譛|荳|雎|蝣|霈|莉|悄/;

const textOnly = (html = "") =>
  html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const hasMojibake = (post) =>
  ["title", "displayTitle", "description", "lead", "heroBadge", "heroMessage"].some((key) =>
    mojibakePattern.test(String(post[key] || "")),
  ) ||
  (post.displayTitleLines || []).some((value) => mojibakePattern.test(String(value || ""))) ||
  (post.heroMessageLines || []).some((value) => mojibakePattern.test(String(value || ""))) ||
  (post.keyPoints || []).some((value) => mojibakePattern.test(String(value || ""))) ||
  (post.infoItems || []).some(
    (item) => mojibakePattern.test(String(item.label || "")) || mojibakePattern.test(String(item.value || "")),
  );

const checks = {
  missingHero: (post) => !post.heroImage?.src,
  legacyMarkup: (post) => legacyMarkupPattern.test(post.contentHtml || ""),
  externalInlineImages: (post) => externalInlineImagePattern.test(post.contentHtml || ""),
  noVideoReference: (post) => !videoPattern.test(JSON.stringify(post)),
  shortBody: (post) => textOnly(post.contentHtml || "").length < 1200,
  weakToc: (post) => !Array.isArray(post.toc) || post.toc.length < 4,
  mojibakeFields: hasMojibake,
};

const summary = Object.fromEntries(
  Object.entries(checks).map(([name, check]) => [name, posts.filter(check).length]),
);

console.log(JSON.stringify({ total: posts.length, ...summary }, null, 2));

for (const [name, check] of Object.entries(checks)) {
  const matches = posts.filter(check).slice(0, 16);
  if (!matches.length) continue;
  console.log(`\n[${name}]`);
  for (const post of matches) {
    console.log(`${post.path} ${post.displayTitle || post.title}`);
  }
}
