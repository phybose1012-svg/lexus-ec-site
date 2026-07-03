import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const siteOrigin = "https://lexus-ec.com";
const root = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const workspace = path.resolve(root, "..");
const publicDir = path.join(root, "public");
const sourcePath = "frontend/src/data/generated/voiceInterviewPosts.json";

const decodeEntityMap = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeEntities(value = "") {
  return String(value)
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number.parseInt(num, 10)))
    .replace(/&([a-z]+);/gi, (_, name) => decodeEntityMap[name] ?? `&${name};`);
}

function localPathFor(value = "") {
  if (!value) return null;
  const decoded = decodeEntities(value).trim();
  try {
    const url = new URL(decoded, siteOrigin);
    if (url.origin !== siteOrigin) return null;
    if (!/\.(?:jpe?g|png|webp|gif|avif)$/i.test(url.pathname)) return null;
    if (url.pathname.startsWith("/wp-content/uploads/")) return `/assets/legacy${decodeURI(url.pathname)}`;
    return decodeURI(url.pathname);
  } catch {
    if (!decoded.startsWith("/")) return null;
    if (!/\.(?:jpe?g|png|webp|gif|avif)$/i.test(decoded)) return null;
    return decoded.startsWith("/wp-content/uploads/") ? `/assets/legacy${decodeURI(decoded)}` : decodeURI(decoded);
  }
}

function remoteUrlFor(localPath = "") {
  if (localPath.startsWith("/assets/legacy/wp-content/uploads/")) {
    return `${siteOrigin}${encodeURI(localPath.replace(/^\/assets\/legacy/, ""))}`;
  }
  return `${siteOrigin}${encodeURI(localPath)}`;
}

function imageRefsFromPost(post) {
  const refs = [];
  const add = (src) => {
    const localPath = localPathFor(src);
    if (localPath) refs.push({ path: post.path, src, localPath, remoteUrl: remoteUrlFor(localPath) });
  };

  add(post.heroImage?.src);
  for (const match of (post.contentHtml || "").matchAll(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi)) {
    add(match[1]);
  }
  return refs;
}

const baselineRaw = execFileSync("git", ["show", `HEAD:${sourcePath}`], {
  cwd: workspace,
  encoding: "utf8",
  maxBuffer: 16 * 1024 * 1024,
});
const baselinePosts = JSON.parse(baselineRaw);
const allRefs = baselinePosts.flatMap(imageRefsFromPost);
const uniqueRefs = [...new Map(allRefs.map((ref) => [ref.localPath, ref])).values()];
const missingRefs = uniqueRefs.filter((ref) => !existsSync(path.join(publicDir, ref.localPath)));

let downloaded = 0;
const failures = [];

for (const [index, ref] of missingRefs.entries()) {
  try {
    const response = await fetch(ref.remoteUrl, {
      headers: { "user-agent": "LEXUS-EC-static-migration/1.0" },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) throw new Error(`Unexpected content-type ${contentType || "unknown"}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    const targetPath = path.join(publicDir, ref.localPath);
    await mkdir(path.dirname(targetPath), { recursive: true });
    await writeFile(targetPath, bytes);
    downloaded += 1;
    console.log(`[${index + 1}/${missingRefs.length}] ${ref.localPath}`);
  } catch (error) {
    failures.push({ ...ref, message: error.message });
    console.error(`[failed] ${ref.remoteUrl}: ${error.message}`);
  }
}

console.log(
  JSON.stringify(
    {
      refs: uniqueRefs.length,
      alreadyPresent: uniqueRefs.length - missingRefs.length,
      attempted: missingRefs.length,
      downloaded,
      failures: failures.length,
      failureSample: failures.slice(0, 20),
    },
    null,
    2,
  ),
);

if (failures.length > 0) process.exitCode = 1;
