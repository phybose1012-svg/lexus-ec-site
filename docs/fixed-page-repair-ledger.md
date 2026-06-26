# 固定ページ品質改善 台帳 (fixed-page-repair-ledger)

ブランド基準: ステージングトップページ <https://staging.lexus-ec.pages.dev/>
作業ブランチ: `staging`（`main` には push しない）

判定の見方:
- 実装種別: 専用Astro / 抽出流し込み / フォーム / 情報ページ
- 優先度: A（CV・信頼に直結 / 大きな崩れ）/ B（重点改善）/ C（崩れのみ・法務等）
- 方針: 再現（元ページ再現）/ 統合（ブランド統合リデザイン）/ 整理（情報整理）/ 崩れ（崩れのみ修正）
- 状態: 未着手 / 確認済(問題なし) / 修正中 / 完了

## 進捗サマリ

| 対象 | path | 実装種別 | 優先度 | 方針 | PC | mobile | 状態 | commit |
|---|---|---|---|---|---|---|---|---|
| 合格体験記 | `/top/voice/` | 専用Astro | A | 統合 | OK | OK | 完了 | 4f99945 |
| 合格実績・メソッド | `/top/results/` | 専用Astro | A | 統合 | OK | OK | 確認済(問題なし) | - |
| 講師紹介 | `/top/teacher/` | 専用Astro | A | 統合 | OK | OK | 確認済(問題なし) | - |
| コース一覧 | `/top/course/` | 専用Astro | A | 統合 | OK | OK | 確認済(問題なし) | - |
| レクサス プレミア本科 | `/lexus-premier/` | 専用Astro | A | 統合 | OK | OK | 確認済(問題なし) | - |
| アクセス | `/top/access/` | 専用Astro | B | 統合 | OK | OK | 完了 | (本コミット) |
| レクサスガーデン | `/top/lexus-garden/` | 専用Astro | B | 統合 | OK | OK | 確認済(問題なし) | - |
| 強み(沿革) | `/top/history/` | 専用Astro | B | 統合 | OK | OK | 確認済(問題なし) | - |
| FAQ | `/top/faq/` | 専用Astro | B | 整理 | OK | OK | 確認済(問題なし) | - |
| 入学までの流れ | `/entrance/` | 専用Astro | B | 統合 | OK | OK | 確認済(問題なし) | - |
| 英語の鬼特訓 | `/medical-english-training/` | 専用Astro | B | 統合 | OK | OK | 確認済(問題なし) | - |
| プレミア本科(詳細) | `/top/course/lexus-premiere-course/` | 専用Astro | B | 統合 | OK | OK | 完了 | (バッチ2) |
| 高レベル現役合格 | `/top/course/high-level-geneki-course/` | 専用Astro | B | 統合 | OK | OK | 完了 | (バッチ2) |
| オーダーメード演習 | `/top/course/custom-made-course/` | 専用Astro | B | 統合 | OK | OK | 完了 | (バッチ2) |
| メディカル準備(高等部) | `/top/course/medical-prep/` | 専用Astro | B | 統合 | OK | OK | 完了 | (バッチ2) |
| メディカル準備(中等部) | `/top/course/medical-prep-junior/` | 専用Astro | B | 統合 | OK | OK | 完了 | (バッチ2) |
| 個別説明会予約 | `/reservation/` `/top/reservation/` | フォーム | A | 統合 | OK | OK | 完了 | (バッチ2) |
| お問い合わせ | `/top/contact/` | フォーム | A | 統合 | OK | OK | 完了 | (バッチ2) |
| 資料請求 | `/request-documents/` | フォーム | A | 統合 | OK | OK | 完了 | (バッチ2) |
| Lexus Online | `/lexus-online/` 配下5ページ | 専用Astro | B | 統合 | OK | OK | 完了 | (バッチ2) |

> 上記以外（コース詳細各ページ、フォーム系、情報ページ、旧URL群、特商法）は未トリアージ。
> 全ページ台帳は `baseline/pages/manifest.json` を基に順次拡充する。

## トリアージ方法（再現手順）

```powershell
Set-Location C:\---hp\frontend
npm.cmd run build
# 重点ページの desktop/mobile ファーストビューを一括取得
node ./scripts/capture-visual-set.mjs / /top/voice/ /top/results/ /top/teacher/ /top/course/ /lexus-premier/ /top/access/ /top/lexus-garden/ /top/history/ /top/faq/ /entrance/ /medical-english-training/
# 出力: reports/visual-snapshots/<timestamp>/*.png （viewport=1366x900 / 390x900）
```

ページ全体（全コンテナ）を見るときは fullPage 取得スクリプトを使う。

## 修正記録

### `/top/voice/` 合格体験記 — 完了

- production: <https://lexus-ec.com/top/voice/>
- staging: <https://staging.lexus-ec.pages.dev/top/voice/>
- 方針: ブランド統合リデザイン（崩れ修正）
- 問題（崩れ）:
  - hero 下に `border-bottom: 58px solid #f5339a`（PC）/ `44px`（mobile）の**ホットピンク帯**。本番ページには存在しない色で、ブランド配色（赤 #8b0000 / 紺 / 金）と不一致。高さ合わせの名残と推定。
  - `.voice-hero__actions` の `padding-block: 66px 92px` による**PCの大きな空白**。
  - mobile `.voice-notice { padding-top: 304px }` による**スマホの巨大な空白**（hero とお知らせ帯の間）。
- 修正:
  - ピンク帯を削除（PC/mobile 両方）。hero は白背景＋整った余白に統一。
  - `voice-hero__actions` の余白を `8px 56px` に圧縮。
  - mobile `voice-notice` の `padding-top` を 0 に。
- 確認:
  - PC 1366x900: OK（hero→講師紹介/理念と沿革ピル→緑のお知らせ帯→RECENT RESULTS が自然に連続）
  - mobile 390x900: OK（ピンク帯・空白とも解消）
  - build: OK（astro check 含む 564 pages）
  - 横スクロール: なし / H1: 1 / SEO(title/canonical): 不変
- 触ったファイル: `frontend/src/styles/pages.css`（`.voice-hero` / `.voice-hero__actions` / mobile `.voice-hero` / mobile `.voice-notice`）

### `/top/access/` アクセス — 完了

- production: <https://lexus-ec.com/top/access/>
- staging: <https://staging.lexus-ec.pages.dev/top/access/>
- 方針: ブランド統合リデザイン（崩れ修正）
- 問題（崩れ）:
  - 電話CTA（`.access-phone-cta`）が**ホットピンク**。電話番号ピル `background: #f5339a`、注記テキスト `color: #e83a86`。本番・ブランド配色外。
  - セレクタ `.access-phone-cta > a` が電話番号リンクと `電話をかける`（`.button--blue`）の**両方**に当たり、青ボタンまでピンクに上書きされていた。
- 修正:
  - 電話番号ピルを `var(--red)`（#8b0000）に、注記テキストを `#8f1515`（同ページ見出しと同系の濃赤）に変更。
  - ピルのセレクタを `.access-phone-cta > a:not(.button)` に限定し、`電話をかける` のブランド青を復帰。グリッドに `gap: 12px` を付与し余白を整理。
- 確認:
  - PC 1366x900: OK / mobile 390x844: OK（ピンク消滅、赤ピル＋青ボタンで自然）
  - build: OK（564 pages）/ 横スクロールなし / H1=1 / SEO不変
  - 道順写真の空白はファーストビュー外の `loading="lazy"` 画像のスクショ未読込（実ファイルは dist に存在＝崩れではない）
- 触ったファイル: `frontend/src/styles/pages.css`（`.access-phone-cta` 一式）

## バッチ2修正記録（サブエージェント・トリアージ → 直列修正）

トリアージは並列サブエージェント3体（コース詳細／フォーム／Lexus Online）で実施し、構造化defectリストを取得。修正はメインループで直列に実施・build・スクショ確認。

### コース詳細5ページ（`/top/course/*`）
- 問題: ① オススメ一覧の ✓ マークがブランド外のホットピンク赤 `#ff0d55`（全5ページ共通, pages.css:11397）② `medical-prep` のタイトルカード背景が紫 `#690086`（ブランド外）③ `custom-made` が原色寄りの青 `#1431be` ④ モバイルhero h1 の `white-space:nowrap`（はみ出しリスク, 3箇所）。
- 修正: ✓→`var(--green)`（トップの✓リストと統一）／`#690086`→`#8b0000`（ブランド赤）／`#1431be`→`#12356a`（ブランド紺）／nowrap 撤去。
- 確認: 5ページ desktop/mobile OK、緑✓・赤/紺カード・gold文字で統一。

### フォーム（予約 `/reservation/` `/top/reservation/`・問い合わせ `/top/contact/`）+ 共通フッタ
- 問題: 予約の送信ボタン・必須マークがホットピンク `#ff0066`／pill-nav が原色 `#003fff/#007d2a/#a10000`／問い合わせ送信・寮CTAが原色緑 `#00b900`・必須マーク `#f06`・CONTACT見出し低コントラスト `#bbb`／共通 `LegacyFormFooter` の著作権バー `#00ae18`・特商法リンクがマゼンタ `#e7007f`・ダーク箱下に130pxの白い空白。
- 修正: 送信/必須/特商法 → `var(--red)`、pill-nav → `var(--blue/green/red)`、寮CTA → `var(--green)`、CONTACT → `var(--muted)`、著作権バー → `#00b71a`（トップ踏襲）、空白 130px→36px。
- 確認: desktop/mobile OK、横スクロールなし、入力欄ラベル/必須表示維持、送信先・既存実装は不変。

### 資料請求 `/request-documents/`（重点・de-Google化）
- 問題: フォームが Google フォームの外観を偽装（青 `#4285f4` 上線・青リンク/送信 `#1a73e8`・Google赤 `#d93025`）。さらに本番に存在しない外部Googleリンク（accounts.google.com / support.google.com）を捏造。下部に `min-height:980px` の巨大空白。入力欄が幅240px固定で狭い。
- 修正: 偽Googleログイン文言/外部リンクを削除し「* は必須項目です」に集約。配色をブランド（赤上線・赤必須・赤送信）へ。入力欄を全幅のボーダー付きに。`min-height:980px` 撤去で空白解消。送信先(endpoint)・フィールド・honeypotは不変＝機能維持。
- 確認: desktop/mobile OK、フォーム機能（必須/種別select/同意チェック/送信）維持、Googleの偽装UIと外部リンク消滅。

### Lexus Online 配下5ページ（共通 `lexus-online-detail.css`）
- 問題: ダークセクション（`--dark`）のカード内 箇条書き `.lo-detail-list li` / `.lo-detail-checklist li` が暗赤背景に near-black `#38332d` で**判読不可**（暗色上書きが `p` のみ対象だった）。policy/application-flow/contact/development-flow の4ページに影響。
- 修正: `lexus-online-detail.css` の暗色上書きにリスト項目セレクタを追加し `rgb(255 255 255 / 82%)` に。1ルールで4ページ解消。`/lexus-online/` トップは確認済みで崩れなし。
- 確認: policy/development-flow desktop で暗セクションの箇条書きが判読可能に。

### 残課題・確認待ち（ユーザー判断）
- `/lexus-online/contact/`: フォールバック文言の電話番号 `03-3477-1306` が data側のメール `info@lexus-ec.com` と混在。番号が正か要確認（コード未変更）。
- `/reservation/` と `/top/reservation/` は同一 `ReservationPage.astro` を描画し、`fixedPages.ts` の別定義（見学希望select等）が未使用。意図的統合か要確認（崩れではないため未変更）。

## バッチ3修正記録（情報・旧URL・抽出流し込みページ群）

`fixed-source`（Elementor抽出流し込み）13ページを一括キャプチャし、`scrollWidth-clientWidth` で横スクロール、配色smellをスクリプト検出。崩れは2ページの横スクロールと1ページの配色のみ。残り10ページは横スクロールなし・ブランド外色なしを確認。

### `/information-faq/` 私立医学部Q&A — 完了
- 問題: Q&A見出し・強調pがブランド外のホットピンク赤 `#ff005d`（本番ベースラインに該当色なし=staging由来）。
- 修正: `#ff005d` → `var(--red)`（2箇所, pages.css:2842/2867）。
- 確認: desktop/mobile OK、横スクロールなし、テーブル/情報量は不変。

### `/english-training/` 英語トレーニング旧 — 完了（横スクロール）
- 問題: `.elementor-widget-image img` に `max-width: none` が指定され、`attachment-large`画像が原寸800pxで描画 → **desktop +117 / mobile +410** の横スクロール。固定幅 `width:800px` のロゴ枠も。
- 修正: `max-width: none` → `max-width: 100%; height: auto`（pages.css:369）／ロゴ枠 `width:800px` → `min(800px, 100%)`。
- 確認: desktop/mobile とも横スクロール解消、画像はビューポート内に収まる。

### `/top/summer-plan/` 夏期プラン — 完了（横スクロール）
- 問題: Elementorカルーセルの送り矢印（`.elementor-swiper-button`）が `left/right: -270px` で外側配置、さらにメインswiperの矢印が `right:-32px` かつ位置指定の祖先が無く `offsetParent=body` → 矢印がビューポート外（desktop +270 / mobile +32）。静的抽出のためSwiperの `position:relative/overflow` が効かずトラックも未包含。
- 修正: 矢印を内側（`left/right: 8px`）へ／swiper系コンテナ（`.e-n-carousel/.elementor-main-swiper/.swiper` 等）に `position: relative; max-width:100%; overflow:hidden`／ページmainに `overflow-x: clip`。
- 確認: desktop/mobile とも横スクロール解消、カルーセル表示・各CTAは正常。

### 横スクロール・配色とも問題なしを確認（10ページ, fixed-source）
`/top/information-kokuritsu/`, `/top/information-shiritsu/`, `/kuriage-information/`, `/medical-math-training/`, `/study-support-system/`, `/results/`(旧), `/voice/`(旧), `/todai-keio-med-special/`, `/top/line/`, `/past-post/`

## バッチ4修正記録（実機で発覚したレイアウト崩れ — ユーザー指摘）

**重要な学び**: `scrollWidth`/配色hexだけのトリアージでは「レイアウト崩壊（カラム潰れ・要素非表示）」を見逃す。実機（staging）でユーザーが見て初めて発覚。以後、フルページ・スクリーンショットの目視を必須とする。

### `/top/history/` — 完了（最重要バグ）
- 問題: 沿革タイムライン（1989〜2024の全14項目＝ページの主要コンテンツ）が `.history-timeline .content { display:none }` で**完全非表示**にされ、代わりに `.history-timeline::after { height:4300px }`（モバイルは4200px）の**巨大な空白**が挿入されていた。タイムライン本体のCSS・コンテンツは完全に揃っており、隠蔽ハックの取り残しと判断。
- 修正: 隠蔽3ルールを削除。タイムラインが desktop/mobile とも正常描画（赤い年マーカー＋接続線＋カード）。
- 確認: PC/mobile OK。

### `/study-support-system/`, `/top/information-kokuritsu/`, `/medical-math-training/` — 完了（カラム潰れ）
- 問題: ページ固有CSSが0件で、base `.fixed-source` の `.e-con-inner{display:flex;flex-wrap:wrap}` ＋ 各widget `flex:1 1 300px` により、**縦積みのはずのコンテンツが横3カラム364pxに潰れ／spacerに半分占有され**、左寄せ・右側大量空白の崩壊。
- 修正: 再利用クラス `.fixed-page--unstack` を新設（`pages.css`）＋ `[...slug].astro` で対象パスに付与。各コンテナを縦積み（`flex-direction:column`）・1カラム中央寄せ（max 860px）・spacer高さclampで是正。
- 確認: 3ページとも desktop/mobile で中央1カラムの可読レイアウトに。

### `/kuriage-information/` — 完了（壊れたElementorギャラリー）
- 問題: ページ中央に巨大な空白。原因は繰り上げ合格者数の26枚のデータ画像が `.elementor-gallery`（Elementorギャラリー）に入っており、抽出時の `style=` 一括除去で各タイルの `background-image` が消え、空タイルの羅列＝空白になっていた（画像URLは親 `<a href>` に残存）。
- 修正: `fixedPageSource.ts` に `restoreGalleryImages` 変換を追加し、`<a href>` から `<img>` を復元（style除去の前段）。さらに base CSS で `.elementor-gallery__container` を responsive grid 化（JS非依存）。**ギャラリーを持つ fixed-source 9ページ全てに有効**。
- 確認: 26枚のデータ画像がグリッド表示、空白解消。

### `/top/information-shiritsu/` — 対応中
- 上部（見出し・画像・ボタン）は49個の固有ルールで正常。私立医学部リンク一覧が長い1カラムで冗長 → グリッド化を検討中。

## 次の候補（未トリアージ）
- 既に第一視＋スクリプト検査で「問題なし」とした重点ページ（results/teacher/lexus-premier/lexus-garden/history/faq/entrance/medical-english-training）の全コンテナ精査（任意）。
- 特商法ページ（パーセントエンコードURL）の崩れのみ確認。
- `[...slug]` 生成の投稿系ページ群（記事テンプレート）の精査（`ArticleLayout` 単位）。
