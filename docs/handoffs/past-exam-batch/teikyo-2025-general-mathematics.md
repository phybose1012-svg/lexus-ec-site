# 帝京大学 2025年度 数学 — 修正担当への依頼

対象元データ: `C:/---hp/shidai-igakubu-gokaku-dokuhon/projects/universities/teikyo/past-exams/working/2025/general/first-stage/mathematics`

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

- **questions / figures-pending**: Question figures require independent reconstruction; dependent questions remain review-only.（2件）
- **answers / figures-pending**: Required visual positions retained; no restricted answer crop copied.（3件）
- **answers / editorial-review**: Imported learner-oriented adaptation; not independently reauthored or fully mathematically verified in this batch.
- **analysis-targets / source-error**: 数学①・②は別日程ですが、元の最大化は2日分の120分を合算しています。苦手層の最大構成は数学①だけで66.2分となり、1日60分の仮枠を超えます。日別の計画が修復されるまで目標点は保留し、合計の半分を1日分の目安にはしません。 (docs/handoffs/past-exam-batch/teikyo-math-source-review.md)
- **analysis-targets / pending**: Target section retained but scores withheld until validated source is supplied.

## 完了報告

修正した正本の位置、原文→修正後、根拠となるページ・計算、再生成したHTML、テスト結果、未解決事項を列挙する。過去問ライブラリーの再取り込み先IDは `teikyo-2025-general-mathematics`。既存の独自解説へ昇格済みのパッケージは一括取込で上書きしない。

## 元データの未解決項目

元のissues.jsonから取得した編集メモです。完了済みという意味ではありません。

- **provisional-subquestion-scoring-review**: 数学①・数学②の小問25件に割り当てた仮配点（各日100点、2日分合計200点）を科目担当＝編集責任者が確認する。空所補充と記述が混在するためmixedとして配分しており、公式の小問別配点ではない。
- **provisional-subject-time-budget-review**: 公式の選択2科目合計120分とは別に、得点効率計算用として数学1日60分、収録2日分合計120分を仮設定した。受験生が実際に解くのは1日分であることを含め、科目担当＝編集責任者がこの集計条件を確認する。
- **combined-subject-window-review**: 公式の選択科目枠には国語・数学・物理・化学・生物が含まれる。共通スキーマに国語のsubject_idが無いため、機械可読subject_idsは数学・物理・化学・生物とし、国語は公式条件の注記と表示本文に保持している。科目担当＝編集責任者がこの表現を確認する。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、原本数式・図版クロップ9点の模写差し替えと内容確認を行う。rights_statusがunknown/restricted、replacement_statusがpending_redrawの間、原本ページ画像・原本クロップ・解答解説は内部レビュー限定とする。
- **subject-editor-review**: 数学科目担当者が、原本21ページのHTML転記、8大問・25小問の構造、学習者向け解説、難易度、五角形評価、層別所要時間、戦略、仮配点、得点効率、Lexus目標をパッケージ単位で確認し、manifestのvisual_reviewedとanalysisのreview.approvedを明示的に判断する。
