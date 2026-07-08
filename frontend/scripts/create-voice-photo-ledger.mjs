import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const workspace = path.resolve(root, "..");
const postsPath = path.join(root, "src", "data", "generated", "voiceInterviewPosts.json");
const reportDir = path.join(workspace, "reports");
const docsDir = path.join(workspace, "docs");
const jsonPath = path.join(reportDir, "voice-interview-photo-ledger.json");
const mdPath = path.join(docsDir, "voice-interview-photo-ledger.md");

const posts = JSON.parse(await readFile(postsPath, "utf8"));

const stripTags = (value = "") =>
  value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8230;/g, "...")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

const firstProfileText = (post) => {
  const paragraph = post.contentHtml?.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1] || "";
  return stripTags(paragraph).slice(0, 140);
};

const statusFor = (post) => {
  if (!post.heroImage) return "needs-photo-check";
  return "has-source-photo";
};

const reasonFor = (post) => {
  if (!post.heroImage) {
    return "本文範囲に本人写真候補なし。汎用バナーまたは関連記事側の人物写真は誤掲載防止のため採用しない。";
  }
  return "本文範囲内の画像を採用。人物・記事内容との一致は目視確認推奨。";
};

const actionFor = (post) => {
  if (!post.heroImage) {
    return "元WordPressメディア、旧制作データ、合格者インタビュー一覧、手元写真素材を確認。本人写真が見つかれば heroImage に差し替え。見つからない場合は写真なしで公開、または共通VOICEビジュアルを別途作成。";
  }
  return "公開前に記事タイトル・本文プロフィールと写真が一致するか目視確認。";
};

const rows = posts
  .map((post) => ({
    path: post.path,
    sourceUrl: post.url,
    localUrl: `http://localhost:4321${post.path}`,
    title: post.title,
    displayTitle: post.displayTitleLines?.join(" / ") || post.displayTitle || post.title,
    university: post.infoItems?.find((item) => item.label === "大学")?.value || "",
    profile: firstProfileText(post),
    heroImage: post.heroImage?.src || "",
    status: statusFor(post),
    reason: reasonFor(post),
    action: actionFor(post),
  }))
  .sort((a, b) => {
    if (a.status !== b.status) return a.status === "needs-photo-check" ? -1 : 1;
    return a.path.localeCompare(b.path);
  });

const needsPhotoCheck = rows.filter((row) => row.status === "needs-photo-check");
const hasSourcePhoto = rows.filter((row) => row.status === "has-source-photo");

const report = {
  generatedAt: new Date().toISOString(),
  total: rows.length,
  needsPhotoCheck: needsPhotoCheck.length,
  hasSourcePhoto: hasSourcePhoto.length,
  rows,
};

await mkdir(reportDir, { recursive: true });
await mkdir(docsDir, { recursive: true });
await writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

const escapeCell = (value = "") => String(value).replace(/\|/g, " / ").replace(/\n/g, " ");
const md = [
  "# 合格者インタビュー 写真欠損・差し替え台帳",
  "",
  `生成日時: ${report.generatedAt}`,
  "",
  "## Summary",
  "",
  `- 対象: voice-interview ${report.total}件`,
  `- 写真欠損・要手動確認: ${report.needsPhotoCheck}件`,
  `- 本文由来写真あり・目視確認推奨: ${report.hasSourcePhoto}件`,
  "",
  "## 写真欠損・要手動確認",
  "",
  "| Path | 記事タイトル | 大学 | プロフィール抜粋 | 対応方針 |",
  "| --- | --- | --- | --- | --- |",
  ...needsPhotoCheck.map(
    (row) =>
      `| ${escapeCell(row.path)} | ${escapeCell(row.title)} | ${escapeCell(row.university)} | ${escapeCell(
        row.profile,
      )} | ${escapeCell(row.action)} |`,
  ),
  "",
  "## 本文由来写真あり・目視確認推奨",
  "",
  "| Path | 記事タイトル | Hero image | 確認事項 |",
  "| --- | --- | --- | --- |",
  ...hasSourcePhoto.map(
    (row) => `| ${escapeCell(row.path)} | ${escapeCell(row.title)} | ${escapeCell(row.heroImage)} | ${escapeCell(row.action)} |`,
  ),
  "",
];

await writeFile(mdPath, `${md.join("\n")}\n`, "utf8");
console.log(
  JSON.stringify(
    {
      total: report.total,
      needsPhotoCheck: report.needsPhotoCheck,
      hasSourcePhoto: report.hasSourcePhoto,
      jsonPath,
      mdPath,
    },
    null,
    2,
  ),
);
