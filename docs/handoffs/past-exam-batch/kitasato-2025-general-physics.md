# 北里大学 2025年度 物理 — 修正担当への依頼

対象元データ: `C:/---hp/shidai-igakubu-gokaku-dokuhon/projects/universities/kitasato/past-exams/working/2025/general/first-stage/physics`

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

修正した正本の位置、原文→修正後、根拠となるページ・計算、再生成したHTML、テスト結果、未解決事項を列挙する。過去問ライブラリーの再取り込み先IDは `kitasato-2025-general-physics`。既存の独自解説へ昇格済みのパッケージは一括取込で上書きしない。

## 元データの未解決項目

元のissues.jsonから取得した編集メモです。完了済みという意味ではありません。

- **official-score-time-review**: 公式の理科2科目一括100分・200点から物理50分・100点とした仮時間、17設問への5〜7点仮配点を募集要項原本と科目担当者が確認する。
- **lexus-time-model-review**: 物理50分の仮設定に基づく得意・苦手層の時間倍率、設問依存、Lexus目標を確認する。
- **learner-editorial-review**: 3大問17設問の学習者向け解説について、コンデンサーの電荷一定、非慣性系の振動、荷電粒子軌道を物理科目担当者が確認する。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、restrictedかつpending_redrawの原本図版クロップ8点を模写差し替えする。
- **subject-editor-review**: 物理科目担当者が原本16ページ、3大問17設問、学習者向け解説、分析を一括レビューし、manifestのvisual_reviewedとanalysis.review.approvedを明示判断する。
