# 埼玉医科大学 2025年度 物理 — 修正担当への依頼

原本全ページの照合で見つかった具体的な修復箇所は、[追加の修復依頼](saitama-early-physics-source-review.md)を必ず併せて確認してください。

対象元データ: `C:/---hp/shidai-igakubu-gokaku-dokuhon/projects/universities/saitama-medical/past-exams/working/2025/general-early/first-stage/physics`

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
- **analysis-targets / source-error**: 前問依存の登録が不足しています。苦手層の最大構成は欄16の温度計算を選びながら、必要なおもりの質量を求める欄15を含みません。独立に解く場合の時間も未検証のため、目標点は元データ修復後に再確認します。 (docs/handoffs/past-exam-batch/saitama-early-physics-source-review.md)
- **analysis-targets / pending**: Target section retained but scores withheld until validated source is supplied.

## 完了報告

修正した正本の位置、原文→修正後、根拠となるページ・計算、再生成したHTML、テスト結果、未解決事項を列挙する。過去問ライブラリーの再取り込み先IDは `saitama-medical-2025-general-early-physics`。既存の独自解説へ昇格済みのパッケージは一括取込で上書きしない。

## 元データの未解決項目

元のissues.jsonから取得した編集メモです。完了済みという意味ではありません。

- **source-transcription-corrections**: {"id":"source-transcription-corrections","status":"open","severity":"high","summary":"問題p001の半円筒面名BOD→BCD、問題p009の位置エネルギー指数10^-13→10^-10という原本照合修正2件を科目担当者が確認する。"}
- **official-2025-score-source**: {"id":"official-2025-score-source","status":"open","severity":"high","summary":"2025年度一般選抜（前期）一次の物理100点を大学公式募集要項の保存原本で再確認する。理科2科目90分は問題原本p001で確認済み。"}
- **score-allocation**: {"id":"score-allocation","status":"open","severity":"medium","summary":"31解答欄へ2〜4点を割り当て、大問別30・30・40点とした仮配点を科目担当者が確認する。"}
- **time-strategy**: {"id":"time-strategy","status":"open","severity":"medium","summary":"理科2科目90分から物理45分とした仮時間、時間モデル、層別戦略、Lexus目標を確認する。"}
- **editorial-review**: {"id":"editorial-review","status":"open","severity":"high","summary":"学習者向け解説5原本ページ分を、原本の解法順・数式・答えと物理科目担当者が照合する。"}
- **rights-redraw**: {"id":"rights-redraw","status":"open","severity":"high","summary":"内部限定クロップ3点の権利を確認し、公開前に模写へ差し替える。"}
- **human-visual-review**: {"id":"human-visual-review","status":"open","severity":"high","summary":"原本14ページを科目担当者が確認し、source manifestのvisual_reviewedを明示判断する。"}
- **human-approval**: {"id":"human-approval","status":"open","severity":"high","summary":"分析、解説、難易度、レーダー、戦略、権利状態を科目担当者が一括承認する。"}
