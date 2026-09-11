# 杏林大学 2025年度 数学 — 修正担当への依頼

対象元データ: `C:/---hp/shidai-igakubu-gokaku-dokuhon/projects/universities/kyorin/past-exams/working/2025/general/first-stage/mathematics`

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

修正した正本の位置、原文→修正後、根拠となるページ・計算、再生成したHTML、テスト結果、未解決事項を列挙する。過去問ライブラリーの再取り込み先IDは `kyorin-2025-general-mathematics`。既存の独自解説へ昇格済みのパッケージは一括取込で上書きしない。

## 元データの未解決項目

元のissues.jsonから取得した編集メモです。完了済みという意味ではありません。

- **official-score-source-review**: 2025年度一般選抜1次試験の数学100点を、大学公式募集要項の保存原本で科目担当兼編集責任者が再確認する。数学70分は問題原本p.1で確認済み。
- **provisional-subquestion-scoring-review**: 印刷上の8小問へ割り当てた仮配点12点または13点（合計100点）を科目担当兼編集責任者が確認する。公式の小問別配点ではない。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、4次関数グラフ、直角三角形、直交円柱・八面体・断面図など解答図版11点を模写差し替えして内容確認を行う。rights_statusがunknown/restricted、replacement_statusがpending_redrawの間、原本ページ画像・原本クロップ・原本解答解説は内部レビュー限定とする。
- **subject-editor-review**: 数学科目担当者が、原本24ページのHTML転記、3大問・8小問の構造、学習者向け解説、難易度、五角形評価、層別所要時間、戦略、仮配点、得点効率、Lexus目標をパッケージ単位で確認し、manifestのvisual_reviewedとanalysisのreview.approvedを明示的に判断する。
