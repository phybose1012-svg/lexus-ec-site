type AdminKVNamespace = {
  get(key: string, options?: { type?: "json" | "text" }): Promise<unknown>;
  put(key: string, value: string, options?: { metadata?: Record<string, unknown> }): Promise<void>;
  delete(key: string): Promise<void>;
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

type ContentOverridePayload = {
  id?: string;
  label?: string;
  path: string;
  fields: Record<string, string>;
  images?: Record<string, ImageOverridePayload>;
  styles?: Record<string, Record<string, string>>;
  selectors?: Record<string, string>;
  status?: string;
  draftId?: string;
  updatedAt?: string;
};

type ImageOverridePayload = {
  src?: string;
  alt?: string;
  width?: string;
  hidden?: boolean;
};

const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex",
};

const overridePrefix = "page-override:";
const maxBodyBytes = 1024 * 1024;

export const onRequestGet = async ({ request, env }: FunctionContext) => {
  const path = normalizePath(new URL(request.url).searchParams.get("path") || "/");
  if (!env.ADMIN_CONTENT_KV) return jsonResponse({ configured: false, override: null });

  const override = await env.ADMIN_CONTENT_KV.get(keyForPath(path), { type: "json" });
  return jsonResponse({ configured: true, override: override || null });
};

export const onRequestPost = async ({ request, env }: FunctionContext) => {
  const auth = assertAdminAccess(request, env);
  if (auth) return auth;
  if (!env.ADMIN_CONTENT_KV) return jsonResponse({ configured: false, error: "ADMIN_CONTENT_KV is not configured" }, 503);

  const contentLength = Number(request.headers.get("Content-Length") || "0");
  if (contentLength > maxBodyBytes) return jsonResponse({ error: "Content override is too large" }, 413);

  const payload = await request.json().catch(() => null);
  if (!isContentOverridePayload(payload)) return jsonResponse({ error: "Invalid content override payload" }, 400);

  const now = new Date().toISOString();
  const normalized: ContentOverridePayload & { path: string; updatedAt: string } = {
    ...payload,
    id: normalizeId(payload.id || payload.path),
    path: normalizePath(payload.path),
    fields: sanitizeFields(payload.fields),
    images: sanitizeImages(payload.images),
    styles: sanitizeStyles(payload.styles),
    selectors: sanitizeSelectors(payload.selectors),
    status: payload.status || "published",
    updatedAt: payload.updatedAt || now,
  };

  await env.ADMIN_CONTENT_KV.put(keyForPath(normalized.path), JSON.stringify(normalized), {
    metadata: {
      id: normalized.id,
      path: normalized.path,
      status: normalized.status,
      updatedAt: normalized.updatedAt,
    },
  });

  return jsonResponse({ configured: true, override: normalized });
};

export const onRequestDelete = async ({ request, env }: FunctionContext) => {
  const auth = assertAdminAccess(request, env);
  if (auth) return auth;
  if (!env.ADMIN_CONTENT_KV) return jsonResponse({ configured: false, error: "ADMIN_CONTENT_KV is not configured" }, 503);

  const path = normalizePath(new URL(request.url).searchParams.get("path") || "");
  if (!path) return jsonResponse({ error: "path is required" }, 400);
  await env.ADMIN_CONTENT_KV.delete(keyForPath(path));
  return jsonResponse({ configured: true, deleted: path });
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

const isContentOverridePayload = (value: unknown): value is ContentOverridePayload =>
  Boolean(
    value &&
      typeof value === "object" &&
      typeof (value as Record<string, unknown>).path === "string" &&
      typeof (value as Record<string, unknown>).fields === "object" &&
      (value as Record<string, unknown>).fields,
  ) &&
  Object.values((value as ContentOverridePayload).fields).every((fieldValue) => typeof fieldValue === "string");

const styleKeys = [
  "fontSize",
  "fontWeight",
  "letterSpacing",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "minHeight",
] as const;
const signedPixelStyleKeys = new Set(["letterSpacing", "marginTop", "marginRight", "marginBottom", "marginLeft"]);
const fontWeightValues = new Set(["400", "500", "600", "700", "800", "900"]);

const sanitizeFields = (fields: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(fields)
      .filter(([key, value]) => key.length <= 160 && typeof value === "string")
      .map(([key, value]) => [key, value.slice(0, 8000)]),
  );

const sanitizeImageSrc = (value: unknown) => {
  if (typeof value !== "string") return "";
  const src = value.trim();
  if (!src || src.length > 2000) return "";
  if (/^(https?:)?\/\//i.test(src) || src.startsWith("/") || src.startsWith("./") || src.startsWith("../")) return src;
  return "";
};

const sanitizeImageAlt = (value: unknown) => (typeof value === "string" ? value.trim().slice(0, 300) : "");

const sanitizeImageWidth = (value: unknown) => {
  if (typeof value !== "string") return "";
  const match = value.trim().match(/^(\d{1,4}(?:\.\d{1,2})?)(px|%)$/);
  if (!match) return "";
  const numeric = Number(match[1]);
  const unit = match[2];
  const max = unit === "%" ? 300 : 2400;
  if (!Number.isFinite(numeric) || numeric <= 0 || numeric > max) return "";
  return `${Number(numeric.toFixed(2))}${unit}`;
};

const sanitizeImages = (images?: Record<string, ImageOverridePayload>) => {
  if (!images || typeof images !== "object") return {};
  return Object.fromEntries(
    Object.entries(images)
      .filter(([fieldId, image]) => fieldId.length <= 160 && image && typeof image === "object")
      .map(([fieldId, image]) => {
        const cleanImage: ImageOverridePayload = {};
        if (Object.prototype.hasOwnProperty.call(image, "src")) {
          const src = sanitizeImageSrc(image.src);
          if (src) cleanImage.src = src;
        }
        if (Object.prototype.hasOwnProperty.call(image, "alt")) cleanImage.alt = sanitizeImageAlt(image.alt);
        if (Object.prototype.hasOwnProperty.call(image, "width")) {
          const width = sanitizeImageWidth(image.width);
          if (width) cleanImage.width = width;
        }
        if (Object.prototype.hasOwnProperty.call(image, "hidden")) cleanImage.hidden = image.hidden === true;
        return [fieldId, cleanImage];
      })
      .filter(([, image]) => Object.keys(image).length > 0),
  );
};

const sanitizeStyleValue = (key: string, value: unknown) => {
  if (!styleKeys.includes(key as (typeof styleKeys)[number]) || typeof value !== "string") return "";
  if (key === "fontWeight") return fontWeightValues.has(value) ? value : "";
  if (!/^-?\d{1,3}(\.\d{1,2})?px$/.test(value)) return "";

  const numeric = Number(value.replace(/px$/i, ""));
  const min = signedPixelStyleKeys.has(key) ? -240 : 0;
  const max = key === "minHeight" ? 720 : key === "fontSize" ? 96 : 320;
  if (!Number.isFinite(numeric) || numeric < min || numeric > max) return "";
  return value;
};

const sanitizeStyles = (styles?: Record<string, Record<string, string>>) => {
  if (!styles || typeof styles !== "object") return {};
  return Object.fromEntries(
    Object.entries(styles)
      .filter(([fieldId, fieldStyles]) => fieldId.length <= 160 && fieldStyles && typeof fieldStyles === "object")
      .map(([fieldId, fieldStyles]) => {
        const cleanFieldStyles = Object.fromEntries(
          Object.entries(fieldStyles)
            .map(([key, value]) => [key, sanitizeStyleValue(key, value)])
            .filter(([, value]) => Boolean(value)),
        );
        return [fieldId, cleanFieldStyles];
      })
      .filter(([, fieldStyles]) => Object.keys(fieldStyles).length > 0),
  );
};

const sanitizeSelectors = (selectors?: Record<string, string>) => {
  if (!selectors || typeof selectors !== "object") return {};
  return Object.fromEntries(
    Object.entries(selectors)
      .filter(([fieldId, selector]) => fieldId.length <= 160 && typeof selector === "string")
      .map(([fieldId, selector]) => [fieldId, selector.trim().slice(0, 1000)])
      .filter(([, selector]) => Boolean(selector) && !/[{}<>]/.test(selector)),
  );
};

const normalizePath = (value: string) => {
  const path = String(value || "/").trim();
  if (!path || path === "/") return "/";
  return `/${path.replace(/^\/+|\/+$/g, "")}/`;
};

const normalizeId = (value: string) => value.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120);

const keyForPath = (path: string) => `${overridePrefix}${encodeURIComponent(normalizePath(path))}`;

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
