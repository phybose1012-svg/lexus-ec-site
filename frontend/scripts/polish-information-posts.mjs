import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const postsPath = path.join(root, "src", "data", "generated", "admissionInfoPosts.json");

const replacements = [
  {
    path: "/information-jyoshiika/",
    pattern:
      /<p><a href="https:\/\/www\.twmu\.ac\.jp\/img\/medical\/curriculum_tree20241120\.pdf" target="_blank" rel="noopener"><img src="https:\/\/www\.twmu\.ac\.jp\/img\/medical\/curriculum_tree20241120\.jpg"[^>]*><\/a><\/p>/g,
    replacement:
      '<p>カリキュラムツリーは【<a href="https://www.twmu.ac.jp/img/medical/curriculum_tree20241120.pdf" target="_blank" rel="noopener">東京女子医科大学公式PDF</a>】で確認できます。</p>',
  },
  {
    path: "/information-showa/",
    pattern: /<p><img src="https:\/\/www\.showa-u\.ac\.jp\/albums\/211\/abm00052119\.jpg"[^>]*><\/p>/g,
    replacement:
      '<p>履修系統図は【<a href="https://www.showa-u.ac.jp/albums/211/abm00052119.jpg" target="_blank" rel="noopener">昭和大学公式資料</a>】で確認できます。</p>',
  },
  {
    path: "/information-kitasato/",
    pattern: /<p><img title="カリキュラム" src="https:\/\/www\.kitasato-u\.ac\.jp\/med\/albums\/abm00014578\.svg" alt="カリキュラム"><\/p>/g,
    replacement:
      '<p>カリキュラム図は【<a href="https://www.kitasato-u.ac.jp/med/albums/abm00014578.svg" target="_blank" rel="noopener">北里大学公式資料</a>】で確認できます。</p>',
  },
];

const posts = JSON.parse(await readFile(postsPath, "utf8"));
const changed = [];

for (const post of posts) {
  const rules = replacements.filter((rule) => rule.path === post.path);
  if (!rules.length) continue;

  let contentHtml = post.contentHtml || "";
  const before = contentHtml;

  for (const rule of rules) {
    contentHtml = contentHtml.replace(rule.pattern, rule.replacement);
  }

  if (contentHtml === before) continue;

  post.contentHtml = contentHtml;
  if (post.sourceMetrics) {
    post.sourceMetrics.htmlBytes = Buffer.byteLength(contentHtml);
    post.sourceMetrics.imageCount = (contentHtml.match(/<img\b/gi) || []).length;
  }
  changed.push(post.path);
}

await writeFile(postsPath, `${JSON.stringify(posts, null, 2)}\n`, "utf8");

console.log(`changed: ${changed.length}`);
for (const pathValue of changed) console.log(pathValue);
