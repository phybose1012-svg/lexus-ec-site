import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const postsPath = path.join(root, "src", "data", "generated", "admissionInfoPosts.json");

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

function slugifyHeading(value, index) {
  const slug = value
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 58);
  return slug || `section-${index + 1}`;
}

function nextHeadingIndex(html, from, currentLevel) {
  const headingPattern = /<h([2-6])\b[^>]*>/gi;
  headingPattern.lastIndex = from;
  let match;
  while ((match = headingPattern.exec(html))) {
    if (Number(match[1]) <= currentLevel) return match.index;
  }
  return html.length;
}

function removeSections(html, headingPattern) {
  let output = html;
  let changed = true;

  while (changed) {
    changed = false;
    const match = /<h([2-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi.exec(output);
    if (!match) break;

    const allHeadings = [...output.matchAll(/<h([2-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)];
    for (const heading of allHeadings) {
      const text = stripTags(heading[2]);
      if (!headingPattern.test(text)) {
        headingPattern.lastIndex = 0;
        continue;
      }

      headingPattern.lastIndex = 0;
      const start = heading.index ?? 0;
      const end = nextHeadingIndex(output, start + heading[0].length, Number(heading[1]));
      output = `${output.slice(0, start)} ${output.slice(end)}`;
      changed = true;
      break;
    }
  }

  return output;
}

function stripOpeningChrome(html) {
  const basicInfoMatch = html.match(/<h[2-6]\b[^>]*>\s*(?:<[^>]+>\s*)*大学基本情報(?:\s*<[^>]+>)*\s*<\/h[2-6]>/i);
  if (!basicInfoMatch || typeof basicInfoMatch.index !== "number") return html;
  return html.slice(basicInfoMatch.index);
}

function normalizeProgressText(html) {
  let output = html;
  const progressPattern =
    /<span\b[^>]*>\s*([^<]+?)\s*<\/span>\s*<div\b[^>]*(?:aria-labelledby|aria-valuenow)[^>]*>\s*<span\b[^>]*>\s*<\/span>\s*<span\b[^>]*>\s*([^<]+?)\s*<\/span>/gi;

  for (let pass = 0; pass < 8; pass += 1) {
    const next = output.replace(progressPattern, (_match, label, value) => {
      const cleanLabel = stripTags(label);
      const cleanValue = stripTags(value);
      if (!cleanLabel || !cleanValue) return " ";
      return `<p><strong>${cleanLabel}</strong>：${cleanValue}</p>`;
    });
    if (next === output) break;
    output = next;
  }

  return output;
}

function removeLegacyBlocks(html) {
  let output = html;

  output = removeSections(output, /^(?:ボーダーライン|生徒専用寮|LEXUS GARDEN|レクサスガーデン|レクサス情報)$/i);
  output = removeSections(output, /^(?:大学別\s*医学部情報|関連(?:記事|情報)|他の大学(?:情報)?も見る)$/i);
  output = output
    .replace(/<article\b[\s\S]*?<\/article>/gi, " ")
    .replace(/<p\b[^>]*>\s*(?:◇◆◇\s*)?他の大学情報も見る(?:\s*◇◆◇)?\s*<\/p>/gi, " ")
    .replace(/<a\b[^>]*href=["']\/top\/(?:teacher|voice|history|information-[^"']+)\/?["'][^>]*>[\s\S]*?<\/a>/gi, " ")
    .replace(/<a\b[^>]*>\s*(?:傾向\/対策|学生の声|他の大学も見る|講師紹介|合格体験記|理念と沿革)\s*<\/a>/gi, " ");

  return output;
}

function normalizeTags(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, " ")
    .replace(/<video\b[\s\S]*?<\/video>/gi, " ")
    .replace(/<form\b[\s\S]*?<\/form>/gi, " ")
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, " ")
    .replace(/<link\b[^>]*>/gi, " ")
    .replace(/<meta\b[^>]*>/gi, " ")
    .replace(/<img\b[^>]*src=["']https:\/\/img\.youtube\.com\/[^"']+["'][^>]*>/gi, " ")
    .replace(/<img\b[^>]*\/wp-content\/plugins\/elementor\/[^>]*>/gi, " ")
    .replace(/<\/?(?:div|span|button)\b[^>]*>/gi, " ")
    .replace(/\s(?:class|style|id|role|tabindex|hidden|data-[\w:-]+|aria-[\w:-]+|on[a-z]+)=(["']).*?\1/gi, "")
    .replace(/\s(?:loading|decoding|fetchpriority|srcset|sizes)=(["']).*?\1/gi, "")
    .replace(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi, "<h2>$1</h2>")
    .replace(/<h5\b[^>]*>([\s\S]*?)<\/h5>/gi, "<h3>$1</h3>")
    .replace(/<h6\b[^>]*>([\s\S]*?)<\/h6>/gi, "<h4>$1</h4>")
    .replace(/<h([2-4])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_match, level, inner) => `<h${level}>${inner}</h${level}>`)
    .replace(/<p\b[^>]*>\s*(?:<strong>\s*)?もくじ(?:\s*<\/strong>)?\s*<\/p>/gi, " ")
    .replace(/<p\b[^>]*>\s*<\/p>/gi, " ")
    .replace(/<h[2-4]\b[^>]*>\s*<\/h[2-4]>/gi, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/>\s+</g, "> <")
    .trim();
}

function wrapLooseText(html) {
  return html.replace(
    /(<\/(?:h[2-4]|p|table|ul|ol|blockquote|figure)>)([^<][\s\S]*?)(?=<(?:h[2-4]|p|table|ul|ol|blockquote|figure|hr)\b|$)/gi,
    (_match, before, text) => {
      const cleanText = stripTags(text);
      if (!cleanText) return before;
      return `${before} <p>${cleanText}</p>`;
    },
  );
}

function removeEmptySubheadings(html) {
  let output = html;
  let changed = true;

  while (changed) {
    changed = false;
    const headings = [...output.matchAll(/<h([3-4])\b[^>]*>([\s\S]*?)<\/h\1>/gi)];

    for (const heading of headings) {
      const start = heading.index ?? 0;
      const end = start + heading[0].length;
      const next = nextHeadingIndex(output, end, Number(heading[1]));
      const between = output.slice(end, next);
      const hasBody = /<(?:p|table|ul|ol|figure|blockquote|img)\b/i.test(between) || stripTags(between).length > 0;
      if (hasBody) continue;

      output = `${output.slice(0, start)} ${output.slice(end)}`;
      changed = true;
      break;
    }
  }

  const trimmedEnd = output.trimEnd();
  const headings = [...trimmedEnd.matchAll(/<h([2-4])\b[^>]*>([\s\S]*?)<\/h\1>/gi)];
  const lastHeading = headings.at(-1);
  if (lastHeading && (lastHeading.index ?? 0) + lastHeading[0].length === trimmedEnd.length) {
    return trimmedEnd.slice(0, lastHeading.index).trim();
  }

  return output;
}

function rebuildHeadingIds(html) {
  const toc = [];
  const usedIds = new Set();
  let headingIndex = 0;

  const content = html.replace(/<h([2-4])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_match, level, inner) => {
    const text = stripTags(inner);
    if (!text || text.length > 120 || /^(?:もくじ|5 Videos)$/i.test(text)) return "";

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

  return { content, toc };
}

function cleanInformationHtml(contentHtml) {
  let html = contentHtml || "";
  html = stripOpeningChrome(html);
  html = normalizeProgressText(html);
  html = removeLegacyBlocks(html);
  html = normalizeTags(html);
  html = wrapLooseText(html);
  html = removeEmptySubheadings(html);
  html = html.replace(/(?:<hr\s*\/?>\s*){2,}/gi, "<hr /> ");
  html = html.replace(/\s{2,}/g, " ").trim();
  return rebuildHeadingIds(html);
}

function auditLegacyMarkers(posts) {
  const marker = /(elementor|aria-controls|aria-labelledby|aria-valuenow|aria-selected|<video\b|<button\b|<div\b|<span\b|Read More|More\s*»|続きを読む|<article\b)/i;
  return posts.filter((post) => marker.test(post.contentHtml || ""));
}

const posts = JSON.parse(await readFile(postsPath, "utf8"));
const targets = posts.filter((post) => /^\/information-[^/]+\/$/.test(post.path || ""));
let changed = 0;

for (const post of targets) {
  const before = post.contentHtml || "";
  const { content, toc } = cleanInformationHtml(before);
  post.contentHtml = content;
  post.toc = toc.slice(0, 14);
  if (post.sourceMetrics) {
    post.sourceMetrics.htmlBytes = Buffer.byteLength(content);
    post.sourceMetrics.tocCount = toc.length;
    post.sourceMetrics.imageCount = (content.match(/<img\b/gi) || []).length;
  }
  if (post.contentHtml !== before) changed += 1;
}

await writeFile(postsPath, `${JSON.stringify(posts, null, 2)}\n`, "utf8");

const remaining = auditLegacyMarkers(targets);
console.log(`information posts: ${targets.length}`);
console.log(`changed: ${changed}`);
console.log(`remaining legacy markers: ${remaining.length}`);
if (remaining.length) {
  for (const post of remaining.slice(0, 20)) {
    console.log(`${post.path}\t${post.title}`);
  }
}
