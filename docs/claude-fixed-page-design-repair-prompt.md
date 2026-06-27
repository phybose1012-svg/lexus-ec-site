# Claude Code 用プロンプト: 固定ページ品質改善セッション

あなたは Claude Code として、`C:\---hp` の `phybose1012-svg/lexus-ec-site` リポジトリで作業します。

目的は、固定ページ群のデザイン崩れ・レイアウト崩れ・低品質な見た目を、1ページずつ丁寧に修正することです。作業の基本思想は **Divide and Conquer** と **一貫性と柔軟性のバランス** です。

## 最重要ゴール

1. 固定ページを1ページずつ改善する。
2. 各ページをさらにコンテナ単位で分解し、現在の本番ページとステージングページを比較する。
3. 原則として、本番ページの情報構造・内容・SEO・CTA・導線を保つ。
4. ただし、本番ページのデザインが古い、素人っぽい、トップページと一貫性がない、または明らかに低品質な場合は、単純再現ではなく、ステージングトップページのデザイン体系へ寄せてリデザインする。
5. デザインやレイアウトを変更したら、必ず `staging` ブランチへ commit / push し、Cloudflare Pages のステージングURLで確認する。
6. `main` には絶対に push しない。

## 基準にするデザイン

トップページの現在のステージング版を、全固定ページのブランド基準にする。

- ブランド基準ページ: `https://staging.lexus-ec.pages.dev/`
- 比較対象の本番トップページ: `https://lexus-ec.com/`

特に以下をトップページから踏襲する。

- ヘッダー、グローバルナビ、モバイル固定ナビ、フッターの扱い
- 余白設計
- 見出しのサイズ、行間、フォントの使い方
- 赤、紺、金、白、黒、薄いグレーを軸にした配色
- CTAボタンの見た目
- セクションの区切り方
- 画像の見せ方
- カードや表の角丸、線、影の控えめな使い方
- スマホ幅での読みやすさとボタンの押しやすさ

避けること:

- Elementor由来の崩れたDOM構造をそのまま再現すること
- 意味のないカード乱用
- トップページと無関係な派手な色や装飾
- 文字が小さすぎる、詰まりすぎる、横スクロールするレイアウト
- CTAが画面外に逃げるレイアウト
- PCだけ整えてスマホを放置すること
- 本番ページが低品質なのに、低品質な見た目まで忠実再現すること

## URL対応表

各ページでは、必ず以下の対応で比較する。

| 対象 | 本番ページ | ステージングページ | 初期判断 |
|---|---|---|---|
| トップ | `https://lexus-ec.com/` | `https://staging.lexus-ec.pages.dev/` | デザイン基準 |
| 合格体験記 | `https://lexus-ec.com/top/voice/` | `https://staging.lexus-ec.pages.dev/top/voice/` | 重点改善 |
| 合格実績・メソッド | `https://lexus-ec.com/top/results/` | `https://staging.lexus-ec.pages.dev/top/results/` | 重点改善 |
| 講師紹介 | `https://lexus-ec.com/top/teacher/` | `https://staging.lexus-ec.pages.dev/top/teacher/` | 重点改善 |
| コース一覧 | `https://lexus-ec.com/top/course/` | `https://staging.lexus-ec.pages.dev/top/course/` | 重点改善 |
| レクサス プレミア本科 | `https://lexus-ec.com/lexus-premier/` | `https://staging.lexus-ec.pages.dev/lexus-premier/` | 重点改善 |
| プレミア本科 元ページ | `https://lexus-ec.com/top/course/lexus-premiere-course/` | `https://staging.lexus-ec.pages.dev/top/course/lexus-premiere-course/` | 重点改善 |
| 高レベル現役合格コース | `https://lexus-ec.com/top/course/high-level-geneki-course/` | `https://staging.lexus-ec.pages.dev/top/course/high-level-geneki-course/` | 重点改善 |
| オーダーメード演習コース | `https://lexus-ec.com/top/course/custom-made-course/` | `https://staging.lexus-ec.pages.dev/top/course/custom-made-course/` | 重点改善 |
| メディカル準備コース 高等部 | `https://lexus-ec.com/top/course/medical-prep/` | `https://staging.lexus-ec.pages.dev/top/course/medical-prep/` | 重点改善 |
| メディカル準備コース 中等部 | `https://lexus-ec.com/top/course/medical-prep-junior/` | `https://staging.lexus-ec.pages.dev/top/course/medical-prep-junior/` | 重点改善 |
| アクセス | `https://lexus-ec.com/top/access/` | `https://staging.lexus-ec.pages.dev/top/access/` | 重点改善 |
| レクサスガーデン | `https://lexus-ec.com/top/lexus-garden/` | `https://staging.lexus-ec.pages.dev/top/lexus-garden/` | 重点改善 |
| 医学部予備校としての強み | `https://lexus-ec.com/top/history/` | `https://staging.lexus-ec.pages.dev/top/history/` | 重点改善 |
| FAQ | `https://lexus-ec.com/top/faq/` | `https://staging.lexus-ec.pages.dev/top/faq/` | 重点改善 |
| 入学までの流れ | `https://lexus-ec.com/entrance/` | `https://staging.lexus-ec.pages.dev/entrance/` | 重点改善 |
| 体験・個別説明会 | `https://lexus-ec.com/reservation/` | `https://staging.lexus-ec.pages.dev/reservation/` | フォーム注意 |
| トップ配下予約 | `https://lexus-ec.com/top/reservation/` | `https://staging.lexus-ec.pages.dev/top/reservation/` | フォーム注意 |
| お問い合わせ | `https://lexus-ec.com/top/contact/` | `https://staging.lexus-ec.pages.dev/top/contact/` | フォーム注意 |
| 資料請求 | `https://lexus-ec.com/request-documents/` | `https://staging.lexus-ec.pages.dev/request-documents/` | フォーム注意 |
| 英語の鬼特訓 | `https://lexus-ec.com/medical-english-training/` | `https://staging.lexus-ec.pages.dev/medical-english-training/` | 重点改善 |
| 英語トレーニング旧URL | `https://lexus-ec.com/english-training/` | `https://staging.lexus-ec.pages.dev/english-training/` | 旧ページ品質確認 |
| 数学の鬼特訓 | `https://lexus-ec.com/medical-math-training/` | `https://staging.lexus-ec.pages.dev/medical-math-training/` | 旧ページ品質確認 |
| 鬼監理とは | `https://lexus-ec.com/study-support-system/` | `https://staging.lexus-ec.pages.dev/study-support-system/` | 旧ページ品質確認 |
| 国公立医学部情報 | `https://lexus-ec.com/top/information-kokuritsu/` | `https://staging.lexus-ec.pages.dev/top/information-kokuritsu/` | 情報整理 |
| 私立医学部情報 | `https://lexus-ec.com/top/information-shiritsu/` | `https://staging.lexus-ec.pages.dev/top/information-shiritsu/` | 情報整理 |
| 私立医学部 Q&A | `https://lexus-ec.com/information-faq/` | `https://staging.lexus-ec.pages.dev/information-faq/` | 情報整理 |
| 繰り上げ合格情報 | `https://lexus-ec.com/kuriage-information/` | `https://staging.lexus-ec.pages.dev/kuriage-information/` | 情報整理 |
| LINEページ | `https://lexus-ec.com/top/line/` | `https://staging.lexus-ec.pages.dev/top/line/` | 旧ページ品質確認 |
| 夏期講習・夏期プラン | `https://lexus-ec.com/top/summer-plan/` | `https://staging.lexus-ec.pages.dev/top/summer-plan/` | 旧ページ品質確認 |
| 過去投稿一覧 | `https://lexus-ec.com/past-post/` | `https://staging.lexus-ec.pages.dev/past-post/` | 情報整理 |
| 合格実績旧URL | `https://lexus-ec.com/results/` | `https://staging.lexus-ec.pages.dev/results/` | 旧ページ品質確認 |
| 合格体験記旧URL | `https://lexus-ec.com/voice/` | `https://staging.lexus-ec.pages.dev/voice/` | 旧ページ品質確認 |
| 東大・慶應特化 | `https://lexus-ec.com/todai-keio-med-special/` | `https://staging.lexus-ec.pages.dev/todai-keio-med-special/` | 旧ページ品質確認 |
| 特商法 | `https://lexus-ec.com/%e7%89%b9%e5%ae%9a%e5%95%86%e5%8f%96%e5%bc%95%e6%b3%95%e3%81%ab%e5%9f%ba%e3%81%a5%e3%81%8f%e8%a1%a8%e8%a8%98/` | `https://staging.lexus-ec.pages.dev/%e7%89%b9%e5%ae%9a%e5%95%86%e5%8f%96%e5%bc%95%e6%b3%95%e3%81%ab%e5%9f%ba%e3%81%a5%e3%81%8f%e8%a1%a8%e8%a8%98/` | 法務ページ。崩れのみ修正 |

上記以外にも `baseline/pages/manifest.json` から生成されるページが多数ある。作業開始時に必ず以下のような追加台帳を作る。

- production URL: `https://lexus-ec.com${path}`
- staging URL: `https://staging.lexus-ec.pages.dev${path}`
- 実装種別: 専用Astro / 抽出流し込み / フォーム / 情報ページ
- 優先度: A / B / C
- 方針: 元ページ再現 / ブランド統合リデザイン / 情報整理 / 崩れのみ修正
- PC確認状況
- mobile確認状況
- 修正済みcommit

保存先の例:

- `docs/fixed-page-repair-ledger.md`
- `reports/fixed-page-repair/<path-slug>/`

## 作業前の必須確認

最初に必ず実行する。

```powershell
cd C:\---hp
git status --short --branch
git remote -v
git branch --show-current
```

条件:

- ブランチは `staging` で作業する。
- `main` には絶対に push しない。
- 未コミット変更がある場合は、自分の作業かどうかを確認してから進める。
- ユーザーの変更を勝手に戻さない。

必要なら:

```powershell
git switch staging
git pull --ff-only origin staging
```

## 1ページごとの作業手順

一度に大量のページを直さない。必ず1ページ、または完全に同じテンプレートの小さなページ群だけを扱う。

### 1. 対象ページを選ぶ

優先順位:

1. スマホで大きく崩れているページ
2. PCでファーストビューやCTAが崩れているページ
3. トップページとデザインの一貫性がないページ
4. 本番ページの情報構造が重要だが、ステージングで再現不足のページ
5. フォーム・資料請求・予約などCVに直結するページ

### 2. 本番とステージングを比較する

対象ページごとに以下を取得する。

- production desktop: 1440x900
- production mobile: 390x844
- staging desktop: 1440x900
- staging mobile: 390x844

比較はページ全体ではなく、コンテナ単位で行う。

比較単位:

- header
- mobile fixed nav
- hero / page title
- lead section
- main content sections
- cards / tables / lists
- CTA
- forms
- images
- footer
- mobile-only layout

各コンテナで記録すること:

- 本番ページで伝えている情報
- ステージングで欠落している情報
- ステージングで崩れている表示
- 本番に寄せるべき点
- トップページのブランド基準へリデザインすべき点

### 3. 判断基準

本番ページが十分に整っている場合:

- 文字情報、画像、順序、CTA、余白の雰囲気を近づける。
- ただし、ヘッダー、フッター、ボタン、フォント、配色はステージングトップページのブランド基準を優先する。

本番ページが低品質な場合:

- 低品質な見た目は再現しない。
- 情報の意味と順序を読み取り、トップページのデザイン体系で再構成する。
- Elementor的な重い構造、過剰な装飾、古い色使い、雑なカード、詰まった文字組みは捨てる。

フォームページの場合:

- 送信先やGoogleフォームの直リンクを勝手に増やさない。
- 既存の `LeadForm` や固定フォーム実装に合わせる。
- 入力欄、ラベル、必須表示、CTA、エラー状態、スマホ表示を必ず確認する。

情報ページの場合:

- テーブルは横スクロールに逃げすぎない。
- スマホではカード化、縦積み、見出し固定など、読みやすさを優先する。
- 情報量を削らない。

## 実装ルール

- 既存の設計とコンポーネントを優先する。
- 共有化できるCSSは `frontend/src/styles/global.css` または `frontend/src/styles/pages.css` に置く。
- ページ固有の例外は最小限にする。
- 既存の `SiteLayout` / `BaseLayout` / `SiteHeader` / `SiteFooter` を壊さない。
- ヘッダーとフッターは、原則として現在のステージングトップページと同じ品質を維持する。
- URL、canonical、title、description、H1、主要本文、内部リンクを不用意に変更しない。
- 画像は既存の `frontend/public/assets/legacy/` や既存public assetsを使う。
- 外部画像URLを増やさない。
- 画像には適切な `width` / `height` / `loading` / `decoding` を付ける。
- 文字がボタンやカードからはみ出さないようにする。
- PCとスマホの両方を確認する。

触ってよい主な場所:

- `frontend/src/pages/**/*.astro`
- `frontend/src/components/**/*.astro`
- `frontend/src/styles/global.css`
- `frontend/src/styles/pages.css`
- `frontend/src/data/*.ts`
- `frontend/src/lib/fixedPageSource.ts`

慎重に扱う場所:

- `frontend/src/data/generated/*Posts.json`
- `frontend/scripts/generate-*-content.mjs`
- `frontend/src/layouts/ArticleLayout.astro`
- `baseline/pages/`

これらは投稿生成や旧ページ抽出に関わるため、固定ページの見た目修正だけでは原則触らない。

## 検証ルール

各ページの修正後、最低限以下を実行する。

```powershell
cd C:\---hp\frontend
npm.cmd run build
```

さらに対象ページをローカルまたはステージングで確認する。

ローカル確認:

```powershell
npm.cmd run dev -- --port 4321
```

確認URL:

- local: `http://127.0.0.1:4321/<path>`
- production: `https://lexus-ec.com/<path>`
- staging: `https://staging.lexus-ec.pages.dev/<path>`

確認項目:

- 1440x900 desktop
- 390x844 mobile
- 横スクロールがない
- ヘッダーが崩れていない
- CTAが見える
- 画像が欠落していない
- フォームが破綻していない
- コンソールエラーや404が増えていない
- SEO基本情報が消えていない

## commit / push ルール

デザインやレイアウトを変更したら、ページ単位で commit して `staging` へ push する。

```powershell
cd C:\---hp
git status --short --branch
git add <変更したファイルだけ>
git commit -m "Polish <page-name> fixed page"
git push origin staging
```

禁止:

- `git push origin main`
- `git reset --hard`
- 関係ないファイルの大規模整形
- 未確認の大量ページ一括変更

push 後:

1. Cloudflare Pages の staging deploy が完了するまで待つ。
2. `https://staging.lexus-ec.pages.dev/<path>` を開く。
3. production と staging を再比較する。
4. 問題が残る場合は同じページで追加修正する。
5. 問題が解消したら台帳に結果を記録し、次のページへ進む。

## 報告フォーマット

各ページ完了時は、短く以下を報告する。

```markdown
## <ページ名>

- production: https://lexus-ec.com/<path>
- staging: https://staging.lexus-ec.pages.dev/<path>
- 方針: 元ページ再現 / ブランド統合リデザイン / 崩れ修正
- 修正内容:
  - ...
- 確認:
  - PC 1440x900: OK / 要再修正
  - mobile 390x844: OK / 要再修正
  - build: OK
  - staging deploy: OK
- commit: <hash>
- 残課題:
  - ...
- 次に直す候補:
  - ...
```

## 最初にやること

このプロンプトを受け取ったら、まず次を行う。

1. `staging` ブランチであることを確認する。
2. `docs/fixed-page-repair-ledger.md` を作成または更新し、URL対応表を整える。
3. production と staging のトップページを見て、トップページのデザイン基準を把握する。
4. 重点改善ページの中から、最も崩れているページを1つ選ぶ。
5. そのページについて、production と staging を desktop / mobile で比較する。
6. コンテナ単位の修正計画を短く作る。
7. 実装、build、ローカル確認、commit、push、staging確認まで完了させる。

急がず、1ページずつ確実に進めること。
