# 日本医科大学2025前期物理：PC停止後の再開地点

> この記録は履歴です。2026-09-12 08:10 JST台に以下の未読部分を監査し、6独立SVGと分析整理を実装・検証しました。現在の公開状態・次の対象は continuation.md の最新記録を参照し、この読解地点から再開しないでください。

2026-09-12 07:24 JST。ユーザーのPC停止確認依頼を受け、保存済み状態を確認した。現在の対象は `nippon-medical-2025-general-early-physics`。元リポジトリは読み取り専用。

## 復旧確認

- サイト作業ツリーは開始時clean。HEAD `e80786e4` は作業remoteと一致、fetch後のorigin/stagingに対して記録のみahead 1、behind 0。Git connectivity正常、残留lockなし。
- preview `http://127.0.0.1:4337/past-exam-library/` はHTTP200（PID27588）。再起動不要。
- build-input正常、420回帰成功、14,898 TeXエラー0。実staging全201ルート成功。初回のsandboxネットワーク制限によるfetch失敗は、許可されたネットワークで再検証して解消。
- 既存automation-2はACTIVE/30分を確認し、設定は変更していない。元repoの別担当による慶應数学修復差分はそのまま保持。
- 本文・図の変更はまだないため、再ビルド・staging再配信は不要。今回の記録のみ作業branchへ保存する。

## 読了・未読

- 今回までにバッチ・作図・SVGレビュー・分析publisherスキルを読了。再開時は適用スキルを読み直す。
- 問題reconstructionの全3ページ本文は読了。learnerは先頭約60行のみ確認。
- 原本PNGは未確認。2画像同時表示がコンテキスト上限で失敗したため、**画像を見た扱いにしない**。1画像ずつ表示する。
- 解答reconstruction全8ページ、learner残り、分析JSON/derived/分析HTML全7項目は未読。
- 元パス：`projects/universities/nippon-medical/past-exams/working/2025/general-early/first-stage/physics`。
- 問題画像 `source/pages/questions/questions-page-1.png`〜`questions-page-3.png`。解答画像 `source/pages/answers/answers-page-1.png`〜`answers-page-8.png`（ゼロ埋めなし）。

## 問題の概要（原本照合前の読解メモ）

- I：半円筒内面の運動と水平射出、半球からの離脱、惑星軌道。問題図 `q1-fig1-half-cylinder` / `q1-fig2-hemisphere`。候補値は初速sqrt(5gr)、OA=2r、Aでの抗力6mg、Bでの遠心力3mg、離脱高さ2R/3、周期比8、軌道速度sqrt(GM/R)。静止した球が完全な頂点から動く条件の説明は原本と照合する。
- II：電位グラフ中の荷電粒子と球殻。問題図 `q2-fig1-potential-graph` / `q2-fig2-conducting-shell`。グラフの数値頂点は未確認。球殻は外部kQ/r²、導体内0、負電荷の最大高さv0²/(2A)、脱出速さsqrt(2AR)、A=kqQ/(mR²)。問題図に解答を漏らさない。
- III：単原子理想気体、AB定積→BC断熱→CA定圧のPVサイクル。問題図 `q3-fig-pv-cycle`。P2/P1=243/32から、計算候補V2/V1=27/8、QAB=ΔUAB=633/64 P1V1、WBC=405/64 P1V1、放熱量95/16 P1V1、効率253/633。まだ原本解答との照合・独立テストはしていない。
- 解説側に図1枠、問題側5枠が保留。解説図IDと用途はこれから確認する。

## 分析ゲート

- 現在targets-deferred：`Stale or invalid target weak headline: observed 62; canonical 62.5 (or rounded 63)`。
- Python/JS等の丸め差の可能性は仮説であり未検証。元の計算と全設問・時間・依存関係を読み、推測でゲートを解除しない。
- 7主設問、仮配点200、理科2科目120分／編集上の物理60分。これも元資料の根拠まで確認する。

## 読解開始時の元ファイルSHA256

```text
source-html/reconstruction.json 8a90a417056cc61af11d282dadb10dc7525caeaaaa6ad742f21aa12d22c5c0ce
source-html/editorial-explanations.json 57d72b38cc5b20353d0027c503417cf9692560b77a854a4f1d04679bb78b4ca5
analysis.json 8ed109dc2e656b5d58cc5b0fe137d7549c5528676482c89d36ac8d8c24392489
derived.json 219163379484d39301ec3260c9e4c39be39c40f2b34330629f69d7eca69a0c03
```

次は問題PNGを1枚ずつ確認し、解答・分析の未読部分を全監査する。元HTML修復依頼をまとめ、条件から独立SVGを実装・検証する。完成済みの日本医科大学数学をやり直さない。権利・人間レビュー・実印刷は未承認のまま保持。
