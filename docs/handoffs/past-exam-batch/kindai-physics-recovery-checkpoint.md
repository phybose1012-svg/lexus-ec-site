# 近畿2025一般前期A物理：PC停止後の再開地点

更新：2026-09-11 07:10 JST台。今回のユーザー依頼はPC停止の影響確認・復旧。図版実装の完了記録ではありません。

## 次の作業

- package ID：`kindai-2025-general-first-a-physics`
- source：`C:/---hp/shidai-igakubu-gokaku-dokuhon/projects/universities/kindai/past-exams/working/2025/general-first-a/first-stage/physics`
- site：`C:/---hp/_worktrees/keio-2025-mathematics`、branch `codex/keio-2025-mathematics`
- URL：`/past-exam-library/kindai/2025/physics/{questions,answers,analysis}/`
- 問題8図・解説5図が予約状態。専用generator、独自SVG、正式な修復依頼はまだ未作成。既存本文の取り込みをやり直して図完成と数えない。
- 苦手NOW集合の `phys-q2-a5` に必要な `phys-q2-a4` が含まれていないため、目標点は保留中。小問そのものが欠落しているという意味とは区別し、現在のanalysisとderivedで確認すること。

## 中断前の読解範囲（引継ぎ情報）

`SOURCE-HTML-RECORD.md`、`ANALYSIS-RECORD.md`、`issues.json` を読解済み。以下は元記録の主張であり、今回独立検証を済ませた内容ではない。

- 原本は問題14ページ・原解答6ページ、計20ページ。2大問、12分析小問、33解答欄相当。
- 大問Iはばね・膜の力学、大問IIは荷電粒子の運動・質量分析。13 cropはrestricted/pending_redraw。公開コピー・トレースをしない。
- 試験表紙は理科2科目120分。物理60分・100点は編集上の等分仮定で、元記録にも公式理科200点の根拠確認が残る。
- 元記録の難度件数は基本2／基本＋α2／標準4／発展4。複数分野に重複計上した分野別配点は合計100にならないため、そのまま円グラフにしない。
- 元記録には苦手最大58点・56.9分、得意最大100点・49.1分、係数0.8で80点とあるが、サイト側の前提依存検証は保留のまま。検証前に目標を解除しない。
- 旧SOURCE-HTML-RECORDの「数学」見出し・内部index blockedは過去時点の情報。新しいANALYSIS-RECORDは修正済みとしているので、現在ファイルと突き合わせる。
- issuesの6項目は公式配点、仮小問配点、仮科目時間、権利・図差替え、旧記録との整合、科目担当レビュー。人間・権利承認は未完了のまま。

**まだ読んでいない／未実施：** reconstruction本文・asset ID全件、全問題・原解答・学習者向け解説、原本PNG20枚、analysis全12問・derived全体・分析HTML、独立した物理検算、作図、画面／印刷確認。次回はこれらから進める。学習者向け解説は `editorial-explanations.json` を使い、原解答HTMLを公開解説にしない。

## 今回の復旧確認

- 開始時のサイト作業treeはクリーン。HEAD `3f157466` はGitHubの作業ブランチと一致し、staging `19fef2c4` に対して配信後記録だけ1コミット先行。fetch後も未統合のstaging変更なし。
- `git fsck --connectivity-only --no-dangling` と `git diff --check` 成功。共通Gitと対象worktreeの管理ディレクトリ直下に残留lockなし。全ディスク・ハードウェア障害やメモリー内の未保存編集まで検査したという意味ではない。
- 既存buildを使う313回帰テスト成功、14,771 TeXターゲットの構文描画エラー0、build-input検証成功。新しいbuildやブラウザー／実印刷目視は実施していない。
- ステージング201ページすべてHTTP200、h1が1、noindex、ローカルとcanonical一致。最新内容のCloudflare checkはsuccess。再配信は不要。
- 現行preview4337は127.0.0.1とlocalhostで対象3ページすべてHTTP200、h1が1、noindex。再起動しない。旧4330は応答しなかったが、この継続作業は4337を使用しており、他担当の旧サーバーを勝手に立ち上げない。
- 元repoの慶應数学に別担当の未コミット修復差分が残っている。編集・commit・stash・破棄は一切していない。
- `automation-2` はACTIVE、30分間隔、同じタスクが対象。重複作成や変更は不要。今回は記録のみを作業ブランチに保存し、stagingへは次の検証済み内容と一緒に送る。

## 継続時の境界

近畿数学は配信済みなので再作図しない。元repoは読み取り専用。他担当の順天堂物理、独自解説5件、人間編集SVG/trioを保護。直列で作業し、未検証の目標値を推測して埋めず、元HTMLの不備は根拠付きMarkdown修復依頼へ分離する。スキル・手順の正本は `continuation.md` と `.agents/skills/past-exam-staging-batch/SKILL.md`。
