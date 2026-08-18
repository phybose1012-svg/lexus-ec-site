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
  dateModified: "2026-08-18",
  dateModifiedLabel: "2026年8月18日",
  version: "2026-08-18",
  publisher: {
    name: "医学部予備校 レクサス E.C.",
    alternateName: "レクサス教育センター",
    url: "https://lexus-ec.com/",
  },
} as const;

export const privateMedicalExamVenuesHotels2027FieldDefinitions = [
  { key: "venueId", label: "会場ID", description: "名称変更の影響を受けにくい固有会場の安定ID" },
  { key: "routeId", label: "方式ID", description: "日程データと会場データの間で共有する大学・年度・方式の安定ID" },
  { key: "examStage", label: "試験段階", description: "一次試験、二次試験、面接等の区分" },
  { key: "announcedPrefectures", label: "公表済み会場都道府県", description: "正式施設が未公表の場合も含む、大学が試験地として公表した都道府県" },
  { key: "venueLinks", label: "会場との対応", description: "方式・試験段階と会場を結ぶ関係。必要に応じて適用都道府県・試験区分・試験日を含む" },
  { key: "publicationState", label: "公表状態", description: "正式会場、都市・キャンパスのみ、受験票指定、未公表、確認中の区分" },
  { key: "conditions", label: "指定・選択条件", description: "試験地・受験日の固定や希望、大学指定、受験票確認、定員状況による制限・変更の条件" },
  { key: "hotelId", label: "ホテルID", description: "宿泊施設の安定ID" },
  { key: "venueAccess", label: "会場アクセス", description: "宿泊施設から会場までの主な経路と注意事項" },
  { key: "officialUrl", label: "施設・会場情報の公式URL", description: "会場施設・宿泊施設の公式サイト、または会場を公表した大学公式資料のURL" },
  { key: "officialUrlLabel", label: "公式URLの種別", description: "施設公式以外の資料を会場情報URLとして使う場合の表示名" },
  { key: "operatingStatusEvidenceUrl", label: "営業状態の公式根拠URL", description: "宿泊施設の営業状態を確認した公式URL" },
  { key: "officialAdmissionUrl", label: "大学公式資料URL", description: "会場割当を確認した大学公式資料のURL" },
  { key: "evidenceUrls", label: "経路の公式根拠URL", description: "宿泊施設から会場までの経路を確認した公式URL" },
  { key: "reviewState", label: "確認状態", description: "各レコードを公式情報と照合した状態" },
] as const;
