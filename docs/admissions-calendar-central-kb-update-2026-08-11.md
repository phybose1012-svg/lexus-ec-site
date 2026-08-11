# 2027年度私立医学部入試カレンダー 中央ナレッジ差分確認（2026-08-11）

## スナップショット

- カレンダー更新前コミット: `7ab0988`
- 中央ナレッジ参照コミット: `5b1ea99`
- 中央ナレッジ対象年度: 2027年度
- 中央ナレッジvalidation: `passed`（2026-08-11T05:22:55.745Z）
- 中央ナレッジmanifest content hash: `65afedd84efd7d1457af1a60e124b8b390fc1d3a0b49d158313a3c625f347085`
- 完成募集要項HTML取込レポート生成日時: 2026-08-11T05:22:35.826Z
- 今回の完成全文照合対象: 昭和医科大学（PDF 74ページ）、兵庫医科大学（PDF 46ページ）

## 公式根拠を確認して更新した項目

### 兵庫医科大学

- 対象方式: 一般選抜B（英語資格試験活用型）
- 項目: 第2次試験
- 旧値: `2/27 10:00（西宮キャンパス）`
- 新値: `2/27（集合時刻は一次合格発表時に案内）`
- 理由: 募集要項PDF 25ページでは第2次試験日は2月27日とされ、集合時刻は第1次試験合格発表時に案内される。10:00は募集要項PDF 27ページにある第1次試験合格発表の開始時刻であり、第2次試験の開始時刻ではない。
- 公式根拠: `https://www.hyo-med.ac.jp/files/20260703/c737f86c1b3de8f37133c3de2c8031853ac51fff.pdf`
- 大学別HTML: `projects/universities/hyogo-medical/output/production-2027/pages/page-25.html`、`page-26.html`、`page-27.html`
- 確認日時: 2026-08-11（JST）

- 対象方式: 一般選抜A（4科目型）
- 項目: 入学手続猶予条件
- 変更内容: 「残額と書類」を、公式表記に合わせて「その他の手続時納付金と手続書類」へ明確化した。
- 公式根拠: 同募集要項PDF 28ページ
- 大学別HTML: `projects/universities/hyogo-medical/output/production-2027/pages/page-28.html`
- 確認日時: 2026-08-11（JST）

### 昭和医科大学

- 対象方式: 一般選抜入試（Ⅰ期）
- 項目: 第2次試験日の選択条件
- 旧値: `2/13・14の選択日`
- 新値: `2/13・14から出願時に1日選択（出願後の変更不可）`
- 理由: 募集要項PDF 15ページに、出願時に選択し、出願後は変更できないと明記されている。
- 公式根拠: `https://adm.showa-u.ac.jp/albums/abm.php?d=2405&f=abm00072419.pdf`
- 大学別HTML: `projects/universities/showa-medical/output/production-2027/pages/page-15.html`
- 確認日時: 2026-08-11（JST）

## 派生表示の修正

- 全日程カレンダーの入学手続締切詳細を生成する際、文字列末尾の閉じ括弧を一律削除していた処理を修正した。
- 修正前は「必着」「消印有効」「手続条件」などを囲む括弧が複数大学で欠けていた。
- 正本データは変更せず、正本から派生する表示だけを修正した。

## 公表待ち・継続確認

- 兵庫医科大学の兵庫県推薦入学制度枠は、兵庫県側の2027年度受付期間、県選考日、結果通知日が公表待ち。今回の確認では推測補完していない。
- 昭和医科大学・兵庫医科大学とも、公式資料の訂正・差替えが公表された場合は対象ページとPDF hashを再確認する。

## 中央ナレッジ側へのフィードバック候補

中央ナレッジは今回読み取り専用で扱い、以下は直接修正していない。

1. `issue:hyogo-medical--2027--issue--html-reconstruction-incomplete`
   - 現在は全46ページが完成・承認済みで、allow-listにも登録されているため、issue本文の「全ページpending」は現状と不一致。
2. `issue:hyogo-medical--2027--issue--procedure-deadline-condition-mismatch`
   - 現行イベントの `deadline_condition` には「消印有効」が反映されているため、解決済みか再判定が必要。
3. `issue:source-archive-metadata-pending--showa-medical`
   - 昭和医科大学の完成要項HTMLと公式PDF SHA-256は中央ナレッジへ取込済みだが、一般選抜Ⅰ期・Ⅱ期のroute/eventが完成要項sourceへ未接続。完成sourceをroute/eventへ関連付ける正規更新が必要。
