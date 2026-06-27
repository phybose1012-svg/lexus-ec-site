import redirects from "../data/legacyRedirects.json";

export type LegacyRedirect = {
  from: string;
  to: string;
};

export const legacyRedirects = redirects as LegacyRedirect[];

const normalizePath = (value: string) => {
  let pathname = value;
  try {
    pathname = new URL(value, "https://lexus-ec.com").pathname;
  } catch {
    pathname = value;
  }
  try {
    pathname = decodeURIComponent(pathname);
  } catch {
    // Keep the original path if it cannot be decoded.
  }
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
};

export const getLegacyRedirectStaticPaths = () =>
  legacyRedirects.map((redirect) => ({
    params: { slug: decodeURIComponent(redirect.from).replace(/^\/|\/$/g, "") },
    props: { legacyRedirect: redirect },
  }));

export const getLegacyRedirectByPath = (targetPath: string) => {
  const normalized = normalizePath(targetPath);
  return legacyRedirects.find((redirect) => normalizePath(redirect.from) === normalized);
};
