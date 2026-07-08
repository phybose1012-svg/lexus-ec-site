import { migratedPosts } from "../lib/postSource";
import { getSitemapEntries } from "../lib/seoRoutes";

export type AdminEditableFieldType = "text" | "textarea" | "table-cell" | "auto" | "image";
export type AdminEditablePageKind = "fixed-page" | "post";

export type AdminEditableImageValue = {
  src?: string;
  alt?: string;
  width?: string;
  hidden?: boolean;
};

export type AdminEditableField = {
  id: string;
  label: string;
  type: AdminEditableFieldType;
  defaultValue: string;
  help?: string;
  rows?: number;
  selector?: string;
  kind?: string;
  defaultImage?: AdminEditableImageValue;
};

export type AdminEditablePage = {
  id: string;
  label: string;
  kind: AdminEditablePageKind;
  path: string;
  productionUrl: string;
  stagingUrl: string;
  summary: string;
  fields: AdminEditableField[];
  autoDiscover?: boolean;
};

const productionOrigin = "https://lexus-ec.com";
const stagingOrigin = "https://staging.lexus-ec.pages.dev";

const normalizePath = (value: string) => {
  const path = String(value || "/").trim();
  if (!path || path === "/") return "/";
  return `/${path.replace(/^\/+|\/+$/g, "")}/`;
};

const field = (
  id: string,
  label: string,
  defaultValue: string,
  type: AdminEditableFieldType = "textarea",
  rows = 4,
): AdminEditableField => ({
  id,
  label,
  type,
  defaultValue,
  rows,
  selector: `[data-admin-editable="${id}"]`,
});

const knownPages: AdminEditablePage[] = [
  {
    id: "home",
    label: "トップページ",
    kind: "fixed-page",
    path: "/",
    productionUrl: `${productionOrigin}/`,
    stagingUrl: `${stagingOrigin}/`,
    summary: "トップページの主要コピーを編集します。未登録の文言や表セルもプレビューから自動検出します。",
    autoDiscover: true,
    fields: [
      field("home.hero.year", "ヒーロー 年度", "2026年度", "text", 1),
      field("home.hero.subtitle", "ヒーロー サブタイトル", "最高級の医学部受験指導", "text", 2),
      field("home.hero.title", "ヒーロー 見出し", "覚悟が決まったら\nレクサス・プレミア本科へ\n（開講中）", "textarea", 5),
      field(
        "home.hero.target",
        "ヒーロー 対象",
        "対象：既卒生（年齢制限なし）\n欠員が出た場合、夏期(7・8月)入学可能。\n※お問合せ下さい。",
        "textarea",
        4,
      ),
      field(
        "home.intro.title",
        "導入 見出し",
        "医学部受験 なら、\n実績35年の レクサス教育センター（レクサス E.C.）にお任せください。",
        "textarea",
        4,
      ),
      field(
        "home.intro.body",
        "導入 本文",
        "偏差値50台からの合格率は88%。「緻密な“鬼特訓”メニュー」と「1日13時間の厳しい管理体制 (＝“鬼監理”)」で、医学部受験生を合格へ導きます。校舎は寮と一体型で、渋谷（東京）にあります。レクサスは日本全国の浪人生や現役生の医師への思いに応えます。",
        "textarea",
        7,
      ),
      field(
        "home.representative.title",
        "代表メッセージ 見出し",
        "レクサスは1992年創立、1000人以上の医学部生を輩出している医学部受験の専門塾です。",
      ),
      field(
        "home.representative.body",
        "代表メッセージ 本文",
        "レクサスは、医学部受験に必要な厳しさを日々の学習に落とし込みます。授業、課題、質問、確認、生活リズムまでを途切れさせず、受験生の一年を合格へ向けて使い切ります。",
      ),
      field("home.method.headline", "メソッド 見出し", "「厳しさ」が最短合格の絶対条件！", "textarea", 3),
      field(
        "home.method.body",
        "メソッド 本文",
        "レクサス教育センターでは、情熱と実力を兼ね備えた講師達があなたの学習を厳しく管理し、独自の医学部専門カリキュラムで合格へ導きます。講師の指示通りに課題をこなせば、医学部に合格する実力が必ず身につきます。",
        "textarea",
        6,
      ),
      field("home.courses.title", "コース 見出し", "老舗の医学部予備校だから成せる\n「コース」と「カリキュラム」", "textarea", 4),
      field("home.courses.lead", "コース リード", "ご自身のタイプに合った「コース選択」が合格への第一歩。"),
      field("home.final.message", "最終メッセージ", "きみはできる。さあ、“勉強の鬼”になろう。", "textarea", 3),
    ],
  },
  {
    id: "request-documents",
    label: "資料請求",
    kind: "fixed-page",
    path: "/request-documents/",
    productionUrl: `${productionOrigin}/request-documents/`,
    stagingUrl: `${stagingOrigin}/request-documents/`,
    summary: "資料請求ページの案内文とボタン文言を編集します。フォーム外の文言も自動検出します。",
    autoDiscover: true,
    fields: [
      field("request.intro", "導入文", "必須事項を入力して\n「送信ボタンを」押してください。", "textarea", 4),
      field("request.form.title", "フォーム見出し", "資料請求フォーム", "text", 1),
      field("request.form.lead", "フォーム説明", "必須項目を入力してください。"),
      field("request.submit", "送信ボタン", "送信", "text", 1),
    ],
  },
  {
    id: "reservation",
    label: "無料面談予約",
    kind: "fixed-page",
    path: "/reservation/",
    productionUrl: `${productionOrigin}/reservation/`,
    stagingUrl: `${stagingOrigin}/reservation/`,
    summary: "無料面談予約ページの説明、補足、ボタン文言を編集します。フォーム外の文言も自動検出します。",
    autoDiscover: true,
    fields: [
      field("reservation.title", "ページ見出し", "無料面談のご予約", "text", 1),
      field(
        "reservation.lead",
        "リード文",
        "体験授業や入学をご検討の方は、\nまず無料面談をご予約下さい。\n詳しくご説明いたします。",
        "textarea",
        5,
      ),
      field("reservation.mascot.left", "左キャラクター吹き出し", "お気軽にどうぞ", "text", 1),
      field("reservation.mascot.right", "右キャラクター吹き出し", "毎日実施中", "text", 1),
      field("reservation.notice", "フォーム案内", "必須事項を入力して\n「予約する」ボタンを押してください。", "textarea", 4),
      field("reservation.submit", "送信ボタン", "予約する", "text", 1),
      field("reservation.phone.label", "電話予約見出し", "【お電話でもご予約承ります】", "text", 1),
      field("reservation.phone.hours", "電話受付時間", "受付時間：10時00分～21時00分", "text", 1),
    ],
  },
];

const knownLabels: Record<string, string> = {
  "/": "トップページ",
  "/entrance/": "入学案内",
  "/lexus-premier/": "レクサス・プレミア",
  "/medical-english-training/": "医学部英語研修",
  "/request-documents/": "資料請求",
  "/reservation/": "無料面談予約",
  "/results/": "合格実績",
  "/voice/": "合格体験記",
  "/top/access/": "アクセス",
  "/top/contact/": "お問い合わせ",
  "/top/course/": "コース一覧",
  "/top/faq/": "よくある質問",
  "/top/history/": "沿革",
  "/top/lexus-garden/": "レクサスガーデン",
  "/top/reservation/": "面談予約",
  "/top/results/": "合格実績",
  "/top/teacher/": "講師紹介",
  "/top/voice/": "合格体験記",
  "/top/course/custom-made-course/": "カスタムメイドコース",
  "/top/course/lexus-premiere-course/": "レクサス・プレミア本科",
  "/top/course/medical-prep/": "医学部進学準備コース",
  "/top/course/medical-prep-junior/": "医学部進学ジュニア",
  "/lexus-online/": "Lexus Online",
  "/lexus-online/application-flow/": "Lexus Online お申し込みの流れ",
  "/lexus-online/contact/": "Lexus Online お問い合わせ",
  "/lexus-online/development-flow/": "Lexus Online 開発の流れ",
  "/lexus-online/policy/": "Lexus Online ポリシー",
};

const decodeSegment = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const hashValue = (value: string) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
};

const labelFromPath = (path: string) => {
  const normalized = normalizePath(path);
  if (knownLabels[normalized]) return knownLabels[normalized];
  const segments = normalized.split("/").filter(Boolean).map(decodeSegment);
  if (!segments.length) return "トップページ";
  return segments.join(" / ");
};

const idFromPath = (path: string) => {
  const normalized = normalizePath(path);
  if (normalized === "/") return "home";
  const slug = normalized
    .replace(/^\/+|\/+$/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const suffix = hashValue(normalized);
  return `page-${slug ? `${slug}-${suffix}` : suffix}`;
};

const pageFromPath = (path: string, kind: AdminEditablePageKind = "fixed-page"): AdminEditablePage => {
  const normalized = normalizePath(path);
  const urlPath = normalized === "/" ? "/" : normalized;
  return {
    id: idFromPath(normalized),
    label: labelFromPath(normalized),
    kind,
    path: normalized,
    productionUrl: `${productionOrigin}${urlPath}`,
    stagingUrl: `${stagingOrigin}${urlPath}`,
    summary: "このページの見出し、本文、リスト、表セルをプレビューから自動検出して編集します。",
    fields: [],
    autoDiscover: true,
  };
};

const pageMap = new Map<string, AdminEditablePage>();
const migratedPostPaths = new Set(migratedPosts.map((post) => normalizePath(post.path)));

for (const entry of getSitemapEntries()) {
  const path = normalizePath(new URL(entry.url).pathname);
  pageMap.set(path, pageFromPath(path, migratedPostPaths.has(path) ? "post" : "fixed-page"));
}

for (const page of knownPages) {
  pageMap.set(normalizePath(page.path), page);
}

export const adminEditablePages = [...pageMap.values()].sort((a, b) => {
  if (a.path === "/") return -1;
  if (b.path === "/") return 1;
  if (a.kind !== b.kind) return a.kind === "fixed-page" ? -1 : 1;
  return a.path.localeCompare(b.path, "ja");
});
