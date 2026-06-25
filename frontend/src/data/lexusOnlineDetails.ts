export const lexusOnlineContactHref =
  "mailto:info@lexus-ec.com?subject=Lexus%20Online%E3%81%B8%E3%81%AE%E7%9B%B8%E8%AB%87";

export const lexusOnlineDetailPages = [
  {
    label: "開発ポリシー詳細",
    href: "/lexus-online/policy/",
    summary: "共有スライドの思想を、実際の開発判断に落とし込んだページ。",
  },
  {
    label: "アプリケーション開発の流れ",
    href: "/lexus-online/development-flow/",
    summary: "診断、MVP、導入、改善、保守までの具体的な進め方。",
  },
  {
    label: "相談・申し込みの流れ",
    href: "/lexus-online/application-flow/",
    summary: "初回相談から見積もり、契約、着手までの準備事項。",
  },
  {
    label: "問い合わせフォーム",
    href: "/lexus-online/contact/",
    summary: "教育業務システム、AI業務改善、SaaS化の相談窓口。",
  },
];

export const lexusOnlineOpenItems = [
  "公開可能な導入実績、事例名、画面例、利用者数",
  "正式な提供プラン名、月額保守の最終価格、支払い条件",
  "保守範囲に含める障害対応時間、SLA、セキュリティ監査の有無",
  "個人情報、成績情報、答案画像、保護者連絡履歴の保存方針",
  "AIに渡してよい情報と、AIに渡さない情報の社内ルール",
  "既存システム、Google Workspace、LINE、決済、会計ツールとの連携要件",
  "問い合わせフォームの本番送信先、通知先、個人情報同意文",
  "契約書、利用規約、秘密保持契約、再委託可否の扱い",
];

export const detailPageJsonLdBase = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Lexus Online",
  provider: {
    "@type": "EducationalOrganization",
    name: "レクサス教育センター",
    url: "https://lexus-ec.com/",
  },
  areaServed: "JP",
};
