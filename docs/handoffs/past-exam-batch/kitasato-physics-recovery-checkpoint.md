# 北里2025一般物理：PC停止後の再開地点

## 最新状態：2026-09-11 16:51 JST

以下の15:59読解境界から作業を進め、全原本16PNG・問題／原解答／学習者・全分析の監査、独自8SVG、8意味テスト、正式修復依頼を実装した。最終build16:46:31・1118ページ、完了後361テスト成功・14,803 TeXエラー0。最終8PNG／contact・PC／390pxでの確認と限界はcontinuation.md最新節を参照。**下記「未実装」「未読」は過去の復旧記録であり、北里の再作業をしないこと。**

実配信はcontinuation.mdの配信結果追記で判断する。次は久留米2025一般前期数学。元正本4hashは下記基準と一致、元repoは不変。

**16:57 JST：4cebe682をstagingと作業remoteへpush、Cloudflare成功。実3ページ・8SVGバイト照合・全201ルート検証成功。北里8図は配信済み、次は久留米数学。** 本文の修復依頼と権利／人間レビューは未完了。配信後の文書だけは作業ブランチへ保存する。

更新：2026-09-11 15:59 JST。公開完了の記録ではなく、中断前の読解地点の保全。

## 復旧確認

- サイト `C:/---hp/_worktrees/keio-2025-mathematics`、`codex/keio-2025-mathematics`。開始時treeはクリーン。HEADと作業remoteは`13013b01`、stagingは`bfb77b77`。fetch後も作業remoteとの差0、stagingより配信後文書1コミット先行・未統合0。
- Git connectivity検査成功（dangling objectは破損ではないので削除しない）、diff検査成功。worktree管理ディレクトリに残留lock／merge／rebase記録なし。
- 既存ビルドに対し全353回帰成功、14,803 TeX表示エラー0、build-input正常。新規ビルド／新規画面目視／実印刷は今回行っていない。
- preview4337の北里数学解説HTTP200、起動し直す必要なし。ステージング全201ルートHTTP／h1／noindex／canonical検査失敗0、配信commitのCloudflare check completed/success。
- automation-2はACTIVE・30分間隔。重複作成・設定変更なし。元repoの他担当による慶應数学差分を保持。

## 今回の対象

- ID `kitasato-2025-general-physics`。
- 元repo（読み取り専用）`C:/---hp/shidai-igakubu-gokaku-dokuhon`。
- 元相対パス `projects/universities/kitasato/past-exams/working/2025/general/first-stage/physics`。
- 台帳上3大問17論理問（I5／II5／III7）、解答欄1–29。問題10ページ／原解答6ページ、問題7図／解答1図。
- 配信済み北里数学1図・補足2表は再作業しない。登録図保留239／目標保留19、67package／201routeという配信状態は今回不変。

## 実読済み／未読の境界

中断前に各skill、元共通AGENTS、SOURCE-HTML-RECORD、ANALYSIS-RECORD、reconstructionのmetadata／assets／review、manifestのページパスを確認した。再開時は適用skillを再読すること。

- **実読済み：問題本文1–4ページと対応原本PNG1–4。** 大問I問1–5の本文・選択肢まで。
- **未読：問題5–10ページ、原解答6ページ、学習者解説6ページ、analysis全17問、derived詳細、分析HTML。** 問題5–7を読む最後の出力が全量切り捨てになったため、読了扱いにしない。
- 新規SVG・generator・意味テスト・正式修復依頼・再importは**未実装**。今回も実装に進まず復旧と記録のみ。
- 原本PNGは `source/pages/questions/questions-page-01.png`～`10.png`、原解答は `source/pages/answers/answers-page-1.png`～`6.png`（原解答は1桁）。一度に1画像、本文は小分けで読む。

## 大問Iの独立計算メモ（原解答との照合前）

以下は中断前の独立計算であって、原解答監査完了を意味しない。

1. 棒Aの長さを補助変数L、BをL/2、重さWと2Wとする。床との角度は両者60度、B上端はA中点に接触。Aの床まわりのモーメントから接触垂直抗力N=W/2、Bのモーメントから接触摩擦F=√3W/6、Aの床摩擦=√3W/3。欄1–3の予想選択肢番号7,3,8。問題図に問われている力の答えを先に描かない。
2. 衛星：GM=gR²、ω=√(gR²/(R+h)³)、T=2π√((R+h)³/(gR²))。欄4,5の予想9,3。元図なし。
3. 孤立コンデンサー：電荷固定、エネルギーは極板間隔に比例。W1=(d2−d1)U/d1、W2=(d2/d1)(1−εr)U/εr。欄6–8の予想10,5,6。問題図に電池・回路を追加しない。
4. ドップラー：初めの直接波Vf/(V+v)、反射波Vf/(V−v)。初期うなり2Vvf/((V+v)(V−v))。pでv/2になった後、直接波の変更が先着し、最初の変化後は3Vvf/((V−v)(2V+v))。欄9–12の予想7,2,10,6。発音時と観測時の遅延を省かない。
5. 断熱容器：初期A(P,V,T)、B(2P,2V)、混合後温度2T。エネルギー保存から最終圧力5P/3、物質量から初期B温度8T/3。欄13,14の予想5,8。問題図のB温度は答えなので記載しない。

## 作図予定の既存ID

1. `q1-rods-equilibrium`：問題p1、2本の粗い棒と床、角度60度。
2. `q3-capacitor-stages`：問題p2、間隔d1→d2→誘電体Dを充填した3段階。
3. `q4-doppler-layout`：問題p3、観測者O・右向き音源S・p・壁。
4. `q5-insulated-vessels`：問題p4、断熱容器A/Bとコック。
5. `q6-spring-cart`：問題p5、台車とばね（詳細未読）。
6. `q7-electric-plates-screen`：問題p8、極板とスクリーン（詳細未読）。
7. `q7-magnetic-arc`：問題p10、磁場内の軌道（詳細未読）。
8. `ans-q7-magnetic-geometry`：原解答p6、軌道の幾何（詳細未読）。

元cropはrestricted／pending_redrawなので公開しない。図の向き・変数・条件は残り本文を読んで確定する。shared SVG helper、KaTeX書体、pack.add/saveとhuman-edit保護を再利用する。

## 調査保留と分析条件

- 問題の積記号にTeX `\times` のエスケープ不備（TAB＋imes）の疑いがあるが**未確定**。実際のコードポイントを調べる。JSON.stringifyの文字列検索で正しい `\times` まで誤検出しない。実在する制御文字だけ、field pathと短い周辺文脈を出す。
- 公式の理科枠は2科目100分／200点との元記録。物理単独50分／100点は分析用仮定であり公式と混同しない。
- 元記録の難度4/7/6問、仮配点30/30/40、苦手53点・49.4分、得意最大100点・48分→係数0.8で80点は未監査。analysis／derived全読と独立検算が必要。
- 権利・人間レビュー・科目担当承認はfalse／未承認のまま。

## 元正本SHA-256（復旧時の基準）

中断前hashは未採取だったため、これは停止前後の一致を証明する値ではない。

| 相対ファイル | SHA-256 |
| --- | --- |
| source-html/reconstruction.json | d3323eb216859ff8d8bd519cde4a9b45344d3ac0be35dbc25f4ddd3855477405 |
| source-html/editorial-explanations.json | b2e3d8f39ec4422de2cc89d01bfcba0c826e19f848afe23eabd86360ee51f3b7 |
| analysis.json | fdd780487facb24b2ab2651e39e1cd2c4ad45519477cb2be9a01d49aa8d5b879 |
| derived.json | c7a4814c248524dcda8e40d9c652fc8ba6f5b7fdf4061318c67041c68410407e |

## 次の実行

問題5ページから小分けに監査し、原解答／学習者／全分析まで読む。8独自SVGと意味テスト、必要な注記・正式修復依頼を実装する。対象限定import→report→build完了後テスト／TeX／PNG・PC・狭幅確認→fetchで並行変更確認→staging通常push→作業branch push→実配信検証。印刷の機械検査と実印刷を区別して記録する。サブエージェントは使わない。
