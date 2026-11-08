# 医学部過去問鬼研究：埼玉医科大学2025年度前期数学

## 記事と編集する場所

- 記事：`/oni-research/saitama-medical/2025/early/mathematics/`
- 連載の入口：`/oni-research/`
- 本文正本：`frontend/src/data/oniResearch/saitama-medical-2025-early-mathematics.json`
- ページ：`frontend/src/pages/oni-research/saitama-medical/2025/early/mathematics/index.astro`
- 表示部品：`frontend/src/components/oni-research/`
- 記事固有CSS：`frontend/src/styles/oni-research.css`

SiteLayoutのヘッダー・フッター、global.cssとarticles.cssの書体・色・記事部品を使用。共有デザインの変更はない。過去問ライブラリーから連載の入口へリンクを1本追加した。

JSONの設問IDは q1-1〜q4-2 の10件。問題内容は原文の要約、解説・判断理由は記事用の独自文。各設問に解答、段階的説明、得意／苦手の判断、撤退目安、依存する前問、誤答注意、復習、原本の欄番号との対応を収録する。JSONには大学・年度・方式・段階・科目も保持し、ナレッジへの再利用単位とする。

## 内容確認

埼玉医科大学2025年度・一般前期・数学50分、4大問10小問39欄。問題原本の掲載頁19〜21、解説原本の掲載頁75〜82を元データと照合。原本画像は再レンダリングせず、既存ページ画像を参照した。

全10小問について、指数関数の最小値、中心まわりの回転、射影による最接近、最適速度比、円・直交・面積比・120度・PTの長さ、非負整数解の列挙を独立計算。第4問の組合せは高校数学のC記法を使用する。

重要な修正：第2問・問3は k=(-1+√5)/2。原本では20番の枠の外に負号が印刷され、20番の正答は1。旧HTMLの20=−を記事へ引き継がない。原本解答掲載頁76でも20=1を確認。記事データのcorrectionsに根拠を記録した。既存ライブラリーの生成元や人間の承認フラグは変更しない。

第3問のSVGは、登録済み・条件から独立作図・restrictedSourceCopied=falseの既存図版を参照。t=2.2の配置例なので、問2の解答t=√3の縮尺図とは区別してキャプションを付ける。原本画像の公開用複製はない。

## 分析の条件

難度・時間・撤退目安は編集推定。公式の小問配点は不明なので、仮配点、マーク数による換算、合否予測は提示しない。苦手層は短い6小問を優先し、第2問・問3の前半は確保候補、後半と第3問・問2・問3は見送り候補とする。得意層は問3の前問依存も考慮し、前問が解けたら後続を確認する。いずれも単年度の判断で、複数年の傾向と称さない。

## 検証

`node --test frontend/scripts/oni-research-saitama-2025-math.test.mjs frontend/scripts/past-exam-saitama-early-math.test.mjs`：12件合格。

`CF_PAGES_BRANCH=staging npm --prefix frontend run build`：成功。Astro checkは0 errors、0 warnings（既存コードの16 hints）、1,138ページを出力。既存FIBONAバンドルに関するViteのeval／大きいchunkの警告は今回の変更箇所ではない。

PC 1366×900、スマホ390×844でヘッダー・ヒーロー・表・開いた解説・図・マーク一覧を確認。数式279件の描画エラー0、全10解説の一括開閉、受験生像の切替を確認。ステージングではnoindexを保つ。

## 公開範囲

利用者の指示によるstaging確認用。本番mainへの反映は含まない。statusはstaging_reviewで、人間による内容承認済みの状態にはしていない。公開記事を固定保存する際は、その版のJSONと根拠指紋を残す。
