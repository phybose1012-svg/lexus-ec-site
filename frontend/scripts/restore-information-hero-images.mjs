import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const siteOrigin = "https://lexus-ec.com";
const root = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const postsPath = path.join(root, "src", "data", "generated", "admissionInfoPosts.json");
const publicDir = path.join(root, "public");
const userAgent = "LEXUS-EC-static-migration/1.0";
const fetchTimeoutMs = 12_000;

function decodeHtmlEntities(value = "") {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number.parseInt(num, 10)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function stripTags(value = "") {
  return decodeHtmlEntities(value)
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function attr(tag, name) {
  return tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "i"))?.[1] || "";
}

function localAssetPath(urlValue = "") {
  try {
    const url = new URL(decodeHtmlEntities(urlValue), siteOrigin);
    if (url.origin !== siteOrigin || !url.pathname.startsWith("/wp-content/uploads/")) {
      return "";
    }
    return `/assets/legacy${decodeURI(url.pathname)}`;
  } catch {
    return "";
  }
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), fetchTimeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "user-agent": userAgent,
        ...(options.headers || {}),
      },
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchJson(url) {
  const response = await fetchWithTimeout(url, {
    headers: {
      accept: "application/json",
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

function firstContentImage(contentHtml = "") {
  const imageTags = [...contentHtml.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
  for (const tag of imageTags) {
    const src = attr(tag, "data-lazy-src") || attr(tag, "src");
    if (!src || src.startsWith("data:image")) continue;
    return {
      src,
      alt: stripTags(attr(tag, "alt")),
      width: Number(attr(tag, "width")) || undefined,
      height: Number(attr(tag, "height")) || undefined,
    };
  }
  return null;
}

function pickHeroImage(restPost) {
  const featuredMedia = restPost._embedded?.["wp:featuredmedia"]?.[0];
  if (featuredMedia?.source_url) {
    return {
      src: featuredMedia.source_url,
      alt: stripTags(featuredMedia.alt_text || featuredMedia.title?.rendered || ""),
      width: featuredMedia.media_details?.width,
      height: featuredMedia.media_details?.height,
    };
  }
  return firstContentImage(restPost.content?.rendered || "");
}

async function ensureLocalImage(remoteUrl, localPath) {
  const absolutePath = path.join(publicDir, localPath);
  if (existsSync(absolutePath)) return false;

  const response = await fetchWithTimeout(remoteUrl, {
    headers: {
      accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, Buffer.from(await response.arrayBuffer()));
  return true;
}

function repairKanazawaMedicalTable(post) {
  if (post.path !== "/information-kanazawaika/") return false;

  const before = post.contentHtml || "";
  const broken =
    '<h4 id="一般入試-後期-2">一般入試（後期）</h4><table><thead><tr><th colspan="2">1次試験</th></tr></thead><tbody><tr><td>外国語<br />英</td><td><p>100点・60分</p><p>数学 数ⅠⅡAB(列)C(べ) 100点・60分</p><table><thead><tr><th colspan="2">2次試験</th></tr></thead><tbody><tr><td>小論文</td><td>60点・60分</td></tr><tr><td>面接(グループ面接)</td><td>110点(調査書等含む)・1グループ約20分</td></tr></tbody></table>';
  const fixed =
    '<h4 id="一般入試-後期-2">一般入試（後期）</h4><table><thead><tr><th colspan="2">1次試験</th></tr></thead><tbody><tr><td>外国語<br />英</td><td>100点・60分</td></tr><tr><td>数学<br />数ⅠⅡAB(列)C(べ)</td><td>100点・60分</td></tr></tbody></table><table><thead><tr><th colspan="2">2次試験</th></tr></thead><tbody><tr><td>小論文</td><td>60点・60分</td></tr><tr><td>面接(グループ面接)</td><td>110点(調査書等含む)・1グループ約20分</td></tr></tbody></table>';

  post.contentHtml = before.replace(broken, fixed);
  if (post.contentHtml === before) return false;
  post.sourceMetrics.htmlBytes = Buffer.byteLength(post.contentHtml);
  return true;
}

const posts = JSON.parse(await readFile(postsPath, "utf8"));
const targets = posts.filter((post) => /^\/information-[^/]+\/$/.test(post.path || ""));

let heroUpdated = 0;
let downloaded = 0;
let repaired = 0;
const failures = [];

for (let index = 0; index < targets.length; index += 1) {
  const post = targets[index];

  if (repairKanazawaMedicalTable(post)) repaired += 1;

  try {
    const apiUrl = new URL(`/wp-json/wp/v2/posts/${post.id}`, siteOrigin);
    apiUrl.searchParams.set("_embed", "wp:featuredmedia");
    const restPost = await fetchJson(apiUrl.href);
    const image = pickHeroImage(restPost);
    const localPath = localAssetPath(image?.src || "");
    if (!image?.src || !localPath) {
      throw new Error("original hero image not found");
    }

    if (await ensureLocalImage(image.src, localPath)) downloaded += 1;

    const nextHeroImage = {
      src: localPath,
      alt: image.alt || `${post.title} 医学部入試情報`,
      ...(image.width ? { width: image.width } : {}),
      ...(image.height ? { height: image.height } : {}),
    };

    if (JSON.stringify(post.heroImage) !== JSON.stringify(nextHeroImage)) {
      post.heroImage = nextHeroImage;
      heroUpdated += 1;
    }
  } catch (error) {
    failures.push({
      path: post.path,
      id: post.id,
      message: error instanceof Error ? error.message : String(error),
    });
  }

  if ((index + 1) % 20 === 0) {
    console.log(`processed ${index + 1}/${targets.length}`);
  }
}

await writeFile(postsPath, `${JSON.stringify(posts, null, 2)}\n`, "utf8");

console.log(`information posts: ${targets.length}`);
console.log(`hero updated: ${heroUpdated}`);
console.log(`downloaded: ${downloaded}`);
console.log(`kanazawa repaired: ${repaired}`);
console.log(`failures: ${failures.length}`);
if (failures.length) console.log(JSON.stringify(failures, null, 2));
