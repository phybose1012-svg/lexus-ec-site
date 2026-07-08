export type AdminTone = "red" | "blue" | "green" | "gold" | "neutral";

export type AdminMetric = {
  label: string;
  value: string;
  detail: string;
  tone: AdminTone;
};

export type AdminWorkflowStep = {
  title: string;
  owner: string;
  state: "ready" | "working" | "blocked";
  detail: string;
};

export type AdminContentQueueItem = {
  title: string;
  kind: "fixed-page" | "post" | "seo" | "system";
  targetPath: string;
  sourceUrl?: string;
  stagingUrl?: string;
  state: "要確認" | "編集中" | "反映待ち" | "保留";
  priority: "高" | "中" | "低";
  nextAction: string;
};

export type AdminReportSnapshot = {
  title: string;
  source: string;
  updatedAt: string;
  score: string;
  state: "良好" | "確認中" | "要修正" | "未接続";
  summary: string;
  nextAction: string;
};

export type AdminActivity = {
  date: string;
  title: string;
  detail: string;
};

export type AdminUrlPair = {
  label: string;
  productionUrl: string;
  stagingUrl: string;
  checkPoint: string;
};

export const adminMetrics: AdminMetric[] = [
  {
    label: "固定ページ",
    value: "比較修正",
    detail: "元ページとステージングをページ単位で照合する対象",
    tone: "gold",
  },
  {
    label: "投稿記事",
    value: "編集導線",
    detail: "生成済み記事の確認、差し替え、公開判断を扱う対象",
    tone: "blue",
  },
  {
    label: "SEO監査",
    value: "受信準備",
    detail: "ローカルAI実行結果を管理画面で閲覧する領域",
    tone: "green",
  },
  {
    label: "公開管理",
    value: "Access前提",
    detail: "本番運用前にCloudflare Accessで保護する画面",
    tone: "red",
  },
];

export const adminWorkflowSteps: AdminWorkflowStep[] = [
  {
    title: "1. 対象ページを選ぶ",
    owner: "管理画面",
    state: "ready",
    detail: "固定ページ、投稿、SEO項目を同じ一覧から選び、作業対象を小さく分ける。",
  },
  {
    title: "2. 元ページと比較する",
    owner: "Codex / Claude Code",
    state: "working",
    detail: "コンテナ単位で本番ページとステージングを比較し、トップページのデザインに寄せる。",
  },
  {
    title: "3. レポートを取り込む",
    owner: "ローカルPC",
    state: "ready",
    detail: "SEO監査、内部リンク監査、モバイル表示監査の結果を管理データとして更新する。",
  },
  {
    title: "4. ステージングで確認する",
    owner: "Cloudflare Pages",
    state: "ready",
    detail: "変更後はstagingブランチへ反映し、ステージングURLで確認してから本番へ進める。",
  },
];

export const contentQueue: AdminContentQueueItem[] = [
  {
    title: "固定ページ全体の再現品質チェック",
    kind: "fixed-page",
    targetPath: "/",
    sourceUrl: "https://lexus-ec.com/",
    stagingUrl: "https://staging.lexus-ec.pages.dev/",
    state: "編集中",
    priority: "高",
    nextAction: "ページごとにコンテナ分割し、崩れが大きい順に修正する。",
  },
  {
    title: "資料請求フォーム",
    kind: "fixed-page",
    targetPath: "/request-documents/",
    sourceUrl: "https://lexus-ec.com/request-documents/",
    stagingUrl: "https://staging.lexus-ec.pages.dev/request-documents/",
    state: "要確認",
    priority: "高",
    nextAction: "入力導線、送信前後の文言、スマホ幅の余白を確認する。",
  },
  {
    title: "医学部受験記事群",
    kind: "post",
    targetPath: "/medical-school/",
    stagingUrl: "https://staging.lexus-ec.pages.dev/medical-school/",
    state: "反映待ち",
    priority: "中",
    nextAction: "タイトル、導入、内部リンク、画像差し替え候補を監査する。",
  },
  {
    title: "SEOメタ情報の一括確認",
    kind: "seo",
    targetPath: "sitemap.xml",
    sourceUrl: "https://lexus-ec.com/sitemap.xml",
    stagingUrl: "https://staging.lexus-ec.pages.dev/sitemap.xml",
    state: "要確認",
    priority: "中",
    nextAction: "title、description、canonical、noindexの状態を一覧化する。",
  },
  {
    title: "管理画面の認証設定",
    kind: "system",
    targetPath: "/admin/",
    stagingUrl: "https://staging.lexus-ec.pages.dev/admin/",
    state: "保留",
    priority: "高",
    nextAction: "本番公開前にCloudflare Accessで/admin/*を保護する。",
  },
];

export const reportSnapshots: AdminReportSnapshot[] = [
  {
    title: "SEO分析サマリー",
    source: "ローカルAI監査",
    updatedAt: "未接続",
    score: "-",
    state: "未接続",
    summary: "ローカルPCで実行したSEO監査結果をここに表示する想定。",
    nextAction: "監査結果JSONの出力先と取り込み方法を決める。",
  },
  {
    title: "内部リンク監査",
    source: "audit-internal-links",
    updatedAt: "未接続",
    score: "-",
    state: "未接続",
    summary: "リンク切れ、孤立ページ、重要ページへの導線不足を確認する領域。",
    nextAction: "スクリプト出力を管理データへ変換する。",
  },
  {
    title: "モバイル表示監査",
    source: "audit-mobile-linebreaks",
    updatedAt: "未接続",
    score: "-",
    state: "未接続",
    summary: "見出し、ボタン、ナビゲーションの折り返し崩れを記録する領域。",
    nextAction: "優先度順の修正リストをレポートとして表示する。",
  },
  {
    title: "ステージング確認",
    source: "Cloudflare Pages",
    updatedAt: "手動確認",
    score: "要運用",
    state: "確認中",
    summary: "変更後にstagingブランチへ反映し、URLで確認する運用の入口。",
    nextAction: "修正単位ごとにビルド、push、ステージング確認を実施する。",
  },
];

export const recentActivities: AdminActivity[] = [
  {
    date: "2026-06-26",
    title: "管理画面MVPを開始",
    detail: "/admin配下に固定ページ、投稿、SEOレポートを扱う作業画面を追加。",
  },
  {
    date: "2026-06-26",
    title: "ヘッダー修正をstagingへ反映",
    detail: "ナビゲーション、スマホヘッダー、法人向け開発リンクを調整済み。",
  },
  {
    date: "2026-06-26",
    title: "固定ページ修正プロンプトを作成",
    detail: "本番ページとステージングページを比較し、分割統治で直す指示書を追加。",
  },
];

export const adminUrlPairs: AdminUrlPair[] = [
  {
    label: "トップページ",
    productionUrl: "https://lexus-ec.com/",
    stagingUrl: "https://staging.lexus-ec.pages.dev/",
    checkPoint: "全体トーン、ヘッダー、フッター、主要CTAの一貫性",
  },
  {
    label: "資料請求",
    productionUrl: "https://lexus-ec.com/request-documents/",
    stagingUrl: "https://staging.lexus-ec.pages.dev/request-documents/",
    checkPoint: "フォーム導線、入力項目、スマホ幅の余白",
  },
  {
    label: "個別相談",
    productionUrl: "https://lexus-ec.com/reservation/",
    stagingUrl: "https://staging.lexus-ec.pages.dev/reservation/",
    checkPoint: "予約導線、説明文、CTAの視認性",
  },
  {
    label: "Lexus Online",
    productionUrl: "https://lexus-ec.com/lexus-online/",
    stagingUrl: "https://staging.lexus-ec.pages.dev/lexus-online/",
    checkPoint: "サービス説明、法人向け導線、問い合わせ導線",
  },
];

export const kindLabels: Record<AdminContentQueueItem["kind"], string> = {
  "fixed-page": "固定ページ",
  post: "投稿",
  seo: "SEO",
  system: "設定",
};
