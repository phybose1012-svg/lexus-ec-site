import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const publicDir = path.join(root, "public");
const files = [
  "src/data/generated/admissionInfoPosts.json",
  "src/data/generated/universityStrategyPosts.json",
  "src/data/generated/interviewPrepPosts.json",
  "src/data/generated/voiceInterviewPosts.json",
];

const posts = [];
for (const file of files) {
  posts.push(...JSON.parse(await readFile(path.join(root, file), "utf8")));
}

const refs = [];
const localRefs = [];
for (const post of posts) {
  const add = (src) => {
    if (!src?.startsWith("/")) return;
    localRefs.push({ path: post.path, src });
    if (src.startsWith("/assets/legacy/")) refs.push({ path: post.path, src });
  };
  add(post.heroImage?.src);
  for (const match of (post.contentHtml || "").matchAll(/src=["']([^"']+)["']/g)) add(match[1]);
}

const uniqueRefs = [...new Map(refs.map((ref) => [ref.src, ref])).values()];
const missing = uniqueRefs.filter((ref) => !existsSync(path.join(publicDir, ref.src)));
const uniqueLocalRefs = [...new Map(localRefs.map((ref) => [ref.src, ref])).values()];
const missingLocal = uniqueLocalRefs.filter((ref) => !existsSync(path.join(publicDir, ref.src)));

console.log(
  JSON.stringify(
    {
      posts: posts.length,
      localAssetRefs: uniqueLocalRefs.length,
      localMissing: missingLocal.length,
      localSample: missingLocal.slice(0, 20),
      legacyAssetRefs: uniqueRefs.length,
      missing: missing.length,
      sample: missing.slice(0, 20),
    },
    null,
    2,
  ),
);
