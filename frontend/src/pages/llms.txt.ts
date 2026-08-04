import type { APIRoute } from "astro";
import { privateMedicalAdmissions2027Metadata } from "../data/privateMedicalAdmissions2027Metadata";
import { privateMedicalSpecialAdmissions2027Metadata } from "../data/privateMedicalSpecialAdmissions2027Metadata";

export const prerender = true;

export const GET: APIRoute = () => {
  const lines = [
    "# 医学部予備校 レクサス E.C.",
    "",
    "> 私立医学部受験に関する情報と、医学部専門予備校レクサス教育センターの公式サイトです。",
    "",
    "入試日程は大学公式サイト、公式募集要項、公式PDFおよび大学入試センターの公式資料を優先して確認しています。未公表事項は推測で補完しません。出願時は各大学の最新募集要項を確認してください。",
    "",
    "## 2027年度 私立医学部 一般選抜・共通テスト利用選抜",
    "",
    `- [一般選抜・共通テスト利用選抜の日程ページ](${privateMedicalAdmissions2027Metadata.canonicalUrl}): 全国31大学の一般選抜・共通テスト利用選抜を、出願締切、試験日、大学別、全日程で掲載しています。`,
    `- [一般選抜・共通テスト利用選抜のJSONデータ](${privateMedicalAdmissions2027Metadata.datasetUrl}): ページと同一の正本から生成した日程、出典、状態、受験大学プランニング用データです。`,
    "",
    "## 2027年度 私立医学部 総合型・学校推薦型選抜等",
    "",
    `- [総合型・学校推薦型選抜等の日程ページ](${privateMedicalSpecialAdmissions2027Metadata.canonicalUrl}): 全国31大学について、総合型・学校推薦型・地域枠・帰国生・IBなど、一般選抜・通常の共通テスト利用選抜以外の日程と出願条件を掲載しています。`,
    `- [総合型・学校推薦型選抜等のJSONデータ](${privateMedicalSpecialAdmissions2027Metadata.datasetUrl}): ページと同一の正本から生成した方式、出願資格、日程、出典、公表状況のデータです。`,
    "",
    "- [サイトマップ](https://lexus-ec.com/sitemap.xml): 公開ページの一覧です。",
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
