# Production deployment guide

作成日: 2026-06-24  
更新日: 2026-06-25

対象: LEXUS 教育センター Astro 静的サイトを Cloudflare Pages に公開するための案内書。  
この文書は実行手順の整理であり、本番 Pages デプロイ、Pages custom domain 切り替え、環境変数登録、外部サービス作成はまだ行っていない。

## 現状サマリー

| 項目 | 現状 |
|---|---|
| プロジェクトルート | `C:\---hp` |
| フロントエンド | `C:\---hp\frontend` |
| GitHub repository | `https://github.com/phybose1012-svg/lexus-ec-site.git` |
| Git branch | `main` = production, `staging` = 社長確認用 preview |
| Framework | Astro 5 系の static site |
| Astro output | `output: "static"` |
| Astro site | `https://lexus-ec.com` |
| ローカル開発 URL | `http://127.0.0.1:4321/` |
| ローカル build command | `npm.cmd run build` |
| Cloudflare Pages build command | `npm run build` |
| build output | `frontend/dist` |
| Cloudflare Pages 上の output directory | `dist`。`Root directory` を `frontend` にするため |
| build 確認 | 2026-06-25 に `npm.cmd run build` 成功。Astro check は 0 errors / 0 warnings、564 pages built |
| Cloudflare DNS | `lexus-ec.com` zone active。nameserver は `brad.ns.cloudflare.com`, `dee.ns.cloudflare.com` |
| Cloudflare Pages project | 未作成 |
| フォーム送信 endpoint | `PUBLIC_FORM_ENDPOINT` 未設定時は `/form-submit/` 表示だが、`data-local-form="pending"` により送信は保留表示で止まる |
| Pages Functions | 未実装 |
| `_headers` / `_redirects` | 未作成 |
| `robots.txt` / `sitemap.xml` | 未作成 |
| custom 404 | 未作成 |

注意: Cloudflare Pages の build 環境は Linux なので、Windows 専用の `npm.cmd run build` は使わない。Cloudflare dashboard には `npm run build` を設定する。

補足: `Root directory` を空欄のままリポジトリルートで build する構成も可能だが、その場合は build command や output directory を `frontend` 前提に調整する必要がある。誤設定を避けるため、このプロジェクトでは `Root directory=frontend` を推奨する。

## Cloudflare Pages 推奨設定

| Cloudflare 画面項目 | 推奨値 | 補足 |
|---|---|---|
| Project name | `lexus-ec` | `lexus-ec.pages.dev` を取りたい。使用済みなら `lexus-ec-frontend` などに変更 |
| Production branch | `main` | GitHub へ push 済み |
| Framework preset | `Astro` | Cloudflare 公式の Astro preset は `npm run build` / `dist` |
| Root directory | `frontend` | monorepo 形なので、Pages の root を Astro プロジェクトに合わせる |
| Build command | `npm run build` | Cloudflare 用。ローカル Windows では `npm.cmd run build` |
| Build output directory | `dist` | `frontend/dist` ではなく、root directory からの相対パス |
| Build system / image | v3 推奨 | 2026-06 時点の Pages build image v3 は Node.js 22.16.0 が既定 |
| Node.js version | `NODE_VERSION=22.16.0` | 既定に任せても動くが、初回公開では固定推奨 |
| Install command | 空欄または既定 | `package-lock.json` があるため通常は npm install 系が自動で走る想定 |
| Environment variables: 初回静的公開 | `NODE_VERSION=22.16.0` のみ | フォームをまだ送信しない場合。フォームは保留メッセージになる |
| Environment variables: フォーム有効化時 | `NODE_VERSION=22.16.0`, `PUBLIC_FORM_ENDPOINT=/form-submit/` | `PUBLIC_FORM_ENDPOINT` を入れないと pending script が送信を止める |

Cloudflare 公式ドキュメント確認日: 2026-06-25

- Astro guide: https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/
- Build configuration: https://developers.cloudflare.com/pages/configuration/build-configuration/
- Build image: https://developers.cloudflare.com/pages/configuration/build-image/
- Custom domains: https://developers.cloudflare.com/pages/configuration/custom-domains/
- Preview deployments: https://developers.cloudflare.com/pages/configuration/preview-deployments/
- Branch deployment controls: https://developers.cloudflare.com/pages/configuration/branch-build-controls/
- Add a custom domain to a branch: https://developers.cloudflare.com/pages/how-to/custom-branch-aliases/
- Redirects: https://developers.cloudflare.com/pages/configuration/redirects/
- Headers: https://developers.cloudflare.com/pages/configuration/headers/
- Pages Functions: https://developers.cloudflare.com/pages/functions/
- Functions bindings / variables / secrets: https://developers.cloudflare.com/pages/functions/bindings/
- Cloudflare Access self-hosted apps: https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/self-hosted-public-app/

## 三段構えの推奨運用

可能。構成は「ローカル開発 → 限定公開の社内確認環境 → 本番」の 3 段にする。

| 段階 | 目的 | 推奨 URL | 更新方法 | 閲覧制限 |
|---|---|---|---|---|
| Local | 実装・一次確認 | `http://127.0.0.1:4321/` | `npm.cmd run dev` | この PC のみ |
| Staging / 社長確認 | 本番に近い限定公開確認 | `staging.lexus-ec.com` または `staging.lexus-ec.pages.dev` | `staging` branch に push | Cloudflare Access でメール認証 |
| Production | 一般公開 | `https://lexus-ec.com/` | `main` branch に merge / push | 公開 |

### 推奨ブランチ

| Branch | 役割 | Cloudflare Pages environment |
|---|---|---|
| `work/*` または任意の作業 branch | Codex / ローカル作業 | Preview を自動生成するかは任意 |
| `staging` | 社長確認用の固定 preview | Preview |
| `main` | 本番 | Production |

### 推奨構成 A: 1 つの Pages project で運用

最初の候補。Cloudflare Pages の production branch を `main`、preview branch を `staging` にする。

流れ:

1. ローカルで `npm.cmd run build` まで確認する。
2. 作業内容を `staging` branch に入れる。
3. Cloudflare Pages が preview deployment を作る。
4. 社長は `staging.<project>.pages.dev`、または branch custom domain の `staging.lexus-ec.com` を見る。
5. OK が出たら `staging` から `main` に merge して production deploy。

利点:

- Pages project が 1 つで済む。
- build 設定が本番と staging で揃いやすい。
- Cloudflare Pages は branch alias を作るため、`staging.<project>.pages.dev` を固定確認 URL として使える。

注意:

- Cloudflare Pages の preview access policy は preview deployment を保護できるが、`*.pages.dev` 本体や custom domain まで同時に保護する場合は Cloudflare Access の設定範囲を別途確認する。
- `staging.lexus-ec.com` のような custom domain を branch に割り当てる場合、Cloudflare の proxied DNS record が必要。外部 DNS または unproxied record では production branch に向く可能性がある。

### 推奨構成 B: Staging と Production を別 Pages project に分ける

権限や事故防止を強くしたい場合の候補。

| Project | URL | branch | 用途 |
|---|---|---|---|
| `lexus-ec-staging` | `staging.lexus-ec.com` | `staging` | 社長確認 |
| `lexus-ec` | `lexus-ec.com` | `main` | 本番 |

利点:

- staging と production の環境変数、Functions、Access policy を分離できる。
- 本番 custom domain への誤反映リスクを下げられる。

注意:

- Pages project が 2 つになり、設定の同期管理が必要。
- staging と production の build command / output directory / Node.js version を必ず同じにする。

### このプロジェクトでの暫定推奨

初期は構成 A を推奨する。

```text
Local:      http://127.0.0.1:4321/
Staging:    staging.lexus-ec.com
Production: https://lexus-ec.com/
```

理由:

- 現状は Astro static site で、staging / production の差分が少ない。
- Cloudflare Pages の preview branch と branch alias が用途に合う。
- 社長確認 URL は固定した方が運用しやすい。

本番操作前の確認事項:

1. `staging.lexus-ec.com` を使ってよいか。
2. 社長確認環境は Cloudflare Access のメール認証でよいか。
3. 許可するメールアドレス。例: 社長、担当者、制作チーム。
4. staging でもフォーム送信を実送信するか、送信先をテスト用に分けるか。
5. production 反映は `staging` → `main` merge を承認制にするか。

## 初回デプロイ手順

1. GitHub repository `phybose1012-svg/lexus-ec-site` と production branch `main` は確定済み。
2. Cloudflare dashboard で `Workers & Pages` → `Create application` → `Pages` → `Connect to Git` を選ぶ。
3. 対象リポジトリを選び、上記の Pages 推奨設定を入力する。
4. 初回はフォーム backend を未実装のまま静的公開するなら、`PUBLIC_FORM_ENDPOINT` は設定しない。
5. フォームも同時に有効化するなら、先に `frontend/functions/form-submit.ts` などの Pages Function を実装し、`PUBLIC_FORM_ENDPOINT=/form-submit/` を production / preview 両方に設定する。
6. `Save and Deploy` を押す前に、設定値をユーザー確認する。
7. Preview URL または `*.pages.dev` で主要ページを確認する。
8. 問題がなければ custom domain 設定に進む。

## カスタムドメイン設定手順

対象候補:

| Domain | 用途 | 推奨 |
|---|---|---|
| `lexus-ec.com` | 本番 apex domain | primary |
| `www.lexus-ec.com` | www alias | apex へ 301 redirect するか、同じ Pages project に割り当てる。要確認 |

手順:

1. Cloudflare dashboard で対象 Pages project を開く。
2. `Custom domains` → `Set up a domain` を選ぶ。
3. `lexus-ec.com` を追加する。
4. `www.lexus-ec.com` も使う場合は別途追加する。
5. 証明書発行と domain active を待つ。
6. `*.pages.dev` のアクセスをどう扱うか決める。公開後は custom domain へ redirect する方針が望ましい。

注意:

- apex domain を Pages に向ける場合、Cloudflare docs では domain を Cloudflare zone として扱い、nameserver を Cloudflare に向ける手順が前提。
- subdomain のみなら外部 DNS でも CNAME で運用できるが、apex `lexus-ec.com` は DNS provider 側の制約を確認する。
- CAA record がある場合、Cloudflare の証明書発行が失敗することがあるため要確認。

## DNS 切り替え手順

実行前に必ず現在の DNS / 既存 WordPress / メール関連 record を棚卸しする。

| Record | 推奨設定 | 実行前確認 |
|---|---|---|
| `lexus-ec.com` | Cloudflare Pages が作る CNAME/flattened CNAME を使用 | 現在の A/AAAA/CNAME、既存 origin、TTL |
| `www.lexus-ec.com` | `lexus-ec.pages.dev` への CNAME、または Pages custom domain 自動追加 | www を使うか、apex へ redirect するか |
| MX | 既存維持 | メール停止を避けるため触らない |
| TXT/SPF/DKIM/DMARC | 既存維持 | メール通知 provider 追加時のみ追記 |
| CAA | Cloudflare 証明書発行を許可 | 既存 CAA の有無 |

切り替えの進め方:

1. 現 DNS record を export / screenshot で保存する。
2. TTL を短くできる provider なら、切り替え前に短縮する。
3. Pages preview で build、主要ページ、フォーム挙動を確認する。
4. Cloudflare Pages の custom domain を追加し、証明書が active になるまで待つ。
5. DNS を Pages に向ける。
6. `https://lexus-ec.com/`, `https://www.lexus-ec.com/` の 200 / 301 / TLS / canonical を確認する。
7. 問題が出た場合に戻せるよう、旧 origin 情報を保持しておく。

## 404 / redirects / headers / caching

現状は `_redirects`, `_headers`, custom 404 が未作成。

推奨方針:

| 項目 | 最小構成 | 将来対応 |
|---|---|---|
| 404 | Cloudflare Pages default 404 のまま初回公開可 | `frontend/src/pages/404.astro` を追加し、`dist/404.html` を生成 |
| redirects | 既存 URL 棚卸し完了まで追加しない | `frontend/public/_redirects` に旧 URL から新 URL の 301 を定義 |
| headers | 初回は Cloudflare default で可 | `frontend/public/_headers` で security headers と hashed asset cache を設定 |
| caching | Pages default で可 | `/_astro/*` は長期 cache、HTML は短め cache を検討 |

注意:

- Cloudflare Pages の `_redirects` と `_headers` は、Astro では `frontend/public/` に置くのが基本。build 後に `dist` へコピーされる。
- Pages Functions が応答する route には `_headers` / `_redirects` がそのまま効かないため、Functions 側で header / redirect を実装する必要がある。
- 既存 WordPress 由来の URL が多いため、301 は URL 棚卸し後に追加する。

## sitemap / robots / canonical の注意点

現状:

- `astro.config.mjs` の `site` は `https://lexus-ec.com`。
- 多くのページで canonical は `https://lexus-ec.com/...` に固定。
- `BaseLayout.astro` には `meta name="robots" content="max-image-preview:large"` がある。
- `robots.txt` と `sitemap.xml` は source / dist ともに未確認。

公開前の推奨:

1. `robots.txt` を作るか、既存 WordPress の robots 方針を移植する。
2. `sitemap.xml` を生成する。Astro なら `@astrojs/sitemap` 追加が候補。
3. `*.pages.dev` preview を index させない方針を決める。必要なら Cloudflare Access、Bulk Redirect、または header 方針を検討する。
4. custom domain 公開後に canonical が `https://lexus-ec.com/...` で揃っているか確認する。
5. 旧 WordPress URL から移行したページは、200 / 301 / 404 の意図を URL 単位で監査する。

## フォーム / バックエンド方針

### 静的サイトだけで完結する箇所

通常ページ、記事ページ、固定ページ、画像/CSS/JS 配信は Cloudflare Pages の静的配信だけで公開できる。

### バックエンドが必要な箇所

実送信が必要なフォームは backend が必要。

検出済みフォーム:

| Path | formType | 現状 |
|---|---|---|
| `/request-documents/` | `request-documents` | `PUBLIC_FORM_ENDPOINT` 未設定時は pending 表示 |
| `/reservation/` | `reservation` | 同上 |
| `/top/reservation/` | `reservation` | 同上 |
| `/top/contact/` | `contact` | 同上 |
| `/test-entry/` | `test-entry` | LeadForm 経由。同上 |
| `/lexus-online/contact/` | `lexus-online-contact` | 独自 local pending 属性あり。実装時に確認対象 |

### 最小構成案

Cloudflare Pages Functions を同じ Pages project に追加する。

推奨 route:

```text
frontend/functions/form-submit.ts
```

期待する動作:

1. `POST /form-submit/` のみ受け付ける。
2. `FormData` を parse する。
3. `formType` を allowlist で検証する。
4. 必須項目、メール形式、本文長、電話番号長を検証する。
5. Turnstile または honeypot / rate limit で spam を抑える。
6. 通知メールを送る。
7. 必要なら Google Sheets / D1 / CRM webhook に保存する。
8. 成功時は thank-you page へ 303 redirect、または HTML response を返す。

重要:

- 現在の Astro は `PUBLIC_FORM_ENDPOINT` が未設定だと `data-local-form="pending"` を付け、ブラウザ上で submit を止める。
- Pages Function を作るだけではフォームは送信されない。
- フォーム有効化時は Cloudflare Pages の environment variables に `PUBLIC_FORM_ENDPOINT=/form-submit/` を設定して再デプロイする。

### 将来拡張案

| 要件 | 候補 |
|---|---|
| メール通知 | Resend / SendGrid / Amazon SES などの transactional email API |
| スプレッドシート保存 | Google Apps Script webhook、または Google Sheets API |
| DB 保存 | Cloudflare D1。PII 保持期間と閲覧権限を決める |
| 添付ファイル | Cloudflare R2。フォームに file input を追加する場合のみ |
| CRM 連携 | HubSpot / Salesforce / kintone 等の webhook/API |
| 再送・非同期処理 | Cloudflare Queues |
| spam 対策 | Cloudflare Turnstile、IP rate limit、honeypot |
| 管理画面 | Cloudflare Access + Workers/Pages Functions |

### 必要な環境変数

初回静的公開:

| Name | 種別 | 値 | 備考 |
|---|---|---|---|
| `NODE_VERSION` | Build variable | `22.16.0` | Pages build を固定 |

フォーム有効化時:

| Name | 種別 | 値 | 備考 |
|---|---|---|---|
| `PUBLIC_FORM_ENDPOINT` | Build variable | `/form-submit/` | client HTML に埋め込まれる。秘密情報不可 |
| `FORM_NOTIFICATION_TO` | Runtime variable | 要確認 | 受信先メール |
| `FORM_NOTIFICATION_FROM` | Runtime variable | 要確認 | provider 側で認証済み domain を推奨 |
| `RESEND_API_KEY` または `SENDGRID_API_KEY` | Secret | 要発行 | 使用 provider 決定後。暗号化 secret にする |
| `TURNSTILE_SECRET_KEY` | Secret | 要発行 | Turnstile を使う場合 |
| `PUBLIC_TURNSTILE_SITE_KEY` | Build variable | 要発行 | client に出る公開 key |
| `GOOGLE_SHEETS_WEBHOOK_URL` | Secret | 要確認 | Sheets 保存を使う場合。公開しない |
| `CRM_WEBHOOK_URL` | Secret | 要確認 | CRM 連携を使う場合。公開しない |

### セキュリティ注意点

- `PUBLIC_` prefix の環境変数は client に露出する。API key、webhook URL、認証 token は入れない。
- フォーム内容は個人情報を含む。保存先、閲覧権限、保持期間、削除手順を先に決める。
- Runtime secret は Cloudflare dashboard の `Variables and Secrets` で `Encrypt` して保存する。
- Functions では `Origin` / `Referer` の確認、method 制限、content length 制限、allowlist validation を行う。
- ログに氏名、電話番号、メール、相談内容を丸ごと出さない。
- メール provider を使う場合は SPF/DKIM/DMARC の DNS 追加が必要になる可能性がある。既存メール運用を壊さないよう、追加 record は事前確認する。

## 本番公開前チェックリスト

| Check | 内容 | 状態 |
|---|---|---|
| build | `cd frontend; npm.cmd run build` | 2026-06-24 成功 |
| Pages preview | `*.pages.dev` で主要ページを確認 | 未実施 |
| 主要ページ | `/`, `/request-documents/`, `/reservation/`, `/top/contact/`, `/top/reservation/`, `/top/access/`, `/top/course/`, `/top/voice/`, `/lexus-online/` | 未実施 |
| 404 | 存在しない URL の status と見た目 | custom 404 未作成 |
| canonical | custom domain 上で `https://lexus-ec.com/...` に揃うか | 要確認 |
| robots | `robots.txt` の有無と index 方針 | 未作成 |
| sitemap | `sitemap.xml` の有無と URL 集合 | 未作成 |
| 外部リクエスト | Google accounts、Google docs support、LINE、地図/動画等の意図確認 | 要確認 |
| フォーム送信 | pending のまま公開するか、Functions で有効化するか | 要確認 |
| mobile 表示 | 主要導線を 390px 幅前後で確認 | 別セッションのデザイン確認に依存 |
| DNS | apex / www / MX / TXT / CAA の棚卸し | 未実施 |
| SSL | custom domain active、証明書エラーなし | 未実施 |
| rollback | 旧 origin / DNS record を戻せる状態 | 未準備 |

## ユーザーに確認すべき事項

1. Cloudflare アカウントと zone 管理権限を誰が持つか。
2. `lexus-ec.com` の現在の DNS provider / registrar / nameserver。
3. 本番 branch は `main` でよいか。
4. Pages project name は `lexus-ec` でよいか。使用済みの場合の代替名。
5. `www.lexus-ec.com` を使うか、apex `lexus-ec.com` に 301 redirect するか。
6. 初回公開でフォームを pending のままにするか、フォーム backend 実装後に公開するか。
7. フォーム通知メールの受信先。
8. フォーム送信内容をメールだけにするか、Sheets / CRM / DB にも保存するか。
9. 利用するメール送信 provider。Resend / SendGrid / SES など。
10. Turnstile を初回から入れるか。
11. 旧 WordPress をいつまで fallback / rollback 用に保持するか。
12. `robots.txt` / `sitemap.xml` の公開方針。

## 次に実行する具体手順

ユーザー確認後に進める順番:

1. production branch、Cloudflare account、domain/DNS 管理者を確定する。
2. 初回公開方式を決める。
   - A: 静的サイトだけ先に Pages へ公開し、フォームは pending 表示のまま。
   - B: Pages Functions の `POST /form-submit/` を実装してから公開。
3. A の場合、Cloudflare Pages project を推奨設定で作り、preview を確認する。
4. B の場合、先に Functions、通知 provider、必要 secret、`PUBLIC_FORM_ENDPOINT=/form-submit/` を実装・設定し、preview でフォーム送信を確認する。
5. `robots.txt`, `sitemap.xml`, 404, redirects, headers の追加要否を決める。
6. custom domain を Pages に追加する。
7. DNS 切り替え前の record を保存し、ユーザー確認後に切り替える。
8. 切り替え後、主要ページ、canonical、フォーム、TLS、www/apex redirect、404 を確認する。
