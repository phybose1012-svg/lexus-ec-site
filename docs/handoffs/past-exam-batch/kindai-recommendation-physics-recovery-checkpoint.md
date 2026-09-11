# 近畿2025推薦公募物理 — PC停止後の再開地点

**更新：2026-09-11 13:40 JST、下記の残り検証を完了し、内容コミット `f9a134cf6c789d1a3212aaabc14e52ed6f0fd87e` をstaging／作業ブランチへpush・配信確認済み。** Cloudflare success、実3ページのHTTP200・h1=1・noindex・注記2/2/1、19SVGの配信バイト一致、全201ルートの検査失敗0。337回帰・14,771 TeXエラー0、PC／390pxの3ページ確認、残り4PNG／コンタクトシート確認も完了。実印刷／PDF目視と元HTML修復・人間レビューは未完了。以下は復旧当時の履歴であり、再作業リストではありません。次はcontinuation.mdの北里2025数学から進めてください。

2026-09-11 12:28 JST。**19図は実装済み・未コミット／未配信。次は最終PNGとブラウザー確認から再開する。** 原本の監査や作図を初めから繰り返さない。

## 作業場所と保存状況

- サイト: `C:/---hp/_worktrees/keio-2025-mathematics`、`codex/keio-2025-mathematics`。
- 元repo: `C:/---hp/shidai-igakubu-gokaku-dokuhon`（読み取り専用）。元repoの慶應数学に残る別担当の修復差分は保持する。
- package: `kindai-2025-recommendation-general-public-physics`。
- 元相対パス: `projects/universities/kindai/past-exams/working/2025/recommendation-general-public/first-stage/physics`。
- URL: `/past-exam-library/kindai/2025/physics-recommendation-general-public-first-stage/{questions,answers,analysis}/`。一般前期Aの物理と混同しない。
- fetch時のHEAD／作業リモートは `73387e05`、stagingは `775811ab`。差は前回復旧記録1コミット、staging側の未統合コミット0。下記新規実装はローカル差分として残る。
- Git full fsck・diff検査成功、残留lock／merge／rebase途中の管理情報なし。確認用preview4337は正常、再起動・重複起動していない。旧4330は今回使用しない。
- automation-2はACTIVE・30分間隔、同じタスクの継続設定を維持。重複作成・設定変更なし。

## 監査と実装済み範囲

- 中断前に問題11／原解答8／学習者8ページ、原本PNG全19枚、analysis全11主設問、derived・目標プロファイル・分析HTMLを読解済み。
- 正式な11区分の修復依頼は [kindai-recommendation-physics-source-review.md](kindai-recommendation-physics-source-review.md)。角度範囲、cosθ₂の負号、Cと電流の空欄因子、QBとOBの転記、面積速度の微小時間、交流の瞬時値と振幅、31解答欄の構造、古いblocked記録など。元HTMLは修正せず、サイトの問題／解説各2注記・分析1注記で修復待ちを示す。
- generator: `frontend/scripts/build-kindai-2025-recommendation-general-public-physics-figures.mjs`。manifest: `frontend/src/data/pastExamFigures/kindai-2025-recommendation-general-public-physics.json`。独自SVG19点、共有SVG生成枠・ローカルKaTeX・人間編集保護を使用。
- package意味テスト7件: `frontend/scripts/past-exam-kindai-recommendation-physics-figures.test.mjs`。反射・壁への到達、環状断面、双曲線のエネルギー／角運動量／漸近線、RCの位相と電力、全2048部分集合の目標点、manifest、build済み注記を確認。
- 対象importとreportは実行済み。生成Q/A・ローカル解説snapshot・status・summary・引継ぎREADMEが変更済み。他大学の独自解説5件は未変更。
- 対象CSSは狭幅の図を横スクロール、最小560pxと案内を使用。印刷はこの最小幅を適用せず最大200mm高／150mm幅。実ブラウザーと実印刷の確認は残る。
- ローカルの登録図保留240、配信済み259を区別する。67package／201route、実本文67問題・65解説・64分析、目標点保留19。

## 復旧時に完了した検証

- 中断していたbuildセッション24584は終了コード0、12:21:44 JSTに1118ページ完了。ビルド自体をやり直す必要はなかった。
- 全回帰の最初の実行で、共有生成枠の変数名 `p` が既存の手編集保護テストの `pack.add/save` 検査と合わず1件失敗。保護機構はすでに使われていた。generatorの局所変数だけを `pack` に統一し、生成内容やテストを弱めず修正した。
- その後 **337テストすべて成功**、14,771 TeXターゲットの表示エラー0、build-input成功。unused Bを除去済みの最終ソースに対するastro checkは0 errors／0 warnings／既存3 hints。
- generatorを2回実行し、19SVG＋manifest全20ファイルのハッシュ不変、19SVGのpublic/dist全バイト一致。図形や書体の変更は今回行っていない。
- localhost:4337の対象3ページすべてHTTP200・h1=1・noindex。公開済みステージング全201ルートのHTTP／h1／noindex／canonical検査も失敗0。今回の復旧ではブラウザーの新規目視・実印刷を行っていない。
- 現行ステージングの巻き戻し・再配信は不要。今回の復旧記録のみを作業ブランチに保存し、新しい図は最終目視完了後に通常pushする。

## 最終画像レビューの正確な未完了点

QA PNG: `frontend/reports/kindai-recommendation-physics-figures/`。

初回19枚は個別に目視済み。その後ラベル修正を重ね、ほとんどの修正後PNGも確認済み。ただし次の4枚は**最後の変更後の画像を再確認する必要がある**。コンタクトシートも最後に確認する。画像は1枚ずつ返し、出力超過を確認済みに数えない。

1. `q-i-a-fig1a.png`: 球のRラベルをO.x+57から+85へ移し境界との衝突を解消する変更後。
2. `a-i-a-q5-wall-distance.png`: 同じR修正後。直前の画像出力はコンテキスト上限で切れ、確認完了にできない。
3. `q-ii-c-fig4.png`: extra=trueの抵抗ラベルをy+63からy+45へ変更後。
4. `a-ii-c-q10-circuit.png`: 同じextra=trueラベル変更後。Rがrのラベルに見えないこと。

上記以外の変更後PNGは目視済み。q-ii-b-fig2-3のミニ図の文字、conic図5のD・θ・θ₂、面積ΔA、phasorのδなどは調整後を確認済み。PNG変換器の数字フォントと実ブラウザーの埋込KaTeXを区別する。

## 残りの実行順序

1. 必要ならvalidator/rasterizerを再実行し、上記4PNGと最終コンタクトシートを目視。
2. CUAブラウザーでPC1280pxと390pxの問題・解説・分析を確認。全画像の読込、ページの横はみ出し、図スクロールの案内と文字サイズ、2/2/1注記、見出し・目標点・数式を調べる。特に背の高い等価回路／位相複合図、軌道図、3枝回路を目視。ブラウザーはlocalhost:4337を使用し、127.0.0.1がblockedでも別サーバーを増やさない。
3. 画像・CSSをさらに変更したら再生成／再build／build後テストとTeX監査を繰り返す。実印刷を検証していなければ未実施と記す。
4. 自動生成引継ぎ `kindai-2025-recommendation-general-public-physics.md` から正式な11区分修復依頼へのリンクを加える（import後に行う）。
5. 最新stagingをfetchして未統合変更を確認。検証済み内容をcommit、staging→作業ブランチへ通常push。main／production／force pushは禁止。
6. Cloudflare commit checkと実3URL、19SVG配信バイト、全201ルートを確認。continuationに内容コミットと配信結果、実際の検証範囲を保存する。配信後記録だけのコミットは作業ブランチへ保存し、余分な再配信をしない。
7. 次候補は北里数学だが、台帳の順番と未完了状況を改めて確認する。まだ新packageの原文監査はしていない。この物理を先に終える。

## 意味検証の要点

- 反射α=π−2θA、法線速度だけ反転、撃力2mv cosθA。壁に届く条件a>R/√2、BC=a+(L+R cosθA)tanα。α=π/3でBC=√3(R+L)。外側半分の断面積が壁へ、外側1/4がRとR₁の環へ到達。
- 双曲線generatorはmu=.7,b=2.4,v0=1。A=mu/v0²、e=√(1+(b/A)²)、β=2atan(A/b)、θ₂=(π−β)/2。p(t)=A(e−cosh t)d+b sinh t nで進行方向はt減少。エネルギー・角運動量・極方程式・漸近線・鏡映を独立テスト。
- RCではV0=4,C=.2,ω=3,δ=.2,r=5を例示。R=1/(Cωtanδ)、IR=V0/R、IC=V0Cω。電圧基準でIRは同相、ICは90度進む。合成電流はベクトル和。周期平均電力は抵抗だけ、V0²/(2R)+V0²/(2r)。
- 分析は2大問11主設問・31空欄、仮100点（55/45）。難度2/2/5/2問・18/18/45/19点。全2048部分集合の独立検算で、苦手はscan20.4分＋最適64点58分（高度問題も含むので注記あり）、現NOW81点66.8分は時間超過。得意はscan5.1分＋最大100点46.8分→目標80点、NOW81点35.8分。点数計算自体は一致し目標保留へ変更しない。公式合格点や実測時間ではない。

## 復旧時の正本SHA-256

前回監査開始時のハッシュとの比較ではなく、今後変更を検出するための基準。

| ファイル | SHA-256 |
| --- | --- |
| source-html/reconstruction.json | 206d80ad4c89231e091bf3fa1c155ca0f29befdde9744978d3c3509615fce778 |
| source-html/editorial-explanations.json | 0c5e3d116f93c860df14379604e0085b37353beb37f8fa0726003f59d05f77f6 |
| analysis.json | 4afc08bb25aae7e2fdde1ca4c1c99ad4aa4b012bcb8c9d800b72031c2651793a |
| derived.json | 9136b44f04e3366015e05bc98a5760234b621c4926403a20fcbd039d8d27bb2f |
