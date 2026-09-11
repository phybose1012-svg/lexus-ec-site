# 埼玉医科大学2025前期数学・PC停止後の再開地点

2026-09-12。対象は `saitama-medical-2025-general-early-mathematics`。
元repoは読み取り専用：`C:/---hp/shidai-igakubu-gokaku-dokuhon`。
対象相対パス：`projects/universities/saitama-medical/past-exams/working/2025/general-early/first-stage/mathematics`。

## 保存と復旧確認

- サイトHEAD `f1bb180d`、配信内容 `ee7acd74c1314b80b7c897dbc1546def5998dbba`。復旧確認開始時clean、fetch後staging未統合0、作業branch未push0。
- Git connectivity/diffチェック正常、残留lockなし。preview4337 HTTP200、再起動不要。build-input正常、426回帰成功、14,898 TeXエラー0。実staging全201ルート失敗0。ネットワーク制限内のfetch失敗は権限付き再検証で解消し、配信障害ではない。
- 既存automation-2はACTIVE/30分。新規作成・変更なし。他担当の元repo慶應差分を保持。再ビルド・ステージング再配信は不要。
- このパッケージの作図・取込・編集はまだ未着手。以下は中断前の読解メモであり、完成・人間承認ではない。

## 読了範囲と次の手順

- SOURCE-HTML-RECORD.md、全問題再構成、問題PNG全4ページは読了。
- **解答PNG全8ページ、解答再構成、learner、全analysis/derived/分析HTMLは未読。** learner全文出力はコンテキスト超過で読めなかったため、少量に分けて最初から読む。
- 元画像は `source/pages/questions/questions-page-1.png`〜4、`source/pages/answers/answers-page-1.png`〜8（ゼロ埋めなし）。
- 台帳は問題1図・解説2図の保留。crop IDsは `q3-geometry`（問題p3）、`ans-q3-geometry-1`（解答p4）、`ans-q3-geometry-2`（解答p5、αβ付き）。解答原本を読んでから独立SVGを作る。
- 解答監査、分析10小問と目標計算の独立検証、3図の実装、必要ならHTML表補完、修復依頼、取込・build・検証・staging通常pushの順。既存完成分をやり直さない。

## 原本問題と転記上の発見

- 問題p1のマーク注意：−38を欄5・6・7へ入れる具体例と選択表が再構成では一般説明に置換されている。分数の−4/5と4/−5の比較例も脱落。修復依頼へ記録し、restricted画像をコピーしない。
- **第2問(3)の重大な符号脱落：** 原本は `k=(-[20]+sqrt([21]))/[22]`。再構成は外側のマイナスがなく `([20]+sqrt([21]))/[22]`。欄20は一文字で−1の二文字を入れられない。原本との再照合後、修復依頼とレビューゲートが必要。
- 第3問Tは原本ではARとPSの交点、再構成ではARとℓ′。内部条件では同じ直線だが、原文忠実性として区別して記録。
- 試験冊子は50分。記録の公式参照PDFは数学9:00〜9:50/100点/マーク式とされるが、今回直接閲覧は未実施。公式配点レビュー状態は勝手に解除しない。

## 独立計算メモ（解答原本との照合前）

1. 第1問：`e^x+3e^-x` はx=log(3)/2で最小2√3。複素数回転は `(√2−1)(−1+2i)`。
2. 第2問：P(10,0)、Q(0,20)、左/下へ進み原点で停止しない。等速の最短はP移動15m・距離5√2、Qが3倍速では7m・√10。一般kでP移動 `10(2k+1)/(k²+1)`、最大となるkは `(−1+√5)/2`。
3. 第3問：A(1,0)、B(0,1)、C(0,−1)、Pは単位円の第1象限弧上。ℓはCP、傾きt。ℓ′はBP、傾き−1/t。P=`(2t/(1+t²),(t²−1)/(1+t²))`、Q=(1/t,0)、S=(t,0)、R=(1,t−1)、T=(1,1−1/t)、内部はt>1。
   面積比PBC/PQS=`4t²/(t²−1)²`=3よりt=√3。P=(√3/2,1/2)、T=(1,1−1/√3)、∠ATP=2π/3、PT=(2√3−3)/3。原本図は全円ではなくABの四分円弧、ARは鉛直、PはTの左、Q<A<S、RはTの上。問題図に解答値を漏らさない。
4. 第4問：同じ飴10個を区別する5人へ0個可で配る。総数C(14,4)=1001。Aがk個ならC(13−k,3)=(11−k)(12−k)(13−k)/6。

## 元正本SHA256（復旧確認時も一致）

- reconstruction.json: `b5a94a59a8dfed724646fecd9acd76f37703442d220dcd22007a7f2c9bad62ee`
- editorial-explanations.json: `88a08b4aeed67ae0987e752af08dca9d03901eb03ebf4067d0cccf52fa37ffb8`
- analysis.json: `42bd90cdf1febf03bf564005d97385bec015a8f40307bcb3255cf3a6547dca6c`
- derived.json: `9681c5499ab8f9b0d3c4ef9c9b604d413aa57545ee506233b6b19283c0026abd`
