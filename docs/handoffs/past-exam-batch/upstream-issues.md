# 元データの未解決事項（同期記録）

新規取込62パッケージに340件。元のissues.jsonのitems/ issues両形式を読み取った編集メモであり、ここで新たに検証・解決したものではありません。権利・仮配点・時間配分・科目担当レビューも含まれます。元ソースは変更していません。各担当は大学別依頼と合わせて参照してください。

## aichi-medical-2025-general-mathematics

元データ: `projects/universities/aichi-medical/past-exams/working/2025/general/first-stage/mathematics/issues.json`

- **provisional-subquestion-scoring-review**: {"id":"provisional-subquestion-scoring-review","status":"open","severity":"review_required","summary":"14主設問の仮配点合計100点は編集上の配分であり、公式小問別配点ではない。","owner":"subject_editor"}
- **lexus-time-and-target-review**: {"id":"lexus-time-and-target-review","status":"open","severity":"review_required","summary":"小問別時間と層別Lexus目標は、公式80分を用いた編集モデルによる仮定である。","owner":"subject_editor"}
- **learner-editorial-review**: {"id":"learner-editorial-review","status":"open","severity":"review_required","summary":"学習者向け解説は原本の解法順を保った編集稿であり、数学担当による論理・式変形・答案表現の確認が必要。","owner":"subject_editor"}
- **restricted-crop-redraw-review**: {"id":"restricted-crop-redraw-review","status":"open","severity":"publication_blocker","summary":"内部限定クロップ4点はpending_redrawであり、公開前に模写差し替えと対応確認が必要。","owner":"art_and_rights"}
- **rights-review**: {"id":"rights-review","status":"open","severity":"publication_blocker","summary":"原本問題・解答解説のrights_statusはunknown。公開判断前に権利確認が必要。","owner":"rights"}
- **subject-editor-review**: {"id":"subject-editor-review","status":"open","severity":"publication_blocker","summary":"科目担当＝編集責任者による原本、分析、解説、表示の一括承認が未了。","owner":"subject_editor"}

## aichi-medical-2025-general-physics

元データ: `projects/universities/aichi-medical/past-exams/working/2025/general/first-stage/physics/issues.json`

- **official-score-time-review**: 公式の理科2科目一括100分・200点から物理50分・100点とした仮時間、16設問への6〜7点仮配点を2025年度募集要項原本と科目担当者が確認する。
- **lexus-time-model-review**: 物理50分の仮設定に基づく得意・苦手層の時間倍率、設問依存、Lexus目標を確認する。
- **learner-editorial-review**: 2大問16設問の学習者向け解説について、電場と電位の符号、位相空間の楕円、量子化への接続を物理科目担当者が確認する。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、restrictedかつpending_redrawの原本図版クロップ6点を模写差し替えする。
- **subject-editor-review**: 物理科目担当者が原本13ページ、2大問16設問、学習者向け解説、分析を一括レビューし、manifestのvisual_reviewedとanalysis.review.approvedを明示判断する。

## dokkyo-medical-2025-general-early-mathematics

元データ: `projects/universities/dokkyo-medical/past-exams/working/2025/general-early/first-stage/mathematics/issues.json`

- **official-score-source-review**: 2025年度一般選抜（前期）1次試験の数学100点を大学公式募集要項の保存原本で科目担当兼編集責任者が再確認する。数学60分は問題原本p.1で確認済み。
- **provisional-subquestion-scoring-review**: 印刷上の12小問へ割り当てた仮配点8点または9点（合計100点）を科目担当兼編集責任者が確認する。公式の小問別配点ではない。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、角柱彩色図、複素数平面、双曲線、空間断面・回転体など原本crop 14点を模写差し替えして内容確認を行う。rights_statusがunknown/restricted、replacement_statusがpending_redrawの間、原本ページ画像・原本クロップ・原本解答解説は内部レビュー限定とする。
- **subject-editor-review**: 数学科目担当者が、原本16ページのHTML転記、4大問・12小問の構造、学習者向け解説、難易度、五角形評価、層別所要時間、戦略、仮配点、得点効率、Lexus目標をパッケージ単位で確認し、manifestのvisual_reviewedとanalysisのreview.approvedを明示的に判断する。

## dokkyo-medical-2025-general-early-physics

元データ: `projects/universities/dokkyo-medical/past-exams/working/2025/general-early/first-stage/physics/issues.json`

- **provisional-subquestion-scoring-review**: 21小問の仮配点（基本5点、第2問問2・第3問問3・第4問問1・第5問問1・第5問問2のみ4点、合計100点）を科目担当＝編集責任者が確認する。物理の科目満点100点は令和7年度学生募集要項の公式値だが、小問別配点は非公表である。仮配点は、全21問が選択肢から1つ選ぶ形式で解答欄数が等しいことを前提に、ほぼ均等配分を出発点として工程量だけを補助基準とした編集モデルであり、難易度は配分に使っていない。実際の配点差は1点である。
- **provisional-subject-time-budget-review**: 理科の公式時間枠は2科目合計120分（12:50〜14:50）であり、物理単独の公式時間はない。得点効率とLexus目標の計算に使う物理60分の仮時間配分を、科目担当＝編集責任者が確認する。公式値として扱ってはならない。
- **weak-profile-scan-cost-review**: 小問21問という規模では、苦手層の初期判断4倍による全問一巡の時間が44.4分となり、仮時間60分の74%を占める。実行に使える時間は15.6分しか残らず、苦手層の「今解く！」9問（仮41点・実行17.5分）は仮時間内に収まらない（合計61.9分）。そのためLexus目標は最大化構成の仮37点（37%）となった。層別時間倍率はLexus所有の設定であるため、小問数の多いマーク科目でこの倍率をそのまま適用するか、全問一巡の計上方法を見直すかをユーザーが判断する。AI側で倍率を変更してはならない。
- **standardized-scoring-comparability-review**: 獨協医科大学は各科目の採点結果を標準偏差で標準化した相対得点で判定する（令和7年度学生募集要項 PDF 11ページ目）。合格最低点も公表されていない。したがって本パッケージの仮配点による自己採点は、合否ラインとの直接比較に使えない。この制約を読者向け表示でどう明示するかを科目担当＝編集責任者が確認する。
- **source-transcription-correction-review**: 分析中に原本転記の誤りを3か所検出し、原本ページ画像と照合して修正した。科目担当＝編集責任者が原本と再照合する。(1) 解答p006 第4問問3の設問要約が「R₂の電流の大きさが 1/6・I₀ になったとき」となっていたが、原本は「I₀ になったとき」である。(2) 同じく解答p006 のキルヒホッフの式が「0=2R・I₀/6−V₁′+V₂′」および「0=(1/6)V−V₁′+V₂′」となっていたが、原本は「0=RI₀−V₁′+V₂′」「0=(1/2)V−V₁′+V₂′」である。誤った式は直後に転記されている V₁′=5V/9、V₂′=V/18 と整合しない。(3) 解答p008 の分子量の式が「3kT₂」と添字付きで転記されていたが、原本は添字なしの「3kT」である。あわせて解答p003 の半減期の単位を原本の「日」表記に合わせた（従来は [day]）。
- **rights-review**: 原本図版11点（すべて問題側）の権利確認と、問題HTML公開候補の公開可否を確定する。確認が済むまで公開候補は非公開扱いを維持し、解答・解説HTMLと学習者向け解説HTMLは内部限定とする。
- **figure-redraw-review**: 原本クロップ11点はすべて replacement_status が pending_redraw である。差し替えSVGを作成し、科目担当＝編集責任者が反映可否を確認するまで replacement_ready へ変更しない。公開候補は差し替えが済むまで図版が欠けた状態になる。
- **editorial-explanation-review**: 学習者向け解説レイヤー（source-html/editorial-explanations.json、大問5題分）は原本解説の解法・順序・場合分けを保存したうえで言い回しと段落のみを編集した草案である。科目担当＝編集責任者が原本転記ビュー（internal/source-answers/）と並べて照合し、解法の入れ替えや中間値の先出しがないことを確認する。
- **subject-editor-review**: 原本23ページの目視確認（visual_reviewed）と、パッケージ全体の承認（review.approved）を科目担当＝編集責任者が明示的に行う。AIの目視確認と自動検査の合格は、この人間ゲートを閉じる根拠にしない。

## fujita-health-2025-general-early-mathematics

元データ: `projects/universities/fujita-health/past-exams/working/2025/general-early/first-stage/mathematics/issues.json`

- **official-score-source-review**: 2025年度一般入試（前期）の数学200点を、大学公式募集要項の保存原本で科目担当兼編集責任者が再確認する。数学100分は問題原本p.1で確認済み。
- **provisional-subquestion-scoring-review**: 12小問へ割り当てた仮配点（マーク式各15点、記述式15点または25点、合計200点）を科目担当兼編集責任者が確認する。公式の小問別配点ではない。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、解答内の回転体関連図、条件範囲グラフ、直角三角形配置図、関数グラフ、2放物線と共通接線の計5点を模写差し替えして内容確認を行う。rights_statusがunknown/restricted、replacement_statusがpending_redrawの間、原本ページ画像・原本クロップ・原本解答解説は内部レビュー限定とする。
- **subject-editor-review**: 数学科目担当者が、原本13ページのHTML転記、3大問・12小問の構造、学習者向け解説、難易度、五角形評価、層別所要時間、戦略、仮配点、得点効率、Lexus目標をパッケージ単位で確認し、manifestのvisual_reviewedとanalysisのreview.approvedを明示的に判断する。

## fujita-health-2025-general-early-physics

元データ: `projects/universities/fujita-health/past-exams/working/2025/general-early/first-stage/physics/issues.json`

- **official-score-source-review**: 2025年度募集要項原本で、理科2科目200点から物理100点とする科目別換算の扱いを科目担当兼編集責任者が再確認する。
- **provisional-subquestion-scoring-review**: 28小問へ割り当てた仮配点3点または4点、合計100点を科目担当兼編集責任者が確認する。公式小問別配点ではない。
- **provisional-subject-time-budget-review**: 理科2科目120分を等分した物理60分の仮時間配分を確認する。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、原本図版クロップ10点を模写差し替えする。restricted/pending_redrawの間は内部レビュー限定とする。
- **subject-editor-review**: 物理科目担当者が原本13ページ、4大問28小問・32解答成分、学習者向け解説、分析を一括レビューし、manifestのvisual_reviewedとanalysis.review.approvedを明示判断する。

## fukuoka-2025-general-keitobetsu-mathematics

元データ: `projects/universities/fukuoka/past-exams/working/2025/general-keitobetsu/first-stage/mathematics/issues.json`

- **official-score-source-review**: 2025年度一般選抜（系統別日程）一次選考の数学100点を当年度大学公式募集要項の保存原本で科目担当兼編集責任者が再確認する。数学90分は2025年度問題原本p.1で確認済み。
- **provisional-subquestion-scoring-review**: 7論理小問へ割り当てた14点または15点の仮配点（合計100点、差1点）を科目担当兼編集責任者が確認する。公式小問別配点ではない。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、解答第Ⅲ問(ii)の図版crop a7-area-shaded-regionを模写差し替えして内容確認を行う。rights_statusがrestricted、replacement_statusがpending_redrawの間、原本ページ画像・原本クロップ・原本解答解説は内部レビュー限定とする。
- **subject-editor-review**: 数学科目担当者が原本10ページのHTML転記、3大問・7小問の構造、学習者向け解説、難易度、五角形評価、層別所要時間、戦略、仮配点、得点効率、Lexus目標をパッケージ単位で確認し、manifestのvisual_reviewedとanalysisのreview.approvedを明示的に判断する。

## fukuoka-2025-general-keitobetsu-physics

元データ: `projects/universities/fukuoka/past-exams/working/2025/general-keitobetsu/first-stage/physics/issues.json`

- **official-2025-score-source**: {"id":"official-2025-score-source","status":"open","severity":"high","summary":"2025年度要項原本を入手し、隣接年度の2026年度公式要項から採用した物理100点の配点が同一であることを確認する。"}
- **score-allocation**: {"id":"score-allocation","status":"open","severity":"medium","summary":"物理100点をマーク21設問各3点・記述8設問各4〜5点とした仮配点を科目担当者が確認する。"}
- **time-strategy**: {"id":"time-strategy","status":"open","severity":"medium","summary":"理科2科目120分から物理60分とした仮時間、時間モデル、層別戦略、Lexus目標を確認する。"}
- **editorial-review**: {"id":"editorial-review","status":"open","severity":"high","summary":"学習者向け解説4原本ページ分を、原本の解法順・数式・答えと物理科目担当者が照合する。"}
- **rights-redraw**: {"id":"rights-redraw","status":"open","severity":"high","summary":"内部限定クロップ4点の権利を確認し、公開前に模写へ差し替える。"}
- **human-visual-review**: {"id":"human-visual-review","status":"open","severity":"high","summary":"原本9ページを科目担当者が確認し、source manifestのvisual_reviewedを明示判断する。"}
- **human-approval**: {"id":"human-approval","status":"open","severity":"high","summary":"分析、解説、難易度、レーダー、戦略、権利状態を科目担当者が一括承認する。"}

## hyogo-medical-2025-general-a-b-mathematics

元データ: `projects/universities/hyogo-medical/past-exams/working/2025/general-a-b/first-stage/mathematics/issues.json`

- **provisional-subquestion-scoring-review**: {"id":"provisional-subquestion-scoring-review","status":"open","severity":"review_required","summary":"15主設問の仮配点合計100点は編集上の配分であり、公式小問別配点ではない。","owner":"subject_editor"}
- **lexus-time-and-target-review**: {"id":"lexus-time-and-target-review","status":"open","severity":"review_required","summary":"小問別時間と層別Lexus目標は、公式90分を用いた編集モデルによる仮定である。","owner":"subject_editor"}
- **learner-editorial-review**: {"id":"learner-editorial-review","status":"open","severity":"review_required","summary":"学習者向け解説は原本の解法順を保った編集稿であり、数学担当による論理・式変形・答案表現の確認が必要。","owner":"subject_editor"}
- **restricted-crop-redraw-review**: {"id":"restricted-crop-redraw-review","status":"open","severity":"publication_blocker","summary":"内部限定クロップ5点はpending_redrawであり、公開前に模写差し替えと対応確認が必要。","owner":"art_and_rights"}
- **rights-review**: {"id":"rights-review","status":"open","severity":"publication_blocker","summary":"原本問題・解答解説のrights_statusはunknown。公開判断前に権利確認が必要。","owner":"rights"}
- **subject-editor-review**: {"id":"subject-editor-review","status":"open","severity":"publication_blocker","summary":"科目担当＝編集責任者による原本、分析、解説、表示の一括承認が未了。","owner":"subject_editor"}

## hyogo-medical-2025-general-a-b-physics

元データ: `projects/universities/hyogo-medical/past-exams/working/2025/general-a-b/first-stage/physics/issues.json`

- **official-score-and-time-review**: 一般選抜Aの理科2科目120分とBの物理60分の扱い、および物理100点への分析用仮換算を募集要項原本と科目担当者が確認する。
- **provisional-subquestion-scoring-review**: 46主設問へ割り当てた1〜4点、5大問各20点相当・合計100点の仮配点を確認する。公式小問別配点ではない。
- **lexus-time-model-review**: 物理60分の分析時間、得意・苦手層の時間倍率、前問依存、Lexus目標を確認する。
- **learner-editorial-review**: 5大問の学習者向け解答・解説について、式変形、力の向き、熱の符号、屈折図、核反応式を物理科目担当者が確認する。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、原本図版クロップ10点を模写差し替えする。restricted/pending_redrawの間は内部レビュー限定とする。
- **subject-editor-review**: 物理科目担当者が原本15ページ、5大問46主設問、学習者向け解説、分析を一括レビューし、manifestのvisual_reviewedとanalysis.review.approvedを明示判断する。

## international-health-welfare-2025-general-mathematics

元データ: `projects/universities/international-health-welfare/past-exams/working/2025/general/first-stage/mathematics/issues.json`

- **official-score-source-review**: 2025年度医学部一般選抜の数学200点、第一次試験合計600点を、2025年度学生募集要項の公式PDF原本で科目担当兼編集責任者が再確認する。現パッケージでは原本問題の『数学80分』と公開二次情報で照合している。
- **provisional-subquestion-scoring-review**: 16小問へ割り当てた仮配点（12点または13点、合計200点）を科目担当兼編集責任者が確認する。公式の小問別配点ではない。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、原本図版クロップ4点の模写差し替えと内容確認を行う。rights_statusがunknown/restricted、replacement_statusがpending_redrawの間、原本ページ画像・原本クロップ・原本解答解説は内部レビュー限定とする。
- **subject-editor-review**: 数学科目担当者が、原本16ページのHTML転記、4大問・16小問の構造、学習者向け解説、難易度、五角形評価、層別所要時間、戦略、仮配点、得点効率、Lexus目標をパッケージ単位で確認し、manifestのvisual_reviewedとanalysisのreview.approvedを明示的に判断する。

## international-health-welfare-2025-general-physics

元データ: `projects/universities/international-health-welfare/past-exams/working/2025/general/first-stage/physics/issues.json`

- **official-score-source-review**: 2025年度医学部一般選抜の物理100点、理科2科目200点、第一次試験合計600点を、2025年度学生募集要項の公式PDF原本で科目担当兼編集責任者が再確認する。現パッケージでは原本問題の『2科目120分』と公開二次情報で照合している。
- **provisional-subquestion-scoring-review**: 26小問へ割り当てた仮配点（3点または4点、合計100点）を科目担当兼編集責任者が確認する。第2問問1は張力と外力の2解答成分を持つが1小問4点としている。公式の小問別配点ではない。
- **provisional-subject-time-budget-review**: 公式の理科2科目合計120分とは別に、得点効率計算用として物理60分を仮設定した。科目担当兼編集責任者がこの等分モデルを確認する。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、原本図版クロップ13点の模写差し替えと内容確認を行う。rights_statusがunknown/restricted、replacement_statusがpending_redrawの間、原本ページ画像・原本クロップ・解答解説は内部レビュー限定とする。
- **subject-editor-review**: 物理科目担当者が、原本22ページのHTML転記、5大問・26小問・27解答枠の構造、学習者向け解説、難易度、五角形評価、層別所要時間、戦略、仮配点、得点効率、Lexus目標をパッケージ単位で確認し、manifestのvisual_reviewedとanalysisのreview.approvedを明示的に判断する。

## iwate-medical-2025-general-chemistry

元データ: `projects/universities/iwate-medical/past-exams/working/2025/general/first-stage/chemistry/issues.json`

- **rights-review**: 問題11ページと解答・解説3ページの公開権利を確認する。確認が済むまで問題の公開候補は非公開扱いを維持し、解答・解説HTMLは内部限定とする。

## jichi-medical-2025-general-physics

元データ: `projects/universities/jichi-medical/past-exams/working/2025/general/first-stage/physics/issues.json`

- **provisional-subquestion-scoring-review**: 25設問の仮配点（均等1点×25問＝25点）を科目担当＝編集責任者が確認する。公式に公表されているのは令和7年度学生募集要項の「理科50点（1科目25点）」という科目合計だけで、設問別配点は非公表である。全25設問が同じ1マーク1択形式で解答欄の構造が完全に等しいため、難易度による傾斜をつけず均等配分とした。小問間の配点差は0点で、Lexus所有の上限5点以内に収まっている。公式配点として扱ってはならない。
- **provisional-subject-time-budget-review**: 理科の公式時間枠は2科目合計80分（10:50〜12:10）であり、物理単独の公式時間はない。得点効率とLexus目標の計算に使う物理40分の仮時間配分を、科目担当＝編集責任者が確認する。実際に解答する科目数2で割った値であり、原本解答冊子の講評が述べる「1科目あたり40分程度」とも整合するが、大学公表値ではない。
- **weak-profile-scan-cost-exceeds-budget**: 苦手層のLexus目標が仮0点（0%）になった。原因は小問数と時間枠の組合せである。25小問の初期判断の合計は得意層基準で12.8分だが、苦手層の初期判断4倍を適用すると全問一巡だけで51.2分となり、物理40分の仮時間枠を11.2分超える。実行に使える時間が0分になるため、最大化構成が空集合になった。参考として岩手医科2025物理は24小問・仮60分で一巡48.4分（81%）であり、本パッケージは枠が40分しかないぶん超過する。層別時間倍率と全問一巡の計上方法はLexus所有の設定であるため、この倍率をこの規模のマーク科目へそのまま適用するか、一巡の計上方法を見直すかをユーザーが判断する。AI側で倍率や初期判断時間を変更してはならない。
- **weak-profile-strategy-set-over-budget**: 苦手層の「今解く！」6小問（仮6点）でも所要は56.7分、「今解く！＋後回し」14小問（仮14点）では71.5分となり、いずれも物理40分の仮時間枠を超える。時間圧はどちらも「極めて厳しい」である。戦略ラベル自体は本番の再現性を基準に付けた編集判断だが、苦手層向けの誌面でどこまでを推奨範囲として提示するかは科目担当＝編集責任者が確認する。上記の一巡計上の扱いと合わせて判断する必要がある。
- **rights-review**: 原本図版9点（すべて問題ページ側。回路、磁場内の粒子、波の干渉、開管、全反射、レンズ、p-V図、棒、ばね）の権利確認と、問題HTML公開候補の公開可否を確定する。確認が済むまで公開候補は非公開扱いを維持し、解答・解説HTMLと学習者向け解説は内部限定とする。
- **figure-redraw-review**: 原本クロップ9点はすべて replacement_status が pending_redraw である。差し替えSVGを作成し、科目担当＝編集責任者が反映可否を確認するまで replacement_ready へ変更しない。公開候補は差し替えが済むまで図版が欠けた状態になる。分析側の成果物はこの差し替えを待たずに完成している。
- **subject-editor-review**: 原本16ページの目視確認（source/manifest.json の visual_reviewed）と、パッケージ全体の承認（analysis.json の review.approved）を科目担当＝編集責任者が明示的に行う。AIの目視確認と自動検査の合格は、この人間ゲートを閉じる根拠にしない。

## jichi-medical-2025-general-mathematics-second-stage

元データ: `projects/universities/jichi-medical/past-exams/working/2025/general/second-stage/mathematics/issues.json`

- **provisional-subquestion-scoring-review**: 公式科目配点12.5点を5設問へ各2.5点で均等配分した仮配点を、数学科目担当兼編集責任者が確認する。30分・12.5点は2025年度公式募集要項で確認済みだが、設問別配点は公式配点ではない。
- **rights-and-redraw-review**: 解答側図版crop 5点（ans-overview-diagram、ans-proof-diagram、ans-midpoint-diagram、ans-alternative-diagram、ans-trig-triangle）を模写差し替えし、内容と権利を確認する。rights_statusがrestricted、replacement_statusがpending_redrawの間、原本ページ画像・原本crop・原本解答解説は内部レビュー限定とする。
- **subject-editor-review**: 数学科目担当者が原本8ページのHTML転記、1大問・5小問の構造、学習者向け解説、難易度、五角形評価、層別所要時間、戦略、仮配点、得点効率、Lexus目標をパッケージ単位で確認し、manifestのvisual_reviewedとanalysisのreview.approvedを明示的に判断する。

## jikei-2025-general-mathematics

元データ: `projects/universities/jikei/past-exams/working/2025/general/first-stage/mathematics/issues.json`

- **provisional-subquestion-scoring-review**: 公式の数学100点に対し、小問別配点は非公表である。分析上の8小問へ、数値記入・証明・不定積分・記述式の答案要求と論証量を基準に10・10・10・8・17・15・15・15点（合計100点）を仮配点した。公式配点ではないため、科目担当＝編集責任者が妥当性を確認する。
- **lexus-time-and-target-review**: Lexusの層別時間モデルを適用すると、苦手層の全8小問の初期判断は26.4分、90分以内の理論最大は仮58点で、これを係数1.0・丸めなしのLexus目標としている。得意層の理論最大は仮100点・88.1分で、係数0.8・1点未満切り捨てにより目標80点となる。基準時間、戦略ラベル、目標算出結果を科目担当が確認する。
- **learner-editorial-review**: 学習者向け解説は原本解説の主解法、論理順序、場合分け、定理選択を維持し、目標・最初の一手・理由・計算・結論が追えるよう9原本ページから4大問へ再編集した。第3問の接線と半径の直交を使う方法は原本どおり主解法後の別解に置いた。科目担当が原本転記比較表示と照合する。
- **rights-review**: 問題・解答原本の公開利用範囲を確認する。source manifest の rights_status は unknown、解答解説は internal_only のため、問題HTMLの一般公開候補も承認・権利確認前に公開しない。
- **subject-editor-review**: 数学科目担当者＝編集責任者が、原本11ページの人間による目視確認（manifest の visual_reviewed）、問題構造、大問4・小問8の切り分け、単元、難易度、レーダー5軸、層別時間、戦略、仮配点、得点効率、Lexus目標、学習者向け解説をパッケージ単位で確認し、review.approved の可否を記録する。AIの機械検査と目視証跡だけで承認済みにしない。

## jikei-2025-general-physics

元データ: `projects/universities/jikei/past-exams/working/2025/general/first-stage/physics/issues.json`

- **provisional-subquestion-scoring-review**: {"id":"provisional-subquestion-scoring-review","status":"open","severity":"review_required","summary":"11論理小問の仮配点合計100点は編集上の配分であり、公式小問別配点ではない。","owner":"subject_editor"}
- **combined-time-allocation-review**: {"id":"combined-time-allocation-review","status":"open","severity":"review_required","summary":"原本記載は理科2科目合計120分。分析では物理へ60分を仮配分しており、科目担当による妥当性確認が必要。","owner":"editorial_lead"}
- **lexus-time-and-target-review**: {"id":"lexus-time-and-target-review","status":"open","severity":"review_required","summary":"小問別時間とLexus目標は編集モデルによる仮定であり、科目担当の確認が必要。","owner":"subject_editor"}
- **learner-editorial-review**: {"id":"learner-editorial-review","status":"open","severity":"review_required","summary":"学習者向け解説は原本の解法順・式・講評を保持した編集稿であり、物理担当による論理・式・符号の確認が必要。","owner":"subject_editor"}
- **restricted-crop-redraw-review**: {"id":"restricted-crop-redraw-review","status":"open","severity":"publication_blocker","summary":"内部限定クロップ4点はpending_redrawであり、公開前に模写差し替えと対応確認が必要。","owner":"art_and_rights"}
- **rights-review**: {"id":"rights-review","status":"open","severity":"publication_blocker","summary":"原本問題・解答解説のrights_statusはunknownで、クロップはrestricted。公開判断前に権利確認が必要。","owner":"rights"}
- **subject-editor-review**: {"id":"subject-editor-review","status":"open","severity":"publication_blocker","summary":"科目担当＝編集責任者による原本、分析、学習者向け解説、表示の一括承認が未了。","owner":"subject_editor"}

## juntendo-2025-general-a-physics

元データ: `projects/universities/juntendo/past-exams/working/2025/general-a/first-stage/physics/issues.json`

- **provisional-subquestion-scoring-review**: 物理100点を26論理小問へ3〜5点で配分した仮配点を科目担当＝編集責任者が確認する。小問別公式配点ではない。
- **provisional-subject-time-budget-review**: 理科の公式時間は2科目合計120分で、物理単独時間はない。得点効率に使う物理60分の仮配分を科目担当＝編集責任者が確認する。
- **weak-profile-strategy-set-over-budget**: 苦手層の『今解く！』15小問は仮55点だが65.6分、『今解く！＋後回し』23小問は仮87点だが84.1分となり、いずれも物理60分の仮時間を超える。誌面では全件を機械的に実行せず、Lexus目標の最大化構成へ絞る必要があることを科目担当＝編集責任者が確認する。
- **weak-profile-optimized-target-review**: 苦手層の自動最大化は、全26小問の初期判断44.8分を一度だけ数え、11小問を14.7分で実行する59.5分・仮44点（44%）をLexus目標とした。層別倍率と全問一巡の扱いはLexus所有設定なので、AI側で変更せず科目担当＝編集責任者が確認する。
- **rights-review**: 原本クロップ27点と問題HTML候補の権利確認を行う。確認前は問題候補を非公開、解答と学習者向け解説を内部限定のまま維持する。
- **figure-redraw-review**: 原本クロップ27点はすべて pending_redraw。承認済みreplacement.svgが揃うまで replacement_ready に変更しない。
- **subject-editor-review**: 原本24ページの人間目視と、分析・学習者向け解説・仮配点・戦略のパッケージ一括承認を科目担当＝編集責任者が行う。AI目視や自動QAで代替しない。

## kanazawa-medical-2025-general-early-mathematics

元データ: `projects/universities/kanazawa-medical/past-exams/working/2025/general-early/first-stage/mathematics/issues.json`

- **provisional-scoring-review**: 公式の小問別配点は非公表。9小問へ10〜12点を配して合計100点とした仮配点を、科目担当者＝編集責任者が確認する。
- **strategy-time-review**: 数学60分を用いた小問別時間、苦手・得意層戦略、Lexus目標の編集モデルを科目担当者が確認する。
- **editorial-explanation-review**: 学習者向け解説9原本頁分について、原本の方法・順序・答えを保っていることを原本転記ビューと並べて科目担当者が確認する。
- **rights-and-redraw-review**: 内部限定の原本クロップ2点の権利を確認し、replacement.svgを用意して科目担当者の許可後に一括反映する。確認前は公開候補を非公開に保つ。
- **subject-editor-approval**: 原本12頁の人間目視、分析・解説の一括照合、パッケージ全体の承認を科目担当者＝編集責任者が行う。AI検査だけでvisual_reviewedやapprovedをtrueにしない。

## kanazawa-medical-2025-general-early-physics

元データ: `projects/universities/kanazawa-medical/past-exams/working/2025/general-early/first-stage/physics/issues.json`

- **official-score-source-review**: 令和7年度選抜要項原本で理科2科目150点を再確認し、物理75点という分析用等分仮換算の扱いを科目担当兼編集責任者が判断する。
- **provisional-subquestion-scoring-review**: 6小問へ割り当てた仮配点12点または13点、合計75点を確認する。公式小問別配点ではない。
- **provisional-subject-time-budget-review**: 理科2科目90分を等分した物理45分の仮時間配分を確認する。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、原本図版クロップ3点を模写差し替えする。restricted/pending_redrawの間は内部レビュー限定とする。
- **source-wording-review**: 第1問(2)の原文『求めたrとMの幅』を原本どおり保持している。科目担当が表記を確認し、公開用注記の要否を判断する。
- **subject-editor-review**: 物理科目担当者が原本8ページ、2大問6小問・49マーク欄、学習者向け解説、分析を一括レビューし、manifestのvisual_reviewedとanalysis.review.approvedを明示判断する。

## kanazawa-medical-2025-general-late-mathematics

元データ: `projects/universities/kanazawa-medical/past-exams/working/2025/general-late/first-stage/mathematics/issues.json`

- **provisional-scoring-review**: 公式の小問別配点は非公表。7論理小問へ14〜15点を配して合計100点とした仮配点を、科目担当者＝編集責任者が確認する。
- **strategy-time-review**: 数学60分を用いた小問別時間、苦手・得意層戦略、Lexus目標の編集モデルを科目担当者が確認する。
- **editorial-explanation-review**: 学習者向け解説10原本頁分について、原本の方法・順序・答えを保っていることを原本転記ビューと並べて科目担当者が確認する。
- **rights-and-redraw-review**: 内部限定の原本クロップ7点の権利を確認し、replacement.svgを用意して科目担当者の許可後に一括反映する。確認前は公開候補を非公開に保つ。
- **subject-editor-approval**: 原本13頁の人間目視、分析・解説の一括照合、パッケージ全体の承認を科目担当者＝編集責任者が行う。AI検査だけでvisual_reviewedやapprovedをtrueにしない。

## kansai-medical-2025-general-early-mathematics

元データ: `projects/universities/kansai-medical/past-exams/working/2025/general-early/first-stage/mathematics/issues.json`

- **provisional-scoring-review**: 保存原本で科目満点を再確認する。小問別公式配点は非公表のため、13論理小問へ7〜8点を配して合計100点とした仮配点を科目担当者が確認する。
- **strategy-time-review**: 原本記載の数学90分を用いた小問別時間、苦手・得意層戦略、Lexus目標の編集モデルを科目担当者が確認する。
- **source-transcription-correction-review**: 解答原本p.10のⅣ(2)最終値は V=π/3-9√3/20。既存文字起こしの3π/8をπ/3へ修正したため、原本画像と科目担当者が再照合する。
- **editorial-explanation-review**: 学習者向け解説14原本頁分について、原本の方法・順序・答えを保っていることを原本転記ビューと並べて科目担当者が確認する。
- **rights-and-redraw-review**: 内部限定の原本クロップ6点の権利を確認し、replacement.svgを用意して科目担当者の許可後に一括反映する。確認前は公開候補を非公開に保つ。
- **subject-editor-approval**: 原本17頁の人間目視、分析・解説の一括照合、パッケージ全体の承認を科目担当者＝編集責任者が行う。AI検査だけでvisual_reviewedやapprovedをtrueにしない。

## kansai-medical-2025-general-early-physics

元データ: `projects/universities/kansai-medical/past-exams/working/2025/general-early/first-stage/physics/issues.json`

- **official-score-time-review**: 原本の理科2科目120分から物理60分とした仮時間、物理100点への仮換算、24設問への4点・5点仮配点を募集要項原本と科目担当者が確認する。
- **lexus-time-model-review**: 物理60分の仮設定に基づく得意・苦手層の時間倍率、前問依存、Lexus目標を確認する。
- **learner-editorial-review**: 4大問24設問の学習者向け解説について、実験データ換算、ローレンツ力、二重ドップラー効果、半減期計算を物理科目担当者が確認する。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、restrictedかつpending_redrawの原本図版クロップ6点を模写差し替えする。
- **subject-editor-review**: 物理科目担当者が原本16ページ、4大問24設問、学習者向け解説、分析を一括レビューし、manifestのvisual_reviewedとanalysis.review.approvedを明示判断する。

## kawasaki-medical-2025-general-regional-quota-mathematics

元データ: `projects/universities/kawasaki-medical/past-exams/working/2025/general-regional-quota/first-stage/mathematics/issues.json`

- **provisional-scoring-review**: 保存原本で数学の科目満点を確認し、仮100点および第1問34・第2問33・第3問33の編集配点を科目担当者が確認する。
- **strategy-time-review**: 原本記載の数学80分を用いた9小問の時間、苦手・得意層戦略、Lexus目標を科目担当者が確認する。
- **editorial-explanation-review**: 学習者向け解説13原本頁分が原本の答え・解法・順序を保つことを原本転記ビューと並べて科目担当者が確認する。
- **rights-and-redraw-review**: 内部限定の原本クロップ8点の権利を確認し、replacement.svgを用意して承認後に模写へ差し替える。
- **subject-editor-approval**: 原本17頁の人間目視、分析・解説・難易度・仮配点・戦略を科目担当者＝編集責任者が一括承認する。AI検査だけでvisual_reviewedやapprovedをtrueにしない。

## kawasaki-medical-2025-general-regional-quota-physics

元データ: `projects/universities/kawasaki-medical/past-exams/working/2025/general-regional-quota/first-stage/physics/issues.json`

- **official-score-source-review**: 2025年度一般選抜・地域枠選抜の理科2科目合計配点と、物理単独の扱いを2025年度学生募集要項の公式PDF原本で科目担当兼編集責任者が再確認する。現分析の科目満点75点は、理科2科目150点を等分した編集上の仮換算であり大学公表の物理単独配点ではない。
- **provisional-subquestion-scoring-review**: 17小問へ割り当てた仮配点（4点または5点、合計75点）を科目担当兼編集責任者が確認する。第Ⅰ問、Ⅱ問1・問3、Ⅲ問5、Ⅳ問3、Ⅴ問3・問4を5点、他を4点とした。公式の小問別配点ではない。
- **provisional-subject-time-budget-review**: 公式の理科2科目合計120分とは別に、得点効率計算用として物理60分を仮設定した。科目担当兼編集責任者がこの等分モデルを確認する。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、原本図版クロップ6点の模写差し替えと内容確認を行う。rights_statusがunknown/restricted、replacement_statusがpending_redrawの間、原本ページ画像・原本クロップ・解答解説は内部レビュー限定とする。
- **subject-editor-review**: 物理科目担当者が、原本17ページのHTML転記、5大問・17小問・24解答枠の構造、学習者向け解説、難易度、五角形評価、層別所要時間、戦略、仮配点、得点効率、Lexus目標をパッケージ単位で確認し、manifestのvisual_reviewedとanalysisのreview.approvedを明示的に判断する。

## keio-2025-general-physics

元データ: `projects/universities/keio/past-exams/working/2025/general/first-stage/physics/issues.json`

- **official-score-time-review**: 公式の理科2科目一括120分・200点から物理60分・100点とした仮時間、29設問への2〜5点仮配点を募集要項原本と科目担当者が確認する。
- **lexus-time-model-review**: 物理60分の仮設定に基づく得意・苦手層の時間倍率、設問依存、Lexus目標を確認する。
- **learner-editorial-review**: 3大問29設問の学習者向け解説について、反発衝突、非線形磁気計測、断熱減率の導出と数値を物理科目担当者が確認する。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、restrictedかつpending_redrawの原本図版クロップ8点を模写差し替えする。
- **subject-editor-review**: 物理科目担当者が原本18ページ、3大問29設問、学習者向け解説、分析を一括レビューし、manifestのvisual_reviewedとanalysis.review.approvedを明示判断する。

## kindai-2025-general-first-a-mathematics

元データ: `projects/universities/kindai/past-exams/working/2025/general-first-a/first-stage/mathematics/issues.json`

- **provisional-subquestion-scoring-review**: {"id":"provisional-subquestion-scoring-review","status":"open","severity":"review_required","summary":"15主設問の仮配点合計100点は編集上の配分であり、公式小問別配点ではない。","owner":"subject_editor"}
- **lexus-time-and-target-review**: {"id":"lexus-time-and-target-review","status":"open","severity":"review_required","summary":"小問別時間と層別Lexus目標は、公式60分を用いた編集モデルによる仮定である。","owner":"subject_editor"}
- **learner-editorial-review**: {"id":"learner-editorial-review","status":"open","severity":"review_required","summary":"学習者向け解説は原本の解法順を保った編集稿であり、数学担当による論理・式変形・答案表現の確認が必要。","owner":"subject_editor"}
- **restricted-crop-redraw-review**: {"id":"restricted-crop-redraw-review","status":"open","severity":"publication_blocker","summary":"内部限定クロップ8点はpending_redrawであり、公開前に模写差し替えと対応確認が必要。学習者解説では解答由来6点のみを使用している。","owner":"art_and_rights"}
- **rights-review**: {"id":"rights-review","status":"open","severity":"publication_blocker","summary":"原本問題・解答解説のrights_statusはunknown。公開判断前に権利確認が必要。","owner":"rights"}
- **subject-editor-review**: {"id":"subject-editor-review","status":"open","severity":"publication_blocker","summary":"科目担当＝編集責任者による原本、分析、解説、表示の一括承認が未了。","owner":"subject_editor"}

## kindai-2025-general-first-a-physics

元データ: `projects/universities/kindai/past-exams/working/2025/general-first-a/first-stage/physics/issues.json`

- **official-score-source-review**: 2025年度医学部一般前期A日程の募集要項原本で理科2科目の公式合算配点200点を再確認し、分析用の物理100点等分仮換算を科目担当兼編集責任者が判断する。
- **provisional-subquestion-scoring-review**: 12小問へ割り当てた仮配点8点または9点、合計100点を確認する。公式小問別配点ではない。
- **provisional-subject-time-budget-review**: 理科2科目120分を等分した物理60分の仮時間配分を確認する。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、原本図版クロップ13点を模写差し替えする。restricted/pending_redrawの間は内部レビュー限定とする。
- **source-html-record-reconciliation**: SOURCE-HTML-RECORD.mdに残る内部トップ科目名誤表示・blocked記述は現在の生成HTMLでは物理表示へ解消済み。原本HTMLレーンの記録管理者が履歴を保ったまま状態表現を更新する。
- **subject-editor-review**: 物理科目担当者が原本20ページ、2大問12分析小問・33解答欄相当、学習者向け解説、分析を一括レビューし、manifestのvisual_reviewedとanalysis.review.approvedを明示判断する。

## kindai-2025-recommendation-general-public-mathematics

元データ: `projects/universities/kindai/past-exams/working/2025/recommendation-general-public/first-stage/mathematics/issues.json`

- **provisional-subquestion-scoring-review**: {"id":"provisional-subquestion-scoring-review","status":"open","severity":"review_required","summary":"13主設問の仮配点合計100点は編集上の配分であり、公式小問別配点ではない。","owner":"subject_editor"}
- **lexus-time-and-target-review**: {"id":"lexus-time-and-target-review","status":"open","severity":"review_required","summary":"小問別時間と層別Lexus目標は、公式60分を用いた編集モデルによる仮定である。","owner":"subject_editor"}
- **learner-editorial-review**: {"id":"learner-editorial-review","status":"open","severity":"review_required","summary":"学習者向け解説は原本の解法順を保った編集稿であり、数学担当による論理・式変形・答案表現の確認が必要。","owner":"subject_editor"}
- **restricted-crop-redraw-review**: {"id":"restricted-crop-redraw-review","status":"open","severity":"publication_blocker","summary":"内部限定クロップ5点はpending_redrawであり、公開前に模写差し替えと対応確認が必要。学習者向け解説では解答由来3点のみを使用している。","owner":"art_and_rights"}
- **rights-review**: {"id":"rights-review","status":"open","severity":"publication_blocker","summary":"原本問題・解答解説のrights_statusはunknown。公開判断前に権利確認が必要。","owner":"rights"}
- **subject-editor-review**: {"id":"subject-editor-review","status":"open","severity":"publication_blocker","summary":"科目担当＝編集責任者による原本、分析、解説、表示の一括承認が未了。","owner":"subject_editor"}

## kindai-2025-recommendation-general-public-physics

元データ: `projects/universities/kindai/past-exams/working/2025/recommendation-general-public/first-stage/physics/issues.json`

- **official-score-source-review**: 2025年度医学部推薦入試（一般公募）の募集要項原本で物理の公式配点100点を再確認し、分析用の物理100点仮換算を科目担当兼編集責任者が判断する。
- **provisional-subquestion-scoring-review**: 11分析小問へ割り当てた仮配点9点または10点、合計100点を確認する。公式小問別配点ではない。
- **official-subject-time-review**: 問題冊子表紙の物理60分を科目担当者が確認し、分析上の時間配分と戦略を承認する。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、原本図版クロップ19点を模写差し替えする。restricted/pending_redrawの間は内部レビュー限定とする。
- **source-html-record-reconciliation**: SOURCE-HTML-RECORD.mdに残る内部トップ科目名誤表示・blocked記述は現在の生成HTMLでは物理表示へ解消済み。原本HTMLレーンの記録管理者が履歴を保ったまま状態表現を更新する。
- **subject-editor-review**: 物理科目担当者が原本19ページ、2大問11分析小問・31解答欄相当、学習者向け解説、分析を一括レビューし、manifestのvisual_reviewedとanalysis.review.approvedを明示判断する。

## kitasato-2025-general-mathematics

元データ: `projects/universities/kitasato/past-exams/working/2025/general/first-stage/mathematics/issues.json`

- **provisional-subquestion-scoring-review**: 10論理小問へ各15点を割り当てた仮配点（合計150点）を科目担当兼編集責任者が確認する。数学150点は2025年度大学公式募集要項で確認済みだが、小問別配点は公式配点ではない。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、解答第2問の図版crop ans-q2-function-graphを模写差し替えして内容確認を行う。rights_statusがrestricted、replacement_statusがpending_redrawの間、原本ページ画像・原本クロップ・原本解答解説は内部レビュー限定とする。
- **subject-editor-review**: 数学科目担当者が原本15ページのHTML転記、3大問・10小問の構造、学習者向け解説、難易度、五角形評価、層別所要時間、戦略、仮配点、得点効率、Lexus目標をパッケージ単位で確認し、manifestのvisual_reviewedとanalysisのreview.approvedを明示的に判断する。

## kitasato-2025-general-physics

元データ: `projects/universities/kitasato/past-exams/working/2025/general/first-stage/physics/issues.json`

- **official-score-time-review**: 公式の理科2科目一括100分・200点から物理50分・100点とした仮時間、17設問への5〜7点仮配点を募集要項原本と科目担当者が確認する。
- **lexus-time-model-review**: 物理50分の仮設定に基づく得意・苦手層の時間倍率、設問依存、Lexus目標を確認する。
- **learner-editorial-review**: 3大問17設問の学習者向け解説について、コンデンサーの電荷一定、非慣性系の振動、荷電粒子軌道を物理科目担当者が確認する。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、restrictedかつpending_redrawの原本図版クロップ8点を模写差し替えする。
- **subject-editor-review**: 物理科目担当者が原本16ページ、3大問17設問、学習者向け解説、分析を一括レビューし、manifestのvisual_reviewedとanalysis.review.approvedを明示判断する。

## kurume-2025-general-early-mathematics

元データ: `projects/universities/kurume/past-exams/working/2025/general-early/first-stage/mathematics/issues.json`

- **total-points-primary-source-review**: 科目満点100点の2025年度一次資料を科目担当＝編集責任者が確認する。現パッケージの100点は既存の2025年度日程資料と、大学公式サイトで確認できる現行入試の数学100点という反復条件に基づく編集上の仮置きであり、2025年度公式配点として断定してはならない。
- **provisional-subquestion-scoring-review**: 13小問の仮配点（7点または8点、合計100点、最大差1点）を科目担当＝編集責任者が確認する。小問別の公式配点は確認できておらず、解答欄数と処理量を補助基準にした編集モデルである。
- **weak-profile-scan-cost-review**: 苦手層の初期判断4倍による全13小問の一巡が56.4分となり、公式科目時間90分の約63%を占める。実行に使える時間は33.6分で、最大化構成は仮30点・合計88.8分となった。層別時間倍率はLexus所有の設定であるため、この一巡コストとLexus目標30%をそのまま採用するかをユーザーが判断する。AI側で倍率を変更してはならない。
- **rights-review**: 問題・解答原本と原本クロップ7点の権利確認、および問題HTML公開候補の公開可否を確定する。確認が済むまで公開候補は非公開扱いを維持し、解答・解説HTMLと学習者向け解説HTMLは内部限定とする。
- **figure-redraw-review**: 原本クロップ7点は replacement_status が pending_redraw である。差し替え図版を作成し、科目担当＝編集責任者が反映可否を確認するまで replacement_ready へ変更しない。
- **editorial-explanation-review**: 学習者向け解説レイヤー（source-html/editorial-explanations.json、大問5題分）は原本解説の解法と順序を保存して再構成した草案である。科目担当＝編集責任者が原本転記ビュー（internal/source-answers/）と並べて、13小問の答え・式変形・場合分けを確認する。
- **subject-editor-review**: 原本15ページの人間による目視確認（visual_reviewed）と、パッケージ全体の承認（review.approved）を科目担当＝編集責任者が明示的に行う。AIの全ページ目視と自動検査の合格は、この人間ゲートを閉じる根拠にしない。

## kurume-2025-general-early-physics

元データ: `projects/universities/kurume/past-exams/working/2025/general-early/first-stage/physics/issues.json`

- **official-score-time-review**: 公式の理科2科目一括120分から物理60分・100点とした仮時間、28設問への3〜4点仮配点を2025年度募集要項原本と科目担当者が確認する。
- **lexus-time-model-review**: 物理60分の仮設定に基づく得意・苦手層の時間倍率、設問依存、Lexus目標を確認する。
- **learner-editorial-review**: 3大問28設問の学習者向け解説について、円すい内運動、開口熱気球、最大電力条件を物理科目担当者が確認する。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、restrictedかつpending_redrawの原本図版クロップ4点を模写差し替えする。
- **subject-editor-review**: 物理科目担当者が原本11ページ、3大問28設問、学習者向け解説、分析を一括レビューし、manifestのvisual_reviewedとanalysis.review.approvedを明示判断する。

## kyorin-2025-general-mathematics

元データ: `projects/universities/kyorin/past-exams/working/2025/general/first-stage/mathematics/issues.json`

- **official-score-source-review**: 2025年度一般選抜1次試験の数学100点を、大学公式募集要項の保存原本で科目担当兼編集責任者が再確認する。数学70分は問題原本p.1で確認済み。
- **provisional-subquestion-scoring-review**: 印刷上の8小問へ割り当てた仮配点12点または13点（合計100点）を科目担当兼編集責任者が確認する。公式の小問別配点ではない。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、4次関数グラフ、直角三角形、直交円柱・八面体・断面図など解答図版11点を模写差し替えして内容確認を行う。rights_statusがunknown/restricted、replacement_statusがpending_redrawの間、原本ページ画像・原本クロップ・原本解答解説は内部レビュー限定とする。
- **subject-editor-review**: 数学科目担当者が、原本24ページのHTML転記、3大問・8小問の構造、学習者向け解説、難易度、五角形評価、層別所要時間、戦略、仮配点、得点効率、Lexus目標をパッケージ単位で確認し、manifestのvisual_reviewedとanalysisのreview.approvedを明示的に判断する。

## kyorin-2025-general-physics

元データ: `projects/universities/kyorin/past-exams/working/2025/general/first-stage/physics/issues.json`

- **official-score-source-review**: 2025年度募集要項原本で、理科2科目の公式配点と、そこから物理75点とする科目別換算の扱いを科目担当兼編集責任者が再確認する。
- **provisional-subquestion-scoring-review**: 12小問へ割り当てた仮配点6点または7点、合計75点を科目担当兼編集責任者が確認する。公式小問別配点ではない。
- **provisional-subject-time-budget-review**: 理科2科目100分を等分した物理50分の仮時間配分を確認する。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、原本図版クロップ8点を模写差し替えする。restricted/pending_redrawの間は内部レビュー限定とする。
- **subject-editor-review**: 物理科目担当者が原本15ページ、3大問12小問・50解答成分・57マーク欄、学習者向け解説、分析を一括レビューし、manifestのvisual_reviewedとanalysis.review.approvedを明示判断する。

## nihon-u-2025-n-unified-first-mathematics

元データ: `projects/universities/nihon-u/past-exams/working/2025/n-unified-first/first-stage/mathematics/issues.json`

- **provisional-subquestion-scoring-review**: 小問18件の仮配点（合計100点）を科目担当＝編集責任者が確認する。数学の科目配点100点は2025年度N全学統一方式募集要項の公式値だが、小問別配点は非公表である。全問マークシート方式のため、ほぼ均等配分から出発し小問間の配点差を4点〜7点（差3点）に収めた。公式配点ではない。
- **subquestion-split-review**: 原本の大問VI（2）は「図形Dの面積」と「Dをy軸のまわりに1回転してできる立体の体積」という互いに独立した2つの要求を1つの小問番号にまとめている。分析では独立に評価できる最小単位として math-q6-2a／math-q6-2b の2小問に分けた（分析上の小問数18、原本の小問番号数17）。この分割の可否を科目担当が確認する。
- **weak-profile-initial-judgment-share-review**: 苦手層の初期判断時間（Lexusの層別倍率4倍）は、小問18問で35.6分となり公式60分の59%を占める。残る解答実行時間は24.4分で、これが苦手層のLexus目標を42点に押し下げている主因である。この時間モデルを本パッケージへ適用してよいか、科目担当＝編集責任者が確認する。倍率も基準時間もLexus所有の入力であり、目標値をよく見せるために縮めていない。
- **standardized-score-comparability-review**: 一次試験の成績は標準化得点で算出され、換算式は非公表である（2025年度入学者選抜結果の備考）。公表されている一次合格者最低点230.55/400と受験生の素点自己採点は直接比較できない。読者向け表示でこの但し書きをどこまで書くかを科目担当が確認する。
- **answer-key-transcription-fix-review**: 分析中に原本転記の誤りを2件見つけて修正した。(1) 解答一覧の解答欄1の値が「−1」となっていたが、原本解答p.1の印字は「3」であり、解説本文の「B は 3 より大きく 8 より小さい x の集合」という結論とも一致するため3へ直した。(2) 解答一覧6ブロックが answer_key の項目キーを items ではなく entries で保持していたため、生成HTMLの解答一覧が空で出力されていた。キー名を items へ直し、区切り記号を生成器が解釈する全角スラッシュへそろえた。科目担当が原本ページ画像と再生成後の解答一覧を照合する。
- **crop-redraw-review**: 解答解説の図版3点（ans-q3-triangle／ans-q5-square-series／ans-q6-rotation-region）は全件 pending_redraw・rights_status: restricted のまま。replacement.svg が用意された後、科目担当が模写内容を確認して replacement_ready へ進める。元クロップとSVGの縦横比は一致しなくてよい。
- **rights-review**: 問題・解答原本の公開利用範囲を確認する。権利状態が restricted の間、原本ページ画像と原本クロップ、解答解説は内部限定に留め、問題HTMLの一般公開候補も非公開扱いとする。
- **subject-editor-review**: 数学科目担当者＝編集責任者が、原本12ページの目視確認（manifest の visual_reviewed）と、問題構造・小問別難易度・レーダー5軸・層別所要時間・戦略・仮配点・得点効率・Lexus目標・学習者向け解説をパッケージ単位で確認し、review.approved の可否を記録する。AIの機械検査と目視証跡は承認の根拠にしない。

## nihon-u-2025-n-unified-first-physics

元データ: `projects/universities/nihon-u/past-exams/working/2025/n-unified-first/first-stage/physics/issues.json`

- **official-score-review**: 物理100点への仮換算と25小問各4点の仮配点を募集要項原本と科目担当者が確認する。公式小問別配点ではない。
- **lexus-time-model-review**: 原本明記の60分を前提とした得意・苦手層の時間倍率、前問依存、Lexus目標を確認する。
- **learner-editorial-review**: 5大問25小問の学習者向け解説について、力積の符号、熱力学の状態、干渉条件、誘導電流の向き、核計算を物理科目担当者が確認する。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、原本図版クロップ10点を模写差し替えする。restricted/pending_redrawの間は内部レビュー限定とする。
- **subject-editor-review**: 物理科目担当者が原本19ページ、5大問25小問、学習者向け解説、分析を一括レビューし、manifestのvisual_reviewedとanalysis.review.approvedを明示判断する。

## nihon-u-2025-n-unified-first-mathematics-second-stage

元データ: `projects/universities/nihon-u/past-exams/working/2025/n-unified-first/second-stage/mathematics/issues.json`

- **provisional-subquestion-scoring-review**: {"id":"provisional-subquestion-scoring-review","status":"open","severity":"review_required","summary":"各大問20点・合計60点は公式だが、9小問への内訳は編集上の仮配点であり公式小問別配点ではない。","owner":"subject_editor"}
- **lexus-time-and-target-review**: {"id":"lexus-time-and-target-review","status":"open","severity":"review_required","summary":"小問別時間と層別Lexus目標は、公式60分を用いた編集モデルによる仮定である。","owner":"subject_editor"}
- **learner-editorial-review**: {"id":"learner-editorial-review","status":"open","severity":"review_required","summary":"学習者向け解説は原本の解法順を保った編集稿であり、数学担当による論理・式変形・答案表現の確認が必要。","owner":"subject_editor"}
- **restricted-crop-redraw-review**: {"id":"restricted-crop-redraw-review","status":"open","severity":"publication_blocker","summary":"内部限定クロップ6点はpending_redrawであり、公開前に模写差し替えと対応確認が必要。","owner":"art_and_rights"}
- **rights-review**: {"id":"rights-review","status":"open","severity":"publication_blocker","summary":"原本問題・解答解説のrights_statusはunknown。公開判断前に権利確認が必要。","owner":"rights"}
- **subject-editor-review**: {"id":"subject-editor-review","status":"open","severity":"publication_blocker","summary":"科目担当＝編集責任者による原本、分析、解説、表示の一括承認が未了。","owner":"subject_editor"}

## nippon-medical-2025-general-early-mathematics

元データ: `projects/universities/nippon-medical/past-exams/working/2025/general-early/first-stage/mathematics/issues.json`

- **provisional-subquestion-scoring-review**: {"id":"provisional-subquestion-scoring-review","status":"open","severity":"review_required","summary":"14主設問の仮配点合計300点は編集上の配分であり、公式小問別配点ではない。","owner":"subject_editor"}
- **exam-time-source-notation-review**: {"id":"exam-time-source-notation-review","status":"open","severity":"review_required","summary":"公式要項の試験枠11:05〜12:55と、問題冊子の数学90分表記の関係を編集責任者が最終確認する。分析時間モデルは問題冊子の90分を採用した。","owner":"editorial_lead"}
- **lexus-time-and-target-review**: {"id":"lexus-time-and-target-review","status":"open","severity":"review_required","summary":"小問別時間、苦手層53.3%、得意層80.0%のLexus目標は編集モデルによる仮定である。","owner":"subject_editor"}
- **learner-editorial-review**: {"id":"learner-editorial-review","status":"open","severity":"review_required","summary":"学習者向け解説は原本の解法順を保った編集稿であり、数学担当による論理・式変形・答案表現の確認が必要。","owner":"subject_editor"}
- **restricted-crop-redraw-review**: {"id":"restricted-crop-redraw-review","status":"open","severity":"publication_blocker","summary":"内部限定クロップ5点はpending_redrawであり、公開前に模写差し替えと対応確認が必要。","owner":"art_and_rights"}
- **rights-review**: {"id":"rights-review","status":"open","severity":"publication_blocker","summary":"原本問題・解答解説のrights_statusはunknown。公開判断前に権利確認が必要。","owner":"rights"}
- **subject-editor-review**: {"id":"subject-editor-review","status":"open","severity":"publication_blocker","summary":"科目担当＝編集責任者による原本、分析、解説、表示の一括承認が未了。","owner":"subject_editor"}

## nippon-medical-2025-general-early-physics

元データ: `projects/universities/nippon-medical/past-exams/working/2025/general-early/first-stage/physics/issues.json`

- **provisional-subquestion-scoring-review**: {"id":"provisional-subquestion-scoring-review","status":"open","severity":"review_required","summary":"7小問の仮配点合計200点は編集上の配分であり、公式小問別配点ではない。","owner":"subject_editor"}
- **combined-time-allocation-review**: {"id":"combined-time-allocation-review","status":"open","severity":"review_required","summary":"原本記載は理科2科目合計120分。分析では物理へ60分を仮配分しており、科目担当による妥当性確認が必要。","owner":"editorial_lead"}
- **lexus-time-and-target-review**: {"id":"lexus-time-and-target-review","status":"open","severity":"review_required","summary":"小問別時間とLexus目標は編集モデルによる仮定であり、科目担当の確認が必要。","owner":"subject_editor"}
- **learner-editorial-review**: {"id":"learner-editorial-review","status":"open","severity":"review_required","summary":"学習者向け解説は原本の解法順を保った編集稿であり、物理担当による論理・式・単位・有効数字の確認が必要。","owner":"subject_editor"}
- **restricted-crop-redraw-review**: {"id":"restricted-crop-redraw-review","status":"open","severity":"publication_blocker","summary":"内部限定クロップ6点はpending_redrawであり、公開前に模写差し替えと対応確認が必要。","owner":"art_and_rights"}
- **rights-review**: {"id":"rights-review","status":"open","severity":"publication_blocker","summary":"原本問題・解答解説のrights_statusはunknownで、クロップはrestricted。公開判断前に権利確認が必要。","owner":"rights"}
- **subject-editor-review**: {"id":"subject-editor-review","status":"open","severity":"publication_blocker","summary":"科目担当＝編集責任者による原本、分析、学習者向け解説、表示の一括承認が未了。","owner":"subject_editor"}

## saitama-medical-2025-general-early-mathematics

元データ: `projects/universities/saitama-medical/past-exams/working/2025/general-early/first-stage/mathematics/issues.json`

- **official-score-source-review**: 2025年度一般選抜（前期）1次試験の数学100点を大学公式募集要項の保存原本で科目担当兼編集責任者が再確認する。数学50分は問題原本p.1で確認済み。
- **provisional-subquestion-scoring-review**: 印刷上の10小問へ割り当てた各10点の仮配点（合計100点）を科目担当兼編集責任者が確認する。公式の小問別配点ではない。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、第3問の幾何図crop 3点を模写差し替えして内容確認を行う。rights_statusがunknown/restricted、replacement_statusがpending_redrawの間、原本ページ画像・原本クロップ・原本解答解説は内部レビュー限定とする。
- **subject-editor-review**: 数学科目担当者が、原本12ページのHTML転記、4大問・10小問の構造、学習者向け解説、難易度、五角形評価、層別所要時間、戦略、仮配点、得点効率、Lexus目標をパッケージ単位で確認し、manifestのvisual_reviewedとanalysisのreview.approvedを明示的に判断する。

## saitama-medical-2025-general-early-physics

元データ: `projects/universities/saitama-medical/past-exams/working/2025/general-early/first-stage/physics/issues.json`

- **source-transcription-corrections**: {"id":"source-transcription-corrections","status":"open","severity":"high","summary":"問題p001の半円筒面名BOD→BCD、問題p009の位置エネルギー指数10^-13→10^-10という原本照合修正2件を科目担当者が確認する。"}
- **official-2025-score-source**: {"id":"official-2025-score-source","status":"open","severity":"high","summary":"2025年度一般選抜（前期）一次の物理100点を大学公式募集要項の保存原本で再確認する。理科2科目90分は問題原本p001で確認済み。"}
- **score-allocation**: {"id":"score-allocation","status":"open","severity":"medium","summary":"31解答欄へ2〜4点を割り当て、大問別30・30・40点とした仮配点を科目担当者が確認する。"}
- **time-strategy**: {"id":"time-strategy","status":"open","severity":"medium","summary":"理科2科目90分から物理45分とした仮時間、時間モデル、層別戦略、Lexus目標を確認する。"}
- **editorial-review**: {"id":"editorial-review","status":"open","severity":"high","summary":"学習者向け解説5原本ページ分を、原本の解法順・数式・答えと物理科目担当者が照合する。"}
- **rights-redraw**: {"id":"rights-redraw","status":"open","severity":"high","summary":"内部限定クロップ3点の権利を確認し、公開前に模写へ差し替える。"}
- **human-visual-review**: {"id":"human-visual-review","status":"open","severity":"high","summary":"原本14ページを科目担当者が確認し、source manifestのvisual_reviewedを明示判断する。"}
- **human-approval**: {"id":"human-approval","status":"open","severity":"high","summary":"分析、解説、難易度、レーダー、戦略、権利状態を科目担当者が一括承認する。"}

## sangyo-medical-2025-general-a-b-mathematics

元データ: `projects/universities/sangyo-medical/past-exams/working/2025/general-a-b/first-stage/mathematics/issues.json`

- **provisional-scoring-review**: 保存原本で数学の科目満点を確認し、仮100点および第1問20・第2問40・第3問20・第4問20の編集配点を科目担当者が確認する。
- **strategy-time-review**: 原本記載の数学100分を用いた23小問の時間、苦手・得意層戦略、Lexus目標を科目担当者が確認する。
- **editorial-explanation-review**: 学習者向け解説9原本頁分が原本の答え・解法・順序を保つことを原本転記ビューと並べて科目担当者が確認する。
- **rights-and-redraw-review**: 内部限定の原本クロップ4点の権利を確認し、replacement.svgを用意して承認後に模写へ差し替える。
- **subject-editor-approval**: 原本14頁の人間目視、分析・解説・難易度・仮配点・戦略を科目担当者＝編集責任者が一括承認する。AI検査だけでvisual_reviewedやapprovedをtrueにしない。

## sangyo-medical-2025-general-a-b-physics

元データ: `projects/universities/sangyo-medical/past-exams/working/2025/general-a-b/first-stage/physics/issues.json`

- **official-score-source-review**: 令和7年度募集要項原本で理科2科目の公式合算配点を再確認し、物理100点という分析用仮換算の扱いを科目担当兼編集責任者が判断する。
- **provisional-subquestion-scoring-review**: 19小問へ割り当てた仮配点5点または6点、合計100点を確認する。公式小問別配点ではない。
- **provisional-subject-time-budget-review**: 理科2科目100分を等分した物理50分の仮時間配分を確認する。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、原本図版クロップ7点を模写差し替えする。restricted/pending_redrawの間は内部レビュー限定とする。
- **subject-editor-review**: 物理科目担当者が原本10ページ、3大問19小問・19解答欄、学習者向け解説、分析を一括レビューし、manifestのvisual_reviewedとanalysis.review.approvedを明示判断する。

## showa-medical-2025-general-i-mathematics

元データ: `projects/universities/showa-medical/past-exams/working/2025/general-i/first-stage/mathematics/issues.json`

- **provisional-subquestion-scoring-review**: {"id":"provisional-subquestion-scoring-review","status":"open","severity":"review_required","summary":"16主設問の仮配点合計100点は編集上の配分であり、公式小問別配点ではない。","owner":"subject_editor"}
- **combined-time-allocation-review**: {"id":"combined-time-allocation-review","status":"open","severity":"review_required","summary":"公式は英語・数学合計140分。分析では数学へ70分を仮配分しており、科目担当による妥当性確認が必要。","owner":"editorial_lead"}
- **lexus-time-and-target-review**: {"id":"lexus-time-and-target-review","status":"open","severity":"review_required","summary":"小問別時間、苦手層40.0%、得意層80.0%のLexus目標は編集モデルによる仮定である。","owner":"subject_editor"}
- **learner-editorial-review**: {"id":"learner-editorial-review","status":"open","severity":"review_required","summary":"学習者向け解説は原本の解法順を保った編集稿であり、数学担当による論理・式変形・答案表現の確認が必要。","owner":"subject_editor"}
- **restricted-crop-redraw-review**: {"id":"restricted-crop-redraw-review","status":"open","severity":"publication_blocker","summary":"内部限定クロップ6点はpending_redrawであり、公開前に模写差し替えと対応確認が必要。","owner":"art_and_rights"}
- **rights-review**: {"id":"rights-review","status":"open","severity":"publication_blocker","summary":"原本問題・解答解説のrights_statusはunknown。公開判断前に権利確認が必要。","owner":"rights"}
- **subject-editor-review**: {"id":"subject-editor-review","status":"open","severity":"publication_blocker","summary":"科目担当＝編集責任者による原本、分析、解説、表示の一括承認が未了。","owner":"subject_editor"}

## showa-medical-2025-general-i-physics

元データ: `projects/universities/showa-medical/past-exams/working/2025/general-i/first-stage/physics/issues.json`

- **provisional-subquestion-scoring-review**: {"id":"provisional-subquestion-scoring-review","status":"open","severity":"review_required","summary":"25小問の仮配点合計100点は編集上の配分であり、公式小問別配点ではない。","owner":"subject_editor"}
- **combined-time-allocation-review**: {"id":"combined-time-allocation-review","status":"open","severity":"review_required","summary":"公式は理科2科目合計140分。分析では物理へ70分を仮配分しており、科目担当による妥当性確認が必要。","owner":"editorial_lead"}
- **lexus-time-and-target-review**: {"id":"lexus-time-and-target-review","status":"open","severity":"review_required","summary":"小問別時間とLexus目標は編集モデルによる仮定であり、科目担当の確認が必要。","owner":"subject_editor"}
- **learner-editorial-review**: {"id":"learner-editorial-review","status":"open","severity":"review_required","summary":"学習者向け解説は原本の解法順を保った編集稿であり、物理担当による論理・式・単位・有効数字の確認が必要。","owner":"subject_editor"}
- **restricted-crop-redraw-review**: {"id":"restricted-crop-redraw-review","status":"open","severity":"publication_blocker","summary":"内部限定クロップ11点はpending_redrawであり、公開前に模写差し替えと対応確認が必要。","owner":"art_and_rights"}
- **rights-review**: {"id":"rights-review","status":"open","severity":"publication_blocker","summary":"原本問題・解答解説のrights_statusはunknownで、クロップはrestricted。公開判断前に権利確認が必要。","owner":"rights"}
- **subject-editor-review**: {"id":"subject-editor-review","status":"open","severity":"publication_blocker","summary":"科目担当＝編集責任者による原本、分析、学習者向け解説、表示の一括承認が未了。","owner":"subject_editor"}

## st-marianna-2025-general-early-mathematics

元データ: `projects/universities/st-marianna/past-exams/working/2025/general-early/first-stage/mathematics/issues.json`

- **provisional-scoring-review**: 保存原本で数学の科目満点を確認し、仮100点および第1問15・第2問30・第3問25・第4問30の編集配点を科目担当者が確認する。
- **strategy-time-review**: 原本記載の数学90分を用いた15小問の時間、苦手・得意層戦略、Lexus目標を科目担当者が確認する。
- **editorial-explanation-review**: 学習者向け解説6原本頁分が原本の答え・解法・順序を保つことを原本転記ビューと並べて科目担当者が確認する。
- **rights-and-redraw-review**: 内部限定の原本クロップ3点の権利を確認し、replacement.svgを用意して承認後に模写へ差し替える。
- **subject-editor-approval**: 原本9頁の人間目視、分析・解説・難易度・仮配点・戦略を科目担当者＝編集責任者が一括承認する。AI検査だけでvisual_reviewedやapprovedをtrueにしない。

## st-marianna-2025-general-early-physics

元データ: `projects/universities/st-marianna/past-exams/working/2025/general-early/first-stage/physics/issues.json`

- **official-science-window-review**: 2025年度一般選抜（前期）の募集要項原本で、理科は物理・化学・生物から2科目選択、合計200点・150分であることを科目担当者が再確認する。
- **provisional-score-and-time-review**: 分析用に物理100点・75分へ等分した仮設定と、18分析小問へ5〜7点、合計100点とした仮配点を科目担当兼編集責任者が判断する。公式の物理単独配点・時間、小問別配点ではない。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、restricted/pending_redrawの原本図版クロップ10点を権利処理済み画像へ差し替える。完了までは内部レビュー限定とする。
- **source-html-record-reconciliation**: SOURCE-HTML-RECORD.mdに残る内部トップ科目名『数学』の既知表示不具合記述と、今回原本どおりに補正した解答p.2／p.3間の5ブロック所属を、原本HTMLレーンの記録管理者が履歴を保って追記確認する。
- **subject-editor-review**: 物理科目担当者が原本15ページ、問題ブロック50/50、5大問18分析小問、学習者向け解説、難易度・時間・戦略を一括レビューし、manifestのvisual_reviewedとanalysis.review.approvedを明示判断する。

## teikyo-2025-general-mathematics

元データ: `projects/universities/teikyo/past-exams/working/2025/general/first-stage/mathematics/issues.json`

- **provisional-subquestion-scoring-review**: 数学①・数学②の小問25件に割り当てた仮配点（各日100点、2日分合計200点）を科目担当＝編集責任者が確認する。空所補充と記述が混在するためmixedとして配分しており、公式の小問別配点ではない。
- **provisional-subject-time-budget-review**: 公式の選択2科目合計120分とは別に、得点効率計算用として数学1日60分、収録2日分合計120分を仮設定した。受験生が実際に解くのは1日分であることを含め、科目担当＝編集責任者がこの集計条件を確認する。
- **combined-subject-window-review**: 公式の選択科目枠には国語・数学・物理・化学・生物が含まれる。共通スキーマに国語のsubject_idが無いため、機械可読subject_idsは数学・物理・化学・生物とし、国語は公式条件の注記と表示本文に保持している。科目担当＝編集責任者がこの表現を確認する。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、原本数式・図版クロップ9点の模写差し替えと内容確認を行う。rights_statusがunknown/restricted、replacement_statusがpending_redrawの間、原本ページ画像・原本クロップ・解答解説は内部レビュー限定とする。
- **subject-editor-review**: 数学科目担当者が、原本21ページのHTML転記、8大問・25小問の構造、学習者向け解説、難易度、五角形評価、層別所要時間、戦略、仮配点、得点効率、Lexus目標をパッケージ単位で確認し、manifestのvisual_reviewedとanalysisのreview.approvedを明示的に判断する。

## teikyo-2025-general-physics

元データ: `projects/universities/teikyo/past-exams/working/2025/general/first-stage/physics/issues.json`

- **official-score-time-review**: 公式の選択2科目一括120分・各100点から物理60分とした分析用仮時間、39設問への2.0〜3.0点仮配点を2025年度入学試験要項原本と科目担当者が確認する。
- **mixed-format-and-lexus-review**: マーク式と記述式が混在する39設問について、依存関係、得意・苦手層の時間倍率、今解く・後回し、Lexus目標を確認する。
- **learner-editorial-review**: 6大問39設問の学習者向け解説について、単振り子モデル、浮力の仕事、レンズ倍率、等価線量、熱機関、2球の等加速度運動を物理科目担当者が確認する。
- **question-reader-boundary-review**: 分析開始時に修正した問題p005の物理①第2問(7)と第3問の境界が、原本と大問別公開候補HTMLで一致することを人間が確認する。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、restrictedかつpending_redrawの原本図版クロップ10点を模写差し替えする。
- **subject-editor-review**: 物理科目担当者が原本20ページ、6大問、問題148ブロック、39分析設問、学習者向け解説を一括レビューし、manifestのvisual_reviewedとanalysis.review.approvedを明示判断する。

## toho-2025-general-mathematics

元データ: `projects/universities/toho/past-exams/working/2025/general/first-stage/mathematics/issues.json`

- **provisional-subquestion-scoring-review**: 小問20件の仮配点（合計100点、1問あたり4〜6点、実際の最大差2点）を科目担当＝編集責任者が確認する。全問マークシート方式で公式の小問別配点が非公表のため、編集上の配分である。公式配点ではない。
- **source-explanation-defect-q5-complement**: 第5問問1（オカキ）の原本解説の余事象の数え方を科目担当が確認する。原本は余事象を「A1から2個・A2から1個」「A1から1個・A2から2個」の2型に限り ₁₅C₃−₅C₂・₅C₁・2＝455−10・5・2＝335 と印刷しているが、この右辺は 455−100＝355 であり印刷された答え335と一致しない。「A1から3個」「A2から3個」を含めた完全な余事象は ₁₀C₃＝120 で、455−120＝335 となり答えは正しい。学習者向け解説では原本の式をそのまま示したうえで「つまずきやすい点」として不足分と正しい数え方を併記した。この扱いでよいか、あるいは別の注記に改めるかを判断する。
- **source-explanation-defect-q9-case-table**: 第9問(イ) 0<a<4 の増減表を科目担当が確認する。原本の表は x=−2 の欄に f'(x)=0、f(x)=a+12 と印刷しているが、この場合は −2<−√a なので x=−2 は外側の式 f(x)=x²−4x+8−a が使われる範囲にあり、実際には f'(−2)=−8、f(−2)=20−a である（(ア)の表の値が残ったものと見られる）。結論（極大値なし・最小値 4−a・a=16 は不適）には影響しない。学習者向け解説では原本の表をそのまま再掲したうえで「つまずきやすい点」として指摘した。この扱いの可否を判断する。
- **source-explanation-menelaus-triangle-label**: 第2問問1（カ・キ）の原本解説が「三角形ABCと直線BQについて、メネラウスの定理より」と書いている点を科目担当が確認する。印刷された比の並び AQ/QC・CB/BP・PO/OA=1 は、三角形APCを直線QBが切る形に対応する。式と答えは正しい。学習者向け解説では原本の表記をそのまま引用したうえで、「考え方」として定理を当てる三角形がAPC・切る直線がQBであることを補足した。この扱いの可否を判断する。
- **question-instructions-transcription-scope**: 問題冊子1ページ目の「解答に関する注意」の転記粒度を司令塔が判断する。原本は(1)符号と数字の対応・マーク例、(2)分数は既約形・符号は分子につける、(3)根号の中の自然数は最小にする、の3項目と例示を含むが、reconstruction.json では2文に要約されている。本バッチは原本HTML化を範囲外としているため転記し直していない。分析結果には影響しないが、公開候補の問題HTMLの原本忠実性には関わる。
- **rights-review**: 問題・解答原本の公開利用範囲を確認する。権利状態が unknown / restricted の間、原本ページ画像と解答解説は内部レビュー版だけに表示する。
- **crop-redraw-review**: 図版クロップ4点（ans-q2-triangle、ans-q3-curves、ans-q7-complex-plane、ans-q8-space）に replacement.svg が格納された後、科目担当が模写内容を確認して replacement_ready へ進める。元クロップとSVGの縦横比は一致しなくてよい。
- **subject-editor-review**: 数学科目担当者が、原本13ページのHTML転記、大問10・小問20の構造、小問別難易度、五角形評価、層別所要時間、戦略、仮配点、得点効率、Lexus目標、学習者向け解説をパッケージ単位で確認し、承認可否を記録する。source/manifest.json の visual_reviewed と analysis.json の review.approved は本セッションでは変更していない。
- **weak-profile-scan-cost-review**: 苦手層の初期判断時間が公式90分のうち60.8分（67.6%）を占め、解答実行に29.2分しか残らない点を編集責任者が確認する。大問10題・小問20問という構成そのものに由来する数値であり、時間倍率も基準時間もLexus所有の入力である。目標を良く見せるために基準時間や倍率を縮めていない。指導方針（解く範囲をどこまで絞るか）の判断材料として提示する。

## toho-2025-general-physics

元データ: `projects/universities/toho/past-exams/working/2025/general/first-stage/physics/issues.json`

- **toho-physics-2025-provisional-scoring**: {"id":"toho-physics-2025-provisional-scoring","status":"open","category":"scoring","summary":"27小問の配点は編集上の仮配点であり、科目担当レビューが必要。"}
- **toho-physics-2025-combined-time**: {"id":"toho-physics-2025-combined-time","status":"open","category":"time_model","summary":"理科2科目120分から物理60分とした仮時間モデルの編集責任者確認が必要。"}
- **toho-physics-2025-official-source-recheck**: {"id":"toho-physics-2025-official-source-recheck","status":"open","category":"source","summary":"典拠として記録された2025年度募集要項URLが現在404のため、公式原典の再確認が必要。"}
- **toho-physics-2025-lexus-review**: {"id":"toho-physics-2025-lexus-review","status":"open","category":"analysis","summary":"Lexus目標と層別時間倍率は編集モデルであり、科目担当レビューが必要。"}
- **toho-physics-2025-editorial-review**: {"id":"toho-physics-2025-editorial-review","status":"open","category":"editorial","summary":"6大問へ再編した学習者向け解答・解説の科目担当レビューが必要。"}
- **toho-physics-2025-crop-redraw**: {"id":"toho-physics-2025-crop-redraw","status":"open","category":"asset","summary":"原本クロップ7点は内部限定で、公開前に模写・差し替えが必要。"}
- **toho-physics-2025-rights**: {"id":"toho-physics-2025-rights","status":"open","category":"rights","summary":"問題・解答原本の権利状態は未確認。公開可否の人間判断が必要。"}
- **toho-physics-2025-package-approval**: {"id":"toho-physics-2025-package-approval","status":"open","category":"approval","summary":"科目担当・編集責任者によるパッケージ全体承認が未実施。"}

## tohoku-medical-pharmaceutical-2025-general-mathematics

元データ: `projects/universities/tohoku-medical-pharmaceutical/past-exams/working/2025/general/first-stage/mathematics/issues.json`

- **official-score-source-review**: 2025年度一般選抜1次試験の数学100点を、大学公式募集要項の保存原本で科目担当兼編集責任者が再確認する。数学70分は問題原本p.1で確認済み。
- **provisional-subquestion-scoring-review**: 印刷上の12小問へ割り当てた仮配点8点または9点（合計100点）を科目担当兼編集責任者が確認する。公式の小問別配点ではない。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、マーク記入例、格子経路図、a-b平面の領域・接線図、ベン図の計7点を模写差し替えして内容確認を行う。rights_statusがunknown/restricted、replacement_statusがpending_redrawの間、原本ページ画像・原本クロップ・原本解答解説は内部レビュー限定とする。
- **subject-editor-review**: 数学科目担当者が、原本10ページのHTML転記、3大問・12小問の構造、学習者向け解説、難易度、五角形評価、層別所要時間、戦略、仮配点、得点効率、Lexus目標をパッケージ単位で確認し、manifestのvisual_reviewedとanalysisのreview.approvedを明示的に判断する。

## tohoku-medical-pharmaceutical-2025-general-physics

元データ: `projects/universities/tohoku-medical-pharmaceutical/past-exams/working/2025/general/first-stage/physics/issues.json`

- **source-transcription-corrections-review**: {"id":"source-transcription-corrections-review","status":"open","severity":"review_required","summary":"原本19ページのAI再監査で、注意事項の欄番号、問Ⅰ-3(1)の座標符号と選択肢、問Ⅱ-1(2)の解答番号を正本へ修正した。科目担当による原本対照が必要。","owner":"subject_editor"}
- **provisional-subquestion-scoring-review**: {"id":"provisional-subquestion-scoring-review","status":"open","severity":"review_required","summary":"18論理小問の仮配点合計100点は編集上の配分であり、公式小問別配点ではない。","owner":"subject_editor"}
- **combined-time-allocation-review**: {"id":"combined-time-allocation-review","status":"open","severity":"review_required","summary":"原本記載は理科2科目合計120分。分析では物理へ60分を仮配分しており、科目担当による妥当性確認が必要。","owner":"editorial_lead"}
- **lexus-time-and-target-review**: {"id":"lexus-time-and-target-review","status":"open","severity":"review_required","summary":"小問別時間とLexus目標は編集モデルによる仮定であり、科目担当の確認が必要。","owner":"subject_editor"}
- **learner-editorial-review**: {"id":"learner-editorial-review","status":"open","severity":"review_required","summary":"学習者向け解説は原本の解法順・式を保った編集稿であり、物理担当による論理・式・符号の確認が必要。","owner":"subject_editor"}
- **restricted-crop-redraw-review**: {"id":"restricted-crop-redraw-review","status":"open","severity":"publication_blocker","summary":"内部限定クロップ7点はpending_redrawであり、公開前に模写差し替えと対応確認が必要。","owner":"art_and_rights"}
- **rights-review**: {"id":"rights-review","status":"open","severity":"publication_blocker","summary":"原本問題・解答解説のrights_statusはunknownで、クロップはrestricted。公開判断前に権利確認が必要。","owner":"rights"}
- **subject-editor-review**: {"id":"subject-editor-review","status":"open","severity":"publication_blocker","summary":"科目担当＝編集責任者による原本、分析、学習者向け解説、表示の一括承認が未了。","owner":"subject_editor"}

## tokai-2025-general-mathematics

元データ: `projects/universities/tokai/past-exams/working/2025/general/first-stage/mathematics/issues.json`

- **score-allocation**: {"id":"score-allocation","status":"open","severity":"medium","summary":"公式100点を16論理小問へ配分した仮配点を科目担当者が確認する。"}
- **time-strategy**: {"id":"time-strategy","status":"open","severity":"medium","summary":"公式70分を用いた時間モデル・層別戦略・Lexus目標を確認する。"}
- **editorial-review**: {"id":"editorial-review","status":"open","severity":"high","summary":"学習者向け解説10原本ページ分を原本の解法順・数値と照合する。"}
- **rights-redraw**: {"id":"rights-redraw","status":"open","severity":"high","summary":"内部限定クロップ9点の権利を確認し、公開前に模写へ差し替える。"}
- **human-approval**: {"id":"human-approval","status":"open","severity":"high","summary":"原本12ページ、分析、解説、難易度、レーダー、戦略を科目担当者が承認する。"}

## tokai-2025-general-physics

元データ: `projects/universities/tokai/past-exams/working/2025/general/first-stage/physics/issues.json`

- **score-allocation**: {"id":"score-allocation","status":"open","severity":"medium","summary":"公式100点を20論理小問へ均等配分した仮配点を科目担当者が確認する。"}
- **time-strategy**: {"id":"time-strategy","status":"open","severity":"medium","summary":"公式70分を用いた時間モデル・層別戦略・Lexus目標を確認する。"}
- **editorial-review**: {"id":"editorial-review","status":"open","severity":"high","summary":"学習者向け解説6原本ページ分を原本の解法順・数式・答えと照合する。"}
- **rights-redraw**: {"id":"rights-redraw","status":"open","severity":"high","summary":"内部限定クロップ7点の権利を確認し、公開前に模写へ差し替える。"}
- **human-visual-review**: {"id":"human-visual-review","status":"open","severity":"high","summary":"原本11ページを科目担当者が実画面で確認し、source manifestのvisual_reviewedを承認する。"}
- **human-approval**: {"id":"human-approval","status":"open","severity":"high","summary":"分析、解説、難易度、レーダー、戦略、権利状態を科目担当者が一括承認する。"}

## tokyo-medical-2025-general-mathematics

元データ: `projects/universities/tokyo-medical/past-exams/working/2025/general/first-stage/mathematics/issues.json`

- **official-score-source-review**: 2025年度一般選抜1次試験の数学100点を、大学公式入試資料の保存原本で科目担当兼編集責任者が再確認する。数学60分は問題原本p.1で確認済み。
- **provisional-subquestion-scoring-review**: 14小問へ割り当てた仮配点（7点または8点、合計100点）を科目担当兼編集責任者が確認する。公式の小問別配点ではない。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、問題第4問の解答群1点、解答第2問の集合図3点、解答第4問の空間図2点を模写差し替えして内容確認を行う。rights_statusがunknown/restricted、replacement_statusがpending_redrawの間、原本ページ画像・原本クロップ・原本解答解説は内部レビュー限定とする。
- **subject-editor-review**: 数学科目担当者が、原本12ページのHTML転記、4大問・14小問の構造、学習者向け解説、難易度、五角形評価、層別所要時間、戦略、仮配点、得点効率、Lexus目標をパッケージ単位で確認し、manifestのvisual_reviewedとanalysisのreview.approvedを明示的に判断する。

## tokyo-medical-2025-general-physics

元データ: `projects/universities/tokyo-medical/past-exams/working/2025/general/first-stage/physics/issues.json`

- **official-science-window-review**: 2025年度一般選抜の公式要項原本で、理科は選択2科目を合計120分で解答する条件と、理科・物理の公式配点を科目担当者が再確認する。
- **provisional-score-and-time-review**: 分析用に物理100点・60分へ等分した仮設定と、23分析小問へ4〜5点、合計100点とした仮配点を科目担当兼編集責任者が判断する。公式の物理単独時間・小問別配点ではない。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、restricted/pending_redrawの原本図版クロップ12点を権利処理済み画像へ差し替える。完了までは内部レビュー限定とする。
- **source-record-review**: 原本21ページ、問題94/94ブロック、解答112ブロック、5大問23分析小問・26解答枠の対応を原本HTMLレーンの記録管理者が再確認する。
- **subject-editor-review**: 物理科目担当者が原本21ページ、5大問23分析小問・26解答枠、学習者向け解説、難易度・時間・戦略を一括レビューし、manifestのvisual_reviewedとanalysis.review.approvedを明示判断する。

## tokyo-womens-medical-2025-general-mathematics

元データ: `projects/universities/tokyo-womens-medical/past-exams/working/2025/general/first-stage/mathematics/issues.json`

- **official-score-source-review**: 2025年度一般選抜1次試験の数学100点を大学公式募集要項の保存原本で科目担当兼編集責任者が再確認する。数学60分は問題原本p.1で確認済み。
- **provisional-subquestion-scoring-review**: 11小問へ割り当てた9点または10点の仮配点（合計100点、差1点）を科目担当兼編集責任者が確認する。公式の小問別配点ではない。
- **rights-and-redraw-review**: 問題・解答原本の公開利用範囲を確認し、問題第4問および解答第2問の図版crop 3点を模写差し替えして内容確認を行う。rights_statusがunknown/restricted、replacement_statusがpending_redrawの間、原本ページ画像・原本クロップ・原本解答解説は内部レビュー限定とする。
- **subject-editor-review**: 数学科目担当者が、原本7ページのHTML転記、4大問・11小問の構造、学習者向け解説、難易度、五角形評価、層別所要時間、戦略、仮配点、得点効率、Lexus目標をパッケージ単位で確認し、manifestのvisual_reviewedとanalysisのreview.approvedを明示的に判断する。

## tokyo-womens-medical-2025-general-physics

元データ: `projects/universities/tokyo-womens-medical/past-exams/working/2025/general/first-stage/physics/issues.json`

- **provisional-subquestion-scoring-review**: {"id":"provisional-subquestion-scoring-review","status":"open","severity":"review_required","summary":"29論理小問の仮配点合計100点は編集上の配分であり、公式小問別配点ではない。","owner":"subject_editor"}
- **combined-time-allocation-review**: {"id":"combined-time-allocation-review","status":"open","severity":"review_required","summary":"原本記載は理科2科目合計120分。分析では物理へ60分を仮配分しており、科目担当による妥当性確認が必要。","owner":"editorial_lead"}
- **lexus-time-and-target-review**: {"id":"lexus-time-and-target-review","status":"open","severity":"review_required","summary":"小問別時間とLexus目標は編集モデルによる仮定であり、科目担当の確認が必要。","owner":"subject_editor"}
- **learner-editorial-review**: {"id":"learner-editorial-review","status":"open","severity":"review_required","summary":"学習者向け解説は原本の解法順・式を保持して再構成する編集稿であり、物理担当による論理・式・符号の確認が必要。","owner":"subject_editor"}
- **restricted-crop-redraw-review**: {"id":"restricted-crop-redraw-review","status":"open","severity":"publication_blocker","summary":"内部限定クロップ14点はpending_redrawであり、公開前に模写差し替えと対応確認が必要。","owner":"art_and_rights"}
- **rights-review**: {"id":"rights-review","status":"open","severity":"publication_blocker","summary":"原本問題・解答解説のrights_statusはunknownで、クロップはrestricted。公開判断前に権利確認が必要。","owner":"rights"}
- **subject-editor-review**: {"id":"subject-editor-review","status":"open","severity":"publication_blocker","summary":"科目担当＝編集責任者による原本、分析、学習者向け解説、表示の一括承認が未了。","owner":"subject_editor"}
