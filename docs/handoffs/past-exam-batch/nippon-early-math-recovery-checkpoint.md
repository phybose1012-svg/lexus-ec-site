# 日本医科大学2025前期数学：PC停止後の再開地点

2026-09-12 05:52 JST。これは中断時の読解メモであり、修復完了・公開承認ではない。

**06:48 JST追記：この中断地点の残作業は実施済み。** 独立5SVG・HTML表・分析の更新は `7cbd2811e0283432211f639862ede30215b09b08` でステージング配信を確認。以下は履歴として残す。元HTML修復は [正式修復依頼](nippon-early-math-source-review.md)、次対象は [continuation.md](continuation.md) を参照し、この読解地点からやり直さない。

## 復旧状態

- 作業branch `codex/keio-2025-mathematics` の中断時HEADは `57c49f7f8d52fb14c1bc9442792161b72e0d62f6`。同じSHAがremoteに保存済み。stagingは `a1d3dff6c1489456f5b99d1a3bb70e0f471a5a3f`。
- Git connectivity/diff正常、残留lockなし。サイトの未コミット変更なし。元repoの別担当慶應修復差分は保持した。
- 停止していたpreview4337を非表示で再起動。HTTP200。全413回帰成功、14,873 TeXエラー0、build-input正常。実staging全201ルート失敗0。再ビルド・再配信は不要。
- 30分ごとの既存定期継続 `automation-2` は設定上ACTIVE。複製・変更していない。

## 次の対象と読了範囲

- ID `nippon-medical-2025-general-early-mathematics`。
- 元資料 `C:/---hp/shidai-igakubu-gokaku-dokuhon/projects/universities/nippon-medical/past-exams/working/2025/general-early/first-stage/mathematics`。読み取り専用。
- 全reconstruction/learner本文、問題PNG1〜4、解答PNG01〜06は読解済み。**解答PNG07〜11は未読**。前回5画像一括出力が文脈上限で失敗したため、2枚程度ずつ確認する。
- analysis.json/derived.json/分析HTMLの全項目監査はこれから。14小問・仮300点、苦手53.3%/得意80%は未検証。公式日程11:05〜12:55と冊子90分の違いは勝手に確定しない。
- 作図・対象import・編集はまだ未着手。既存の日本大学二次数学をやり直さない。

## 中断時の発見事項（原本照合を経て正式修復依頼へ整理する）

1. 第I問：複素数の積と極形式、隣接確率比の閾値、不定方程式の導出がlearnerで薄い。再構成の式番号③④が `\\text{?}`。n=2025の最頻k=1350、純虚数はk≡1 mod4で507個という検算メモ。
2. 第II問：learner見出しの「正四面体」は誤り。OA=OB=AB=1、AC=2、OC=BC=√3の四面体。問4準備→問4→問2→問3という順序で未導出の結果を使用。「原本の長さ計算」依存や編集用の内部版文言を独立した解説とみなさない。
3. 第II問：OHの係数は(1/2,1/3,1/6)、OIは((√3−1)/2,(3−√3)/3,(3−√3)/6)。AI=(3−√3)AH、OH=√6/3、AH=√3/3、IH=(2−√3)AH。S=√2(2−√3)(1−x)/6からx=(2−√3)/4。必要な連立式・相似・高さ・角二等分線の適用先の橋渡しを点検する。
4. 第III問：最短距離の点は(2,3/5,4/5)、距離√17。回転前Aと回転後B、元の候補Xと回転後Yを混同しない。p≥0の根拠と頂点Oの確認が必要。F(p)=4p^4−3p²−10p+26、F'=2(p−1)(8p²+8p+5)。原本の増減表がlearnerから欠落。別解も最後まで解いたものか単なる方針か区別する。
5. 第IV問：偶奇性の証明、連続性から差商極限の存在を示す手順、h'=0からh=h(0)=2とする橋渡しを点検。積分結果3πを並べるだけで証明済みとしない。

## 独立図の候補（5配置）

- `ans-q2-djhi-plane`：O,A,D,H,Iの同一平面、JはDからOHへの垂線の足。共通底辺IHと高さJH/OH。
- `ans-q2-tetrahedron`：条件からO=(0,0,0), A=(1,0,0), B=(1/2,√3/2,0), C=(0,1/√3,√(8/3))を使って独立投影できる。
- `ans-q2-incenter`：三角形ABC、I、K=AI∩BC。BK:KC=1:2、AI:IK=√3:1。
- `ans-q3-space-geometry`：回転軸x、断面円、A(1,3,4)→B(1,5,0)。候補点と最短点の区別を明示。
- `ans-q3-yz-projection`：A'=(3,4)、B'=(5,0)、最短点の射影(3/5,4/5)。回転と半径を混同しない。
- 表は画像ではなく既存answer supplementの `insert-after` と共有trend rendererを利用可能。p=0は定義域内なので斜線にしない。既存慣例（項目列右のみ二重線、28px矢印）を維持。

## 元正本SHA256（再開時照合）

| ファイル | SHA256 |
| --- | --- |
| source-html/reconstruction.json | aca96f27d247b5a5d128efce229d5997932e6e39b491b6a8782f958d6727da9f |
| source-html/editorial-explanations.json | c638006a24e84b01861970bda263460f3c493717001b74906825c6cf2f227cae |
| analysis.json | ace338b1943a8ea089b67520612cecc15a0d38d525d24cc6d075640d5380d637 |
| derived.json | a061a552254a954a9761d5cd7a508353983e289ed05a60072b2f8bcc13c1b02b |

再開順：適用スキルを読み、残る5解答PNGと全分析監査→独立作図/表→正式修復依頼→対象import/集計/分析編集→build/回帰/TeX/全図/PC狭幅QA→検証済み差分のみstagingへ通常push。権利・元HTML修復・人間承認のゲートは維持する。
