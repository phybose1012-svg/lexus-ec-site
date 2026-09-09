# 獨協医科大学 2025年度 物理 — 修正担当への依頼

対象元データ: `C:/---hp/shidai-igakubu-gokaku-dokuhon/projects/universities/dokkyo-medical/past-exams/working/2025/general-early/first-stage/physics`

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

- **questions / figures-pending**: Question figures require independent reconstruction; dependent questions remain review-only.（3件）
- **answers / editorial-review**: Imported learner-oriented adaptation; not independently reauthored or fully mathematically verified in this batch.

## 完了報告

修正した正本の位置、原文→修正後、根拠となるページ・計算、再生成したHTML、テスト結果、未解決事項を列挙する。過去問ライブラリーの再取り込み先IDは `dokkyo-medical-2025-general-early-physics`。既存の独自解説へ昇格済みのパッケージは一括取込で上書きしない。

## 元データの未解決項目

元のissues.jsonから取得した編集メモです。完了済みという意味ではありません。

- **provisional-subquestion-scoring-review**: 21小問の仮配点（基本5点、第2問問2・第3問問3・第4問問1・第5問問1・第5問問2のみ4点、合計100点）を科目担当＝編集責任者が確認する。物理の科目満点100点は令和7年度学生募集要項の公式値だが、小問別配点は非公表である。仮配点は、全21問が選択肢から1つ選ぶ形式で解答欄数が等しいことを前提に、ほぼ均等配分を出発点として工程量だけを補助基準とした編集モデルであり、難易度は配分に使っていない。実際の配点差は1点である。
- **provisional-subject-time-budget-review**: 理科の公式時間枠は2科目合計120分（12:50〜14:50）であり、物理単独の公式時間はない。得点効率とLexus目標の計算に使う物理60分の仮時間配分を、科目担当＝編集責任者が確認する。公式値として扱ってはならない。
- **weak-profile-scan-cost-review**: 小問21問という規模では、苦手層の初期判断4倍による全問一巡の時間が44.4分となり、仮時間60分の74%を占める。実行に使える時間は15.6分しか残らず、苦手層の「今解く！」9問（仮41点・実行17.5分）は仮時間内に収まらない（合計61.9分）。そのためLexus目標は最大化構成の仮37点（37%）となった。層別時間倍率はLexus所有の設定であるため、小問数の多いマーク科目でこの倍率をそのまま適用するか、全問一巡の計上方法を見直すかをユーザーが判断する。AI側で倍率を変更してはならない。
- **standardized-scoring-comparability-review**: 獨協医科大学は各科目の採点結果を標準偏差で標準化した相対得点で判定する（令和7年度学生募集要項 PDF 11ページ目）。合格最低点も公表されていない。したがって本パッケージの仮配点による自己採点は、合否ラインとの直接比較に使えない。この制約を読者向け表示でどう明示するかを科目担当＝編集責任者が確認する。
- **source-transcription-correction-review**: 分析中に原本転記の誤りを3か所検出し、原本ページ画像と照合して修正した。科目担当＝編集責任者が原本と再照合する。(1) 解答p006 第4問問3の設問要約が「R₂の電流の大きさが 1/6・I₀ になったとき」となっていたが、原本は「I₀ になったとき」である。(2) 同じく解答p006 のキルヒホッフの式が「0=2R・I₀/6−V₁′+V₂′」および「0=(1/6)V−V₁′+V₂′」となっていたが、原本は「0=RI₀−V₁′+V₂′」「0=(1/2)V−V₁′+V₂′」である。誤った式は直後に転記されている V₁′=5V/9、V₂′=V/18 と整合しない。(3) 解答p008 の分子量の式が「3kT₂」と添字付きで転記されていたが、原本は添字なしの「3kT」である。あわせて解答p003 の半減期の単位を原本の「日」表記に合わせた（従来は [day]）。
- **rights-review**: 原本図版11点（すべて問題側）の権利確認と、問題HTML公開候補の公開可否を確定する。確認が済むまで公開候補は非公開扱いを維持し、解答・解説HTMLと学習者向け解説HTMLは内部限定とする。
- **figure-redraw-review**: 原本クロップ11点はすべて replacement_status が pending_redraw である。差し替えSVGを作成し、科目担当＝編集責任者が反映可否を確認するまで replacement_ready へ変更しない。公開候補は差し替えが済むまで図版が欠けた状態になる。
- **editorial-explanation-review**: 学習者向け解説レイヤー（source-html/editorial-explanations.json、大問5題分）は原本解説の解法・順序・場合分けを保存したうえで言い回しと段落のみを編集した草案である。科目担当＝編集責任者が原本転記ビュー（internal/source-answers/）と並べて照合し、解法の入れ替えや中間値の先出しがないことを確認する。
- **subject-editor-review**: 原本23ページの目視確認（visual_reviewed）と、パッケージ全体の承認（review.approved）を科目担当＝編集責任者が明示的に行う。AIの目視確認と自動検査の合格は、この人間ゲートを閉じる根拠にしない。
