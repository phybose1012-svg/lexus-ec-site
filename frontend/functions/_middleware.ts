import { repoContentOverrides } from "./generated/content-overrides";

type AdminKVNamespace = {
  get(key: string, options?: { type?: "json" | "text" }): Promise<unknown>;
};

type Env = {
  ADMIN_CONTENT_KV?: AdminKVNamespace;
};

type FunctionContext = {
  request: Request;
  env: Env;
  next(): Promise<Response>;
};

type ContentOverridePayload = {
  path: string;
  fields?: Record<string, string>;
  images?: Record<string, ImageOverridePayload>;
  styles?: Record<string, Record<string, string>>;
  selectors?: Record<string, string>;
};

type ImageOverridePayload = {
  src?: string;
  alt?: string;
  width?: string;
  hidden?: boolean;
};

type RewriterElement = {
  getAttribute(name: string): string | null;
  setAttribute(name: string, value: string): void;
  setInnerContent(content: string, options?: { html?: boolean }): void;
};

type HTMLRewriterInstance = {
  on(selector: string, handler: { element(element: RewriterElement): void }): HTMLRewriterInstance;
  transform(response: Response): Response;
};

declare const HTMLRewriter: {
  new (): HTMLRewriterInstance;
};

const overridePrefix = "page-override:";

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

const cssPropertyByStyleKey: Record<(typeof styleKeys)[number], string> = {
  fontSize: "font-size",
  fontWeight: "font-weight",
  letterSpacing: "letter-spacing",
  marginTop: "margin-top",
  marginRight: "margin-right",
  marginBottom: "margin-bottom",
  marginLeft: "margin-left",
  paddingTop: "padding-top",
  paddingRight: "padding-right",
  paddingBottom: "padding-bottom",
  paddingLeft: "padding-left",
  minHeight: "min-height",
};

const signedPixelStyleKeys = new Set(["letterSpacing", "marginTop", "marginRight", "marginBottom", "marginLeft"]);
const fontWeightValues = new Set(["400", "500", "600", "700", "800", "900"]);

export const onRequest = async ({ request, env, next }: FunctionContext) => {
  const response = await next();
  if (request.method !== "GET") return response;

  const contentType = response.headers.get("Content-Type") || "";
  if (!contentType.toLowerCase().includes("text/html")) return response;

  const path = normalizePath(new URL(request.url).pathname);
  const committedOverrides = repoContentOverrides as Record<string, ContentOverridePayload>;
  const committedOverride = committedOverrides[path] || null;
  const kvOverride = env.ADMIN_CONTENT_KV
    ? ((await env.ADMIN_CONTENT_KV.get(keyForPath(path), { type: "json" }).catch(() => null)) as ContentOverridePayload | null)
    : null;
  const override = hasApplicableOverride(kvOverride) ? kvOverride : committedOverride;

  if (!hasApplicableOverride(override)) return response;
  return buildRewriter(override).transform(response);
};

const buildRewriter = (override: ContentOverridePayload) => {
  const rewriter = new HTMLRewriter();
  const imageIds = new Set(Object.keys(override.images || {}));
  const fieldIds = new Set([
    ...Object.keys(override.fields || {}),
    ...Object.keys(override.styles || {}),
  ].filter((fieldId) => !imageIds.has(fieldId)));

  fieldIds.forEach((fieldId) => {
    const selectors = selectorsForField(fieldId, override.selectors);
    const text = override.fields?.[fieldId];
    const styles = override.styles?.[fieldId];
    selectors.forEach((selector) => {
      try {
        rewriter.on(selector, new OverrideElementHandler(text, styles));
      } catch {
        // Invalid or unsupported selectors should not break the page response.
      }
    });
  });

  imageIds.forEach((fieldId) => {
    const selectors = selectorsForField(fieldId, override.selectors);
    const image = override.images?.[fieldId];
    const styles = override.styles?.[fieldId];
    selectors.forEach((selector) => {
      try {
        rewriter.on(selector, new ImageOverrideElementHandler(image, styles));
      } catch {
        // Invalid or unsupported selectors should not break the page response.
      }
    });
  });

  return rewriter;
};

class OverrideElementHandler {
  constructor(
    private readonly text?: string,
    private readonly styles?: Record<string, string>,
  ) {}

  element(element: RewriterElement) {
    if (typeof this.text === "string") {
      element.setInnerContent(renderMultilineText(this.text), { html: true });
    }

    const styleAttribute = mergeStyleAttribute(element.getAttribute("style") || "", this.styles);
    if (styleAttribute) element.setAttribute("style", styleAttribute);
  }
}

class ImageOverrideElementHandler {
  constructor(
    private readonly image?: ImageOverridePayload,
    private readonly styles?: Record<string, string>,
  ) {}

  element(element: RewriterElement) {
    const src = sanitizeImageSrc(this.image?.src);
    const alt = typeof this.image?.alt === "string" ? this.image.alt.slice(0, 300) : undefined;
    if (src) element.setAttribute("src", src);
    if (typeof alt === "string") element.setAttribute("alt", alt);

    const styleAttribute = mergeImageStyleAttribute(
      mergeStyleAttribute(element.getAttribute("style") || "", this.styles),
      this.image,
    );
    if (styleAttribute) element.setAttribute("style", styleAttribute);
  }
}

const selectorsForField = (fieldId: string, selectors?: Record<string, string>) => {
  const attributeSelector = `[data-admin-editable="${escapeAttributeSelectorValue(fieldId)}"]`;
  const fallbackSelector = selectors && typeof selectors === "object" ? selectors[fieldId] : "";
  return [...new Set([attributeSelector, typeof fallbackSelector === "string" ? fallbackSelector.trim() : ""])].filter(Boolean);
};

const mergeStyleAttribute = (styleAttribute: string, styles?: Record<string, string>) => {
  if (!styles || typeof styles !== "object") return styleAttribute.trim();

  const declarations = parseStyleAttribute(styleAttribute);
  for (const property of Object.values(cssPropertyByStyleKey)) declarations.delete(property);

  for (const key of styleKeys) {
    const value = sanitizeStyleValue(key, styles[key]);
    if (value) declarations.set(cssPropertyByStyleKey[key], value);
  }

  return [...declarations.entries()].map(([property, value]) => `${property}: ${value}`).join("; ");
};

const mergeImageStyleAttribute = (styleAttribute: string, image?: ImageOverridePayload) => {
  const declarations = parseStyleAttribute(styleAttribute);
  const width = sanitizeImageWidth(image?.width);

  if (width) {
    declarations.set("width", width);
    declarations.set("height", "auto");
    declarations.set("max-width", width.endsWith("%") ? "100%" : "none");
  }

  if (image?.hidden === true) declarations.set("display", "none !important");

  return [...declarations.entries()].map(([property, value]) => `${property}: ${value}`).join("; ");
};

const parseStyleAttribute = (styleAttribute: string) => {
  const declarations = new Map<string, string>();
  styleAttribute.split(";").forEach((declaration) => {
    const separatorIndex = declaration.indexOf(":");
    if (separatorIndex <= 0) return;
    const property = declaration.slice(0, separatorIndex).trim().toLowerCase();
    const value = declaration.slice(separatorIndex + 1).trim();
    if (property && value) declarations.set(property, value);
  });
  return declarations;
};

const sanitizeStyleValue = (key: (typeof styleKeys)[number], value: unknown) => {
  if (typeof value !== "string") return "";
  if (key === "fontWeight") return fontWeightValues.has(value) ? value : "";
  if (!/^-?\d{1,3}(\.\d{1,2})?px$/.test(value)) return "";

  const numeric = Number(value.replace(/px$/i, ""));
  const min = signedPixelStyleKeys.has(key) ? -240 : 0;
  const max = key === "minHeight" ? 720 : key === "fontSize" ? 96 : 320;
  if (!Number.isFinite(numeric) || numeric < min || numeric > max) return "";
  return value;
};

const sanitizeImageSrc = (value: unknown) => {
  if (typeof value !== "string") return "";
  const src = value.trim();
  if (!src || src.length > 2000) return "";
  if (/^(https?:)?\/\//i.test(src) || src.startsWith("/") || src.startsWith("./") || src.startsWith("../")) return src;
  return "";
};

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

const hasApplicableOverride = (override: ContentOverridePayload | null): override is ContentOverridePayload =>
  Boolean(
    override &&
      typeof override === "object" &&
      ((override.fields && Object.keys(override.fields).length) ||
        (override.images && Object.keys(override.images).length) ||
        (override.styles && Object.keys(override.styles).length)),
  );

const renderMultilineText = (value: string) => value.split(/\r?\n/).map(escapeHtml).join("<br>");

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const escapeAttributeSelectorValue = (value: string) =>
  String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');

const normalizePath = (value: string) => {
  const path = String(value || "/").trim();
  if (!path || path === "/") return "/";
  return `/${path.replace(/^\/+|\/+$/g, "")}/`;
};

const keyForPath = (path: string) => `${overridePrefix}${encodeURIComponent(normalizePath(path))}`;
