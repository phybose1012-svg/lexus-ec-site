import admissionData from "../data/privateMedicalAdmissions2026.json";
import type { MigratedPost } from "./postSource";

type UniversityOverview = {
  category: string;
  facts: string[][];
  officialUrl: string;
  sections: Record<string, OverviewSection>;
  intro?: string;
  textCorrections?: { original: string; updated: string }[];
  sources: { label: string; url: string }[];
  statistics: Record<string, { value: string; title?: string }>;
};

const overviews: Readonly<Record<string, UniversityOverview | undefined>> = admissionData;
const overviewSections = /<h2\b[^>]*>[\s\S]*?<\/h2>[\s\S]*?(?=<h2\b|$)/gi;
const legacyStatistics = /(<h3\b[^>]*\bid=["']((?:男女比|現浪比|年齢比)-2024年度[^"']*)["'][^>]*>)([\s\S]*?)(<\/h3>)[\s\S]*?(?=<h[23]\b|$)/g;
const headingText = (value: string) => value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char);

type OverviewSection = {
  paragraphs: string[];
  links: { label: string; url: string }[];
};

const basicSections = /(<h3\b[^>]*\bid=["']([^"']+)["'][^>]*>[\s\S]*?<\/h3>)[\s\S]*?(?=<h[23]\b|$)/g;
const renderSection = ({ paragraphs, links }: OverviewSection) =>
  paragraphs.map((text) => '<p>' + escapeHtml(text) + '</p>').join("") +
  links.map(({ label, url }) =>
    '<p><a href="' + escapeHtml(url) + '">' + escapeHtml(label) + '</a></p>').join("");

export function hasPrivateMedicalUniversityOverview(path: string): boolean {
  return Object.hasOwn(overviews, path);
}

export function privateMedicalUniversityOverview(post: MigratedPost): MigratedPost | undefined {
  const data = overviews[post.path];
  if (!data || post.template !== "admission-info") return;

  const currentAdmissions = '<h2 id="最新の入試情報">最新の入試情報を確認する</h2>' +
    '<h3>2026年度の入試結果・実施概要（実施済み）</h3>' +
    '<p>' + escapeHtml(data.category) + '</p>' +
    '<ul>' + data.facts.map(([label, value]) =>
      '<li>' + escapeHtml(label) + '：' + escapeHtml(value) + '</li>').join("") + '</ul>' +
    data.sources.map(({ label, url }) =>
      '<p><a href="' + escapeHtml(url) + '">' + escapeHtml(label) + '（大学公式）</a></p>').join("") +
    '<p>出願前に、大学公式サイトで最新の出願日程・試験科目・募集要項をご確認ください。</p>' +
    '<p><a href="' + escapeHtml(data.officialUrl) + '">大学公式サイトで最新の入試情報を見る</a></p>';

  let contentHtml = post.contentHtml
    .replace(overviewSections, (block) => {
      const title = headingText(block.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i)?.[1] ?? "");
      if (title === "一般選抜情報" || title === "一次選抜情報") return currentAdmissions;
      if (title === "募集要項") return "";
      if (title === "大学の魅力") {
        return block.replace(/(<h2\b[^>]*>)[\s\S]*?<\/h2>/i, "$1大学生の声（大学の魅力）</h2>");
      }
      if (title === "大学基本情報" && !block.includes('id="学納金"')) {
        return block + "<h3>学納金</h3>" + renderSection(data.sections["学納金"]);
      }
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
    .replace(basicSections, (block, heading: string, id: string) => {
      const section = data.sections[id];
      return section ? heading + renderSection(section) : block;
    });

  for (const { original, updated } of data.textCorrections ?? []) {
    contentHtml = contentHtml.replace(original, escapeHtml(updated));
  }

  const toc = [...contentHtml.matchAll(/<h([23])\b[^>]*id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/h\1>/gi)]
    .map((match) => ({
      id: match[2],
      text: headingText(match[3]),
      level: Number(match[1]) as 2 | 3,
    }));

  return {
    ...post,
    lead: data.intro ?? post.lead,
    description: post.title + "医学部の大学基本情報と2026年度入試の結果をご紹介します。",
    contentHtml,
    toc,
  };
}
