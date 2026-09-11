# 久留米2025一般前期数学：PC停止後の再開地点

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
