# Form backend setup guide

作成日: 2026-06-25

対象: LEXUS EC のフォーム送信を Cloudflare Pages Functions で受け、メール通知、Google スプレッドシート保存、Slack 通知へ連携する。

## 現在の実装

| 項目 | 内容 |
|---|---|
| Endpoint | `/form-submit/` |
| 実装ファイル | `frontend/functions/form-submit.ts` |
| Functions route 制限 | `frontend/public/_routes.json` で `/form-submit` と `/form-submit/` のみに限定 |
| 送信先 | email, Google Sheets webhook, Slack webhook |
| 既定の必須送信先 | `email,sheets,slack` |
| フォーム有効化 | Cloudflare Pages に `PUBLIC_FORM_ENDPOINT=/form-submit/` を設定して再デプロイ |

## Cloudflare Pages に追加する環境変数

Build variable:

| Name | 値 |
|---|---|
| `PUBLIC_FORM_ENDPOINT` | `/form-submit/` |

Runtime secrets / variables:

| Name | 種別 | 値 |
|---|---|---|
| `FORM_NOTIFICATION_TO` | variable | 通知先メール。複数の場合はカンマ区切り |
| `FORM_NOTIFICATION_FROM` | variable | 送信元メール。Resend / SendGrid で認証済みのアドレス |
| `RESEND_API_KEY` | secret | Resend を使う場合 |
| `SENDGRID_API_KEY` | secret | SendGrid を使う場合。Resend とどちらか一方でよい |
| `GOOGLE_SHEETS_WEBHOOK_URL` | secret | Google Apps Script の Web app URL |
| `GOOGLE_SHEETS_WEBHOOK_SECRET` | secret | Apps Script と照合する共有 secret |
| `SLACK_WEBHOOK_URL` | secret | Slack Incoming Webhook URL |
| `FORM_ALLOWED_ORIGINS` | variable | 必要時のみ。例: `https://lexus-ec.com,https://staging.lexus-ec.pages.dev` |
| `FORM_REQUIRED_DESTINATIONS` | variable | 既定は `email,sheets,slack` |

## Google Apps Script 側の受け口

スプレッドシートに Apps Script を追加し、以下のような `doPost` を Web app としてデプロイする。

```js
const EXPECTED_SECRET = PropertiesService.getScriptProperties().getProperty("LEXUS_FORM_SECRET");

function doPost(e) {
  const payload = JSON.parse(e.postData.contents);
  if (!payload || payload.secret !== EXPECTED_SECRET) {
    return ContentService.createTextOutput("forbidden").setMimeType(ContentService.MimeType.TEXT);
  }

  const submission = payload.submission;
  const fields = submission.fields || {};
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("form_submissions")
    || SpreadsheetApp.getActiveSpreadsheet().insertSheet("form_submissions");

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["受付日時", "受付ID", "フォーム種別", "送信元", "名前", "メール", "電話", "内容", "JSON"]);
  }

  sheet.appendRow([
    submission.submittedAt,
    submission.id,
    submission.formLabel,
    submission.pageUrl,
    fields.name || "",
    fields.email || "",
    fields.tel || "",
    fields.message || fields.requestType || "",
    JSON.stringify(submission),
  ]);

  return ContentService.createTextOutput("ok").setMimeType(ContentService.MimeType.TEXT);
}
```

## Slack 側の受け口

Slack App の Incoming Webhooks を有効にし、通知したいチャンネル用の Webhook URL を `SLACK_WEBHOOK_URL` に登録する。

## 注意点

- `PUBLIC_` で始まる値はブラウザに出る。API key や Webhook URL は入れない。
- `PUBLIC_FORM_ENDPOINT` を入れると、全フォームが実送信モードになる。必ず staging でテストしてから production に入れる。
- メール送信元 domain の SPF / DKIM / DMARC 設定が必要になる場合がある。既存メール DNS を壊さないよう、DNS 追加前に確認する。
- Sheets / Slack / Email のどれかが失敗すると、フォームは失敗表示を返す。部分送信が起きた場合は受付IDで重複確認する。
