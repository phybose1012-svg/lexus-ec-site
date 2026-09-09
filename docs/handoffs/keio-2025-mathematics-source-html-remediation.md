# 慶應義塾大学2025年度一般選抜・数学：source HTML修正依頼

以下のコードブロックを、`shidai-igakubu-gokaku-dokuhon` のHTML修正だけを担当する新しいセッションへ、そのまま渡してください。

````text
慶應義塾大学2025年度 一般選抜 医学部 第一次試験 数学のsource HTMLについて、原本画像との全件再照合と独立計算を行い、検出済みの転記不整合をcanonical dataから修復してください。既知の箇所だけを置換して終わらず、問題5ページ・解答16ページ・分析データの全範囲を監査し、同種の不備が残っていないことを確認してください。

これは新規HTML化バッチではなく、すでにsource HTML・解答転記・分析が存在する1パッケージ専用のremediationです。キューから別パッケージを取得せず、対象パッケージだけを修復してください。生成HTMLを直接編集してはいけません。必ずcanonical dataを直し、既存generatorで全派生物を再生成します。

## 作業対象

作業リポジトリ:

`C:\---hp\shidai-igakubu-gokaku-dokuhon`

対象パッケージ:

`C:\---hp\shidai-igakubu-gokaku-dokuhon\projects\universities\keio\past-exams\working\2025\general\first-stage\mathematics`

package ID:

`keio-2025-general-mathematics`

Lexus EC側の作業ツリーは参照のみとし、修復セッションから編集しないでください:

`C:\---hp\_worktrees\keio-2025-mathematics`

## 最初に読むもの

1. ルートの `AGENTS.md` と `README.md`
2. `projects/universities/AGENTS.md`
3. `projects/universities/keio/AGENTS.md`（存在する場合）
4. `projects/universities/.agents/skills/analyze-medical-entrance-past-exams/SKILL.md`
5. 同skillが今回必要と指定するreferences、とくにsource HTML reconstruction、runbook、analysis validation
6. `prompts/run-past-exam-html-batch.md`（通常工程とデータ形式の参考。今回の専用条件を優先）
7. 対象の `SOURCE-HTML-RECORD.md`、分析記録、`issues.json`
8. `source-html/reconstruction.json`
9. `source-html/editorial-explanations.json`
10. `analysis/analysis.json`、`analysis/derived.json` および分析HTMLの入力・生成記録

大学固有の募集要項データと、2025年度過去問パッケージを混在させないでください。

## 修復の原則

- 原本画像とcanonical transcriptionが不一致なら、原本画像を根拠にcanonicalを直す。
- 原本自体の誤り・説明不足・論理の飛躍なら、source-faithful transcriptionを勝手に改変せず、編集解説レイヤーとopen issueで補う。
- 原本だけでは期待値を確定できない場合は推測しない。open issueとして残す。
- `source-html/generated/**`、preview HTML、埋め込みJSONは直接編集しない。canonical修正後にgeneratorから再生成する。
- restrictedな解答画像・原本ページ・cropをpublic-candidateへコピーしない。
- 既存の権利確認・図版差し替え・編集責任者承認ゲートを解除しない。

## 独立計算で確認済みの正答一覧

修復後の答えキーと解説を照合する基準です。ただし、この一覧だけを機械的に転記せず、必ず原本画像と計算で再確認してください。

| 小問 | 正しい結果 |
|---|---|
| I(1) | あ=84、い=148 |
| I(2) | う=4/(e^2+1) |
| I(3) | え=4/(3π) |
| I(4) | お=13/6 |
| I(5) | (x,y,z,w)=(6,0,0,3),(2,8,2,1) |
| II(1) | あ=1/2、い=1/2、う=3/5、え=2/5、お=3/4、か=(1/2)^n、き=5、く=3/5、け=1/2、こ=4、さ=3/4、し=-2、す=3/5、せ=1/2 |
| II(2) | そ=n/2+1、た=3、ち=-1/4、つ=-1、て=-3/2 |
| III(1)(i) | 24x^6-4x^2+1 |
| III(1)(ii) | Hの値域が無限集合であることからGは零多項式 |
| III(2)(i) | い=a、う=3、え=-3a、お=-6a^2+4a-1、か=3a^3 |
| III(2)(ii) | き=1/3、く=1、け=(3a-sqrt(9a^2-12a+3))/3、こ=(3a+2sqrt(9a^2-12a+3))/3 |
| III(2)(iii) | さ=-3a^2+4a-1、し=a^3、す=a^2 exp(-a^2/2)、せ=2/e |
| IV(1) | あ=(2-p)/2、い=(2-2p)/(2-p)、う=2/3、え=2p/(2-p)、お=(3p-2)/2 |
| IV(2)(i) | か=a_1/b_1 |
| IV(2)(ii) | き=a/2、く=(2-b)/2、け=a/(2-b)、こ=(2-2b)/(2-b)、さ=2/3、し=2-2a、す=(2-2a)/a、せ=3a/2、そ=(3b-2)/2 |

I全問と、原本が意図するIIIの最終値は独立計算と整合しています。主な公開停止級不備はII〜IVです。

## 公開停止級不備1：大問II(1)の問題式・空欄構造が別物

原本:

`source/pages/questions/questions-page-2.png`

canonical候補:

- `source-html/reconstruction.json` の questions p002 blocks 11, 13〜16
- 生成された `major-question-02.html`

現状の主な問題:

- `c_{n+1}` に原本にない `a_n` 項が追加されている。
- 係数の空欄が「え・お・か」へずれている。
- `a_n,b_n,c_n` の空欄記号・指数・係数構造が全面的にずれている。

原本どおりの期待構造:

```tex
c_{n+1}=\boxed{\text{え}}b_n+\boxed{\text{お}}c_n
```

```tex
a_n=\boxed{\text{か}},\qquad
b_n=\boxed{\text{き}}\left\{
(\boxed{\text{く}})^n-(\boxed{\text{け}})^n
\right\}
```

```tex
c_n=\boxed{\text{こ}}\left\{
(\boxed{\text{さ}})^{n-1}
+\boxed{\text{し}}(\boxed{\text{す}})^{n-1}
+(\boxed{\text{せ}})^{n-1}
\right\},\qquad \text{さ}>\text{せ}
```

正しい一般項:

```tex
c_n=4\left\{
\left(\frac34\right)^{n-1}
-2\left(\frac35\right)^{n-1}
+\left(\frac12\right)^{n-1}
\right\}
```

現行の `4(3/4)^n-2(3/5)^n+(1/2)^n` は括弧、係数、指数が誤っています。`n=1` で2.3となり、定義上の `c_1=0` に反することを回帰検査にしてください。

影響範囲:

- 問題canonicalとpublic-candidate
- 内部解答キー
- 原本転記解説と編集解説
- 空欄対応
- 分析上の設問説明

## 公開停止級不備2：大問II(2)の期待値・分散の解答形式が別物

原本:

`source/pages/questions/questions-page-3.png`

canonical候補:

- questions p003 blocks 5〜6
- answers p005 block 2
- `editorial-explanations.json` p005 block 1

現状:

```tex
E(Y_n)=\boxed{\text{た}}2^n+\boxed{\text{ち}}
```

さらに分散を `2^n,4^n,n^2,n` など7空欄相当へ誤分解しています。

原本どおりの期待構造:

```tex
E(Y_n)=\boxed{\text{そ}}
```

```tex
V(Y_n)=\boxed{\text{た}}2^{n-1}
+\boxed{\text{ち}}n^2
+\boxed{\text{つ}}n
+\boxed{\text{て}}
```

独立計算結果:

```tex
E(Y_n)=\frac n2+1,\qquad
V(Y_n)=3\cdot2^{n-1}-\frac14n^2-n-\frac32
```

現行形式では意図された答えを記入できません。答えキーの「そ」欠落と、た〜なの誤分解も同時に直してください。

## 公開停止級不備3：大問III(2)の恒等式で外括弧を喪失

原本:

`source/pages/questions/questions-page-3.png`

canonical候補:

questions p003 block 15

現状:

```tex
g(h(x))-{h(x)}^3+b{g(x)}^2+ch(x)+d=0
```

期待:

```tex
g(h(x))-\left( {h(x)}^3+b{g(x)}^2+ch(x)+d \right)=0
```

マイナスは括弧全体に作用します。現行式なら `b,c,d` の符号が原本の意図する答えと逆になるため、III(2)全体の問題・解答が不一致です。括弧を見た目だけ補うのではなく、canonicalの数式構造として復元してください。

## 公開停止級不備4：大問III(2)(iii)の指数因子の作用範囲が変化

原本:

`source/pages/questions/questions-page-4.png`

canonical候補:

questions p004 blocks 7〜10

現状は `2(x-a)e^{-...}` だけを先に引き、残りの多項式部分に指数因子を掛けていません。

原本どおりの期待定義:

```tex
F(a)=\int_0^a
\left\{
g(x)-\boxed{\text{さ}}x-\boxed{\text{し}}-2(x-a)
\right\}
e^{-\frac{(x-a)^2}{2}}\,dx
```

指数因子は波括弧全体に掛かります。修復後、`F(a)=a^2e^{-a^2/2}` と最大値 `2/e` が定義から独立に導けることを確認してください。

## 公開停止級不備5：大問IV(1)の点名・解答対象・境界条件

原本:

`source/pages/questions/questions-page-4.png`

canonical候補:

questions p004 blocks 16〜19

現状:

- `P_3(p_3,0)` としている。
- 求める対象を `(p_3,q_3)` としている。
- `p` と `q_3` が未定義になる。
- 「`P_i` は正方形の頂点ではない」という条件が欠落している。
- 第2場合の境界 `2/3\leqq p<1` を厳密不等号へ変えている。

期待:

- `P_3(p,0)`
- 場合分けして求めるのは `(p_4,q_4)`
- 頂点除外条件を原本どおり復元
- 境界を原本どおり保持

第1場合と第2場合の境界では、反射展開した直線が角へ同時到達します。等号の所属を原本と独立幾何の両方で確認してください。

## 公開停止級不備6：大問IV(2)を要約し、問題成立に必要な条件を喪失

原本:

- `source/pages/questions/questions-page-4.png`
- `source/pages/questions/questions-page-5.png`

canonical候補:

questions p004 blocks 22〜23、およびp005の続き

現状:

- `Q_3(a_3,b_3,0)` としている。
- 実際の条件を「問題文記載の等角条件」とだけ要約している。
- `a,b` の定義、反射直線化の根拠、各面の共有線分との関係を取得できない。

期待:

- `Q_3(a,b,0)`
- `Q_i` が立方体の頂点・辺上にない条件
- `Q_i` を含む立方体の面と、3点 `Q_{i-1},Q_i,Q_{i+1}` を含む平面との直交条件
- 隣接面の共有線分 `C_iD_i` の定義
- 原本に記載された等角条件と角度範囲の全文

ここは要約禁止です。原本p.4〜5を行単位で再転記し、記号の初出と参照先が閉じていることを検査してください。原本から判読不能な箇所があれば推測せず、該当画像座標と確認事項をopen issueへ残してください。

## 公開停止級不備7：大問IV(2)の空欄対応と内部解答キー

canonical候補:

- questions p005 blocks 3, 5〜6
- answers p012 block 2、p014 block 1、p015 block 1
- `editorial-explanations.json` p012 block 1、p015 blocks 2〜3
- generated internal answers for major question IV

現状の主なずれ:

- (i)で `a_2=き` としている。
- (ii)で `a_1=く,b_1=け,a_2=き` としている。
- 後半条件を「せ<b」としている。
- 解答キーの く・け・せ と最終座標が誤っている。

期待する空欄対応:

- (i): `a_2=か`
- (ii): `a_1=き,b_1=く,a_2=け,c_2=こ`
- 範囲: `0<a\leqqさ` かつ `さ\leqq b<1`

正式キー:

```text
か = a_1/b_1
き = a/2
く = (2-b)/2
け = a/(2-b)
こ = (2-2b)/(2-b)
さ = 2/3
し = 2-2a
す = (2-2a)/a
せ = 3a/2
そ = (3b-2)/2
```

根拠の一つは展開後の直線

```tex
\frac{x}{a}=\frac{y}{2-b}=\frac{z}{2}
```

と平面 `z=3` の交点です。したがって最終座標の第1成分は `3a/2` です。原本転記解説p.14の反射順も、現行の `y=1,z=2,y=2` ではなく、原本どおり `z=1,y=1,z=2` へ直してください。

境界は `2/3<b<1` ではなく `2/3\leqq b<1` です。

## 分析データの連鎖不備

`analysis.json`、`derived.json` と分析HTMLもcanonical問題修復後に再監査・再生成してください。

検出済み:

- `math-q4-2i` のラベル: 現「（2）（i）（か・き）」→ 正「（2）（i）（か）」
- `math-q4-2ii` のラベル: 現「（2）（ii）（く〜そ）」→ 正「（2）（ii）（き〜そ）」
- `assessment_format: "mark_exam"` は不適切。空欄補充だけでなく思考過程の記述と証明問題を含むため、データモデル上の正式な混合形式値（現行schemaでは `mixed` を想定）へ変更する。
- マーク式専用の仮配点制約を外し、15小問各10点という仮配点の根拠を再審査する。
- IVの分割・依存関係・空欄対応が変わるため、難易度・優先度・時間・目標ルートを全面再計算する。
- 現在の70/150、112/150、レーダー平均は壊れた入力に対する算術としては整合しているが、修復後も同じになるとは限らない。旧値を維持するための調整は禁止。

公式資料で確認済みの試験情報:

- 数学100分・150点
- 第一次試験4科目合計500点（英語150、数学150、理科2科目計200）
- 2025年度第一次試験合格最低点280点

公式一次資料:

- `https://www.keio.ac.jp/ja/admissions/docs/240419_generaladmissions2025.pdf`
- `https://www.keio.ac.jp/ja/admissions/docs/tokuten2025.pdf`

リンクが移動している場合は、慶應義塾大学公式の一般選抜ページから2025年度資料を辿り、PDFを対象パッケージの既存ルールに従って保存・ハッシュ記録してください。検索結果の要約だけを証拠にしないでください。

`minimum_score_comparability: "not_published"` は不正確です。500点合計の最低点は公表されていますが科目別最低点ではないため、schemaの定義を確認し `limited` 相当へ変更し、「280点は第一次試験4科目合計であって数学単科の基準ではない」と明記してください。

## 非停止だが原本忠実性のため直す事項

1. 問題p.1で原本の変数 `u,p(u)` を `z,p(z)` に置換し、導入文1文を省略している。原本どおり復元する。
2. IIIの「（う）（き）（く）（せ）は数、他はaを用いる」という空欄指示が欠落している。原本どおり復元する。
3. `reconstruction.json` の解答p.11で置換を `t^2/2=u` としている。正しくは `-t^2/2=u`。前後の積分変換も再計算する。
4. `issues.json` に今回の内容欠陥が記録されていない。既存issueを保持したまま、安定ID・原本ページ・旧値・期待値・根拠・波及先を持つissueを追加する。
5. `reconstruction_complete`、`page_comparison_completed`、`mathematical_consistency_checked`、`answer_key_checked` 等の真値フラグは現状では成立しない。修復と全件再監査が完了するまでfalse/未完了へ戻し、実際の検査通過後にだけ更新する。

## 全件監査

既知10件だけを直して終了しないでください。少なくとも次を全ページで再確認してください。

- 問題原本5ページとI〜IVの本文全文、条件、記号の初出、添字、指数、括弧、絶対値、等号・不等号、等号境界、空欄記号
- 解答原本16ページと全答えキー・各解説の最終値
- すべての式変形が直前式から代数的に成立するか
- 漸化式の初期値、とくに `c_1=0` と一般項が一致するか
- 期待値・分散が小さいnの直接列挙と一致するか
- IIIの恒等式と積分で括弧・指数因子の作用範囲が保持されているか
- IVの各点が定義済みで、頂点・辺・面・共有線分・角条件の参照が閉じているか
- IVの反射順、境界、座標が独立幾何計算と一致するか
- `reconstruction.json`、`question-reader.json`、`editorial-explanations.json`、分析canonical、各生成HTML、埋め込みJSONの対応
- KaTeXの生文字列、未解決コマンド、括弧不一致、文字化け、ラベル重複がないか

追加不備は次の3分類で処理してください。

1. 原本とcanonicalが不一致: canonicalを原本どおり修正し、再生成・再検証。
2. 原本自体の誤り・論理不足: source transcriptionを保持し、編集解説で補い、原資料由来issueをopenで追加。
3. 原本から確定不能: 推測せず、画像位置と必要な確認をopen issueへ記録。

## 再生成と検証

実際のコマンド名・引数は対象リポジトリのskillと記録を優先します。概ね次の順序で行ってください。

1. canonical修正
2. source HTML generatorで `source-html/generated` 全体を再生成
3. source HTML validatorを実行しエラー0を確認
4. 分析成果物をcanonicalから再生成
5. analysis validator / package QAを実行
6. `qa-browser-pages.json` の全対象を実ChromeでPC 1280×900とスマホ390×844の両方で検査
7. browser reportを同じ実在パスへ揃えてsource validatorと全体QAを再実行
8. 原本画像と再生成HTMLを並べ、問題5ページ・解答16ページを目視比較

browser QA出力は、`run_browser_qa.mjs --output`、source validatorのbrowser report引数、全体QAのbrowser report引数で同じファイルを使ってください。古いreportを誤使用しないでください。

最低合格基準:

- 原本問題5/5ページ、原本解答16/16ページを再照合
- 全15分析小問を再照合
- validatorエラー0
- browser QA全ケース合格
- II(1)の旧 `c_{n+1}` 構造と旧一般項が0件
- `n=1` で修復後の `c_n=0`
- II(2)の旧期待値・分散空欄構造が0件
- III(2)恒等式の外括弧がcanonicalと全生成HTMLに存在
- III(2)(iii)で指数因子が波括弧全体へ掛かる
- IV(1)で `P_3(p,0)` と `(p_4,q_4)` が正しく、未定義記号がない
- IV(2)の条件全文、`Q_3(a,b,0)`、正しい空欄対応、正しい答えキーがcanonicalと生成HTMLに存在
- IVの旧誤値 `2/(2-b)`, `2b/(2-b)`, `2a/(2-b)` が誤った空欄として0件
- analysisのIVラベルが「か」「き〜そ」へ修正され、derivedを再生成
- assessment formatが混合形式を表す正式値
- 公開候補にrestricted画像・crop・解答転記本文が流出していない
- 既存の人間・権利ゲート以外にQAエラーがない

旧値検索は、空白やTeX記法の差も考慮してください。単純な完全一致1種類だけでは不十分です。

## 状態フラグと公開ゲート

この修復と自動QAだけを根拠に、次を承認済みにしないでください。

- `visual_reviewed`
- `review.approved`
- `needs_human_review`
- publication status
- cropのrights/replacement status
- 編集責任者承認

現パッケージには「権利確認・図版差し替え・編集責任者承認が完了するまで公開禁止」の明示ゲートがあります。内容修復だけでproduction-readyまたはstaging公開可能へ変更してはいけません。

## Gitと作業範囲

- 開始時に `git status --short --branch` と `git worktree list --porcelain` を確認する。
- 数学キューや別パッケージを予約・更新しない。
- 他セッションの変更をstash、reset、削除しない。
- 対象パッケージと、必要性を立証した共通generator/testだけを変更する。
- 共通generator変更が必要なら、先に全利用箇所を調査し、他パッケージの回帰テストを追加する。
- Lexus EC側 `C:\---hp\_worktrees\keio-2025-mathematics` は編集しない。
- ユーザーから別途指示がない限りcommit/pushしない。

## 完了報告

最後に次を漏れなく報告してください。

- 検出した全不備（原本ページ、canonical場所、旧値、修正値、根拠、波及先）
- canonicalで変更した全ファイル・block
- 再生成した全成果物
- 独立計算の確認方法と15小問の最終値
- IIの漸化式・一般項・期待値・分散が初期値や小さいnと一致したこと
- IIIの括弧と指数因子の作用範囲が直ったこと
- IVの条件全文、空欄、境界、反射順、座標が直ったこと
- analysisの設問分割・format・仮配点・目標ルートを再審査した結果
- 公式PDFの保存場所、URL、hash、数学150点/100分・合計500点・最低280点の確認結果
- staleな旧値が対象パッケージから0件になった検索結果
- source validator、analysis validator、全体QA、PC/スマホbrowser QAの結果
- 追加で残したopen issue
- 権利・図版・人間レビューの公開ゲートを変更していないこと
- 変更ファイル一覧
- `git diff --check`、`git status --short --branch`、`git diff --name-only` の結果
````
