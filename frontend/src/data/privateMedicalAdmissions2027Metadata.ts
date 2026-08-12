export const privateMedicalAdmissions2027Metadata = {
  name: "2027年度 私立医学部入試日程データ",
  title: "【2027年度】私立医学部入試日程一覧｜一般選抜・共通テスト利用31大学",
  description:
    "2027年度（令和9年度）の私立医学部31大学の一般選抜・共通テスト利用選抜を、試験日カレンダー、大学別、出願締切別に一覧化。一次・二次試験、出願期間、入学手続まで確認できます。",
  canonicalUrl: "https://lexus-ec.com/private-medical-school-admissions-schedule-2027/",
  datasetUrl: "https://lexus-ec.com/data/private-medical-admissions-2027.json",
  datasetIdentifier:
    "https://lexus-ec.com/private-medical-school-admissions-schedule-2027/#dataset",
  academicYear: 2027,
  language: "ja",
  datePublished: "2026-07-27",
  dateModified: "2026-08-11",
  dateModifiedLabel: "2026年8月11日",
  version: "2026-08-11",
  publisher: {
    name: "医学部予備校 レクサス E.C.",
    alternateName: "レクサス教育センター",
    url: "https://lexus-ec.com/",
  },
} as const;

export const privateMedicalAdmissions2027FieldDefinitions = [
  {
    key: "canonicalRouteId",
    label: "共通方式ID",
    description:
      "日程・会場など複数の公開データを同じ入試方式で結合する、中央ナレッジDB準拠の安定ID",
  },
  {
    key: "admissionPlanning.routes[].id",
    label: "受験プラン保存ID",
    description:
      "保存済み受験プランとの互換性を維持するplanner専用ID。データ間の結合にはcanonicalRouteIdを使用",
  },
  {
    key: "applicationStart",
    label: "出願開始日",
    description: "Web出願登録または出願書類受付が始まる日",
  },
  {
    key: "applicationDeadline",
    label: "出願締切",
    description: "Web登録締切日時と郵送書類締切（必着・消印有効の区分を含む）",
  },
  {
    key: "firstExam",
    label: "一次試験",
    description: "学力試験、大学入学共通テスト、その他の第一次選考日",
  },
  {
    key: "firstResult",
    label: "一次合格発表",
    description: "第一次選考の合格発表日",
  },
  {
    key: "secondExam",
    label: "二次試験",
    description: "面接、小論文、その他の第二次選考日",
  },
  {
    key: "finalResult",
    label: "合格発表",
    description: "最終合格発表日",
  },
  {
    key: "procedureDeadline",
    label: "入学手続き締切",
    description: "入学金納入や必要書類提出など、入学手続きの締切日",
  },
] as const;

export const privateMedicalAdmissions2027StatusDefinitions = {
  official: "2027年度の確定版学生募集要項で確認済み",
  preliminary: "大学公式の予告・概要・入試ガイドなどで確認済み。確定版募集要項は公表待ち",
  pending: "2027年度の公式日程が未公表",
} as const;
