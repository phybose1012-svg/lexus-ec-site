# 近畿大学2025推薦入試（一般公募）数学・再開地点

## 最新更新：2026-09-11 11:12 JST

下の10時台メモは履歴です。原解答10ページ／原本14PNG／analysis全13問／derived／分析HTMLの監査を完了し、[正式修復依頼](kindai-recommendation-math-source-review.md)へ9区分で保存しました。独自3SVG・共通注意2HTML表・7テスト・3大問と分析の注意書き、対象取込／report／build（11:07:57、1118ページ）を完了。全330回帰成功、14,771 TeXエラー0、全図PNG・PC／390px確認、2回再生成の一致／public-dist一致を確認済みです。**次は通常pushと実配信の検証。** 実印刷／PDF目視は未実施。配信結果はcontinuationの最新記録を確認してください。

2026-09-11 10時台JST、PC停止の復旧依頼に伴う読解状況の保全。
これは監査途中のメモであり、正式な修復依頼・内容検証済み報告ではない。

## 対象と現状

- サイト作業場所: `C:/---hp/_worktrees/keio-2025-mathematics`
- package: `kindai-2025-recommendation-general-public-mathematics`
- 元repo（読み取り専用）: `C:/---hp/shidai-igakubu-gokaku-dokuhon`
- 元package相対パス: `projects/universities/kindai/past-exams/working/2025/recommendation-general-public/first-stage/mathematics`
- catalog確認済みURL: `/past-exam-library/kindai/2025/mathematics-recommendation-general-public-first-stage/{questions,answers,analysis}/`
- `/mathematics/` は前期Aの別試験。URLを混同しない。
- 台帳は問題図0／解説図3だが、上流には共通注意のマーク例2件もある。実際には5cropを監査する。
- 今回のpackage向け新規generator・SVG・supplement・正式修復依頼・取込・buildはまだない。
- 完了済み前期A物理13図を再作成しない。配信済み登録図保留262／目標点保留19を維持。

## 中断直前までの読解範囲

読了: 元SOURCE-HTML-RECORD、ANALYSIS-RECORD、issues、問題reconstruction全4ページ、学習者向けeditorial全10ページ。前期A数学generatorの共有mark例HTML表／SVG envelopeの実装も確認済み。

**未読・未検証:** 原解答reconstruction全10ページ、原本PNG全14枚（問題4＋解答10）、analysis全13小問、derived、分析HTML、独立検算。原本照合済みと報告してはいけない。

上流記録の主張は3大問13分析小問・60分・仮100点、難度3／5／4／1問、苦手最大／目標53点59.9分、得意最大100点54.6分→80点。これは**まだ独立検算していない**。

## 次に原本で確認する不整合候補

1. I(1)の `sin 2θ` の分子欄が問題・キーとも `ウエ` なのに答えが `−24`（3文字）。次の分母がカキなので、オの転記脱落の可能性がある。原本の文字枠を確認し、推測でキーを変更しない。
2. II(1)問題のA〜Hが `9,0,1,10,8,5,7,2` なのに、学習者版は既知8名の並べ替えを `1,2,5,6,7,8,9,10` として平均6・分散9を計算する。問題の0と解説の6の不一致がある。元の平均・分散・得点制約も含めて原本照合し、依存する四分位数・分析を確認する。片側だけを正しいと決めない。
3. 共通注意 `notice-mark-example-1`（−8）と `notice-mark-example-2`（−4/5）の例示を、restricted cropをコピーせず意味HTML表で保持する。元HTMLの完全一致置換条件と原本内容を確認する。
4. `ans-q3-parabola-overview` のalt「x軸上の共有点(a,0)、(b,0)」は疑わしい。f=(x−a)(x−b)、g=−(x−a)^2+bではg(a)=b>0なので、(a,0)は両曲線の共有点ではない。原図の役割と、fの根・gの頂点・実際の共有点を区別する。
5. I(3)学習者版で積の式と、次ページの `≥14+4+12+6=36` が分離し、どの交差項に相加相乗平均を使ったか不明瞭。次の一般化も「原本は帰納法と判別式の二通り」と述べるだけで、帰納法の結論の平方が単独表示される。原解答にある意味のある証明を落としていないか確認する。
6. II(2)の見出しは「平均7を基準に偏差表を作る」だが、学習者版には表がなく2式のみ。原解答の偏差表を確認し、必要ならHTML表として保持する。II(1)・(3)の表の欠落も全ページで確認する。
7. II(3)でC〜L平均6からk+l=16、kl=63へ飛び、分散条件から積を出す過程が見えない。分散の橋渡しが原解答から欠落していないか確認する。
8. IIIの学習者版では面積の式でf,gを使ってから、後のページでfの具体式が出る。f,gの定義、共有点のx座標1・4と積分範囲、上下関係の導入を確認する。
9. III(4)でx1,x2の定義・大小と象限の対応を示さず範囲を書く。整数条件による(a,b)候補の絞り込み、g(b−1)<0の必要性を説明できているか確認する。「元の2式へ代入して確認」と言いながらfの値だけを示す点も確認する。
10. analysis・derivedは未読。元HTMLの不整合が配点・難度・目標点の根拠にも影響するか、全13問の監査と独立計算で調べる。未検証の候補を確定した不備として修復担当に渡さない。

## 図版候補・数学的条件（原図確認前）

- `ans-q3-parabola-overview`: 元cropは解答p8。一般のf,g、根a,b、gの頂点(a,b)、共有点の関係を独立作図する。原図の意味を先に確認する。
- `ans-q3-enclosed-area`: 解答p9。a=2,b=4、f=(x−2)(x−4)、g=−(x−2)^2+4。共有点は(1,3),(4,0)、囲まれた面積9という学習者版。式から独立検算する。
- `ans-q3-quadrants`: 解答p9。a=2,b=6、共有点(1,5),(5,−3)という学習者版。象限、曲線の上下、範囲、整数条件を検算する。
- SVG共通ライブラリは `frontend/scripts/lib/past-exam-svg-author.mjs`。前期A数学generatorを参考にし、元画像をtraceしない。数式は本文と同じKaTeX書体。人間編集保護を維持する。
- 共通注意2件は図形ではなくHTML表が適切。generatorからpackage限定question-supplementを出力し、expectedMatches=1を維持する。

## 次の実行順序

1. 原解答10ページ、原本PNG全14枚を読む。画像は少数ずつ返し、出力超過した画像を目視済みと数えない。
2. analysis全13問・derived・分析HTMLを読み、全問の独立検算・時間／目標計算を行う。
3. 検出した全不備を正式な大学別修復依頼へ整理し、確実な独自3SVG・必要な2HTML表と意味テストを実装。元repoは直さず、必要な注意書きと保留を残す。
4. 対象限定import→report→build→build後の全回帰・TeX監査→全図PNG／PC／390px確認。実印刷未確認は区別する。
5. 最新stagingをfetchして統合要否確認、検証済み内容のみ通常push、実URL検証、継続記録保存。
6. 次候補は近畿推薦公募物理（台帳19図）。現在の数学を終えてから直列に進める。

## 復旧時の正本ハッシュ

以下は復旧時に読み取ったSHA-256。前回監査時のハッシュとの同一性は未確認なので「変化なし」の証明には使わない。

| ファイル | SHA-256 |
| --- | --- |
| source-html/reconstruction.json | 40a47f655468f5bf46b1ddacae0caec03d2e9fff5f195558985d3b3922520699 |
| source-html/editorial-explanations.json | ea70b21e31673dc93a560b2948c2e8ab80dd0097ff02345c68b977d6948a1b39 |
| analysis.json | 0663447c8ed0ccd2d6a35aff996da3d7ff0759b2e02f5bc637ad26ce34d7e650 |
| derived.json | ac7bbc41fe0379967e4fa6575432a0b0d53e7256bbd25423416a14c40a3cec08 |

## 復旧確認

- 開始時サイトtreeはクリーン。fetch後HEAD／GitHub作業ブランチは6b2290a8、stagingは20b90347。差は配信後の記録1コミットだけで、未統合変更なし。
- Git接続検査・差分検査成功、管理ディレクトリ直下のlockなし、rebase／merge途中の管理ファイルなし。サイト実装の消失・破損は検出していない。
- preview4337は127.0.0.1とlocalhostでHTTP200・h1=1・noindex。プロセス列挙は権限制限で失敗したが、直接HTTPで正常を確認したため再起動・重複起動しない。
- 既存build（09:34頃）への全323回帰成功、14,771 TeXエラー0、build-input正常。今回は新規build・ブラウザー目視・実印刷を行っていない。
- ステージング全201ルートのHTTP／h1／noindex／canonical検査は失敗0。20b90347のCloudflare commit checkはcompleted/success。巻き戻し・再配信不要。
- 元repoの他担当の慶應数学修復差分は保持。既存automation-2はACTIVE・30分間隔・同じタスクで存続し、重複作成や設定変更不要。
- 今回はこの再開メモとcontinuationだけを作業ブランチへ保存する。stagingへの新たな内容変更はない。
