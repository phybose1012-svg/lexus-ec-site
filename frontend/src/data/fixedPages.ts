export type FormField = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "date" | "checkbox";
  required?: boolean;
  options?: string[];
  placeholder?: string;
};

export type FormPageConfig = {
  formType: string;
  title: string;
  lead: string;
  fields: FormField[];
  submitLabel: string;
};

const contactFields: FormField[] = [
  { name: "name", label: "お名前", type: "text", required: true, placeholder: "山田 太郎" },
  { name: "email", label: "メールアドレス", type: "email", required: true, placeholder: "example@example.com" },
  { name: "tel", label: "電話番号", type: "tel", required: true, placeholder: "03-0000-0000" },
  {
    name: "studentType",
    label: "学年・状況",
    type: "select",
    required: true,
    options: ["既卒生", "高3生", "高2生", "高1生", "中学生", "再受験生", "保護者"],
  },
  { name: "message", label: "ご相談内容", type: "textarea", required: true, placeholder: "現在の状況やご希望をお書きください。" },
  { name: "privacy", label: "個人情報の取り扱いに同意", type: "checkbox", required: true, placeholder: "個人情報の取り扱いに同意します。" },
];

export const formPageConfigs: Record<string, FormPageConfig> = {
  "/request-documents/": {
    formType: "request-documents",
    title: "資料請求フォーム",
    lead: "パンフレット、医学部情報本、出願・面接試験ガイドラインなどをお届けします。",
    submitLabel: "資料を請求する",
    fields: [
      ...contactFields.slice(0, 4),
      { name: "postalCode", label: "郵便番号", type: "text", required: true, placeholder: "150-0031" },
      { name: "address", label: "送付先住所", type: "textarea", required: true, placeholder: "都道府県からご入力ください。" },
      contactFields[5],
    ],
  },
  "/top/reservation/": {
    formType: "reservation",
    title: "個別説明会予約フォーム",
    lead: "学習相談、進路相談、校舎・専用寮の見学、体験授業の希望をまとめて承ります。",
    submitLabel: "個別説明会を予約する",
    fields: [
      ...contactFields.slice(0, 4),
      { name: "preferredDate", label: "第1希望日", type: "date", required: true },
      { name: "preferredStyle", label: "希望形式", type: "select", required: true, options: ["来校", "オンライン", "電話相談", "未定"] },
      contactFields[4],
      contactFields[5],
    ],
  },
  "/reservation/": {
    formType: "reservation",
    title: "個別説明会・校舎見学予約フォーム",
    lead: "校舎、専用寮、学習システムを実際に確認したい方向けの予約フォームです。",
    submitLabel: "見学・説明会を予約する",
    fields: [
      ...contactFields.slice(0, 4),
      { name: "preferredDate", label: "第1希望日", type: "date", required: true },
      { name: "visitTarget", label: "見学希望", type: "select", required: true, options: ["校舎のみ", "専用寮のみ", "校舎と専用寮", "オンライン説明"] },
      contactFields[4],
      contactFields[5],
    ],
  },
  "/top/contact/": {
    formType: "contact",
    title: "お問い合わせフォーム",
    lead: "医学部受験、入学、コース、寮、資料請求についてお気軽にお問い合わせください。",
    submitLabel: "問い合わせる",
    fields: contactFields,
  },
  "/test-entry/": {
    formType: "test-entry",
    title: "選抜テスト エントリーフォーム",
    lead: "特待生選抜テスト、最難関医学部コースの応募を受け付けます。",
    submitLabel: "選抜テストに申し込む",
    fields: [
      ...contactFields.slice(0, 4),
      { name: "targetUniversity", label: "志望大学", type: "text", required: false, placeholder: "慶應義塾大学 医学部 など" },
      { name: "preferredDate", label: "受験希望日", type: "date", required: true },
      contactFields[4],
      contactFields[5],
    ],
  },
};

export const defaultPageActions = [
  { label: "資料請求", href: "/request-documents/", tone: "red" },
  { label: "個別説明会", href: "/reservation/", tone: "blue" },
  { label: "お問い合わせ", href: "/top/contact/", tone: "light" },
];
