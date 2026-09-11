# 久留米2025一般前期数学：PC停止後の再開地点

## 最新：2026-09-11 18:38 JST・実装済み、最終目視と配信が残る

**以下の17:35の「未実装」は古い記録。作図や全原本の読み直しから再開しない。**

- 対象の全問題5頁・原解答10頁（原本PNG計15）、学習者10頁、全13小問分析と分析HTMLを前の作業で監査済み。独立検算と正式修復依頼 `kurume-math-source-review.md`（8区分）を作成済み。元repoは変更していない。
- 独立SVG7点、再生成スクリプト、8追加テスト、SHA固定の補足増減表2件、5大問別の確認注記、簡潔化した分析を実装済み。対象import/report済み。**分析snapshotはimport後に編集したので、再importで上書きしない。**
- 最終buildは18:31 JST、1118ページ。復旧時に既存buildへ全369テスト成功、14,829 TeXエラー0、build-input正常。Git connectivity／diff検査成功、残留lock・統合途中なし。最新fetchでHEAD f2a2ea1cと作業remote一致、staging 4cebe682より記録2コミット先行、未統合なし。
- 生成7PNGを前の作業で目視し、平面図のA/B/H、AP/AQ、筆算の減算括弧、拡大断面図のclipと寸法位置を修正済み。最終contact sheetと2回再生成の同一性検査は残る。図はpublic/dist一致の自動テスト成功。
- 前のブラウザー確認：解説PC1280/390で数式エラー0、5図読込、長い図の左右スクロール、8列表の分数と列幅を確認。問題PC DOM正常。最後の問題図スクリーンショットの出力は切り捨てられ未読扱い。問題のPC/390目視、分析PC/390の概要・目標点目視を終えてから配信する。実印刷/PDF目視は未実施（CSS回帰検査と区別）。古いタブ変数やIDは復旧後に再探索する。
- 今回の復旧でpreview4337の久留米解説HTTP200を確認。既存プロセスが動いているため再起動や重複起動をしなかった。定期実行automation-2はACTIVE/30分の設定で、アプリのviewも成功。設定変更なし。
- 公開済みステージング全201ルートをネットワーク許可付きで再検査し失敗0。初回のsandbox内fetch失敗はネットワーク制限でありサイト障害ではなかった。**この久留米7SVG/2表はまだ未配信**。再開保全のコミットは作業ブランチだけにpushし、残りの目視後にstagingへ通常pushする。
- ローカル67package/201route、本文67問題/65解説/64分析、登録図保留224/目標保留19。現時点の配信済み図保留は231であり混同しない。
- 未完了順序：①問題と分析の残りの画面QA ②最終contact sheet/生成同一性確認 ③必要ならbuildと全テスト ④origin/stagingをfetchし統合要否確認 ⑤stagingと作業ブランチへ通常push ⑥Cloudflare成功、実3URL、7SVGのバイト一致、全201ルート検査 ⑦continuationへ配信SHAを記録。その後次の台帳対象へ直列継続。
- 維持する未承認事項：元HTML修復、権利・科目担当の人間承認、数学100点の公式確認、苦手スキャン56.4分を含む採点モデル。最大30点/88.8分、77点/86分（係数後61点）の計算検査はモデル承認ではない。独自解説5件、人間編集SVG/trio、別担当の慶應修復差分を保護する。

## 旧記録（以下は17:35時点）

2026-09-11 17:35 JST。対象 `kurume-2025-general-early-mathematics`。

## 中断地点

- 元repo `C:/---hp/shidai-igakubu-gokaku-dokuhon` は読み取り専用。対象相対パスは `projects/universities/kurume/past-exams/working/2025/general-early/first-stage/mathematics`。
- 対象の台帳、SOURCE-HTML-RECORD.md、ANALYSIS-RECORD.mdを確認した段階。**問題・解答・学習者本文、原本15 PNG、全分析の実読と独立検算、7図の実装は未着手。** 読み取り中断のため、この対象の未コミット実装はない。
- batch、diagram author（SVG review含む）、question importer、answer author（explanation review含む）、analysis publisherのスキルと元repoのroot／universities AGENTSを読了していた。次回は適用される現行手順を確認する。
- 元README／docs/08-web-ai-reuse-plan.md、再構成metadata、assets review、4正本hash取得の最後の出力は切り捨てられたため未読扱い。小さな出力単位で再取得する。

## 台帳・記録上の情報（まだ本文の検証ではない）

- 問題5ページ・原解答10ページ、5大問13分析小問。問題2図・解説5図。
- crop IDs: `q2-plane-apq`, `q2-plane-oab`, `a2-tetrahedron-opqab`, `a3-polynomial-long-division`, `a5-sphere-cross-section`, `a5-w-cross-section`, `a5-w-cross-section-zoom`。
- 大問1：対数・相加相乗平均、大問2：正四面体とベクトル、大問3：多項式・極値、大問4：操作と漸化式、大問5：動く球の断面と体積。
- 多項式の筆算は2次元の位置関係を持つ。原本を見てSVG／意味HTMLの適切な表現を判断し、省略しない。既存の増減表2件も確認する。
- 試験90分。数学100点は2025公式確認未済の編集上仮定。大問仮配点16/16/30/22/16。難度1/2/5/5/0問。
- 苦手スキャン56.4分・最大30点88.8分・係数1、得意最大77点86.0分・係数0.8後61点という元記録。算術とモデルの妥当性は別途検証し、勝手に目標を置き換えない。
- 元の権利、人間レビュー、採点モデルは未承認。restricted cropを公開せず条件から独立作図する。元HTMLの不備は正式修復依頼にまとめる。

## 復旧確認

- サイトHEAD `c2c2611e`、作業remoteと一致、staging `4cebe682` より配信記録1コミット先行。fetch後未統合・未pushコミットなし。Git connectivity／diff検査成功、残留lock・merge／rebase途中なし。
- 16:46の既存buildに全361テスト成功、14,803 TeXエラー0、build-input正常。新規buildや画面・印刷の目視は今回実施せず。
- ステージング201ルートのHTTP等検査失敗0。既存preview4337で北里物理3ページHTTP200・h1=1・noindexを確認。
- 最初のポート照会では稼働を把握できず復旧用previewを起動したが、既存4337が正常で新規は4338になった。親子関係を確認し、今回起動したPID19048とその子だけを停止。既存4337/PID6368を保持した。プロセスIDは次回固定値として使わない。
- automation-2はACTIVE・30分間隔を確認し変更なし。別担当の元repo慶應数学差分、人間編集図、独自解説5件を保護。北里物理8図は配信済みなので再作業不要。
- **次は久留米数学の元本文・原本・全分析を実読し、独立検算と7図の実装へ進む。状態確認だけで次の定期作業を終えない。**
