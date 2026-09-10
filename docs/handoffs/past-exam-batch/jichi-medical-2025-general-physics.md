# 自治医科大学 2025年度 物理 — 修正担当への依頼

対象元データ: `C:/---hp/shidai-igakubu-gokaku-dokuhon/projects/universities/jichi-medical/past-exams/working/2025/general/first-stage/physics`

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
- **analysis-targets / source-error**: Invalid target candidate or time budget
- **analysis-targets / pending**: Target section retained but scores withheld until validated source is supplied.

## 完了報告

修正した正本の位置、原文→修正後、根拠となるページ・計算、再生成したHTML、テスト結果、未解決事項を列挙する。過去問ライブラリーの再取り込み先IDは `jichi-medical-2025-general-physics`。既存の独自解説へ昇格済みのパッケージは一括取込で上書きしない。

## 元データの未解決項目

元のissues.jsonから取得した編集メモです。完了済みという意味ではありません。

- **provisional-subquestion-scoring-review**: 25設問の仮配点（均等1点×25問＝25点）を科目担当＝編集責任者が確認する。公式に公表されているのは令和7年度学生募集要項の「理科50点（1科目25点）」という科目合計だけで、設問別配点は非公表である。全25設問が同じ1マーク1択形式で解答欄の構造が完全に等しいため、難易度による傾斜をつけず均等配分とした。小問間の配点差は0点で、Lexus所有の上限5点以内に収まっている。公式配点として扱ってはならない。
- **provisional-subject-time-budget-review**: 理科の公式時間枠は2科目合計80分（10:50〜12:10）であり、物理単独の公式時間はない。得点効率とLexus目標の計算に使う物理40分の仮時間配分を、科目担当＝編集責任者が確認する。実際に解答する科目数2で割った値であり、原本解答冊子の講評が述べる「1科目あたり40分程度」とも整合するが、大学公表値ではない。
- **weak-profile-scan-cost-exceeds-budget**: 苦手層のLexus目標が仮0点（0%）になった。原因は小問数と時間枠の組合せである。25小問の初期判断の合計は得意層基準で12.8分だが、苦手層の初期判断4倍を適用すると全問一巡だけで51.2分となり、物理40分の仮時間枠を11.2分超える。実行に使える時間が0分になるため、最大化構成が空集合になった。参考として岩手医科2025物理は24小問・仮60分で一巡48.4分（81%）であり、本パッケージは枠が40分しかないぶん超過する。層別時間倍率と全問一巡の計上方法はLexus所有の設定であるため、この倍率をこの規模のマーク科目へそのまま適用するか、一巡の計上方法を見直すかをユーザーが判断する。AI側で倍率や初期判断時間を変更してはならない。
- **weak-profile-strategy-set-over-budget**: 苦手層の「今解く！」6小問（仮6点）でも所要は56.7分、「今解く！＋後回し」14小問（仮14点）では71.5分となり、いずれも物理40分の仮時間枠を超える。時間圧はどちらも「極めて厳しい」である。戦略ラベル自体は本番の再現性を基準に付けた編集判断だが、苦手層向けの誌面でどこまでを推奨範囲として提示するかは科目担当＝編集責任者が確認する。上記の一巡計上の扱いと合わせて判断する必要がある。
- **rights-review**: 原本図版9点（すべて問題ページ側。回路、磁場内の粒子、波の干渉、開管、全反射、レンズ、p-V図、棒、ばね）の権利確認と、問題HTML公開候補の公開可否を確定する。確認が済むまで公開候補は非公開扱いを維持し、解答・解説HTMLと学習者向け解説は内部限定とする。
- **figure-redraw-review**: 原本クロップ9点はすべて replacement_status が pending_redraw である。差し替えSVGを作成し、科目担当＝編集責任者が反映可否を確認するまで replacement_ready へ変更しない。公開候補は差し替えが済むまで図版が欠けた状態になる。分析側の成果物はこの差し替えを待たずに完成している。
- **subject-editor-review**: 原本16ページの目視確認（source/manifest.json の visual_reviewed）と、パッケージ全体の承認（analysis.json の review.approved）を科目担当＝編集責任者が明示的に行う。AIの目視確認と自動検査の合格は、この人間ゲートを閉じる根拠にしない。
