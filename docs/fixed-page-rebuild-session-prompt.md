# 固定ページ修正セッション用ファーストプロンプト

あなたは `C:\---hp` の LEXUS 教育センター静的サイト移行プロジェクトを引き継ぐ Codex です。

このセッションの担当範囲は、**固定ページのデザイン・レイアウト崩れを1ページずつ修正すること**です。投稿記事のテンプレート、投稿記事データ、記事生成スクリプトは別セッションで扱うため、このセッションでは原則触らないでください。

## 最重要方針

- Divide and Conquer：固定ページ全体を一括で雑に直さない。ページ単位、さらにコンテナ単位で分析・実装・検証する。
- 一貫性と柔軟性のバランス：トップページの再現品質とブランド一貫性を基準にする。ただし、古い固定ページの元デザインが明らかに低品質な場合は、元ページの意図・情報・SEOを守りつつ、トップページと整合するデザインへリライトする。
- 速度最適化：Elementor由来の重い構造を再現しない。静的HTML/CSS中心、JavaScriptは必要最小限、画像はローカル配信・遅延読み込み・安定サイズ指定。
- SEO保護：URL、canonical、title、description、H1の意図、主要本文、内部リンクは維持する。不要なURL変更やリダイレクト前提の移行はしない。
- スマホの改行を厳密に確認する。変な位置での改行、ボタン内テキストのはみ出し、見出しの読みにくさを必ず潰す。

## 現状の前提

- プロジェクトルート: `C:\---hp`
- フロントエンド: `C:\---hp\frontend`
- 開発サーバー想定: `http://127.0.0.1:4321/`
- トップページ `/` はかなり高品質に再現済み。この品質を固定ページ修正の基準にする。
- ヘッダーとモバイル固定メニューは既にかなり元サイトに寄せてある。固定ページ修正時に崩さないこと。
- 投稿記事系はこのセッションでは触らない。特に以下は原則編集禁止:
  - `frontend/src/data/generated/*Posts.json`
  - `frontend/scripts/generate-*-content.mjs`
  - `frontend/src/layouts/ArticleLayout.astro`

## 固定ページの実装入口

専用Astroページとして実装済みの主な固定ページ:

- `frontend/src/pages/index.astro`
- `frontend/src/pages/lexus-premier/index.astro`
- `frontend/src/pages/medical-english-training/index.astro`
- `frontend/src/pages/request-documents/index.astro`
- `frontend/src/pages/reservation/index.astro`
- `frontend/src/pages/top/access/index.astro`
- `frontend/src/pages/top/contact/index.astro`
- `frontend/src/pages/top/course/index.astro`
- `frontend/src/pages/top/course/lexus-premiere-course/index.astro`
- `frontend/src/pages/top/course/high-level-geneki-course/index.astro`
- `frontend/src/pages/top/course/custom-made-course/index.astro`
- `frontend/src/pages/top/course/medical-prep/index.astro`
- `frontend/src/pages/top/course/medical-prep-junior/index.astro`
- `frontend/src/pages/top/faq/index.astro`
- `frontend/src/pages/top/history/index.astro`
- `frontend/src/pages/top/lexus-garden/index.astro`
- `frontend/src/pages/top/reservation/index.astro`
- `frontend/src/pages/top/results/index.astro`
- `frontend/src/pages/top/teacher/index.astro`
- `frontend/src/pages/top/voice/index.astro`

旧WordPress/ElementorのHTML抽出を流し込んでいる固定ページ:

- `frontend/src/lib/fixedPageSource.ts`
- `frontend/src/pages/[...slug].astro`
- 元HTMLは `baseline/pages/manifest.json` と `baseline/pages/` 配下から来る。
- 抽出流し込みページは崩れやすい。重要ページ・壊れが大きいページは、必要に応じて専用Astroページ化する。

主な共有スタイル:

- `frontend/src/styles/global.css`
- `frontend/src/styles/pages.css`
- `frontend/src/data/home.ts`
- `frontend/src/data/fixedPages.ts`

既存の再現分析レポート:

- `reports/reproduction/top-teacher/`
- `reports/reproduction/top-course/`
- `reports/reproduction/lexus-premier/`

## 初動タスク

1. 固定ページ台帳を作る。
   - `frontend/src/data/home.ts` のグローバルナビ・トップページ導線を入口に、トップページから遷移できる固定ページを列挙する。
   - `frontend/src/lib/fixedPageSource.ts` の `dedicatedPagePaths` と `baseline/pages/manifest.json` も照合する。
   - 各ページについて、専用Astroか抽出流し込みか、現在の推定品質、優先度、修正方針を記録する。

2. 優先順位を決める。
   - まずトップページから主要導線で飛ぶページを優先する。
   - 次に、レイアウト崩れ・文字化け・スマホ改行崩れ・CTA崩れ・画像欠落が大きいページを優先する。
   - 低品質な古いページは「完全再現」ではなく「ブランド整合リライト」として扱う。

3. 1ページずつ、コンテナ単位で分析する。
   - live: `https://lexus-ec.com/<path>`
   - local: `http://127.0.0.1:4321/<path>`
   - desktop と mobile のスクリーンショットを取る。
   - ヘッダー、ヒーロー、主要セクション、CTA、フォーム、フッター、スマホ固定メニュー、改行を分けて評価する。
   - 「元ページの意図」「再現すべき要素」「リライトすべき要素」を分けてから実装する。

## 実装ルール

- 既存のトップページのデザイントークン、余白、ボタン、配色、カード感、フォント感を優先して使う。
- CSSは共有化できるものだけ `global.css` / `pages.css` に入れる。ページ固有の無理な例外は最小化する。
- カード内カード、過剰な装飾、ElementorのDOM構造再現、重いJSは避ける。
- 画像は `frontend/public/assets/legacy/` または既存 `frontend/public/illustrations/` を使う。外部画像直リンクを増やさない。
- 画像には幅・高さ・`loading`・`decoding` を適切に付ける。
- フォームページでは Googleフォームへの逃げを作らず、既存の `LeadForm` / 固定フォーム実装に寄せる。
- PCだけでなく、390px前後のスマホ幅で必ず見出し・ボタン・表・CTAの改行を確認する。

## 検証ルール

各ページ修正後に最低限:

- `npm.cmd run build`
- 対象ページのHTML生成確認
- desktop screenshot: 1440x900
- mobile screenshot: 390x844
- console error / 404 / 余計な外部リクエスト確認
- スマホ改行、ボタンはみ出し、画像欠落、横スクロールの確認

ビルドが `.astro` や `dist` への書き込みで `EPERM` になった場合は、権限付きで再実行する。

## 報告形式

作業報告はページ単位で短くまとめる。

- 対象ページ
- 元の問題
- 実装した修正
- PC/スマホの確認結果
- 再現度または品質スコア
- 残課題
- 次に直すページ

## 最初にやるべき具体タスク

まず、固定ページ台帳を作成してください。台帳には以下を含めてください。

- URL/path
- 実装種別: 専用Astro / 抽出流し込み / 要確認
- トップページからの導線有無
- 推定優先度: A/B/C
- 修正方針: 元デザイン再現 / ブランド整合リライト / フォーム正常化 / 情報整理
- 初回チェック結果: PC崩れ、スマホ崩れ、画像欠落、テキスト改行、CTA、フォーム、外部リクエスト

台帳ができたら、優先度Aのうち最も崩れているページから、1ページずつ修正を開始してください。
