# 日本大学医学部 2025年度 数学 — 修正担当への依頼

対象元データ: `C:/---hp/shidai-igakubu-gokaku-dokuhon/projects/universities/nihon-u/past-exams/working/2025/n-unified-first/second-stage/mathematics`

## 方針

- 元リポジトリの AGENTS.md と該当過去問スキルを読む。別方式・別段階の同名 package_id と混同しない。
- reconstruction.json / editorial-explanations.json / analysis.json を正本として修復し、生成HTMLだけを編集しない。
- 原本の各ページ画像と照合し、全問・全解答欄・TeX・前提条件・依存関係・図表を監査する。以下は自動検査で検出した項目であり、全文の正誤を保証するリストではない。
- 不明な値や欠けた条件を推測で補完しない。未解決項目は issues.json に残す。
- 検証不能の目標点を出さず、仮配点・公式試験時間・仮時間配分を区別する。
- 制限付き図版は複製せず、条件に基づく独自SVGへ置換する。
- 再生成後に元データvalidator、desktop/mobileでの全ページ表示と数式、印刷を確認する。
- 変更はこのパッケージに限定。他担当の変更を上書きしない。ステージング掲載許可は2026-09-09のユーザー指示あり。本番公開の承認とは別。

## 検出事項

- **answers / editorial-review**: Imported learner-oriented adaptation; not independently reauthored or fully mathematically verified in this batch.

## 完了報告

修正した正本の位置、原文→修正後、根拠となるページ・計算、再生成したHTML、テスト結果、未解決事項を列挙する。過去問ライブラリーの再取り込み先IDは `nihon-u-2025-n-unified-first-mathematics-second-stage`。既存の独自解説へ昇格済みのパッケージは一括取込で上書きしない。

## 元データの未解決項目

元のissues.jsonから取得した編集メモです。完了済みという意味ではありません。

- **provisional-subquestion-scoring-review**: {"id":"provisional-subquestion-scoring-review","status":"open","severity":"review_required","summary":"各大問20点・合計60点は公式だが、9小問への内訳は編集上の仮配点であり公式小問別配点ではない。","owner":"subject_editor"}
- **lexus-time-and-target-review**: {"id":"lexus-time-and-target-review","status":"open","severity":"review_required","summary":"小問別時間と層別Lexus目標は、公式60分を用いた編集モデルによる仮定である。","owner":"subject_editor"}
- **learner-editorial-review**: {"id":"learner-editorial-review","status":"open","severity":"review_required","summary":"学習者向け解説は原本の解法順を保った編集稿であり、数学担当による論理・式変形・答案表現の確認が必要。","owner":"subject_editor"}
- **restricted-crop-redraw-review**: {"id":"restricted-crop-redraw-review","status":"open","severity":"publication_blocker","summary":"内部限定クロップ6点はpending_redrawであり、公開前に模写差し替えと対応確認が必要。","owner":"art_and_rights"}
- **rights-review**: {"id":"rights-review","status":"open","severity":"publication_blocker","summary":"原本問題・解答解説のrights_statusはunknown。公開判断前に権利確認が必要。","owner":"rights"}
- **subject-editor-review**: {"id":"subject-editor-review","status":"open","severity":"publication_blocker","summary":"科目担当＝編集責任者による原本、分析、解説、表示の一括承認が未了。","owner":"subject_editor"}
