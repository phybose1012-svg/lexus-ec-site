# 過去問ライブラリーのSEO確認

## 共通実装

- タイトル・説明・canonical・JSON-LDは `src/lib/pastExamSeo.mjs` に集約する。問題／解答・解説／出題分析は役割を明確に区別する。
- 大学名・年度・科目・入試区分・大問数は掲載データから取得する。未収録の内容や「大学公式解答」「合格保証」などを記載しない。
- URLは `/past-exam-library/{university}/{year}/{subject}/{questions|answers|analysis}/` を維持。見た目だけの理由で既存URLを変更しない。やむを得ない変更時は旧URLの301転送と内部リンク更新をセットで行う。
- 画面上のパンくずと `BreadcrumbList` は同じ配列を使用する。`breadcrumb` は `WebPage` / `CollectionPage` に置き、教材は `LearningResource` として `mainEntity` で結ぶ。
- 構造化データに掲載されていない情報、架空の日付・評価・FAQを加えない。試験問題の出題者とレクサスの編集・解説を混同しない。
- JSON-LDのscriptは共通コンポーネントで安全にシリアライズする。
- 本文のh1は1つ。大問h2・小問h3を維持し、ナビゲーションはnav、一覧はリスト、項目と値はdl、表はtable/thを使用する。数式・図表の原稿と印刷レイアウトをSEO変更で改変しない。
- 内容を伝える画像には内容に合うalt、装飾帯・文章と重複する装飾キャラクターには空のalt。図表の意味は省略しない。ダミー図版を完成図として説明しない。

## 検査

1. `npm run build`
2. `npm run past-exam:seo:test`（出力HTMLのメタタグ、JSON-LD、パンくず、見出し、alt、canonical、検索制御）
3. `npm run past-exam:ui:test`（問題・解説の数学HTMLと印刷設定の回帰検査）
4. 新しい大学・年度を追加した際は、SEO検査の対象ルートにも追加する。
5. ステージング反映後は `PAST_EXAM_VERIFY_ORIGIN` を指定して同じSEO検査を再実行できる。

## 公開前の注意

- **SEO整備と本番公開の承認は別。** 現在、大学別一覧と問題・解答・分析は明示的なnoindexを保持し、サイトマップには含めていない。
- ステージングは共通レイアウトのnoindexとCloudflareのX-Robots-Tagを維持する。robots.txtでクロールを遮断してnoindexを読めなくする変更はしない。
- 本番掲載の承認・内容と権利の確認後に限り、対象ページのnoindexを解除し、そのcanonicalをサイトマップへ追加する。確認用表示も公開状態に合わせて見直す。
- 公開後にGoogleのリッチリザルトテスト／Search Consoleで再確認する。JSON-LDの整備は検索順位やリッチリザルト表示を保証しない。

参照: [Googleのタイトル指針](https://developers.google.com/search/docs/appearance/title-link)、[構造化データ指針](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)、[パンくず](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)。
