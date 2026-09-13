# 聖マリアンナ医科大学 2025年度 物理 — 修正担当への依頼

対象元データ: `C:/---hp/shidai-igakubu-gokaku-dokuhon/projects/universities/st-marianna/past-exams/working/2025/general-early/first-stage/physics`

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

修正した正本の位置、原文→修正後、根拠となるページ・計算、再生成したHTML、テスト結果、未解決事項を列挙する。過去問ライブラリーの再取り込み先IDは `st-marianna-2025-general-early-physics`。既存の独自解説へ昇格済みのパッケージは一括取込で上書きしない。

## 元データの未解決項目

元のissues.jsonから取得した編集メモです。完了済みという意味ではありません。

- **official-science-window-review**: 2025年度一般選抜（前期）の募集要項原本で、理科は物理・化学・生物から2科目選択、合計200点・150分であることを科目担当者が再確認する。
- **provisional-score-and-time-review**: 分析用に物理100点・75分へ等分した仮設定と、18分析小問へ5〜7点、合計100点とした仮配点を科目担当兼編集責任者が判断する。公式の物理単独配点・時間、小問別配点ではない。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、restricted/pending_redrawの原本図版クロップ10点を権利処理済み画像へ差し替える。完了までは内部レビュー限定とする。
- **source-html-record-reconciliation**: SOURCE-HTML-RECORD.mdに残る内部トップ科目名『数学』の既知表示不具合記述と、今回原本どおりに補正した解答p.2／p.3間の5ブロック所属を、原本HTMLレーンの記録管理者が履歴を保って追記確認する。
- **subject-editor-review**: 物理科目担当者が原本15ページ、問題ブロック50/50、5大問18分析小問、学習者向け解説、難易度・時間・戦略を一括レビューし、manifestのvisual_reviewedとanalysis.review.approvedを明示判断する。
