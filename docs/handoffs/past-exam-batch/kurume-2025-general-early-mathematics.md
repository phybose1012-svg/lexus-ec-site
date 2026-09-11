# 久留米大学医学部 2025年度 数学 — 修正担当への依頼

対象元データ: `C:/---hp/shidai-igakubu-gokaku-dokuhon/projects/universities/kurume/past-exams/working/2025/general-early/first-stage/mathematics`

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

修正した正本の位置、原文→修正後、根拠となるページ・計算、再生成したHTML、テスト結果、未解決事項を列挙する。過去問ライブラリーの再取り込み先IDは `kurume-2025-general-early-mathematics`。既存の独自解説へ昇格済みのパッケージは一括取込で上書きしない。

## 元データの未解決項目

元のissues.jsonから取得した編集メモです。完了済みという意味ではありません。

- **total-points-primary-source-review**: 科目満点100点の2025年度一次資料を科目担当＝編集責任者が確認する。現パッケージの100点は既存の2025年度日程資料と、大学公式サイトで確認できる現行入試の数学100点という反復条件に基づく編集上の仮置きであり、2025年度公式配点として断定してはならない。
- **provisional-subquestion-scoring-review**: 13小問の仮配点（7点または8点、合計100点、最大差1点）を科目担当＝編集責任者が確認する。小問別の公式配点は確認できておらず、解答欄数と処理量を補助基準にした編集モデルである。
- **weak-profile-scan-cost-review**: 苦手層の初期判断4倍による全13小問の一巡が56.4分となり、公式科目時間90分の約63%を占める。実行に使える時間は33.6分で、最大化構成は仮30点・合計88.8分となった。層別時間倍率はLexus所有の設定であるため、この一巡コストとLexus目標30%をそのまま採用するかをユーザーが判断する。AI側で倍率を変更してはならない。
- **rights-review**: 問題・解答原本と原本クロップ7点の権利確認、および問題HTML公開候補の公開可否を確定する。確認が済むまで公開候補は非公開扱いを維持し、解答・解説HTMLと学習者向け解説HTMLは内部限定とする。
- **figure-redraw-review**: 原本クロップ7点は replacement_status が pending_redraw である。差し替え図版を作成し、科目担当＝編集責任者が反映可否を確認するまで replacement_ready へ変更しない。
- **editorial-explanation-review**: 学習者向け解説レイヤー（source-html/editorial-explanations.json、大問5題分）は原本解説の解法と順序を保存して再構成した草案である。科目担当＝編集責任者が原本転記ビュー（internal/source-answers/）と並べて、13小問の答え・式変形・場合分けを確認する。
- **subject-editor-review**: 原本15ページの人間による目視確認（visual_reviewed）と、パッケージ全体の承認（review.approved）を科目担当＝編集責任者が明示的に行う。AIの全ページ目視と自動検査の合格は、この人間ゲートを閉じる根拠にしない。
