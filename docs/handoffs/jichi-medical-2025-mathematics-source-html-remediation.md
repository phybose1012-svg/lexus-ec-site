# 自治医科大学2025年度第一次試験・数学：source HTML修正依頼

以下のコードブロックを、`shidai-igakubu-gokaku-dokuhon` のHTML修正を担当する新しいセッションへ、そのまま渡してください。

````text
自治医科大学2025年度 一般選抜 第一次試験 数学のsource HTMLについて、検出済みの転記不整合と原資料解説の論理の飛躍を修正・補足し、同じ種類の不備が残っていないことを全25原本ページとの再照合で確認してください。

これは8レーンの新規HTML化バッチではなく、すでに生成・分析済みの1パッケージだけを直す専用remediationです。`prompts/run-past-exam-html-batch.md` はデータ形式と通常工程の参考として読みますが、次の専用条件は同文書より優先します。

- 作業場所は下記の `C:\---hp` 配下であり、同文書の `C:\dev` ではない。
- レーンIDを取得せず、数学キューを予約・更新しない。別パッケージを取得しない。
- 対象パッケージにはすでに分析と編集解説があるため、必要な `editorial-explanations.json` の局所補強と最終 `run_qa.py` は今回の範囲内とする。
- 共通generatorは原則変更しない。見出し投影などをパッケージデータだけで直せず共通修正が不可避な場合に限り、影響調査と回帰テストを添えて最小変更する。

作業リポジトリ:
C:\---hp\shidai-igakubu-gokaku-dokuhon

対象パッケージ:
C:\---hp\shidai-igakubu-gokaku-dokuhon\projects\universities\jichi-medical\past-exams\working\2025\general\first-stage\mathematics

package ID:
jichi-medical-2025-general-mathematics

## 最初に読むもの

1. `AGENTS.md`
2. `README.md`
3. `projects/universities/AGENTS.md`
4. `projects/universities/jichi-medical/AGENTS.md`
5. `projects/universities/.agents/skills/analyze-medical-entrance-past-exams/SKILL.md`
6. 同skillからこの作業に必要と指定されるreference、とくに `references/source-html-reconstruction.md` と `references/runbook.md`
7. `prompts/run-past-exam-html-batch.md`
8. 対象パッケージの `SOURCE-HTML-RECORD.md`、`ANALYSIS-RECORD.md`、`issues.json`

大学固有のAGENTS.mdは主に2027年度募集要項を扱っています。今回の対象は2025年度過去問パッケージなので、募集要項の出力先へ過去問データを移動しないでください。

## 最重要の検出済み不備

### 問題3・解答解説の式変形に余分な `1` が混入している

対象は解答原本2ページ、問題3の複素数計算です。

原本ページ画像:

`source/pages/answers/answers-page-02.png`

canonical dataの該当箇所:

`source-html/reconstruction.json`

同じ原本ページの冒頭で欠落している直交形式:

```text
p=\dfrac12+\dfrac{\sqrt3}{2}i=\cos\dfrac\pi3+i\sin\dfrac\pi3
q=-\dfrac12+\dfrac{\sqrt3}{2}i=\cos\dfrac{2\pi}3+i\sin\dfrac{2\pi}3
```

現canonicalは `p=\cos...`、`q=\cos...` から始まり、原本に印刷された左側の直交形式を落としています。後段の代入行の出所を明確にするためにも、両方の等式を原本どおり復元してください。

現在の誤った式:

`\left|1-p-p^2-1-p+p^2+p+q+6\right|=|1-p+q+6|=5`

canonical transcriptionで原本どおりに記録する正しい式:

`\left|1-p-p^2-1-p+p^2+p+q+6\right|=|-p+q+6|`

続く代入行と結論:

`\left|-\dfrac12-\dfrac{\sqrt3}{2}i+\left(-\dfrac12+\dfrac{\sqrt3}{2}i\right)+6\right|=|5|=5`

根拠:

- 定数項は `1-1+6=6`
- `p^2` の項は相殺する
- `p` の項は `-p-p+p=-p`
- よって絶対値内は `-p+q+6`（代数的には `6-p+q` と同値）
- `p=1/2+(sqrt(3)/2)i`、`q=-1/2+(sqrt(3)/2)i` なので `q-p=-1`
- したがって原本の順序で `|-p+q+6|=|5|=5`
- 原本画像にも中間式は `|-p+q+6|`、次行は実際の `p,q` の代入、最終行は `|5|=5` とあり、余分な `1` はHTML転記時の混入である

生成済みHTMLを直接書き換えてはいけません。必ず `source-html/reconstruction.json` のcanonical blockを修正し、generatorで全生成物を作り直してください。

少なくとも次の派生物から古い誤式が消えることを確認してください。

- `source-html/generated/internal/source-answers/index.html`
- `source-html/generated/internal/source-answers/page-02.html`
- 各ページに埋め込まれた `#source-reconstruction` JSON

修正後は対象パッケージ全体を検索し、`|1-p+q+6|` と同値の古い誤式が0件であること、原本どおりの中間式・代入行・結論がcanonical dataと生成HTMLに存在することを確認してください。

### 問題12・条件③が頂点値ではない別の式へ誤転記されている

対象は解答原本9〜10ページ、問題12の4次方程式を `t=x^2` で2次方程式へ帰着する解説です。

原本ページ画像:

- 関数定義と条件①・②: `source/pages/answers/answers-page-09.png`
- 条件③と続き: `source/pages/answers/answers-page-10.png`

canonical dataの該当箇所:

- `source-html/reconstruction.json:2116` 付近: `f(t)=t^2-2(k+2)t+k^2-2k-3` の定義
- `source-html/reconstruction.json:2137` 付近
- `source_page_id`: `jichi-medical-2025-general-mathematics-answers-p010`
- section: `解説〈4次方程式の実数解の存在条件〉`

原本9ページにあるのにcanonical dataから欠落している平方完成式:

`f(t)=\{t-(k+2)\}^2-6k-7`

この式は条件③の根拠となる直前式です。`f(t)` の定義直後に、原本どおり独立した数式ブロックとして追加してください。

source-page provenanceも原本へ合わせて直してください。

- `answers-p009` には、`f(t)` の定義、平方完成式、「であるから、kの満たす条件は」、条件① `f(0)=k^2-2k-3>0`、条件② `k+2>0` を置く。
- `answers-p010` の先頭には条件③ `f(k+2)=-6k-7<0` だけを置き、その後に現在の結論部分を続ける。
- 現canonicalの「必要条件は f(0)>0、k+2>0、判別式 D>0」という要約は原本の主解法に印刷されていない。source-faithful transcriptionから除き、必要なら原本転記とは分離された編集解説だけに置く。別解に実際に印刷されている `6k+7>0` はそのまま保持する。

現在の誤った条件③:

`\{(k+2)\}^2-6k-7>0`

原本どおりの期待値:

`f(k+2)=-6k-7<0`

根拠:

- 原本9ページで、この解説内の関数は明確に `f(t)=t^2-2(k+2)t+k^2-2k-3` と定義されている。
- 原本10ページ最上段の条件③は、実際に `f(k+2)=-6k-7<0` と印刷されている。関数名は原本では `f` であり、`g` へ読み替えない。
- 放物線の軸は `t=k+2` なので、条件③の役割は頂点が `t` 軸より下にあることを表すことにある。
- 定義式へ `t=k+2` を代入すると、`f(k+2)=-(k+2)^2+k^2-2k-3=-6k-7` となる。
- 現在値は頂点値、判別式、二乗項を混同した式であり、直前の関数定義から成立しない。
- 最終結論 `k\ge4` は独立計算上正しい。結論を誤式へ合わせて変更してはいけない。

必ずcanonical blockへ欠落式を追加し、条件③を修正して再生成してください。少なくとも次から現在の誤式を消してください。

- `source-html/generated/internal/source-answers/index.html`
- `source-html/generated/internal/source-answers/page-10.html`
- 各ページに埋め込まれた `#source-reconstruction` JSON

再検証では、対象パッケージ全体で `\{(k+2)\}^2-6k-7>0` と同値の旧転記が0件、`f(k+2)=-6k-7<0` がcanonical dataと生成HTMLに存在することを確認してください。公開用の独自解説が混同回避のため関数を `g(t)` と命名している場合でも、原資料を記録するcanonical transcriptionの関数名 `f` は変更しないでください。

### 問題19・最大値 `M=8` の実現可能性が、結論の後まで示されていない

対象は問題17〜20の共通設定と、解答原本14ページです。

原本・canonicalの場所:

- 共通設定: `source-html/reconstruction.json:970` 付近（`n` は10000以下の自然数）
- 原本解説: `source/pages/answers/answers-page-14.png`
- canonical解説: `source-html/reconstruction.json:2344-2348` 付近
- `source_page_id`: `jichi-medical-2025-general-mathematics-answers-p014`

現在の論理:

1. `S_n=9-9(8/9)^n<9`
2. 直ちに「最大の自然数 `M` は8」と結論する
3. その後で `8<S_n<9` を解き、最小の `n` が19であることを示す

不備の理由:

- `S_n<9` から分かるのは、`N<S_n<N+1` を満たす自然数 `N` の上限が8以下であることまでである。
- `M=8` と確定するには、問題の制約 `n\leqq10000` の範囲内で実際に `8<S_n<9` となる `n` が存在することも必要である。
- 原本の直後の計算から最小の `n` は19であり、`19\leqq10000` なので `N=8` は実現する。この事実を結論へ明示的に接続すれば論理が閉じる。

期待する説明順序または明示的な補足:

1. `S_n<9` より候補の自然数は `N\leqq8`。
2. `8<S_n<9` を解くと `n\geqq19` であり、とくに許容範囲内の `n=19` で成立する。
3. よって8は単なる上限ではなく実現値であり、`M=8`。その最小の `n` は `m=19`。

これは原本に印刷された式の転記誤りではなく、原本解説自体の説明順序による論理の飛躍です。原本表示用のcanonical transcriptionを、あたかも原本が別の順で印刷されていたかのように改変してはいけません。`source-html/editorial-explanations.json` の問題17〜20にある編集解説レイヤーを補強してください。また、既存項目を保持したまま `issues.json` にstable id `source-answer-q19-maximum-realization-gap` のopen itemを追加し、原資料由来の論理補強であることを記録してください。根拠が不足する場合は推測で転記本文を書き換えず、issueをopenのまま残してください。

再生成後は、`source-html/generated/internal/answers/major-question-15.html` の問題19・20に対応する編集解説について、`M=8` の根拠に `n=19\leqq10000` と `8<S_{19}<9` の実現性が明記され、上限だけから最大値を断定していないことを確認してください。answer/explanationにはpublic-candidate出力を新設しないでください。

### 解答原本16〜17ページ・問題1〜25の講評一覧が逐語転記ではなく要約へ変わっている

対象は解答原本16ページ末から17ページへ連続する、問題1〜25の講評一覧全体です。問題1〜4は16ページ、問題4の文は16ページ末から17ページ冒頭へページをまたぎ、問題5〜25は17ページにあります。17ページだけを直して終了してはいけません。

原本ページ画像:

- `source/pages/answers/answers-page-16.png`
- `source/pages/answers/answers-page-17.png`

canonical dataの該当箇所:

- `source-html/reconstruction.json` の解答原本16〜17ページに対応する講評block
- `source_page_id`: `jichi-medical-2025-general-mathematics-answers-p016` と `jichi-medical-2025-general-mathematics-answers-p017`
- `structured_list`（問題1〜4、問題5、6、7、8、9、10、11、12、13、14〜16、17〜20、21〜25）

現在のcanonical blockは原本転記ではなく、16ページの問題1〜4を含む複数箇所で短縮・言い換え・意味変更が生じています。特に問題4は、16ページ末の「少なくとも1つ解を」から17ページ冒頭の「もつための条件として求める。」へ続く一文です。このsource-page provenanceと文の連続性を失わないでください。少なくとも次を確認済みです。

- 問題1〜4も現canonicalが要約・改作されており、特に問題2、3、4は原本との逐語一致を満たしていない。
- 問題4の講評はページ境界で分断され、17ページ冒頭の続きがcanonicalから欠落している。原本どおり一文として復元しつつ、各断片がどの原本ページ由来か追跡できるprovenanceを保持する。
- 問題5は原本の難易度表記が `（基本的）` なのに、canonicalでは `（標準的）` へ変わっている。
- 問題7は原本の「どのようなときに最小になるかが直観でわかれば、ほとんど時間をかけずに答えは出せる」が、canonicalでは「Pの位置を工夫すればほとんど計算なしで答えを出せる」へ改作されている。
- 問題9は原本の「余りを整理するだけの定型問題」が、canonicalでは「余りを整理する定型問題」へ短縮されている。
- 問題10は原本の「いくつもの解法があるが、どれで解いてもよい」が「複数の解法がある」へ要約されている。
- 問題11は原本の「空間ベクトルの垂直条件を内積で表すだけであるが、点Hの座標を求めるなど不要な計算をしてしまった受験生も多かっただろう」が、canonicalでは「空間ベクトルの垂直条件を内積で表す。点Hの座標を求める必要のない計算としてしまった受験生も多かっただろう」となり、日本語の意味が崩れている。
- 問題17〜20は原本の「等比数列の和を常用対数を用いて評価する頻出問題」が別の説明へ言い換えられている。
- 問題21〜25は、原本にある「極値を与えるxの値が解の公式を用いて求める無理数である」「極値・面積計算で工夫が必要」という具体的説明がcanonicalで短縮されている。

16〜17ページの全項目、すなわち問題1〜25の全講評を画像と行単位で再照合し、難易度表記・本文・句読点を原本どおりに逐語転記してください。上記の例だけを局所置換して終了してはいけません。`source-html/reconstruction.json` のcanonical blockを直してgeneratorで再生成し、`source-html/generated/internal/source-answers/index.html`、`page-16.html`、`page-17.html`、各ページに埋め込まれた `#source-reconstruction` JSONが一致することを確認してください。問題4のページまたぎは、一文の内容だけでなく `source_page_id` / provenanceも原本16〜17ページへ正しく対応させてください。

ここで行う逐語転記は、アクセス制限された内部のsource-transcription層だけに置くものです。原本講評の本文を、学習者向け・公開候補のeditorial explanationへコピーしてはいけません。公開用解説は独自執筆を維持し、必要な事実・論理だけを自分の表現で補強してください。

ただし、次の問題5の原本自体の誤りは、canonical transcriptionでは勝手に訂正しないでください。

### 問題5・原本講評の「18個」は設問の20項と矛盾する

原本講評は `（基本的）18個の三角関数の値の和を求める` と印刷されています。この `18個` は原本画像にも実在するため、転記ミスではありません。一方、問題原本2ページとcanonical questionは

`A=\sum_{k=1}^{20}\sin\dfrac{k\pi}{3},\qquad B=\sum_{k=1}^{20}\cos\dfrac{k\pi}{3}`

であり、実際に各和は20項です。解答でも周期6の3周期分18項を打ち消し、残る `k=19,20` を加えているため、「求める和」全体を18個とする講評は不正確です。

扱いを次のように分離してください。

- `source-html/reconstruction.json` の原本転記は、難易度だけ `（基本的）` に直したうえで、原本どおり `18個` を保持する。
- `source-html/editorial-explanations.json` の問題5に対応する編集解説・講評では「20項の和。うち18項は3周期分として相殺し、残る2項を計算する」と正確に説明する。
- 既存項目を保持したまま `issues.json` にstable id `source-answer-commentary-q5-term-count` のopen itemを追加し、原資料由来の数え間違いであること、問題本文と解答計算を根拠として記録する。
- 原本忠実表示と編集補足を同じレイヤーで混ぜず、`generated/internal/source-answers/page-17.html` には原本の `18個`、編集解説側の生成物には20項と18項＋2項の区別が残ることを検証する。

この分類は重要です。原本の誤りをHTML転記ミスとして隠したり、反対に公開用の編集解説へ誤った18項を継承したりしないでください。

## 問題HTMLで検出済みの非意味変更の表示不備

次の項目は問題文の答えや条件を変えるものではありませんが、原本忠実性と見出し構造のため、canonical側で安全に直せるか確認してください。

1. 問題13の `x=1/e` は、原本と同様に `x=\dfrac{1}{e}` として縦型分数にする。
2. 問題15の選択肢 `11/5, 12/5, 13/5, 14/5, 31/10, 16/5, 33/10, 17/5` は、原本と同様にそれぞれ `\dfrac{...}{...}` として縦型分数にする。
3. `public-candidate/questions/major-question-14.html` では問題14・15・16を共通設定配下の同じ見出し階層にそろえる。現在、ページ境界由来で問題16だけ`h2`になっている。
4. 同様に、`major-question-15.html` の問題19、`major-question-16.html` の問題22だけが`h2`になっているため、各共通設定配下の小問見出しを同じ`h3`へそろえる。

生成HTMLを直接編集しないでください。分数はcanonical transcriptionを修正して再生成します。見出しは内部の原本ページ表示を壊さず、公開候補のquestion-reader投影だけを正しい階層にできる方法を選んでください。共有generatorを変更する必要がある場合は、まず他の共通問題パッケージへの影響を調査し、回帰テストを追加してください。

## 全件監査

既知の項目だけを文字列置換して終了しないでください。次の対応関係を全25原本ページについて再確認してください。

- 問題原本8ページと問題1〜25の本文、条件、添字、指数、符号、絶対値、選択肢
- 解答原本17ページと解答キー1〜25
- 各解説の式変形について、直前の式から代数的に成立するか
- 最終値と解答記号が一致するか
- `source-html/reconstruction.json` と生成HTMLの内容が一致するか
- `source-html/editorial-explanations.json` が原本解説の誤りを無批判に継承していないか
- 共通設定を持つ問題14〜16、17〜20、21〜25で、条件が途中欠落せず各設問へ正しく継承されているか
- KaTeXの生文字列露出、括弧不一致、未解決コマンド、文字化けがないか

追加の不備を検出した場合は、原本ページ、現在値、期待値、根拠を記録し、次の分類で扱ってください。

- 原本とcanonical transcriptionが不一致: canonical dataを原本どおり修正し、再生成・再検証する。
- 原本自体の誤り、説明不足、論理の飛躍: source-faithful canonicalは保持し、編集解説レイヤーで補強して`issues.json`へ原資料由来issueを追加する。
- 原本から期待値を確定できない: 推測でcanonicalも編集解説も直さず、必要な確認事項をopen issueにする。

## 再生成と検証

対象リポジトリに設定されているPython/Node/Playwrightを使用してください。環境固有のランタイムパスは決め打ちせず、現在の環境で解決してください。PythonはUTF-8モードで実行します。

概ね次の順序です。正確な引数はskillと既存記録に従ってください。

1. `generate_source_html.py` で `source-html/generated` を再生成
2. `validate_source_html.py` でエラー0を確認
3. `qa-browser-pages.json` の全対象を実ChromeでPC 1280×900・スマホ390×844の両方で検査
4. browser report付きで `validate_source_html.py` を再実行
5. 分析成果物が存在するため `run_qa.py` も再実行
6. 変更ページを実際にレンダリングし、原本画像と横に並べて目視確認

browser QAの出力は `qa/browser-assertions.json` に統一してください。`run_browser_qa.mjs --output`、`validate_source_html.py --browser-report`、`run_qa.py --browser-report` の3か所へ同じ実在パスを渡し、古い `source-html/qa/browser.json` との取り違えを起こさないでください。

期待される基準:

- 原本ページ被覆 25/25
- 問題ブロック被覆 91/91
- 解答キー 25/25
- validatorエラー 0
- browser QA 全ケース合格
- 古い問題3誤式 0件
- 問題3の原本どおりの `|-p+q+6|`、実値の代入行、`|5|=5` がcanonical dataと生成HTMLに存在
- 問題12の旧転記 `\{(k+2)\}^2-6k-7>0` 0件
- 問題12の欠落していた平方完成式 `f(t)=\{t-(k+2)\}^2-6k-7` がcanonical dataと生成HTMLに存在
- 問題12の原本どおりの `f(k+2)=-6k-7<0` がcanonical dataと生成HTMLに存在
- 内部の編集解説 `generated/internal/answers/major-question-15.html` が、`n=19\leqq10000` による `M=8` の実現可能性を明示
- 解答原本16〜17ページの問題1〜25の講評が画像と逐語一致し、問題4のページまたぎとsource-page provenanceが正しい
- `source-html/generated/internal/source-answers/page-16.html`、`page-17.html`、`index.html`、各埋め込み `#source-reconstruction` JSONがcanonical dataと一致
- `source-html/generated/internal/answers/major-question-05.html` の問題5編集解説が、A、Bそれぞれの20項を「3周期分の18項＋残り2項」と正しく説明
- `issues.json` にstable open id `source-answer-commentary-q5-term-count` と `source-answer-q19-maximum-realization-gap` があり、既存issueを保持
- 公開候補へ原本ページ画像・restricted cropが流出していない
- 既存の人間ゲート以外にQAエラーがない

## 状態フラグと権利

この修正と自動QAだけを根拠に、次を勝手に承認済みにしないでください。

- `visual_reviewed`
- `review.approved`
- `needs_human_review`
- publication status
- cropの `rights_status` / `replacement_status`

解答側のrestricted crop 7点と人間レビューは別ゲートです。原本PDF・原本ページ画像・cropを公開候補へコピーしないでください。公開承認や権利承認は今回の範囲外です。

## Gitと作業範囲

- 作業開始時に `git status --short --branch` と `git worktree list` を確認する。
- これは専用remediationなので、8レーンの数学キューを予約・更新しない。
- 他セッションの変更をstash、reset、削除しない。
- 対象パッケージと、必要性を立証した共通generator/test以外は変更しない。
- Lexus EC側のリポジトリ `C:\---hp\_worktrees\jichi-medical-2025-mathematics` は変更しない。
- git commitやpushは、ユーザーから別途指示がない限り行わない。

## 完了報告

最後に次を報告してください。

- 検出した全不備（原本ページ、旧値、修正値、根拠）
- canonical dataで変更した箇所
- 再生成された成果物
- 実行したvalidator、browser QA、package QAの結果
- 問題3の旧誤式が0件であること
- 問題3冒頭の欠落していた `p,q` の直交形式が原本どおり復元されたこと
- 問題12の旧誤式が0件で、欠落していた平方完成式と原本どおりの頂点値条件が入ったこと
- 問題19の論理補強を置いたレイヤーと、原資料由来issueの記録先
- 解答原本16〜17ページの問題1〜25全講評を逐語再照合し、問題4のページまたぎ・provenance、問題5の難易度表記、問題11を含む要約・改作文が原本どおりになったこと
- 問題5の原本講評 `18個` をcanonicalでは保持しつつ、編集解説で「20項＝18項＋残り2項」と補い、`source-answer-commentary-q5-term-count` を記録したこと
- 追加で残したopen issue
- 人間レビュー・権利ゲートを変更していないこと
- 変更ファイル一覧
- `git diff --check`、`git status --short --branch`、`git diff --name-only` の結果
````
