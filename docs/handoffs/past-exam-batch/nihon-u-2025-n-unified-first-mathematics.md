# 日本大学医学部 2025年度 数学 — 修正担当への依頼

対象元データ: `C:/---hp/shidai-igakubu-gokaku-dokuhon/projects/universities/nihon-u/past-exams/working/2025/n-unified-first/first-stage/mathematics`

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

修正した正本の位置、原文→修正後、根拠となるページ・計算、再生成したHTML、テスト結果、未解決事項を列挙する。過去問ライブラリーの再取り込み先IDは `nihon-u-2025-n-unified-first-mathematics`。既存の独自解説へ昇格済みのパッケージは一括取込で上書きしない。

## 元データの未解決項目

元のissues.jsonから取得した編集メモです。完了済みという意味ではありません。

- **provisional-subquestion-scoring-review**: 小問18件の仮配点（合計100点）を科目担当＝編集責任者が確認する。数学の科目配点100点は2025年度N全学統一方式募集要項の公式値だが、小問別配点は非公表である。全問マークシート方式のため、ほぼ均等配分から出発し小問間の配点差を4点〜7点（差3点）に収めた。公式配点ではない。
- **subquestion-split-review**: 原本の大問VI（2）は「図形Dの面積」と「Dをy軸のまわりに1回転してできる立体の体積」という互いに独立した2つの要求を1つの小問番号にまとめている。分析では独立に評価できる最小単位として math-q6-2a／math-q6-2b の2小問に分けた（分析上の小問数18、原本の小問番号数17）。この分割の可否を科目担当が確認する。
- **weak-profile-initial-judgment-share-review**: 苦手層の初期判断時間（Lexusの層別倍率4倍）は、小問18問で35.6分となり公式60分の59%を占める。残る解答実行時間は24.4分で、これが苦手層のLexus目標を42点に押し下げている主因である。この時間モデルを本パッケージへ適用してよいか、科目担当＝編集責任者が確認する。倍率も基準時間もLexus所有の入力であり、目標値をよく見せるために縮めていない。
- **standardized-score-comparability-review**: 一次試験の成績は標準化得点で算出され、換算式は非公表である（2025年度入学者選抜結果の備考）。公表されている一次合格者最低点230.55/400と受験生の素点自己採点は直接比較できない。読者向け表示でこの但し書きをどこまで書くかを科目担当が確認する。
- **answer-key-transcription-fix-review**: 分析中に原本転記の誤りを2件見つけて修正した。(1) 解答一覧の解答欄1の値が「−1」となっていたが、原本解答p.1の印字は「3」であり、解説本文の「B は 3 より大きく 8 より小さい x の集合」という結論とも一致するため3へ直した。(2) 解答一覧6ブロックが answer_key の項目キーを items ではなく entries で保持していたため、生成HTMLの解答一覧が空で出力されていた。キー名を items へ直し、区切り記号を生成器が解釈する全角スラッシュへそろえた。科目担当が原本ページ画像と再生成後の解答一覧を照合する。
- **crop-redraw-review**: 解答解説の図版3点（ans-q3-triangle／ans-q5-square-series／ans-q6-rotation-region）は全件 pending_redraw・rights_status: restricted のまま。replacement.svg が用意された後、科目担当が模写内容を確認して replacement_ready へ進める。元クロップとSVGの縦横比は一致しなくてよい。
- **rights-review**: 問題・解答原本の公開利用範囲を確認する。権利状態が restricted の間、原本ページ画像と原本クロップ、解答解説は内部限定に留め、問題HTMLの一般公開候補も非公開扱いとする。
- **subject-editor-review**: 数学科目担当者＝編集責任者が、原本12ページの目視確認（manifest の visual_reviewed）と、問題構造・小問別難易度・レーダー5軸・層別所要時間・戦略・仮配点・得点効率・Lexus目標・学習者向け解説をパッケージ単位で確認し、review.approved の可否を記録する。AIの機械検査と目視証跡は承認の根拠にしない。
