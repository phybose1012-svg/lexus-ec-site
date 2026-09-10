# 慶應2025数学：修復済み正本のステージング反映

2026-09-10。ユーザーが提示した `REMEDIATION-REPORT.md` を確認し、「ステージングに反映よろしく」の指示に基づいて実装。

## 参照と承認の境界

- 元パッケージ：`C:/---hp/shidai-igakubu-gokaku-dokuhon/projects/universities/keio/past-exams/working/2025/general/first-stage/mathematics`。
- 元リポジトリは読み取りのみ。未コミットの修復成果物をユーザーの指定により参照した。元側のcommit/pushは行っていない。
- 元担当の「全21原本ページ照合」「1177項目回帰」「72ブラウザー検査」は元レポートの報告であり、このライブラリ側で再実施した検証とは区別する。
- AIの修復完了は人間の内容承認・権利確認の完了を意味しない。`needsHumanReview`、未承認状態、noindexを維持。本番/mainには反映しない。
- 原解答の文章・図版を転載せず、既存の `original_editorial` 解説を編集。制限付きcropのコピー・トレースなし。

参照時のSHA-256：

| 元ファイル | SHA-256 |
| --- | --- |
| REMEDIATION-REPORT.md | FE7055A85194B82574E8F407ADA807332784937433AFA74A11E41DB15745D811 |
| source-html/reconstruction.json | 026D6F07C342FCC9E5EB3AFCD1F2B2F512B8B2FFD3B1FD109C5BD125EFA6DC17 |
| analysis.json | B2B92EEB237372FCBC78E721F93DCD6927B0DE4721287C0DB0B6760B0C0FD3F8 |
| derived.json | 957E8C32AE2D8233926AAF0D65025922BFC914122A9AF0B41B4751CE6665CE5B |

## 反映内容

- 問題：修復済み `source-html/generated/public-candidate/questions` をquestion-importerで再取込。IIの漸化式・添字、IIIの括弧全体の符号と積分、IVの変数・空欄・直交平面と等角条件・端点条件を復元。
- 問題の表示調整：`frontend/src/data/pastExamOverrides/keio-2025-general-mathematics.json`。4つの「続き」見出しを除き、III/IVの改ページで切れた文章をつなぐだけ。条件や式を変更しない。
- 解説：既存15小問の独立解答を保持。III(1)(ii)は値域と異なる零点の個数から示す元の論証経路へ。IIIには増減表2、置換の区間対応表2を復元し、既存の表コンポーネントを利用。
- IV(2)(i)の射影と交点の関係を説明。保留していたIV(2)(ii)を、反射面 `z=1,y=1,z=2`、直線 `t(a,2-b,2)`、到達時刻の比較、折り戻し、境界 `a=b=2/3` の順に独立導出。
- 図：既存正方形2図を保持し、ケース2のラベル位置だけ調整。立方体図 `iv2-cube-unfolding` を追加。携帯幅で小さくなりすぎない縦配置。ジェネレーターは既存handoffの人間編集保護を継続。
- 分析：保存HTML・analysis.json・derived.jsonをanalysis-importerで再抽出。配点はI `[8,6,6,8,12]`、II `[18,12]`、III `[6,10,12,10,12]`、IV `[10,6,14]`。難易度内訳2/5/5/3。
- 目標：苦手58/150点、99.4分。初期のI(3)を外す**入替ルート**として表示。得意は理論最大136点、95.6分に安全係数0.8を掛け、切り捨て108/150点。旧70/112点の文章を更新。
- III(1)(ii)の証明未完でも命題を使えること、III(2)(iii)は(ii)の答えを要しないことを分析へ明示。
- 数学150/4科目500点は公式資料、100分は問題冊子という異なる根拠を区別。数学単科の合格最低点とは表示しない。

## 再生成

慶應数学は独自編集保護対象であり、汎用バッチで解説・分析を上書きしない。

1. question-importer の `--source-dir` に上記元パッケージの公開候補questionsを指定する。出力は `frontend/src/data/generated/pastExamQuestions/keio-2025-general-mathematics.json`。`--overrides` に上記専用JSONを必ず渡す。既存生成JSONの大学・科目・年度・入試・リンクメタデータを引き継ぐ。
2. `frontend/scripts/import-past-exam-analysis.mjs` に元の `preview-html/public-preview/index.html`、`analysis.json`、`derived.json` を渡し、`src/data/pastExamAnalysisEvidence/keio-2025-general-mathematics.json` へ出力。
3. `frontend` で `npm run past-exam:figures:keio-2025-mathematics`、続けて `npm run build`。
4. `node --test --test-reporter=spec scripts/past-exam-*.test.mjs ../.agents/skills/past-exam-answer-author/scripts/build-answer-page.test.mjs` と `node scripts/audit-past-exam-math.mjs`。
5. figure skillのvalidatorで全3図の構造・PNGを確認。実画面のPC/390pxと、staging実URLを確認する。

## このセッションで実施した検証

- build：1118ページ生成、型チェック成功。
- 回帰233件成功（慶應専用15件）。IIの確率過程、IIIの合成・係数・極値・数値積分、IVの座標とSVG点列を独立計算で検証。修復済み条件、目標ルート、表の符号も固定。
- TeX：14771対象、描画エラー0。
- 全SVG安全性・埋込KaTeXフォント検査。全3図PNGとコンタクトシートを各修正後に目視。
- 問題・解説・分析をローカルPC/390pxで表示。ページ横幅超過とKaTeXエラーなし。表・図の位置と目標点カードを目視。
- 実機印刷/PDFプレビューは今回未確認。既存の印刷CSS回帰のみ実施。

配信結果は継続ログの最新記録を参照。
