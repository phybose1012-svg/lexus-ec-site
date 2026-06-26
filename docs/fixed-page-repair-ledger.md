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

## 発見した別ページの課題（未対応・次の候補）

- 現状なし（トリアージ済みの重点11ページで未対応の明確な崩れは解消）。次はコース詳細各ページ／フォーム系／情報ページ群を順次トリアージ予定。
