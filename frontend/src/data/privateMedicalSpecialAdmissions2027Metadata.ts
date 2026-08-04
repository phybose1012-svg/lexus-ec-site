export const privateMedicalSpecialAdmissions2027Metadata = {
  name: "2027年度 私立医学部 総合型・学校推薦型選抜等 日程データ",
  title: "【2027年度】私立医学部の総合型・学校推薦型選抜 入試日程一覧",
  description:
    "2027年度の私立医学部31大学について、総合型・学校推薦型・地域枠・帰国生・IBなど、一般選抜・通常の共通テスト利用選抜以外の日程と出願条件を公式情報に基づき一覧化。未公表情報は推測せず明記します。",
  canonicalUrl:
    "https://lexus-ec.com/private-medical-school-special-admissions-schedule-2027/",
  datasetUrl:
    "https://lexus-ec.com/data/private-medical-special-admissions-2027.json",
  datasetIdentifier:
    "https://lexus-ec.com/private-medical-school-special-admissions-schedule-2027/#dataset",
  academicYear: 2027,
  language: "ja",
  datePublished: "2026-08-04",
  dateModified: "2026-08-04",
  dateModifiedLabel: "2026年8月4日",
  version: "2026-08-04",
  publisher: {
    name: "医学部予備校 レクサス E.C.",
    alternateName: "レクサス教育センター",
    url: "https://lexus-ec.com/",
  },
} as const;

export const privateMedicalSpecialAdmissions2027FieldDefinitions = [
  { key: "quota", label: "募集人員", description: "2027年度の公式公表値。構想中・予定を含む場合は注記" },
  { key: "eligibility", label: "出願資格", description: "2027年3月卒業見込みの高校生が出願できる条件" },
  { key: "exclusive", label: "専願・併願", description: "合格時の入学確約または他大学との併願可否" },
  { key: "principalRecommendation", label: "学校長推薦", description: "学校長の推薦が必要か" },
  { key: "gradeRequirement", label: "評定要件", description: "学習成績の状況などの基準" },
  { key: "restrictions", label: "地域・卒業年等", description: "居住地、出身校、卒業年度、年齢などの条件" },
  { key: "events", label: "入試日程", description: "出願開始から入学手続締切までの正規化した日付" },
] as const;

export const privateMedicalSpecialAdmissions2027PublicationStatusDefinitions = {
  complete: "2027年度の完成版募集要項で確認",
  partial: "2027年度の一部方式の募集要項で確認",
  outline: "2027年度の公式概要・入試ガイドで確認。完成版募集要項は公表待ち",
  unpublished: "2027年度の対象方式・日程は未公表",
  "previous-year-only": "公式入口で確認できるのは前年度情報のみ。前年値は掲載していません",
  "not-offered": "2027年度の公式情報で、現役高校生が出願できる対象方式を確認できません",
} as const;
