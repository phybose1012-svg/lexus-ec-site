import type { APIRoute } from "astro";
import { privateMedicalAdmissions2027Metadata } from "../data/privateMedicalAdmissions2027Metadata";

export const prerender = true;

export const GET: APIRoute = () => {
  const lines = [
    "# 医学部予備校 レクサス E.C.",
    "",
    "> 私立医学部受験に関する情報と、医学部専門予備校レクサス教育センターの公式サイトです。",
    "",
    "入試日程は大学公式サイト、公式募集要項、公式PDFおよび大学入試センターの公式資料を優先して確認しています。未公表事項は推測で補完しません。出願時は各大学の最新募集要項を確認してください。",
    "",
    "## 2027年度 私立医学部入試日程",
    "",
    `- [人が読む入試日程ページ](${privateMedicalAdmissions2027Metadata.canonicalUrl}): 全国31大学の一般選抜・共通テスト利用選抜を、出願締切、試験日、大学別、全日程で掲載しています。`,
    `- [機械可読JSONデータ](${privateMedicalAdmissions2027Metadata.datasetUrl}): ページと同一の正本から生成した日程、出典、状態、受験大学プランニング用データです。`,
    "- [サイトマップ](https://lexus-ec.com/sitemap.xml): 公開ページの一覧です。",
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
