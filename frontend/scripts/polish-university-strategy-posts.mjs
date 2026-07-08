import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const publicDir = path.join(root, "public");
const dataPath = path.join(root, "src", "data", "generated", "universityStrategyPosts.json");

const posts = JSON.parse(await readFile(dataPath, "utf8"));

function stripTags(value = "") {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeLegacyAssetReference(assetPath = "") {
  try {
    return `/assets/legacy${decodeURI(assetPath)}`;
  } catch {
    return `/assets/legacy${assetPath}`;
  }
}

function normalizeUploadUrl(value = "") {
  try {
    const url = new URL(value);
    if (url.hostname === "lexus-ec.com" && url.pathname.startsWith("/wp-content/uploads/")) {
      return normalizeLegacyAssetReference(url.pathname);
    }
  } catch {
    if (value.startsWith("/wp-content/uploads/")) return normalizeLegacyAssetReference(value);
  }
  return value;
}

function tidyArticleBody(html = "") {
  let output = html;

  output = output
    .replace(/<p>\s*◇◆◇\s*他の大学情報も見る\s*◇◆◇\s*<\/p>[\s\S]*$/i, " ")
    .replace(/<article\b[\s\S]*?<\/article>/gi, " ")
    .replace(/<a\b([^>]*)>\s*Read More\s*»\s*<\/a>/gi, " ")
    .replace(/<a\b([^>]*)>\s*続きを読む\s*<\/a>/gi, " ")
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, " ")
    .replace(/<video\b[\s\S]*?<\/video>/gi, " ")
    .replace(/<button\b[\s\S]*?<\/button>/gi, " ")
    .replace(/<\/?div\b[^>]*>/gi, " ")
    .replace(/<\/?span\b[^>]*>/gi, "")
    .replace(/\s(?:class|data-[\w:-]+|role|tabindex|aria-[\w:-]+|style|onclick|onload)=["'][^"']*["']/gi, "")
    .replace(/href=["']https:\/\/lexus-ec\.com([^"']*)["']/gi, (_match, href) => `href="${href}"`)
    .replace(/href=["']http:\/\/lexus-ec\.com([^"']*)["']/gi, (_match, href) => `href="${href}"`)
    .replace(/src=["']https?:\/\/lexus-ec\.com\/wp-content\/uploads\/([^"']+)["']/gi, (_match, assetPath) => {
      const localSrc = normalizeLegacyAssetReference(`/wp-content/uploads/${assetPath}`);
      return `src="${localSrc}"`;
    })
    .replace(/<img\b[^>]*?src=["']([^"']+)["'][^>]*>/gi, (tag, src) => {
      const normalizedSrc = normalizeUploadUrl(src);
      if (/^https?:\/\//i.test(normalizedSrc)) return " ";
      if (normalizedSrc.startsWith("/assets/legacy/") && !existsSync(path.join(publicDir, normalizedSrc))) return " ";
      const alt = tag.match(/\salt=["'][^"']*["']/i)?.[0] || ' alt=""';
      const width = tag.match(/\swidth=["'][^"']*["']/i)?.[0] || "";
      const height = tag.match(/\sheight=["'][^"']*["']/i)?.[0] || "";
      return `<img${width}${height} src="${normalizedSrc}"${alt} loading="lazy" decoding="async">`;
    })
    .replace(/<h([2-4])\b([^>]*)>\s*(?:🗓️|🏫|🧪|🔗)\s*/g, "<h$1$2>")
    .replace(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi, (match, inner) => {
      const text = stripTags(inner);
      if (text.includes("レクサス教育センター") && text.includes("入試情報")) return " ";
      return match;
    })
    .replace(/<p>\s*<\/p>/gi, " ")
    .replace(/<figure>\s*<\/figure>/gi, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  return output;
}

function splitDisplayTitle(post) {
  const title = post.title || post.displayTitle || "";
  if (post.path === "/seimarianna-med-eng-strategy/") {
    return ["2026年度", "聖マリアンナ医科大学 医学部", "一般選抜（後期）の傾向と対策"];
  }
  if (post.path === "/kanazawa-med-eng-strategy/") {
    return ["2026年度", "金沢医科大学 医学部", "一般選抜（後期）の傾向と対策"];
  }

  const match = title.match(/^(20\d{2})年度?\s+(.+?)\s+医学部.*?(一般選抜(?:（[^）]+）)?).*?(?:傾向と対策|対策)/);
  if (match) return [`${match[1]}年度`, `${match[2].trim()} 医学部`, `${match[3]}の傾向と対策`];
  return post.displayTitleLines?.length ? post.displayTitleLines : [post.displayTitle || title];
}

function appendScheduleFallback(post) {
  const plainLength = stripTags(post.contentHtml || "").length;
  if (plainLength >= 300) return false;
  if (!/日程・会場/.test(post.displayTitle || post.title || "")) return false;
  const officialLinks = [...(post.contentHtml || "").matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map((match) => ({ href: match[1], label: stripTags(match[2]) || match[1] }))
    .filter((item, index, list) => item.href && list.findIndex((other) => other.href === item.href) === index)
    .slice(0, 3);
  const officialList = officialLinks.length
    ? `<ul>${officialLinks.map((item) => `<li><a href="${item.href}">${item.label}</a></li>`).join("")}</ul>`
    : "<p>最新の出願期間・試験日・会場は、必ず大学公式サイトと募集要項で確認してください。</p>";
  post.contentHtml = `${post.contentHtml}
<h2 id="確認ポイント">確認ポイント</h2>
<p>日程・会場系の記事は、年度ごとの変更が起こりやすいページです。受験校の候補に入れる場合は、出願前に一次試験日、二次試験日、試験会場、集合時刻、持参物を公式資料で照合してください。</p>
<h3 id="出願前に見るべき項目">出願前に見るべき項目</h3>
<ul><li>出願期間と書類必着日</li><li>一次試験と二次試験の会場</li><li>英語・数学・理科・小論文・面接の配点と試験時間</li><li>合格発表日と入学手続きの締切</li></ul>
<h3 id="公式情報">公式情報</h3>
${officialList}`.trim();
  post.toc = [
    ...(post.toc || []),
    { id: "確認ポイント", text: "確認ポイント", level: 2 },
    { id: "出願前に見るべき項目", text: "出願前に見るべき項目", level: 3 },
    { id: "公式情報", text: "公式情報", level: 3 },
  ];
  return true;
}

function appendStrategyFallback(post) {
  const plain = stripTags(post.contentHtml || "");
  if (plain.length >= 1200) return false;
  if (/日程・会場/.test(post.displayTitle || post.title || "")) return false;
  if ((post.contentHtml || "").includes('id="対策ポイント"')) return false;

  const universityName = post.displayTitleLines?.[1]?.replace(/\s*医学部\s*$/, "") || "志望大学";
  post.contentHtml = `${post.contentHtml}
<h2 id="対策ポイント">${universityName}を受ける前に固めたい対策ポイント</h2>
<p>大学別対策では、出願日程や配点を確認するだけでなく、どの科目で得点を安定させ、どの科目で失点を抑えるかを先に決めることが重要です。ここでは、医学部受験生が直前期までに確認しておきたい共通の観点を整理します。</p>
<h3 id="英語の対策">英語の対策</h3>
<p>英語は、長文読解の処理速度と設問形式への慣れが得点差になりやすい科目です。過去問演習では、正答数だけでなく、本文を読む時間、設問に戻る回数、根拠を拾う精度まで記録し、時間内に解き切る型を作ってください。</p>
<h3 id="数学の対策">数学の対策</h3>
<p>数学は、難問を追いすぎるよりも、標準問題を落とさない完成度が合否を左右します。頻出分野の典型解法を整理し、計算量が多い問題でも途中式を崩さず、部分点を残せる答案づくりを徹底しましょう。</p>
<h3 id="理科の対策">理科の対策</h3>
<p>理科は二科目の完成度をそろえることが大切です。知識確認で止めず、公式・反応式・実験考察を実際の問題で使える状態まで引き上げてください。片方の科目だけに偏ると、総合点が安定しにくくなります。</p>
<h3 id="面接と小論文の対策">面接・小論文の対策</h3>
<p>医学部の面接や小論文では、志望理由、医師像、高校生活、地域医療への理解などを、自分の言葉で説明できる状態にしておく必要があります。出願書類と回答内容にズレが出ないよう、早めに言語化しておきましょう。</p>
<h3 id="直前期の確認">直前期の確認</h3>
<p>最終判断では、大学公式サイトの募集要項で、試験日、会場、配点、出願書類、合格発表日を必ず確認してください。そのうえで、残り時間を「得点源の維持」と「失点パターンの修正」に分けて使うと、直前期の学習密度が上がります。</p>`.trim();

  post.toc = [
    ...(post.toc || []),
    { id: "対策ポイント", text: `${universityName}を受ける前に固めたい対策ポイント`, level: 2 },
    { id: "英語の対策", text: "英語の対策", level: 3 },
    { id: "数学の対策", text: "数学の対策", level: 3 },
    { id: "理科の対策", text: "理科の対策", level: 3 },
    { id: "面接と小論文の対策", text: "面接・小論文の対策", level: 3 },
    { id: "直前期の確認", text: "直前期の確認", level: 3 },
  ].slice(0, 22);

  return true;
}

let changed = 0;
let fallbackAdded = 0;
let strategyFallbackAdded = 0;

for (const post of posts) {
  const before = JSON.stringify(post);
  post.heroBadge = "入試対策";
  post.heroMessageLines = ["君ならできる。", "最後まで自分を信じて走り抜け。"];
  post.heroMessage = post.heroMessageLines.join("\n");
  post.displayTitleLines = splitDisplayTitle(post);
  post.displayTitle = post.displayTitleLines.join(" ");
  post.contentHtml = tidyArticleBody(post.contentHtml || "");
  if (appendScheduleFallback(post)) fallbackAdded += 1;
  if (appendStrategyFallback(post)) strategyFallbackAdded += 1;

  if (post.sourceMetrics) {
    post.sourceMetrics.htmlBytes = Buffer.byteLength(post.contentHtml || "");
    post.sourceMetrics.imageCount = ((post.contentHtml || "").match(/<img\b/gi) || []).length;
    post.sourceMetrics.tocCount = post.toc?.length || 0;
  }

  if (JSON.stringify(post) !== before) changed += 1;
}

await writeFile(dataPath, `${JSON.stringify(posts, null, 2)}\n`, "utf8");

console.log(`Polished posts: ${changed}`);
console.log(`Schedule fallbacks added: ${fallbackAdded}`);
console.log(`Strategy fallbacks added: ${strategyFallbackAdded}`);
