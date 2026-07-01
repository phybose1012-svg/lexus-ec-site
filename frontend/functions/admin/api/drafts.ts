type AdminKVNamespace = {
  get(key: string, options?: { type?: "json" | "text" }): Promise<unknown>;
  put(key: string, value: string, options?: { metadata?: Record<string, unknown> }): Promise<void>;
  delete(key: string): Promise<void>;
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

type DraftPayload = Record<string, string> & {
  targetId: string;
  title: string;
  body: string;
  id?: string;
  updatedAt?: string;
};

const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex",
};

const maxBodyBytes = 96 * 1024;
const draftPrefix = "draft:";

export const onRequestGet = async ({ request, env }: FunctionContext) => {
  const auth = assertAdminAccess(request, env);
  if (auth) return auth;
  if (!env.ADMIN_CONTENT_KV) return jsonResponse({ configured: false, drafts: [] }, 503);

  const list = await env.ADMIN_CONTENT_KV.list({ prefix: draftPrefix, limit: 100 });
  const drafts = await Promise.all(
    list.keys.map((key) => env.ADMIN_CONTENT_KV?.get(key.name, { type: "json" })).filter(Boolean),
  );
  return jsonResponse({ configured: true, drafts });
};

export const onRequestPost = async ({ request, env }: FunctionContext) => {
  const auth = assertAdminAccess(request, env);
  if (auth) return auth;
  if (!env.ADMIN_CONTENT_KV) return jsonResponse({ configured: false, error: "ADMIN_CONTENT_KV is not configured" }, 503);

  const contentLength = Number(request.headers.get("Content-Length") || "0");
  if (contentLength > maxBodyBytes) return jsonResponse({ error: "Draft is too large" }, 413);

  const draft = await request.json().catch(() => null);
  if (!isDraftPayload(draft)) return jsonResponse({ error: "Invalid draft payload" }, 400);

  const now = new Date().toISOString();
  const normalized: DraftPayload & { id: string; updatedAt: string } = {
    ...draft,
    id: normalizeId(draft.id || `${draft.targetId}-${Date.now()}`),
    updatedAt: draft.updatedAt || now,
  };

  await env.ADMIN_CONTENT_KV.put(`${draftPrefix}${normalized.id}`, JSON.stringify(normalized), {
    metadata: {
      targetId: normalized.targetId,
      title: normalized.title,
      updatedAt: normalized.updatedAt,
    },
  });

  return jsonResponse({ configured: true, draft: normalized });
};

export const onRequestDelete = async ({ request, env }: FunctionContext) => {
  const auth = assertAdminAccess(request, env);
  if (auth) return auth;
  if (!env.ADMIN_CONTENT_KV) return jsonResponse({ configured: false, error: "ADMIN_CONTENT_KV is not configured" }, 503);

  const id = normalizeId(new URL(request.url).searchParams.get("id") || "");
  if (!id) return jsonResponse({ error: "id is required" }, 400);
  await env.ADMIN_CONTENT_KV.delete(`${draftPrefix}${id}`);
  return jsonResponse({ configured: true, deleted: id });
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

const isDraftPayload = (value: unknown): value is DraftPayload =>
  Boolean(
    value &&
      typeof value === "object" &&
      typeof (value as Record<string, unknown>).targetId === "string" &&
      typeof (value as Record<string, unknown>).title === "string" &&
      typeof (value as Record<string, unknown>).body === "string",
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
