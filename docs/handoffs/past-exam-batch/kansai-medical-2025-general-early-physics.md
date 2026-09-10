# 関西医科大学 2025年度 物理 — 修正担当への依頼

全問監査の具体的な依頼は [kansai-physics-source-review.md](kansai-physics-source-review.md) を併せて読んでください。軸・原子番号の欠落、実験モデル、導出・近似・符号、目標点計画を9区分で記録しています。Lexus側の6図は独自SVGへ置換済みですが、本文・権利・人間承認は未完了です。

対象元データ: `C:/---hp/shidai-igakubu-gokaku-dokuhon/projects/universities/kansai-medical/past-exams/working/2025/general-early/first-stage/physics`

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
- **analysis-targets / source-error**: Invalid target prerequisite or candidate (weak, now): phys-q1-4: requires absent phys-q1-3
- **analysis-targets / pending**: Target section retained but scores withheld until validated source is supplied.

## 完了報告

修正した正本の位置、原文→修正後、根拠となるページ・計算、再生成したHTML、テスト結果、未解決事項を列挙する。過去問ライブラリーの再取り込み先IDは `kansai-medical-2025-general-early-physics`。既存の独自解説へ昇格済みのパッケージは一括取込で上書きしない。

## 元データの未解決項目

元のissues.jsonから取得した編集メモです。完了済みという意味ではありません。

- **official-score-time-review**: 原本の理科2科目120分から物理60分とした仮時間、物理100点への仮換算、24設問への4点・5点仮配点を募集要項原本と科目担当者が確認する。
- **lexus-time-model-review**: 物理60分の仮設定に基づく得意・苦手層の時間倍率、前問依存、Lexus目標を確認する。
- **learner-editorial-review**: 4大問24設問の学習者向け解説について、実験データ換算、ローレンツ力、二重ドップラー効果、半減期計算を物理科目担当者が確認する。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、restrictedかつpending_redrawの原本図版クロップ6点を模写差し替えする。
- **subject-editor-review**: 物理科目担当者が原本16ページ、4大問24設問、学習者向け解説、分析を一括レビューし、manifestのvisual_reviewedとanalysis.review.approvedを明示判断する。
