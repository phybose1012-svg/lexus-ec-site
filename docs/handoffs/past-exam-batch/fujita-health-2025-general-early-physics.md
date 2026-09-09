# 藤田医科大学 2025年度 物理 — 修正担当への依頼

対象元データ: `C:/---hp/shidai-igakubu-gokaku-dokuhon/projects/universities/fujita-health/past-exams/working/2025/general-early/first-stage/physics`

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
- **analysis-targets / source-error**: Invalid target prerequisite or candidate (weak, now_plus_later): phys-q2-7: requires absent phys-q2-6
- **analysis-targets / pending**: Target section retained but scores withheld until validated source is supplied.

## 完了報告

修正した正本の位置、原文→修正後、根拠となるページ・計算、再生成したHTML、テスト結果、未解決事項を列挙する。過去問ライブラリーの再取り込み先IDは `fujita-health-2025-general-early-physics`。既存の独自解説へ昇格済みのパッケージは一括取込で上書きしない。

## 元データの未解決項目

元のissues.jsonから取得した編集メモです。完了済みという意味ではありません。

- **official-score-source-review**: 2025年度募集要項原本で、理科2科目200点から物理100点とする科目別換算の扱いを科目担当兼編集責任者が再確認する。
- **provisional-subquestion-scoring-review**: 28小問へ割り当てた仮配点3点または4点、合計100点を科目担当兼編集責任者が確認する。公式小問別配点ではない。
- **provisional-subject-time-budget-review**: 理科2科目120分を等分した物理60分の仮時間配分を確認する。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、原本図版クロップ10点を模写差し替えする。restricted/pending_redrawの間は内部レビュー限定とする。
- **subject-editor-review**: 物理科目担当者が原本13ページ、4大問28小問・32解答成分、学習者向け解説、分析を一括レビューし、manifestのvisual_reviewedとanalysis.review.approvedを明示判断する。
