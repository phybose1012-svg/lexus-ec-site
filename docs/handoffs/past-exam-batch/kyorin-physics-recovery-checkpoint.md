# 杏林2025一般物理：PC停止後の再開地点（2026-09-12 00:00 JST）

## 保存された実装

- ID `kyorin-2025-general-physics`。原本問題6PNG・原解答9PNG、全問題/原解答/learner/analysis/derivedを監査済み。本文監査を最初からやり直さない。
- 独立SVG8点、manifest、再現generator、独立7テスト、分析要約、問題/解説3件ずつ・分析1件のレビュー注記、正式修復依頼13項目を保存済み。
- 正式修復依頼は `kyorin-physics-source-review.md`。元HTMLの誤りを黙って書き換えていない。目標はweak now_plus_laterとstrong nowのII(c)→II(b)依存違反のため保留を維持。
- 対象限定import/report済み。ローカル図保留201、配信済み209。目標保留19。既存の独自解説5件と別担当の元repo慶應修復は変更していない。

## 検証済み範囲

- 中断前build 23:53:53 JST、1118ページ。復旧時に全391テスト成功、14,857 TeXエラー0、build-input正常を再確認。Git connectivity/diff正常。dangling objectはあるが破損報告なし、削除しない。
- 8PNG/contact sheetを目視、修正したばね/回路の4PNGも確認済み。実ブラウザーPC1280で問題・解説h1=1、数式エラー0、各4図読込、文書幅1265を確認。解析ページの最後のツール出力は過大で未読なので確認済み扱いにしない。
- preview4337は復旧時HTTP200。再起動せず維持。staging HTTP200、保存済みstagingは5a60881b、作業remoteは2781f3d6。automation-2 ACTIVE/30分のまま、重複作成や設定変更なし。
- 390pxの3ページ目視・実印刷/PDFは未実施。未検証のため今回stagingへは配信しない。作業branchに復旧用として保全する。

## 次の作業（残りQAから再開）

1. `build-kyorin-2025-general-physics-figures.mjs` の詳細回路 `ix(567,360,'I','D')` が7.0Ωに近い。候補 `ix(540,352,'I','D')` を実画像で確認して調整する。未修正。
2. 同ファイルchoiceValue(3)の三角波は現在 `u/Math.PI` で5周期、原本は約2.5周期。`u/(2*Math.PI)` の適否を原本図と比較する。未修正。設問の正解を推測して波形を変えない。
3. 必要な図修正後、再生成・validator・最終PNG/contact sheetを確認。generator変数名packはhandoff回帰が参照するため維持。
4. build完了後に全テストとTeX監査。生成8SVG/manifestの9ファイルを2回生成してSHA-256不変確認。元4正本hashも再確認する。
5. PC分析、390pxの3ページ、図の左右端と実際の可読性を確認。図は狭幅680pxの内部スクロール、本文は375pxに収める。既存ブラウザーtab3が残っていれば再取得し、なければ新規検証タブを作る。fresh queryを付け、古いpreviewキャッシュに注意。
6. origin/stagingをfetchし他担当変更を確認、必要なら統合後に再検証。検証済み内容だけ通常pushでstaging→作業branchに保存。配信3URLと8SVGのバイト一致、全201ルート検査を行いcontinuationへ結果を記録。作業treeの保全コミットを公開完了と混同しない。

元4正本hash（reconstruction/editorial/analysis/derived）：

- `1c050d2eb6dedb3079366cee3356a57d7158cc31ecbba28d66f6306360db4316`
- `fc2d6183b1340580b43d891f0b208e6f914d65690bf18c7fbee3e51fbb761135`
- `e77468d8e86561dba364ee71b2f6cd632416c9b74b43a3bb37766f9e8a89353a`
- `6c9e71d85259551918b6106c8e2dc7ed2c690ab8eaac6d3b0e90bf45986bcf06`

次packageは本packageの配信後に台帳から選ぶ。今は杏林物理の残りQAを優先し、数学11図を再作業しない。
