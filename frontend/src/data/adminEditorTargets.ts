export type AdminEditorTargetKind = "fixed-page" | "post" | "seo-note";

export type AdminEditorTarget = {
  id: string;
  label: string;
  kind: AdminEditorTargetKind;
  path: string;
  productionUrl?: string;
  stagingUrl?: string;
  defaultTitle: string;
  defaultSeoTitle: string;
  defaultDescription: string;
  defaultSummary: string;
  defaultBody: string;
  notes: string;
};

export const adminEditorTargets: AdminEditorTarget[] = [
  {
    id: "home-quality-pass",
    label: "トップページ品質確認",
    kind: "fixed-page",
    path: "/",
    productionUrl: "https://lexus-ec.com/",
    stagingUrl: "https://staging.lexus-ec.pages.dev/",
    defaultTitle: "トップページ品質確認",
    defaultSeoTitle: "医学部予備校ならレクサスE.C.",
    defaultDescription: "渋谷駅徒歩5分の医学部予備校レクサスE.C.。医学部受験の個別指導、寮、受験情報を提供します。",
    defaultSummary: "トップページのデザイン、導線、SEOメタ情報を確認するための下書きです。",
    defaultBody:
      "修正対象:\n- ヘッダーとフッターの表示\n- 主要CTAの視認性\n- モバイル幅の余白\n\n確認結果:\n- ",
    notes: "本番ページとステージングページを比較し、トップページのデザイン基準として扱う。",
  },
  {
    id: "request-documents",
    label: "資料請求フォーム",
    kind: "fixed-page",
    path: "/request-documents/",
    productionUrl: "https://lexus-ec.com/request-documents/",
    stagingUrl: "https://staging.lexus-ec.pages.dev/request-documents/",
    defaultTitle: "資料請求フォーム",
    defaultSeoTitle: "資料請求 | 医学部予備校レクサスE.C.",
    defaultDescription: "医学部予備校レクサスE.C.の資料請求フォームです。校舎案内、コース案内、個別相談の資料をお送りします。",
    defaultSummary: "資料請求フォームの入力導線と送信前後の文言を調整するための下書きです。",
    defaultBody:
      "修正対象:\n- 入力項目の並び\n- 送信ボタン周辺の文言\n- 個人情報同意の見え方\n\n確認結果:\n- ",
    notes: "フォーム送信Functionの挙動と画面文言を分けて確認する。",
  },
  {
    id: "reservation",
    label: "個別相談予約",
    kind: "fixed-page",
    path: "/reservation/",
    productionUrl: "https://lexus-ec.com/reservation/",
    stagingUrl: "https://staging.lexus-ec.pages.dev/reservation/",
    defaultTitle: "個別相談予約",
    defaultSeoTitle: "個別相談予約 | 医学部予備校レクサスE.C.",
    defaultDescription: "医学部受験に関する個別相談、校舎見学、学習相談の予約ページです。",
    defaultSummary: "予約導線と相談内容の見え方を改善するための下書きです。",
    defaultBody:
      "修正対象:\n- 予約CTA\n- 相談内容の説明\n- スマホ表示の読みやすさ\n\n確認結果:\n- ",
    notes: "資料請求と個別相談の導線が競合しないように確認する。",
  },
  {
    id: "lexus-online",
    label: "Lexus Online",
    kind: "fixed-page",
    path: "/lexus-online/",
    productionUrl: "https://lexus-ec.com/lexus-online/",
    stagingUrl: "https://staging.lexus-ec.pages.dev/lexus-online/",
    defaultTitle: "Lexus Online",
    defaultSeoTitle: "Lexus Online | 教育機関向けWeb開発",
    defaultDescription: "医学部予備校レクサスE.C.が提供する教育機関向けWeb制作、運用、システム開発サービスです。",
    defaultSummary: "法人向け開発ページの説明、問い合わせ導線、関連ページを整理する下書きです。",
    defaultBody:
      "修正対象:\n- サービス説明\n- 開発フロー\n- 問い合わせ導線\n\n確認結果:\n- ",
    notes: "公開サイト本体とは目的が異なるため、過度に受験生向け表現へ寄せない。",
  },
  {
    id: "medical-school-posts",
    label: "医学部受験記事群",
    kind: "post",
    path: "/medical-school/",
    stagingUrl: "https://staging.lexus-ec.pages.dev/medical-school/",
    defaultTitle: "医学部受験記事群",
    defaultSeoTitle: "医学部受験対策記事の見直し",
    defaultDescription: "医学部受験対策記事のタイトル、導入文、内部リンク、画像差し替え候補を確認します。",
    defaultSummary: "投稿記事の品質監査とSEO改善案を記録する下書きです。",
    defaultBody:
      "確認対象:\n- タイトル\n- 導入文\n- 内部リンク\n- 画像\n\n改善案:\n- ",
    notes: "記事本文の直接置換前に、改善意図と対象URLを明確にする。",
  },
];
