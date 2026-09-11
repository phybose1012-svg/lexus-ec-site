# 日本大学2025 N第1期一次物理：停止後の再開地点

2026-09-12 02:50 JST。対象ID `nihon-u-2025-n-unified-first-physics`。

## 保存状態

- サイトHEADは `e27d8912`。直前の数学公開内容は `5bab47f2`。物理の新しい図・本文修正はまだ作成していない。停止により失われた保存済み実装は検出していない。
- 元資料は `C:/---hp/shidai-igakubu-gokaku-dokuhon/projects/universities/nihon-u/past-exams/working/2025/n-unified-first/first-stage/physics`。読み取り専用。他担当の慶應修復差分は保持。

## 読解済みと未読

- 元repoルートと universities の AGENTS、対象の SOURCE-HTML-RECORD.md / ANALYSIS-RECORD.md、reconstruction の文書一覧、10図のメタデータ、問題ページ1〜3の全ブロックまで確認。
- **問題原本11PNG・解答原本8PNGはまだ目視していない。問題4〜11、原解答8ページ、learner、全分析・derived・issuesは未読。** 未読部分と原本照合から再開する。
- 5大問25問。問題7図／解説3図が未作図。100点は仮換算（各大問20、各問4）。分析記録の難度は基本9／基本＋α7／標準9。記録上の目標は苦手56点59.6分、得意最大100点56.1分→80点だが、まだ独立検証していない。

## 未確定の照合ポイント

- I：球と壁の斜め衝突。角度は壁の法線から測る。摩擦なしでは平行成分 v0 sinθ、法線成分 e v0 cosθ。摩擦ありは平行力積が法線力積の1/2、θ=45°との再構成。
- 再構成のI(5)選択肢には `2e/(1-e)` があるが、この条件なら tanφ は `(1-e)/(2e)` となるはず。eの指定・角度の定義・選択肢の転記を**原本PNGで確認してから**不備を確定する。原本未確認の推測で修正しない。
- II：断熱容器Aが初め p0,T0,Sl、Bは真空Sl。栓を開ける状態Iの自由膨張なら温度T0、Bの物質量 p0Sl/(2RT0)。以降のピストン条件・外圧は未読。
- 記録の「物理60分」と実際の試験枠、配点の公式／仮換算の区別を表紙・根拠で確認する。

## 図のスロット

問題：q1-collision-setup、q2-gas-state1、q2-gas-state3、q3-lens-liquid-setup、q3-dark-ring-options、q4-rail-resistor、q4-rail-capacitor。

解説：a1-collision-vector、a1-collision-result、a3-lens-geometry。

restricted cropを公開せず、条件から独立SVGを作る。原本と本文の全監査→修復依頼→対象限定実装→再生成同一性・全図目視・独立検算・ビルド・PC/狭幅確認→stagingへ通常pushの順。既存数学3図を再作業しない。

## 復旧検査

- Git connectivity/diff正常、残留lockなし。fetch後staging未統合0、作業remoteへの未push0。
- build-input正常、400回帰成功、14,857 TeXエラー0。実staging201ルート失敗0。
- 停止していたpreview4337を非表示プロセスで再起動し、ライブラリーHTTP200を確認。定期実行automation-2はACTIVE/30分を維持。
- 初回ネットワーク検査はサンドボックス制限で失敗したが、許可された再実行では全件成功。配信障害ではない。
- 再ビルド・再配信は不要。今回は画面/PDFの再目視は未実施。
