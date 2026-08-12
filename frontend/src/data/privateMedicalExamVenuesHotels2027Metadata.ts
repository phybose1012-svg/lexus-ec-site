export const privateMedicalExamVenuesHotels2027Metadata = {
  name: "2027年度 私立医学部入試会場・周辺ホテルデータ",
  title: "【2027年度】私立医学部の入試会場・周辺ホテル一覧｜31大学の受験宿泊ガイド",
  description:
    "2027年度私立医学部31大学の一般選抜・共通テスト利用選抜について、一次・二次試験の会場と周辺の宿泊施設を大学別・会場別に案内。会場までのアクセス、ホテル選びの注意点、公式情報を確認できます。",
  canonicalUrl: "https://lexus-ec.com/private-medical-school-exam-venues-hotels-2027/",
  datasetUrl: "https://lexus-ec.com/data/private-medical-exam-venues-hotels-2027.json",
  datasetIdentifier:
    "https://lexus-ec.com/private-medical-school-exam-venues-hotels-2027/#dataset",
  academicYear: 2027,
  language: "ja",
  datePublished: "2026-08-12",
  dateModified: "2026-08-12",
  dateModifiedLabel: "2026年8月12日",
  version: "2026-08-12",
  publisher: {
    name: "医学部予備校 レクサス E.C.",
    alternateName: "レクサス教育センター",
    url: "https://lexus-ec.com/",
  },
} as const;

export const privateMedicalExamVenuesHotels2027FieldDefinitions = [
  { key: "venueId", label: "会場ID", description: "名称変更の影響を受けにくい固有会場の安定ID" },
  { key: "routeId", label: "方式ID", description: "中央ナレッジDBと共有する大学・年度・方式の安定ID" },
  { key: "examStage", label: "試験段階", description: "一次試験、二次試験、面接等の区分" },
  { key: "publicationState", label: "公表状態", description: "正式会場、都市・キャンパスのみ、受験票指定、未公表、確認中の区分" },
  { key: "conditions", label: "会場条件", description: "固定、希望、大学指定、受験票指定、定員超過変更の条件" },
  { key: "hotelId", label: "ホテルID", description: "宿泊施設の安定ID" },
  { key: "venueAccess", label: "会場アクセス", description: "宿泊施設から会場までの主な経路と注意事項" },
  { key: "sources", label: "公式根拠", description: "大学・会場施設・ホテル・交通機関の公式URL" },
] as const;
