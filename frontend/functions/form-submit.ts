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
  GEMINI_API_KEY?: string;
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

type Destination = "sheets" | "slack";

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
  remarks: "備考",
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
  "remarks",
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

    // 問い合わせフォームのみ: 営業・いたずらを審査し、該当したら受け付けない。
    // 拒否内容はチューニング用にシートの「スパム拒否ログ」へだけ記録する。
    if (submission.formType === "contact") {
      const verdict = await screenContactSpam(submission, env);
      if (verdict.rejected) {
        await logSpamRejection(submission, verdict.reason, env).catch(() => {
          console.error("form-submit spam-log failure", JSON.stringify({ submissionId: submission.id }));
        });
        return rejectionResponse();
      }
    }

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

    // 送信者への自動返信（サンキューメール）。best-effort: 送れなくても受付は成功扱い
    // にして、ユーザーには「送信を受け付けました」を返す。
    await sendAutoReply(submission, env).catch(() => {
      console.error(
        "form-submit auto-reply failure",
        JSON.stringify({ submissionId: submission.id, formType: submission.formType }),
      );
    });

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

// ---- 問い合わせスパム審査 -------------------------------------------------

type SpamVerdict = { rejected: boolean; reason: string };

// 実際に届いている営業文の定番語。名前・本文のどちらかに含まれたら拒否。
const SPAM_KEYWORDS = [
  "貴社",
  "御社",
  "SEO",
  "セールス",
  "集客",
  "マーケティング",
  "広告運用",
  "リスティング",
  "MEO",
  "ホームページ制作",
  "Web制作",
  "サイト制作",
  "業務提携",
  "協業",
  "代理店募集",
  "成果報酬",
  "営業代行",
  "テレアポ",
  "補助金",
  "助成金",
  "無料診断",
  "アクセスアップ",
  "被リンク",
  "人材紹介",
  "採用支援",
] as const;

const SPAM_AI_SYSTEM = [
  "あなたは日本の医学部予備校「レクサスE.C.」のお問い合わせフォームのスパム判定器です。",
  "このフォームは医学部受験生・その保護者・在校生関係者のためのものです。",
  "送信内容を次のいずれかに分類してください:",
  '- "prospect": 受験生・保護者・在校生関係者からの正規の問い合わせ（入塾、体験授業、説明会、寮、学費、受験相談など）',
  '- "sales": 業者からの営業・宣伝・ビジネス提案（Web制作、広告、教材、人材、提携など）',
  '- "prank": いたずら・無意味な文字列・嫌がらせ',
  '- "other": 上記以外（取材依頼、卒業生の連絡など、人が読むべきもの）',
  "判断に迷う場合は必ず prospect を選んでください（本物を落とさないことを最優先）。",
  '出力は JSON のみ: {"category":"prospect|sales|prank|other"}',
].join("\n");

const screenContactSpam = async (submission: Submission, env: Env): Promise<SpamVerdict> => {
  const message = stringField(submission.fields.message);
  const name = stringField(submission.fields.name);

  // ルール1: 日本語（かな）を含まない本文 → 海外系の営業・スパム
  if (message.length >= 10 && !/[ぁ-んァ-ヶ]/.test(message)) {
    return { rejected: true, reason: "本文にかなが含まれない（外国語スパムの疑い）" };
  }
  // ルール2: URLが2本以上
  const urlCount = (message.match(/https?:\/\//gi) || []).length;
  if (urlCount >= 2) {
    return { rejected: true, reason: `本文にURLが${urlCount}件` };
  }
  // ルール3: 営業キーワード
  const hit = SPAM_KEYWORDS.find((keyword) => message.includes(keyword) || name.includes(keyword));
  if (hit) {
    return { rejected: true, reason: `営業キーワード「${hit}」を含む` };
  }

  // AI層: ルールで白のものだけ Gemini (AI Studio) で分類。未設定・障害時は通す（フェイルオープン）。
  if (!env.GEMINI_API_KEY) return { rejected: false, reason: "" };
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent",
      {
        method: "POST",
        headers: {
          "x-goog-api-key": env.GEMINI_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SPAM_AI_SYSTEM }] },
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: [
                    `お名前: ${name}`,
                    `メールアドレス: ${stringField(submission.fields.email)}`,
                    `学年・状況: ${stringField(submission.fields.studentType) || "(未選択)"}`,
                    `ご相談内容: ${truncate(message, 2000)}`,
                  ].join("\n"),
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0,
            maxOutputTokens: 200,
            responseMimeType: "application/json",
          },
        }),
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!response.ok) return { rejected: false, reason: "" };
    const data = (await response.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const json = text.match(/\{[\s\S]*\}/)?.[0];
    const parsed = json ? (JSON.parse(json) as { category?: string }) : null;
    if (parsed?.category === "sales" || parsed?.category === "prank") {
      return { rejected: true, reason: `AI判定: ${parsed.category === "sales" ? "営業・宣伝" : "いたずら"}` };
    }
  } catch {
    // タイムアウト・障害時は通す
  }
  return { rejected: false, reason: "" };
};

// 拒否した内容はシートの「スパム拒否ログ」にだけ残す（Slack・メールは出さない）。
const logSpamRejection = async (submission: Submission, reason: string, env: Env) => {
  if (!env.GOOGLE_SHEETS_WEBHOOK_URL) return;
  await sendSheets(
    {
      ...submission,
      formLabel: "スパム拒否ログ",
      fields: { ...submission.fields, 判定理由: reason },
    },
    env,
  );
};

const rejectionResponse = () =>
  new Response(
    `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>お問い合わせについて</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Hiragino Kaku Gothic ProN",Meiryo,sans-serif;margin:0;background:#faf8f3;color:#1f2933}.wrap{max-width:560px;margin:14vh auto;padding:0 20px;text-align:center}.card{background:#fff;border:1px solid #ece5d6;border-radius:20px;padding:36px 28px}h1{font-size:19px;margin:0 0 14px}p{line-height:1.95;margin:0 0 10px;font-size:14.5px}.sub{color:#6b6255;font-size:13px}a{color:#b91c1c}</style></head><body><main class="wrap"><div class="card"><h1>お問い合わせについて</h1><p>このフォームは医学部受験生やその保護者様のためのフォームです。それ以外の方からのお問合せはご遠慮いただいております。</p><p class="sub">医学部受験に関するお問い合わせでこの表示が出た場合は、お手数ですがお電話（<a href="tel:0334771306">03-3477-1306</a>）にてご連絡ください。</p></div></main></body></html>`,
    { status: 403, headers: { ...htmlHeaders, "X-Form-Rejected": "1" } },
  );

const getConfiguredDestinations = (env: Env) => {
  const destinations: Destination[] = [];
  if (env.GOOGLE_SHEETS_WEBHOOK_URL) destinations.push("sheets");
  if (env.SLACK_WEBHOOK_URL) destinations.push("slack");
  return destinations;
};

const getMissingRequiredDestinations = (env: Env, configured: Destination[]) => {
  const required = splitCsv(env.FORM_REQUIRED_DESTINATIONS || "sheets,slack") as Destination[];
  return required.filter((destination) => !configured.includes(destination));
};

// 送信者本人あての自動返信（サンキューメール）。宛先はフォームに入力された
// メールアドレス、差出人は FORM_NOTIFICATION_FROM（認証済みドメインのアドレス）。
// メール未入力・provider 未設定なら黙ってスキップする。
const sendAutoReply = async (submission: Submission, env: Env) => {
  const to = stringField(submission.fields.email).trim();
  if (!to || !env.FORM_NOTIFICATION_FROM) return;
  if (!env.RESEND_API_KEY && !env.SENDGRID_API_KEY) return;

  const mail = buildAutoReply(submission);

  if (env.RESEND_API_KEY) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.FORM_NOTIFICATION_FROM,
        to: [to],
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
      }),
    });
    await assertDestinationResponse(response, "auto-reply");
    return;
  }

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }], subject: mail.subject }],
      from: { email: env.FORM_NOTIFICATION_FROM },
      content: [
        { type: "text/plain", value: mail.text },
        { type: "text/html", value: mail.html },
      ],
    }),
  });
  await assertDestinationResponse(response, "auto-reply");
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

// フォーム種別ごとの件名とリード文。未知の種別は formLabel から汎用文を組む。
const autoReplyCopy: Record<string, { subject: string; lead: string }> = {
  "request-documents": {
    subject: "【レクサスE.C.】資料請求を受け付けました",
    lead: "この度は資料請求をお申し込みいただき、誠にありがとうございます。\n担当者が内容を確認のうえ、ご請求の資料をお送りいたします。今しばらくお待ちください。",
  },
  reservation: {
    subject: "【レクサスE.C.】個別説明会・個別相談のお申し込みを受け付けました",
    lead: "この度は個別説明会・個別相談にお申し込みいただき、誠にありがとうございます。\n担当者がご希望の日程を確認のうえ、折り返しご連絡いたします。",
  },
  contact: {
    subject: "【レクサスE.C.】お問い合わせを受け付けました",
    lead: "この度はお問い合わせをいただき、誠にありがとうございます。\n担当者が内容を確認のうえ、順次ご返信いたします。",
  },
  "test-entry": {
    subject: "【レクサスE.C.】選抜テストのお申し込みを受け付けました",
    lead: "この度は選抜テストにお申し込みいただき、誠にありがとうございます。\n担当者がご希望の日程を確認のうえ、折り返しご連絡いたします。",
  },
  "lexus-online-contact": {
    subject: "【Lexus Online】お問い合わせを受け付けました",
    lead: "この度は Lexus Online へお問い合わせいただき、誠にありがとうございます。\n担当者が内容を確認のうえ、順次ご返信いたします。",
  },
};

const autoReplyCopyFor = (submission: Submission) =>
  autoReplyCopy[submission.formType] || {
    subject: `【レクサスE.C.】${submission.formLabel}を受け付けました`,
    lead: `この度は${submission.formLabel}をいただき、誠にありがとうございます。\n担当者が内容を確認のうえ、順次ご連絡いたします。`,
  };

const AUTO_REPLY_SIGNATURE = [
  "───────────────",
  "医学部予備校 レクサス E.C.",
  "TEL: 03-3477-1306",
  "受付時間 平日・土曜 9:00〜21:00 / 日曜 10:00〜17:00",
  "https://lexus-ec.com/",
  "〒150-0031 東京都渋谷区桜丘町29-7 LEXUS GARDEN",
].join("\n");

const buildAutoReply = (submission: Submission) => {
  const copy = autoReplyCopyFor(submission);
  const name = stringField(submission.fields.name).trim();
  const greeting = name ? `${name} 様` : "ご担当者 様";
  const record = formatFields(submission).filter(([label]) => label !== "送信元ページ" && label !== "個人情報同意" && label !== "同意");

  const text = [
    greeting,
    "",
    copy.lead,
    "",
    "本メールは自動送信です。ご入力いただいた内容は下記のとおり承りました。",
    "───────────────",
    ...record.map(([label, value]) => `${label}: ${value}`),
    `受付ID: ${submission.id}`,
    `受付日時: ${formatDateTime(submission.submittedAt)}`,
    "───────────────",
    "",
    "お心当たりのない場合や、お急ぎの場合は下記までお電話ください。",
    "",
    AUTO_REPLY_SIGNATURE,
  ].join("\n");

  const rows = record
    .map(([label, value]) => `<tr><th align="left" style="padding:4px 12px 4px 0;color:#555;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</th><td style="padding:4px 0">${escapeHtml(value).replace(/\n/g, "<br>")}</td></tr>`)
    .join("");
  const html = `<!doctype html><html><body style="margin:0;background:#f6f5f1;padding:24px;font-family:-apple-system,'Segoe UI','Hiragino Kaku Gothic ProN',Meiryo,sans-serif;color:#1f2933;line-height:1.9">
  <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e0d5;border-radius:8px;overflow:hidden">
    <div style="background:#111;color:#fff;padding:18px 24px;font-size:18px;font-weight:700">${escapeHtml(copy.subject.replace(/^【[^】]*】/, ""))}</div>
    <div style="padding:24px">
      <p style="margin:0 0 16px;font-weight:700">${escapeHtml(greeting)}</p>
      <p style="margin:0 0 20px;white-space:pre-line">${escapeHtml(copy.lead)}</p>
      <p style="margin:0 0 8px;color:#555;font-size:14px">ご入力いただいた内容は下記のとおり承りました。</p>
      <table style="border-collapse:collapse;font-size:14px;margin:0 0 20px">${rows}
        <tr><th align="left" style="padding:4px 12px 4px 0;color:#555;white-space:nowrap">受付ID</th><td style="padding:4px 0">${escapeHtml(submission.id)}</td></tr>
        <tr><th align="left" style="padding:4px 12px 4px 0;color:#555;white-space:nowrap">受付日時</th><td style="padding:4px 0">${escapeHtml(formatDateTime(submission.submittedAt))}</td></tr>
      </table>
      <p style="margin:0 0 20px;color:#555;font-size:13px">本メールは自動送信です。お心当たりのない場合や、お急ぎの場合は下記までお電話ください。</p>
      <div style="border-top:1px solid #e5e0d5;padding-top:16px;font-size:13px;color:#555">
        <div style="font-weight:700;color:#1f2933">医学部予備校 レクサス E.C.</div>
        <div>TEL: <a href="tel:0334771306" style="color:#b91c1c">03-3477-1306</a></div>
        <div>受付時間 平日・土曜 9:00〜21:00 / 日曜 10:00〜17:00</div>
        <div><a href="https://lexus-ec.com/" style="color:#b91c1c">https://lexus-ec.com/</a></div>
        <div>〒150-0031 東京都渋谷区桜丘町29-7 LEXUS GARDEN</div>
      </div>
    </div>
  </div>
</body></html>`;

  return { subject: copy.subject, text, html };
};

// 内部フラグ（Slack に出しても意味がない項目）は除外し、入力された残り全項目を出す。
const slackInternalLabels = new Set(["送信元ページ", "個人情報同意", "同意"]);

const buildSlackBlocks = (submission: Submission) => {
  const record = formatFields(submission).filter(([label]) => !slackInternalLabels.has(label));

  // 1項目 =「*ラベル*\n値」を1カラムで縦に並べる（fields は必ず2カラム＆短文向けなので使わない）。
  // section の text は最大3000字なので、詰めていって上限に近づいたら次の section に送る。
  const sections: Record<string, unknown>[] = [];
  let buffer: string[] = [];
  let length = 0;
  const flush = () => {
    if (!buffer.length) return;
    sections.push({ type: "section", text: { type: "mrkdwn", text: buffer.join("\n\n") } });
    buffer = [];
    length = 0;
  };
  for (const [label, value] of record) {
    const chunk = `*${escapeSlack(label)}*\n${escapeSlack(truncate(value, 2800))}`;
    if (length + chunk.length + 2 > 2900 && buffer.length) flush();
    buffer.push(chunk);
    length += chunk.length + 2;
  }
  flush();

  return [
    {
      type: "header",
      text: { type: "plain_text", text: submission.formLabel, emoji: true },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*受付日時:* ${escapeSlack(formatDateTime(submission.submittedAt))}\n*受付ID:* ${escapeSlack(
          submission.id,
        )}\n*送信元:* ${escapeSlack(submission.pageUrl)}`,
      },
    },
    { type: "divider" },
    ...sections,
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

const successResponse = () =>
  new Response(
    `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>送信ありがとうございます｜医学部予備校 レクサス E.C.</title><style>*{box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Hiragino Kaku Gothic ProN",Meiryo,sans-serif;margin:0;background:#faf8f3;color:#1f2933}.wrap{max-width:560px;margin:7vh auto;padding:0 20px;text-align:center}.card{background:#fff;border:1px solid #ece5d6;border-radius:20px;padding:40px 28px 34px;box-shadow:0 12px 44px rgba(80,60,20,.09)}.mascot{width:190px;height:auto;margin:0 auto 6px;display:block}h1{font-size:23px;margin:6px 0 16px;color:#1b6e48;letter-spacing:.02em}p{line-height:1.95;margin:0 0 12px;font-size:15px}.sub{color:#6b6255;font-size:13.5px}.tel{color:#b91c1c;font-weight:700;text-decoration:none;white-space:nowrap}.actions{margin-top:28px}.btn{display:inline-block;background:#b91c1c;color:#fff;text-decoration:none;font-weight:700;padding:13px 36px;border-radius:999px}</style></head><body><main class="wrap"><div class="card"><img class="mascot" src="/illustrations/characters/lexus-kun-running.png" alt="レクサスくん" width="190"><h1>送信ありがとうございます！</h1><p>送信内容を LEXUS の受付スタッフにお届けします。<br>担当者より折り返しご連絡いたしますので、少々お待ちください。</p><p class="sub">ご入力いただいたメールアドレス宛に受付確認メールをお送りしました。<br>お急ぎの場合は <a class="tel" href="tel:0334771306">03-3477-1306</a> までお電話ください。</p><div class="actions"><a class="btn" href="/">トップページへ戻る</a></div></div></main></body></html>`,
    { status: 200, headers: htmlHeaders },
  );

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
