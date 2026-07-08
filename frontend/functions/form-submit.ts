type Env = {
  FORM_ALLOWED_ORIGINS?: string;
  FORM_NOTIFICATION_TO?: string;
  FORM_NOTIFICATION_FROM?: string;
  RESEND_API_KEY?: string;
  SENDGRID_API_KEY?: string;
  GOOGLE_SHEETS_WEBHOOK_URL?: string;
  GOOGLE_SHEETS_WEBHOOK_SECRET?: string;
  SLACK_WEBHOOK_URL?: string;
  FORM_REQUIRED_DESTINATIONS?: string;
};

type FunctionContext = {
  request: Request;
  env: Env;
};

type SubmissionFieldValue = string | string[];

type Submission = {
  id: string;
  submittedAt: string;
  formType: string;
  formLabel: string;
  sourcePath: string;
  pageUrl: string;
  referrer: string;
  fields: Record<string, SubmissionFieldValue>;
};

type Destination = "email" | "sheets" | "slack";

const MAX_BODY_BYTES = 64 * 1024;
const MAX_FIELD_CHARS = 4000;
const MAX_TOTAL_CHARS = 24000;

const formLabels: Record<string, string> = {
  "request-documents": "資料請求",
  reservation: "個別説明会予約",
  contact: "お問い合わせ",
  "test-entry": "選抜テスト申し込み",
  "lexus-online-contact": "Lexus Online お問い合わせ",
};

const baseRequiredFields: Record<string, string[]> = {
  "request-documents": ["name", "email", "tel", "studentType", "postalCode", "address", "privacy"],
  reservation: ["name", "email", "tel"],
  contact: ["name", "email", "message", "privacy"],
  "test-entry": ["name", "email", "tel", "studentType", "preferredDate", "privacy"],
  "lexus-online-contact": ["name", "email", "businessType", "requestType", "message", "privacyConsent"],
};

const fieldLabels: Record<string, string> = {
  formType: "フォーム種別",
  sourcePath: "送信元ページ",
  name: "お名前",
  kana: "よみがな",
  email: "メールアドレス",
  tel: "電話番号",
  studentType: "学年・状況",
  postalCode: "郵便番号",
  address: "住所",
  privacy: "個人情報同意",
  privacyConsent: "同意",
  style: "面談方式",
  participants: "参加人数",
  preferredDate: "希望日",
  preferredDate1: "第一希望日",
  preferredTime1: "第一希望時間",
  preferredDate2: "第二希望日",
  preferredTime2: "第二希望時間",
  gardenVisit: "寮の内見",
  preferredStyle: "希望形式",
  visitTarget: "見学希望",
  targetUniversity: "志望大学",
  message: "内容",
  company: "会社名・教室名",
  businessType: "事業種別",
  requestType: "相談内容",
  budgetRange: "予算感",
  timeline: "希望時期",
  currentTools: "現在使っているツール",
};

const orderedFieldNames = [
  "sourcePath",
  "name",
  "kana",
  "email",
  "tel",
  "studentType",
  "company",
  "businessType",
  "requestType",
  "postalCode",
  "address",
  "style",
  "participants",
  "preferredDate",
  "preferredDate1",
  "preferredTime1",
  "preferredDate2",
  "preferredTime2",
  "preferredStyle",
  "visitTarget",
  "gardenVisit",
  "targetUniversity",
  "budgetRange",
  "timeline",
  "currentTools",
  "message",
  "privacy",
  "privacyConsent",
];

const htmlHeaders = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex",
};

export const onRequestGet = () =>
  htmlResponse("このURLはフォーム送信用です。", "フォーム画面から送信してください。", 405);

export const onRequestPost = async ({ request, env }: FunctionContext) => {
  try {
    assertAllowedOrigin(request, env);
    assertBodySize(request);

    const fields = await parseForm(request);
    if (String(fields.websiteUrl || "").trim()) {
      return successResponse();
    }

    const submission = buildSubmission(request, fields);
    validateSubmission(submission);

    const destinations = getConfiguredDestinations(env);
    const missing = getMissingRequiredDestinations(env, destinations);
    if (missing.length) {
      return htmlResponse(
        "送信先設定が未完了です。",
        `未設定: ${missing.join(", ")}。Cloudflare Pages の環境変数を確認してください。`,
        503,
      );
    }
    if (!destinations.length) {
      return htmlResponse("送信先設定が未完了です。", "メール、Google Sheets、Slack の送信先が設定されていません。", 503);
    }

    const results = await Promise.allSettled(destinations.map((destination) => sendToDestination(destination, submission, env)));
    const failed = results
      .map((result, index) => ({ result, destination: destinations[index] }))
      .filter((item) => item.result.status === "rejected");

    if (failed.length) {
      console.error(
        "form-submit destination failure",
        JSON.stringify({
          submissionId: submission.id,
          formType: submission.formType,
          failedDestinations: failed.map((item) => item.destination),
        }),
      );
      return htmlResponse(
        "送信に失敗しました。",
        "一部の通知先へ送信できませんでした。時間をおいて再度お試しください。お急ぎの場合は 03-3477-1306 へお電話ください。",
        502,
      );
    }

    return successResponse();
  } catch (error) {
    const message = error instanceof UserVisibleError ? error.message : "入力内容を確認して、もう一度送信してください。";
    const status = error instanceof UserVisibleError ? error.status : 400;
    if (!(error instanceof UserVisibleError)) {
      console.error("form-submit unexpected failure");
    }
    return htmlResponse("送信できませんでした。", message, status);
  }
};

const sendToDestination = (destination: Destination, submission: Submission, env: Env) => {
  if (destination === "email") return sendEmail(submission, env);
  if (destination === "sheets") return sendSheets(submission, env);
  return sendSlack(submission, env);
};

class UserVisibleError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

const assertAllowedOrigin = (request: Request, env: Env) => {
  const origin = request.headers.get("Origin");
  if (!origin) return;

  const requestOrigin = new URL(request.url).origin;
  const allowedOrigins = new Set([
    requestOrigin,
    "https://lexus-ec.com",
    "https://www.lexus-ec.com",
    "https://staging.lexus-ec.pages.dev",
    ...splitCsv(env.FORM_ALLOWED_ORIGINS),
  ]);

  if (!allowedOrigins.has(origin)) {
    throw new UserVisibleError("許可されていない送信元です。フォーム画面を開き直して送信してください。", 403);
  }
};

const assertBodySize = (request: Request) => {
  const contentLength = Number(request.headers.get("Content-Length") || "0");
  if (contentLength > MAX_BODY_BYTES) {
    throw new UserVisibleError("送信内容が大きすぎます。入力内容を短くして送信してください。", 413);
  }
};

const parseForm = async (request: Request) => {
  const contentType = request.headers.get("Content-Type") || "";
  if (!contentType.includes("application/x-www-form-urlencoded") && !contentType.includes("multipart/form-data")) {
    throw new UserVisibleError("フォーム形式が正しくありません。", 415);
  }

  const formData = await request.formData();
  const fields: Record<string, SubmissionFieldValue> = {};
  let totalChars = 0;

  for (const [key, value] of formData.entries()) {
    if (typeof value !== "string") {
      throw new UserVisibleError("ファイル添付は現在受け付けていません。", 400);
    }

    const normalizedValue = normalizeFieldValue(value);
    if (normalizedValue.length > MAX_FIELD_CHARS) {
      throw new UserVisibleError("入力内容が長すぎる項目があります。", 400);
    }

    totalChars += normalizedValue.length;
    if (totalChars > MAX_TOTAL_CHARS) {
      throw new UserVisibleError("送信内容が大きすぎます。入力内容を短くして送信してください。", 413);
    }

    const existing = fields[key];
    if (existing === undefined) {
      fields[key] = normalizedValue;
    } else if (Array.isArray(existing)) {
      existing.push(normalizedValue);
    } else {
      fields[key] = [existing, normalizedValue];
    }
  }

  return fields;
};

const normalizeFieldValue = (value: string) => value.replace(/\r\n/g, "\n").trim();

const buildSubmission = (request: Request, fields: Record<string, SubmissionFieldValue>): Submission => {
  const formType = stringField(fields.formType);
  if (!formLabels[formType]) {
    throw new UserVisibleError("フォーム種別が確認できません。ページを開き直して送信してください。", 400);
  }

  const sourcePath = normalizeSourcePath(stringField(fields.sourcePath) || "/");
  return {
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    formType,
    formLabel: formLabels[formType],
    sourcePath,
    pageUrl: new URL(sourcePath, new URL(request.url).origin).href,
    referrer: request.headers.get("Referer") || "",
    fields,
  };
};

const validateSubmission = (submission: Submission) => {
  const required = [...(baseRequiredFields[submission.formType] || [])];
  if (submission.formType === "reservation" && stringField(submission.fields.preferredDate1)) {
    required.push("kana", "studentType", "participants", "preferredDate1", "preferredTime1", "preferredDate2", "preferredTime2");
  }

  const missing = required.filter((field) => !hasValue(submission.fields[field]));
  if (missing.length) {
    throw new UserVisibleError(`未入力の必須項目があります: ${missing.map(labelForField).join(", ")}`, 400);
  }

  const email = stringField(submission.fields.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new UserVisibleError("メールアドレスの形式を確認してください。", 400);
  }

  const tel = stringField(submission.fields.tel);
  if (tel && !/^[0-9+\-\s()]{8,20}$/.test(tel)) {
    throw new UserVisibleError("電話番号の形式を確認してください。", 400);
  }
};

const getConfiguredDestinations = (env: Env) => {
  const destinations: Destination[] = [];
  if ((env.RESEND_API_KEY || env.SENDGRID_API_KEY) && env.FORM_NOTIFICATION_TO && env.FORM_NOTIFICATION_FROM) destinations.push("email");
  if (env.GOOGLE_SHEETS_WEBHOOK_URL) destinations.push("sheets");
  if (env.SLACK_WEBHOOK_URL) destinations.push("slack");
  return destinations;
};

const getMissingRequiredDestinations = (env: Env, configured: Destination[]) => {
  const required = splitCsv(env.FORM_REQUIRED_DESTINATIONS || "email,sheets,slack") as Destination[];
  return required.filter((destination) => !configured.includes(destination));
};

const sendEmail = async (submission: Submission, env: Env) => {
  if (env.RESEND_API_KEY) return sendResendEmail(submission, env);
  if (env.SENDGRID_API_KEY) return sendSendGridEmail(submission, env);
  throw new Error("email provider is not configured");
};

const sendResendEmail = async (submission: Submission, env: Env) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.FORM_NOTIFICATION_FROM,
      to: splitCsv(env.FORM_NOTIFICATION_TO || ""),
      reply_to: stringField(submission.fields.email) || undefined,
      subject: buildSubject(submission),
      text: buildTextMessage(submission),
      html: buildHtmlMessage(submission),
    }),
  });
  await assertDestinationResponse(response, "resend");
};

const sendSendGridEmail = async (submission: Submission, env: Env) => {
  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: splitCsv(env.FORM_NOTIFICATION_TO || "").map((email) => ({ email })),
          subject: buildSubject(submission),
        },
      ],
      from: { email: env.FORM_NOTIFICATION_FROM },
      reply_to: stringField(submission.fields.email) ? { email: stringField(submission.fields.email) } : undefined,
      content: [
        { type: "text/plain", value: buildTextMessage(submission) },
        { type: "text/html", value: buildHtmlMessage(submission) },
      ],
    }),
  });
  await assertDestinationResponse(response, "sendgrid");
};

const sendSheets = async (submission: Submission, env: Env) => {
  const response = await fetch(env.GOOGLE_SHEETS_WEBHOOK_URL || "", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      secret: env.GOOGLE_SHEETS_WEBHOOK_SECRET || "",
      submission,
    }),
  });
  await assertDestinationResponse(response, "sheets");
  const text = await response.text();
  if (text.trim() !== "ok") {
    throw new Error("sheets did not return ok");
  }
};

const sendSlack = async (submission: Submission, env: Env) => {
  const response = await fetch(env.SLACK_WEBHOOK_URL || "", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: `${submission.formLabel}を受け付けました`,
      blocks: buildSlackBlocks(submission),
    }),
  });
  await assertDestinationResponse(response, "slack");
};

const assertDestinationResponse = async (response: Response, service: string) => {
  if (response.ok) return;
  throw new Error(`${service} returned ${response.status}`);
};

const buildSubject = (submission: Submission) => {
  const name = stringField(submission.fields.name);
  return `[LEXUS EC] ${submission.formLabel}${name ? ` - ${name}` : ""}`;
};

const buildTextMessage = (submission: Submission) =>
  [
    `${submission.formLabel}を受け付けました。`,
    "",
    `受付ID: ${submission.id}`,
    `受付日時: ${formatDateTime(submission.submittedAt)}`,
    `送信元: ${submission.pageUrl}`,
    "",
    ...formatFields(submission).map(([label, value]) => `${label}: ${value}`),
  ].join("\n");

const buildHtmlMessage = (submission: Submission) => {
  const rows = formatFields(submission)
    .map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value).replace(/\n/g, "<br>")}</td></tr>`)
    .join("");
  return `<!doctype html><html><body><h1>${escapeHtml(submission.formLabel)}</h1><p>受付ID: ${escapeHtml(
    submission.id,
  )}</p><p>受付日時: ${escapeHtml(formatDateTime(submission.submittedAt))}</p><p>送信元: <a href="${escapeHtml(
    submission.pageUrl,
  )}">${escapeHtml(submission.pageUrl)}</a></p><table border="1" cellpadding="8" cellspacing="0">${rows}</table></body></html>`;
};

const buildSlackBlocks = (submission: Submission) => {
  const summaryFields = formatFields(submission)
    .filter(([label]) => ["お名前", "メールアドレス", "電話番号", "学年・状況", "会社名・教室名", "相談内容"].includes(label))
    .slice(0, 8)
    .map(([label, value]) => ({
      type: "mrkdwn",
      text: `*${escapeSlack(label)}*\n${escapeSlack(truncate(value, 500))}`,
    }));

  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: submission.formLabel,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*受付ID:* ${escapeSlack(submission.id)}\n*送信元:* ${escapeSlack(submission.pageUrl)}`,
      },
    },
    ...(summaryFields.length ? [{ type: "section", fields: summaryFields }] : []),
  ];
};

const formatFields = (submission: Submission) => {
  const keys = [
    ...orderedFieldNames.filter((key) => key in submission.fields),
    ...Object.keys(submission.fields).filter((key) => !orderedFieldNames.includes(key) && !["formType", "websiteUrl"].includes(key)),
  ];

  return keys
    .map((key) => [labelForField(key), formatValue(submission.fields[key])] as [string, string])
    .filter(([, value]) => value);
};

const normalizeSourcePath = (sourcePath: string) => {
  if (!sourcePath.startsWith("/")) return "/";
  return sourcePath.replace(/[?#].*$/, "") || "/";
};

const hasValue = (value: SubmissionFieldValue | undefined) => {
  if (Array.isArray(value)) return value.some((item) => item.trim());
  return Boolean(value && value.trim());
};

const stringField = (value: SubmissionFieldValue | undefined) => (Array.isArray(value) ? value.filter(Boolean).join(", ") : value || "");

const formatValue = (value: SubmissionFieldValue | undefined) => (Array.isArray(value) ? value.filter(Boolean).join(", ") : value || "");

const labelForField = (field: string) => fieldLabels[field] || field;

const splitCsv = (value?: string) =>
  (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const truncate = (value: string, maxLength: number) => (value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value);

const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(iso));

const successResponse = () => htmlResponse("送信を受け付けました。", "内容を確認後、担当者よりご連絡します。", 200);

const htmlResponse = (title: string, message: string, status: number) =>
  new Response(
    `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${escapeHtml(
      title,
    )}</title><style>body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;margin:0;background:#f7f7f7;color:#1f2933}.wrap{max-width:680px;margin:10vh auto;padding:32px;background:#fff;border:1px solid #ddd}h1{font-size:24px;margin:0 0 16px}p{line-height:1.8}.actions{margin-top:24px}a{color:#b91c1c}</style></head><body><main class="wrap"><h1>${escapeHtml(
      title,
    )}</h1><p>${escapeHtml(message)}</p><div class="actions"><a href="/">トップページへ戻る</a></div></main></body></html>`,
    { status, headers: htmlHeaders },
  );

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

const escapeSlack = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
