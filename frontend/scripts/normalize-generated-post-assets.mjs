import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const publicDir = path.join(root, "public");
const files = [
  "src/data/generated/admissionInfoPosts.json",
  "src/data/generated/universityStrategyPosts.json",
  "src/data/generated/interviewPrepPosts.json",
  "src/data/generated/voiceInterviewPosts.json",
];

function normalizeLegacyAssetReference(assetPath = "") {
  try {
    return `/assets/legacy${decodeURI(assetPath)}`;
  } catch {
    return `/assets/legacy${assetPath}`;
  }
}

let changedPosts = 0;
let removedMissingImages = 0;
let removedMissingHeroImages = 0;
for (const file of files) {
  const fullPath = path.join(root, file);
  const posts = JSON.parse(await readFile(fullPath, "utf8"));
  let fileChanged = 0;
  for (const post of posts) {
    if (post.heroImage?.src?.startsWith("/assets/legacy/") && !existsSync(path.join(publicDir, post.heroImage.src))) {
      post.heroImage = null;
      removedMissingHeroImages += 1;
      fileChanged += 1;
      changedPosts += 1;
    }

    const before = post.contentHtml || "";
    const after = before
      .replace(/<img\b[^>]*src=["']https:\/\/lexus-ec\.com\/wp-content\/plugins\/elementor\/assets\/images\/placeholder\.png["'][^>]*>/gi, " ")
      .replace(/https:\/\/lexus-ec\.com(\/wp-content\/uploads\/[^"'<>\s)]+)/gi, (_match, src) =>
        normalizeLegacyAssetReference(src),
      )
      .replace(/<img\b[^>]*src=["'](\/assets\/legacy\/[^"']+)["'][^>]*>/gi, (tag, src) => {
        if (existsSync(path.join(publicDir, src))) return tag;
        removedMissingImages += 1;
        return " ";
      })
      .replace(/<figure>\s*<\/figure>/gi, " ")
      .replace(/<h4\b[^>]*>([\s\S]*?)<\/h4>/gi, "<p><strong>$1</strong></p>");
    if (after !== before) {
      post.contentHtml = after;
      fileChanged += 1;
      changedPosts += 1;
    }
    if (post.sourceMetrics) {
      post.sourceMetrics.htmlBytes = Buffer.byteLength(post.contentHtml || "");
      post.sourceMetrics.imageCount = ((post.contentHtml || "").match(/<img\b/gi) || []).length;
    }
  }
  await writeFile(fullPath, `${JSON.stringify(posts, null, 2)}\n`, "utf8");
  console.log(`${file}: ${fileChanged}`);
}

console.log(`Changed posts: ${changedPosts}`);
console.log(`Removed missing content images: ${removedMissingImages}`);
console.log(`Removed missing hero images: ${removedMissingHeroImages}`);
