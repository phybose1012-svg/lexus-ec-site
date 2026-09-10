# 川崎医科大学 2025年度 数学 — 修正担当への依頼

対象元データ: `C:/---hp/shidai-igakubu-gokaku-dokuhon/projects/universities/kawasaki-medical/past-exams/working/2025/general-regional-quota/first-stage/mathematics`

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

全17原本ページの対照で検出した本文・論理・分析の不備は、[詳細な修復依頼](kawasaki-math-source-review.md)を優先して確認してください。登録済み解説8図はLexusで独自SVG化しましたが、本文・権利・人間レビューの承認ではありません。

- **answers / editorial-review**: Imported learner-oriented adaptation; not independently reauthored or fully mathematically verified in this batch.

## 完了報告

修正した正本の位置、原文→修正後、根拠となるページ・計算、再生成したHTML、テスト結果、未解決事項を列挙する。過去問ライブラリーの再取り込み先IDは `kawasaki-medical-2025-general-regional-quota-mathematics`。既存の独自解説へ昇格済みのパッケージは一括取込で上書きしない。

## 元データの未解決項目

元のissues.jsonから取得した編集メモです。完了済みという意味ではありません。

- **provisional-scoring-review**: 保存原本で数学の科目満点を確認し、仮100点および第1問34・第2問33・第3問33の編集配点を科目担当者が確認する。
- **strategy-time-review**: 原本記載の数学80分を用いた9小問の時間、苦手・得意層戦略、Lexus目標を科目担当者が確認する。
- **editorial-explanation-review**: 学習者向け解説13原本頁分が原本の答え・解法・順序を保つことを原本転記ビューと並べて科目担当者が確認する。
- **rights-and-redraw-review**: 内部限定の原本クロップ8点の権利を確認し、replacement.svgを用意して承認後に模写へ差し替える。
- **subject-editor-approval**: 原本17頁の人間目視、分析・解説・難易度・仮配点・戦略を科目担当者＝編集責任者が一括承認する。AI検査だけでvisual_reviewedやapprovedをtrueにしない。
