import admissionData from "../data/privateMedicalAdmissions2026.json";
import type { MigratedPost } from "./postSource";

type UniversityOverview = {
  category: string;
  facts: string[][];
  officialUrl: string;
  sources: { label: string; url: string }[];
  statistics: Record<string, { value: string; title?: string }>;
};

const overviews: Readonly<Record<string, UniversityOverview | undefined>> = admissionData;
const overviewSections = /<h2\b[^>]*>[\s\S]*?<\/h2>[\s\S]*?(?=<h2\b|$)/gi;
const legacyStatistics = /(<h3\b[^>]*\bid=["']((?:男女比|現浪比|年齢比)-2024年度[^"']*)["'][^>]*>)([\s\S]*?)(<\/h3>)[\s\S]*?(?=<h[23]\b|$)/g;
const headingText = (value: string) => value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char);

export function hasPrivateMedicalUniversityOverview(path: string): boolean {
  return Object.hasOwn(overviews, path);
}

export function privateMedicalUniversityOverview(post: MigratedPost): MigratedPost | undefined {
  const data = overviews[post.path];
  if (!data || post.template !== "admission-info") return;

  const currentAdmissions = '<h2 id="最新の入試情報">最新の入試情報を確認する</h2>' +
    '<h3>2026年度の入試結果・実施概要</h3>' +
    '<p>' + escapeHtml(data.category) + '</p>' +
    '<ul>' + data.facts.map(([label, value]) =>
      '<li>' + escapeHtml(label) + '：' + escapeHtml(value) + '</li>').join("") + '</ul>' +
    data.sources.map(({ label, url }) =>
      '<p><a href="' + escapeHtml(url) + '">' + escapeHtml(label) + '（大学公式）</a></p>').join("") +
    '<p>これから受験する方は、受験する年度の出願日程・試験科目を大学公式サイトでご確認ください。</p>' +
    '<p><a href="' + escapeHtml(data.officialUrl) + '">大学公式サイトで最新の入試情報を見る</a></p>';

  const contentHtml = post.contentHtml
    .replace(overviewSections, (block) => {
      const title = headingText(block.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i)?.[1] ?? "");
      if (title === "一般選抜情報" || title === "一次選抜情報") return currentAdmissions;
      if (title === "募集要項") return "";
      return block;
    })
    .replace(legacyStatistics, (_, opening: string, id: string, title: string, closing: string) => {
      const statistic = data.statistics[id];
      const updatedTitle = statistic?.title
        ? escapeHtml(statistic.title)
        : title.replace("2024年度", "2026年度");
      const body = statistic
        ? escapeHtml(statistic.value)
        : "2026年度の内訳は、大学の公表資料で確認できません。";
      return opening + updatedTitle + closing + "<p>" + body + "</p>";
    })
    .replace(/<h3\b([^>]*)>([\s\S]*?)<\/h3>/gi, (heading, attrs: string, text: string) =>
      headingText(text) === "学納金" ? '<h3' + attrs + '>学納金（掲載時点の参考情報）</h3>' : heading)
    .replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (link, href: string, text: string) => {
      const oldJuntendoSyllabus = post.path === "/information-jyunten/" &&
        href.startsWith("https://med.juntendo.ac.jp/syllabus/") && href.includes("2024");
      const wrongPortal = post.path === "/information-tokai/" && href.includes("juntendo.ac.jp");
      if (oldJuntendoSyllabus) {
        return '<a href="https://med.juntendo.ac.jp/syllabus/">順天堂大学のシラバス</a>';
      }
      if (post.path === "/information-dokkyo/" && href.startsWith("https://dept.dokkyomed.ac.jp/dep-m/syllabus/2024/")) {
        return '<a href="https://dept.dokkyomed.ac.jp/dep-m/syllabus/2026/plan/index.html">' +
          escapeHtml(headingText(text)) + '</a>';
      }
      return wrongPortal ? headingText(text) : link;
    });

  const toc = [...contentHtml.matchAll(/<h([23])\b[^>]*id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/h\1>/gi)]
    .map((match) => ({
      id: match[2],
      text: headingText(match[3]),
      level: Number(match[1]) as 2 | 3,
    }));

  return {
    ...post,
    description: post.title + "医学部の大学基本情報と2026年度入試の結果をご紹介します。",
    keyPoints: [
      "所在地や学納金など、医学部の基本情報を確認できます。",
      "2026年度の結果を振り返り、これからの出願日程は大学公式サイトで確認できます。",
    ],
    contentHtml,
    toc,
  };
}
