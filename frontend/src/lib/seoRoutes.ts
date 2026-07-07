import { getFixedPageStaticPaths } from "./fixedPageSource";
import { migratedPosts } from "./postSource";

const SITE_ORIGIN = "https://lexus-ec.com";

type SitemapEntryInput = {
  path: string;
  lastmod?: string;
};

export type SitemapEntry = {
  url: string;
  lastmod?: string;
};

const staticPagePaths = [
  "/",
  "/past-post/",
  "/request-documents/",
  "/entrance/",
  "/english-training/",
  "/lexus-premier/",
  "/medical-english-training/",
  "/medical-math-training/",
  "/information-faq/",
  "/kuriage-information/",
  "/penguin-geometry/",
  "/penguin-integral/",
  "/test-entry/",
  "/top/access/",
  "/top/voice/",
  "/lexus-online/",
  "/lexus-online/application-flow/",
  "/lexus-online/contact/",
  "/lexus-online/development-flow/",
  "/lexus-online/policy/",
  "/top/reservation/",
  "/top/history/",
  "/top/lexus-garden/",
  "/top/teacher/",
  "/top/course/",
  "/top/contact/",
  "/top/faq/",
  "/top/information-kokuritsu/",
  "/top/information-shiritsu/",
  "/top/line/",
  "/top/summer-plan/",
  "/top/course/lexus-premiere-course/",
  "/top/course/medical-prep-junior/",
  "/top/course/custom-made-course/",
  "/top/course/high-level-geneki-course/",
  "/top/results/",
  "/top/course/medical-prep/",
];

const normalizeUrl = (pathOrUrl: string) => {
  const url = new URL(pathOrUrl, SITE_ORIGIN);
  const pathname = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
  return new URL(pathname, SITE_ORIGIN).href;
};

const normalizeLastmod = (value?: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
};

const addEntry = (entries: Map<string, SitemapEntry>, input: SitemapEntryInput) => {
  const url = normalizeUrl(input.path);
  if (!url.startsWith(`${SITE_ORIGIN}/`)) return;

  const lastmod = normalizeLastmod(input.lastmod);
  const existing = entries.get(url);
  if (!existing || (lastmod && (!existing.lastmod || lastmod > existing.lastmod))) {
    entries.set(url, { url, lastmod: lastmod ?? existing?.lastmod });
  }
};

export const getSitemapEntries = () => {
  const entries = new Map<string, SitemapEntry>();

  for (const path of staticPagePaths) addEntry(entries, { path });

  for (const route of getFixedPageStaticPaths()) {
    addEntry(entries, { path: route.props.page.path });
  }

  for (const post of migratedPosts) {
    addEntry(entries, { path: post.path, lastmod: post.modified || post.date });
  }

  return [...entries.values()].sort((a, b) => a.url.localeCompare(b.url));
};
