// Remove the broken "ボーダーライン" placeholder blocks that were carried over
// from the old WordPress/Elementor pages.
//
// On the legacy site these were rendered widgets; the migration flattened them
// into bare text whose every value is `0`, e.g.
//
//   <p><strong><strong>ボーダーライン</strong></strong></p>
//   2025年度 2024年度 ... 共テボーダー得点率（前期） 0 % ... 偏差値 0
//
// Publishing a table of zeroes is worse than publishing nothing: it is content
// with no value for the reader, which is exactly what Google's "scaled content
// abuse" and "thin content" policies describe. We have no source for the real
// numbers in this repo, and inventing exam borderlines would be far worse than
// omitting them, so the blocks are removed.
//
// The script is idempotent and refuses to touch a block that carries any
// non-zero number, so it stays safe to re-run after real data is filled in.

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const generatedDir = path.join(root, "src", "data", "generated");
const targets = ["universityStrategyPosts.json", "admissionInfoPosts.json"];

const HEADING = "<p><strong><strong>ボーダーライン</strong></strong></p>";
// The flattened block is either a bare text run (most pages) or a single
// paragraph (information-tottori). Both end at the next element.
const BLOCK = new RegExp(
  `\\s*${HEADING.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*(?:<p>[^<]*</p>|[^<]*)`,
);

const MARKERS = ["共テボーダー得点率", "B判定偏差値", "共テ目標点"];

// Only the data cells count: a score rate ("0 %"), a deviation value
// ("偏差値 0") or a point total ("0 点"). Column headers (2025年度) and scale
// annotations (900点満点) are labels, not measurements, so they are excluded —
// otherwise a page that really is all zeroes would look populated.
const VALUE_PATTERNS = [/(\d+(?:\.\d+)?)\s*%/g, /偏差値\s*(\d+(?:\.\d+)?)/g, /(\d+(?:\.\d+)?)\s*点(?!満点)/g];

const isPlaceholderOnly = (block) => {
  const text = block.replace(/<[^>]+>/g, " ");
  if (!MARKERS.some((marker) => text.includes(marker))) return false;

  const values = [];
  for (const pattern of VALUE_PATTERNS) {
    for (const match of text.matchAll(pattern)) values.push(Number(match[1]));
  }
  return values.length > 0 && values.every((value) => value === 0);
};

let totalStripped = 0;
const report = [];

for (const file of targets) {
  const filePath = path.join(generatedDir, file);
  const posts = JSON.parse(await readFile(filePath, "utf8"));
  let changed = 0;

  for (const post of posts) {
    if (typeof post.contentHtml !== "string") continue;
    const match = post.contentHtml.match(BLOCK);
    if (!match) continue;

    if (!isPlaceholderOnly(match[0])) {
      report.push(`  SKIP (has real values): ${post.path}`);
      continue;
    }

    post.contentHtml = post.contentHtml.replace(BLOCK, "");
    if (post.contentHtml.includes("共テボーダー得点率")) {
      throw new Error(`${post.path}: placeholder text survived the strip`);
    }
    // The block is a bare <p>, never a heading, so the table of contents and
    // the heading outline are unaffected — assert that rather than assume it.
    if ((post.toc || []).some((entry) => String(entry.text || "").includes("ボーダーライン"))) {
      throw new Error(`${post.path}: unexpected ボーダーライン heading in toc`);
    }
    changed += 1;
  }

  if (changed > 0) {
    await writeFile(filePath, `${JSON.stringify(posts, null, 2)}\n`, "utf8");
  }
  totalStripped += changed;
  report.push(`${file}: stripped ${changed}`);
}

console.log(report.join("\n"));
console.log(`total placeholder border blocks removed: ${totalStripped}`);
