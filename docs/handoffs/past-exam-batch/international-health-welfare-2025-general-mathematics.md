# 国際医療福祉大学 2025年度 数学 — 修正担当への依頼

対象元データ: `C:/---hp/shidai-igakubu-gokaku-dokuhon/projects/universities/international-health-welfare/past-exams/working/2025/general/first-stage/mathematics`

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

修正した正本の位置、原文→修正後、根拠となるページ・計算、再生成したHTML、テスト結果、未解決事項を列挙する。過去問ライブラリーの再取り込み先IDは `international-health-welfare-2025-general-mathematics`。既存の独自解説へ昇格済みのパッケージは一括取込で上書きしない。

## 元データの未解決項目

元のissues.jsonから取得した編集メモです。完了済みという意味ではありません。

- **official-score-source-review**: 2025年度医学部一般選抜の数学200点、第一次試験合計600点を、2025年度学生募集要項の公式PDF原本で科目担当兼編集責任者が再確認する。現パッケージでは原本問題の『数学80分』と公開二次情報で照合している。
- **provisional-subquestion-scoring-review**: 16小問へ割り当てた仮配点（12点または13点、合計200点）を科目担当兼編集責任者が確認する。公式の小問別配点ではない。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、原本図版クロップ4点の模写差し替えと内容確認を行う。rights_statusがunknown/restricted、replacement_statusがpending_redrawの間、原本ページ画像・原本クロップ・原本解答解説は内部レビュー限定とする。
- **subject-editor-review**: 数学科目担当者が、原本16ページのHTML転記、4大問・16小問の構造、学習者向け解説、難易度、五角形評価、層別所要時間、戦略、仮配点、得点効率、Lexus目標をパッケージ単位で確認し、manifestのvisual_reviewedとanalysisのreview.approvedを明示的に判断する。
