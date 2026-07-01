type AdminKVNamespace = {
  get(key: string, options?: { type?: "json" | "text" }): Promise<unknown>;
  put(key: string, value: string, options?: { metadata?: Record<string, unknown> }): Promise<void>;
  list(options?: { prefix?: string; limit?: number }): Promise<{ keys: { name: string }[] }>;
};

type Env = {
  ADMIN_CONTENT_KV?: AdminKVNamespace;
  ADMIN_API_TOKEN?: string;
  ADMIN_ALLOWED_EMAILS?: string;
};

type FunctionContext = {
  request: Request;
  env: Env;
};

type ReportPayload = Record<string, string> & {
  source: string;
  title: string;
  summary: string;
  id?: string;
  updatedAt?: string;
};

const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex",
};

const reportPrefix = "report:";
const maxBodyBytes = 128 * 1024;

export const onRequestGet = async ({ request, env }: FunctionContext) => {
  const auth = assertAdminAccess(request, env);
  if (auth) return auth;
  if (!env.ADMIN_CONTENT_KV) return jsonResponse({ configured: false, reports: [] }, 503);

  const list = await env.ADMIN_CONTENT_KV.list({ prefix: reportPrefix, limit: 100 });
  const reports = await Promise.all(
    list.keys.map((key) => env.ADMIN_CONTENT_KV?.get(key.name, { type: "json" })).filter(Boolean),
  );
  return jsonResponse({ configured: true, reports });
};

export const onRequestPost = async ({ request, env }: FunctionContext) => {
  const auth = assertAdminAccess(request, env);
  if (auth) return auth;
  if (!env.ADMIN_CONTENT_KV) return jsonResponse({ configured: false, error: "ADMIN_CONTENT_KV is not configured" }, 503);

  const contentLength = Number(request.headers.get("Content-Length") || "0");
  if (contentLength > maxBodyBytes) return jsonResponse({ error: "Report is too large" }, 413);

  const report = await request.json().catch(() => null);
  if (!isReportPayload(report)) return jsonResponse({ error: "Invalid report payload" }, 400);

  const now = new Date().toISOString();
  const id = normalizeId(report.id || `${report.source}-${Date.now()}`);
  const normalized: ReportPayload & { id: string; updatedAt: string } = {
    ...report,
    id,
    updatedAt: report.updatedAt || now,
  };

  await env.ADMIN_CONTENT_KV.put(`${reportPrefix}${id}`, JSON.stringify(normalized), {
    metadata: {
      source: normalized.source,
      title: normalized.title,
      updatedAt: normalized.updatedAt,
    },
  });

  return jsonResponse({ configured: true, report: normalized });
};

const assertAdminAccess = (request: Request, env: Env) => {
  const url = new URL(request.url);
  const isLocal = ["127.0.0.1", "localhost", "::1"].includes(url.hostname);
  const token = env.ADMIN_API_TOKEN;
  const allowedEmails = splitCsv(env.ADMIN_ALLOWED_EMAILS);

  if (token) {
    const authorization = request.headers.get("Authorization") || "";
    if (authorization === `Bearer ${token}`) return null;
  }

  if (allowedEmails.length) {
    const email = request.headers.get("Cf-Access-Authenticated-User-Email") || "";
    if (allowedEmails.includes(email)) return null;
  }

  if (!token && !allowedEmails.length && isLocal) return null;
  return jsonResponse({ error: "Admin API is not authorized" }, token || allowedEmails.length ? 401 : 503);
};

const isReportPayload = (value: unknown): value is ReportPayload =>
  Boolean(
    value &&
      typeof value === "object" &&
      typeof (value as Record<string, unknown>).source === "string" &&
      typeof (value as Record<string, unknown>).title === "string" &&
      typeof (value as Record<string, unknown>).summary === "string",
  );

const normalizeId = (value: string) => value.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120);

const splitCsv = (value?: string) =>
  (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const jsonResponse = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: jsonHeaders,
  });
