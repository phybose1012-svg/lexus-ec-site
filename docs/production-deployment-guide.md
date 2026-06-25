# Production deployment guide

作成日: 2026-06-24  
更新日: 2026-06-25

対象: LEXUS 教育センター Astro 静的サイトを Cloudflare Pages に公開し、ローカル / staging / production の三段構えで運用するための案内書。

この文書は実行手順と判断材料の整理である。production custom domain 切り替え、DNS 変更、外部サービス作成、API キー発行、環境変数追加は、ユーザー確認後に行う。

## 現状サマリー

| 項目 | 現状 |
|---|---|
| プロジェクトルート | `C:\---hp` |
| フロントエンド | `C:\---hp\frontend` |
| GitHub repository | `https://github.com/phybose1012-svg/lexus-ec-site.git` |
| Branch | `staging` = 社長確認用、`main` = 本番 |
| Framework | Astro static site |
| Local dev URL | `http://127.0.0.1:4321/` |
| Local build command | `npm.cmd run build` |
| Cloudflare Pages project | `lexus-ec` |
| Staging URL | `https://staging.lexus-ec.pages.dev/` |
| Production URL | `https://lexus-ec.com/` 予定。まだ Pages へ切り替えていない |
| Cloudflare DNS | `lexus-ec.com` は Cloudflare 管理中 |
| Nameserver | `brad.ns.cloudflare.com`, `dee.ns.cloudflare.com` |
| 既存アプリ用 DNS | `front2026`, `bento-request`, `front2026.prt`, `ocean-5` は復旧済み。Base44 / Render 系は DNS only |
| GA4 | 既存 Measurement ID `G-3VC4WYYD01` を使用 |
| GA4 の発火条件 | Cloudflare Pages の `main` branch のみ。staging / local では発火しない |
| robots / sitemap | 実装済み。staging で `robots.txt` と `sitemap.xml` の返却を確認済み |
| Staging の検索除外 | `x-robots-tag: noindex` を確認済み |
| フォーム送信 | Pages Functions の受け口は実装済み。外部送信先と環境変数は未設定 |

## Cloudflare Pages 推奨設定

| Cloudflare 画面項目 | 設定値 | 状態 |
|---|---|---|
| Project name | `lexus-ec` | 設定済み |
| Production branch | `main` | 設定済み |
| Framework preset | `Astro` | 設定済み |
| Root directory | `frontend` | 設定済み |
| Build command | `npm run build` | 設定済み |
| Build output directory | `dist` | 設定済み |
| Build system version | Version 3 | 設定済み |
| Node.js version | Cloudflare 既定で `22.16.0` を確認 | build log で確認済み |
| Auto deploy | 有効 | `staging` push で preview deploy |
| Deploy hooks | `manual-main`, `manual-staging` | 作成済み。URL は公開管理しない |

Cloudflare の Variables & Secrets:

| Name | 値 | 用途 | 状態 |
|---|---|---|---|
| `PUBLIC_GA_MEASUREMENT_ID` | `G-3VC4WYYD01` | GA4 Measurement ID | 設定済み |
| `PUBLIC_ANALYTICS_BRANCH` | 未設定 | GA を発火する branch。未設定時は `main` | 任意 |
| `PUBLIC_ANALYTICS_HOSTNAMES` | 未設定 | GA を許可する hostname。未設定時は `lexus-ec.com,www.lexus-ec.com` | 任意 |
| `PUBLIC_FORM_ENDPOINT` | 未設定 | フォーム送信 endpoint。設定値は `/form-submit/` | 外部送信先設定後に追加 |

直近の Cloudflare 画面では `Value=22.16.0` という不要な環境変数が見えていた。これは Node.js version 固定には使われない。build は Cloudflare 既定の Node.js 22.16.0 で成功しているため緊急対応は不要だが、後で削除してよい。

## 三段構えの運用

| 段階 | URL | 用途 | 更新方法 | 検索エンジン |
|---|---|---|---|---|
| Local | `http://127.0.0.1:4321/` | 制作・一次確認 | ローカル作業 | 公開されない |
| Staging | `https://staging.lexus-ec.pages.dev/` | 社長確認・本番前確認 | `staging` branch へ push | `noindex`。URL を知っている人だけが閲覧 |
| Production | `https://lexus-ec.com/` | 一般公開 | `main` branch へ merge / push | index 対象 |

Staging は Cloudflare Access のメールコード認証を外し、URL を知っている人のみが見られる状態にした。検索対策として、Cloudflare 側で `x-robots-tag: noindex` が返ることを確認済み。

## 初回デプロイ手順

すでに `staging` までは進行済み。

1. ローカルで `npm.cmd run build` を実行する。
2. 成功した変更だけを `staging` branch に反映する。
3. Cloudflare Pages の `staging` preview deploy を待つ。
4. `https://staging.lexus-ec.pages.dev/` で主要ページを確認する。
5. 社長確認で OK が出たら、`staging` を `main` に merge / push する。
6. production deploy が成功したことを確認する。
7. production custom domain の切り替えは、DNS 変更前チェック後に実施する。

本番反映は `main` への反映がトリガーになる。production custom domain の DNS 切り替えはまだ実行しない。

## カスタムドメイン設定手順

対象:

| Domain | 用途 | 方針 |
|---|---|---|
| `lexus-ec.com` | 本番 apex | Cloudflare Pages production に割り当て予定 |
| `www.lexus-ec.com` | www alias | apex へ 301 redirect、または Pages に同時割り当て。要確認 |

手順:

1. Cloudflare Pages project `lexus-ec` を開く。
2. `カスタム ドメイン` で `lexus-ec.com` を追加する。
3. 必要なら `www.lexus-ec.com` も追加する。
4. Cloudflare が提示する DNS / 証明書状態を確認する。
5. 既存 A record を Pages 向けに切り替える前に、メール系と既存アプリ系 DNS が維持されていることを確認する。
6. ユーザー承認後に切り替える。

## DNS 切り替え手順

現在の `lexus-ec.com` zone では、ホームページ以外のアプリも同じドメイン配下にある。DNS を触ると別アプリが止まるため、production 切り替え時は以下を必ず確認する。

| 種別 | 確認対象 | 方針 |
|---|---|---|
| Apex | `lexus-ec.com` | Pages custom domain 用に切り替える候補 |
| www | `www.lexus-ec.com` | redirect 方針を決めてから追加 |
| Base44 / Render 系 | `front2026`, `bento-request`, `front2026.prt`, `ocean-5` | CNAME `base44.onrender.com`、DNS only 維持 |
| Mail | `mail`, `MX`, `TXT/SPF`, Google verification | 既存維持。メール停止を避けるため変更しない |
| FTP | `ftp` | 使用有無を確認。不要でも即削除しない |

DNS 変更前の順番:

1. Cloudflare DNS Records を export / screenshot で保存する。
2. production Pages deploy が成功していることを確認する。
3. `lexus-ec.com` のみ Pages に向ける変更案を作る。
4. 既存アプリ subdomain とメール record は触らない。
5. ユーザー確認後に変更する。
6. 変更後、`dig` / `curl` で apex, www, mail, app subdomain を確認する。

## robots / sitemap / canonical

実装済み:

| ファイル | 役割 |
|---|---|
| `frontend/src/pages/robots.txt.ts` | `robots.txt` を生成 |
| `frontend/src/pages/sitemap.xml.ts` | `sitemap.xml` を生成 |
| `frontend/src/lib/seoRoutes.ts` | 固定ページ、移行記事、生成ページを sitemap に集約 |

確認済み:

| URL | 結果 |
|---|---|
| `https://staging.lexus-ec.pages.dev/robots.txt` | `200 OK`, `Content-Type: text/plain`, `x-robots-tag: noindex` |
| `https://staging.lexus-ec.pages.dev/sitemap.xml` | `200 OK`, `Content-Type: application/xml`, `x-robots-tag: noindex` |

production 公開時の方針:

- `robots.txt` は全体を許可し、sitemap を `https://lexus-ec.com/sitemap.xml` として通知する。
- `sitemap.xml` の URL は production canonical の `https://lexus-ec.com/...` で出力する。
- staging sitemap は Search Console に送信しない。
- Search Console への sitemap 送信は production custom domain が Pages に向いてから行う。

## GA4 / Search Console / AI 分析

GA4 は既存 property を使う。新規 property は作らない。

現在の設定:

| 項目 | 値 |
|---|---|
| GA4 Measurement ID | `G-3VC4WYYD01` |
| Cloudflare env | `PUBLIC_GA_MEASUREMENT_ID=G-3VC4WYYD01` |
| 発火 branch | `main` のみ |
| staging | GA tag 非表示 |
| local | GA tag 非表示 |

production 公開後にやること:

1. GA4 のリアルタイムで `lexus-ec.com` の計測を確認する。
2. Google Search Console に `lexus-ec.com` の Domain property があるか確認する。
3. ない場合は Domain property を追加し、Cloudflare DNS に Google verification TXT を追加する。
4. 確認後、`https://lexus-ec.com/sitemap.xml` を送信する。
5. AI が閲覧する分析基盤は、GA4 Data API / Search Console API の read-only 権限で設計する。ブラウザログイン共有では運用しない。

AI 分析用に後で決める項目:

| 項目 | 要確認 |
|---|---|
| GA4 閲覧権限 | どの Google アカウントに read-only を付与するか |
| Search Console 閲覧権限 | 同上 |
| API 経由分析 | GA4 Data API / Search Console API を使うか |
| レポート出力 | 月次、週次、または改善提案ベース |
| 保存先 | Google Sheets, Markdown report, DB など |

## フォーム / バックエンド方針

静的サイトだけで完結する箇所:

- 通常ページ
- 固定ページ
- 投稿記事ページ
- 画像 / CSS / JS
- sitemap / robots
- GA4 tag の本番限定表示

バックエンドが必要な箇所:

| Path | 用途 | 現状 |
|---|---|---|
| `/request-documents/` | 資料請求 | `/form-submit/` へ送信可能。環境変数未設定時は pending |
| `/reservation/` | 相談 / 予約 | `/form-submit/` へ送信可能。環境変数未設定時は pending |
| `/top/reservation/` | 相談 / 予約 | `/form-submit/` へ送信可能。環境変数未設定時は pending |
| `/top/contact/` | 問い合わせ | `/form-submit/` へ送信可能。環境変数未設定時は pending |
| `/test-entry/` | 体験 / 申し込み系 | `/form-submit/` へ送信可能。環境変数未設定時は pending |
| `/lexus-online/contact/` | Lexus Online 問い合わせ | `/form-submit/` へ送信可能。環境変数未設定時は pending |

### 最小構成案

Cloudflare Pages Functions を使う。

推奨 route:

```text
frontend/functions/form-submit.ts
```

実装済み。Functions の対象 URL は `frontend/public/_routes.json` で `/form-submit` と `/form-submit/` のみに限定している。

処理:

1. `POST /form-submit/` のみ受け付ける。
2. `formType` を allowlist で検証する。
3. 必須項目、メール形式、電話番号、本文長を検証する。
4. honeypot または Cloudflare Turnstile で spam を抑える。
5. メール通知を送る。
6. 必要に応じて Google Sheets / CRM / D1 に保存する。
7. 成功時は thank-you page へ redirect する。

### 将来拡張案

| 要件 | 候補 |
|---|---|
| メール通知 | Resend / SendGrid / Amazon SES |
| スプレッドシート保存 | Google Apps Script webhook / Google Sheets API |
| DB 保存 | Cloudflare D1 |
| 添付ファイル | Cloudflare R2 |
| CRM 連携 | HubSpot / Salesforce / kintone |
| 非同期処理 | Cloudflare Queues |
| spam 対策 | Cloudflare Turnstile / rate limit / honeypot |

### 必要な環境変数

フォーム有効化時:

| Name | 種別 | 値 | 備考 |
|---|---|---|---|
| `PUBLIC_FORM_ENDPOINT` | Build variable | `/form-submit/` | client に出る。秘密情報不可 |
| `FORM_NOTIFICATION_TO` | Runtime variable | 要確認 | 通知先 |
| `FORM_NOTIFICATION_FROM` | Runtime variable | 要確認 | 送信元。認証済み domain 推奨 |
| `RESEND_API_KEY` または `SENDGRID_API_KEY` | Secret | 要発行 | provider 決定後 |
| `TURNSTILE_SECRET_KEY` | Secret | 要発行 | Turnstile 使用時 |
| `PUBLIC_TURNSTILE_SITE_KEY` | Build variable | 要発行 | client に出る |
| `GOOGLE_SHEETS_WEBHOOK_URL` | Secret | 要確認 | Sheets 保存時 |
| `CRM_WEBHOOK_URL` | Secret | 要確認 | CRM 連携時 |

現在の実装で使う主要変数:

| Name | 種別 | 値 | 備考 |
|---|---|---|---|
| `PUBLIC_FORM_ENDPOINT` | Build variable | `/form-submit/` | これを入れるとフォームが実送信モードになる |
| `FORM_NOTIFICATION_TO` | Runtime variable | 要確認 | 通知先メール。複数はカンマ区切り |
| `FORM_NOTIFICATION_FROM` | Runtime variable | 要確認 | Resend / SendGrid で認証済みの送信元 |
| `RESEND_API_KEY` または `SENDGRID_API_KEY` | Secret | 要発行 | どちらか一方 |
| `GOOGLE_SHEETS_WEBHOOK_URL` | Secret | 要作成 | Google Apps Script の Web app URL |
| `GOOGLE_SHEETS_WEBHOOK_SECRET` | Secret | 要作成 | Apps Script と照合する共有 secret |
| `SLACK_WEBHOOK_URL` | Secret | 要作成 | Slack Incoming Webhook URL |
| `FORM_REQUIRED_DESTINATIONS` | Runtime variable | `email,sheets,slack` | 既定値。未設定でも同じ |

### セキュリティ注意点

- `PUBLIC_` 付きの値はブラウザに露出する。API key や webhook URL を入れない。
- フォーム内容は個人情報を含むため、保存先、保持期間、閲覧権限、削除手順を決める。
- Functions のログに氏名、電話番号、メール、本文を丸ごと出さない。
- メール送信 provider を使う場合、SPF / DKIM / DMARC の DNS 追加が必要になる可能性がある。既存メール record を壊さない。
- API / webhook 系 subdomain は原則 DNS only。Cloudflare proxy を有効にする場合は個別検証する。

## 本番公開前チェックリスト

| Check | 状態 |
|---|---|
| `npm.cmd run build` | 成功 |
| Astro check | 0 errors / 0 warnings |
| Cloudflare staging deploy | 成功 |
| staging URL | `https://staging.lexus-ec.pages.dev/` |
| staging noindex | 確認済み |
| GA4 tag | `main` branch のみ発火する実装 |
| robots.txt | 実装・staging 確認済み |
| sitemap.xml | 実装・staging 確認済み |
| canonical | production domain で最終確認が必要 |
| 404 | custom 404 は未作成。必要性を確認 |
| redirects | 旧 URL 棚卸し後に判断 |
| 外部リクエスト | LINE / Google / 動画 / 地図などを production 前に確認 |
| フォーム送信 | Pages Function 実装済み。外部送信先設定と staging 実送信テストが次工程 |
| モバイル表示 | 別セッションのデザイン確認完了後に staging で確認 |
| DNS | 既存アプリとメール record を維持したまま本番切り替えが必要 |
| rollback | DNS record screenshot / export を残してから実施 |

## ユーザーに確認すべき事項

1. production custom domain を Pages に切り替えるタイミング。
2. `www.lexus-ec.com` を使うか、`lexus-ec.com` へ redirect するか。
3. Search Console の `lexus-ec.com` property が既にあるか。
4. Google verification TXT を Cloudflare DNS に追加してよいか。
5. フォーム通知メールの受信先。
6. フォーム送信内容をメールだけにするか、Sheets / CRM / DB にも保存するか。
7. メール送信 provider を何にするか。
8. Turnstile を初回から入れるか。
9. AI 分析用に GA4 / Search Console の read-only 権限をどの Google アカウントへ付与するか。

## 次に実行する具体手順

1. Search Console の現状を確認する。
2. `lexus-ec.com` property がなければ追加し、Google verification TXT を Cloudflare DNS に追加する。
3. production custom domain 切り替え前に、既存 DNS record を再点検する。
4. フォーム backend の最小構成を実装する。
5. staging でフォーム送信、通知メール、spam 対策を確認する。
6. 社長確認後、`main` に反映する。
7. production custom domain を Pages に切り替える。
8. GA4、Search Console sitemap、主要ページ、canonical、フォーム送信を確認する。
