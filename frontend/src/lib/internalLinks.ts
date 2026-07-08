import { getLegacyRedirectByPath } from "./legacyRedirects";

const productionOriginPattern = /^https?:\/\/(?:www\.)?lexus-ec\.com/i;
const protocolRelativeProductionPattern = /^\/\/(?:www\.)?lexus-ec\.com/i;
const internalAnchorHrefPattern = /\bhref\s*=\s*(["'])((?:https?:)?\/\/(?:www\.)?lexus-ec\.com[^"']*|\/[^"']*)\1/gi;

const isPageLikePath = (pathname: string) => !/\.[a-z0-9]{2,8}$/i.test(pathname.split("/").pop() || "");

const normalizePagePath = (pathname: string) => {
  const normalized = pathname || "/";
  if (normalized.startsWith("/wp-content/uploads/")) {
    try {
      return `/assets/legacy${decodeURI(normalized)}`;
    } catch {
      return `/assets/legacy${normalized}`;
    }
  }
  if (!isPageLikePath(normalized)) return normalized;
  return normalized.endsWith("/") ? normalized : `${normalized}/`;
};

export const isProductionHref = (href = "") =>
  productionOriginPattern.test(href) || protocolRelativeProductionPattern.test(href);

export const normalizeInternalHref = (href = ""): string => {
  const trimmed = href.trim();
  if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("?")) return href;
  if (!isProductionHref(trimmed) && !trimmed.startsWith("/")) return href;
  if (trimmed.startsWith("//")) {
    return normalizeInternalHref(`https:${trimmed}`);
  }

  let url: URL;
  try {
    url = new URL(trimmed, "https://lexus-ec.com");
  } catch {
    return href;
  }

  if (url.hostname !== "lexus-ec.com" && url.hostname !== "www.lexus-ec.com") return href;

  const redirected = getLegacyRedirectByPath(url.pathname);
  const pathname = normalizePagePath(redirected?.to || url.pathname);
  return `${pathname}${url.search}${url.hash}`;
};

export const normalizeInternalAnchorHrefs = (html: string) =>
  html.replace(internalAnchorHrefPattern, (_match, _quote, href) => `href="${normalizeInternalHref(href)}"`);
