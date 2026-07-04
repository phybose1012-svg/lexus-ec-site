import admissionInfoPosts from "../data/generated/admissionInfoPosts.json";
import interviewPrepPosts from "../data/generated/interviewPrepPosts.json";
import universityStrategyPosts from "../data/generated/universityStrategyPosts.json";
import voiceInterviewPosts from "../data/generated/voiceInterviewPosts.json";
import type { ArticleTemplateId } from "../data/articleTemplates";
import { classifyArticlePost } from "../data/articleTaxonomy.js";

export type MigratedPostImage = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export type MigratedPostInfoItem = {
  label: string;
  value: string;
};

export type MigratedPostTocItem = {
  id: string;
  text: string;
  level?: 2 | 3;
};

export type MigratedPost = {
  id: number;
  slug: string;
  path: string;
  url: string;
  template: ArticleTemplateId;
  title: string;
  displayTitle?: string;
  displayTitleLines?: string[];
  description: string;
  canonical: string;
  date: string;
  modified: string;
  categories: string[];
  tags: string[];
  lead: string;
  heroBadge?: string;
  heroMessage?: string;
  heroMessageLines?: string[];
  heroVariant?: "standard" | "oni" | "interview";
  keyPoints: string[];
  infoItems: MigratedPostInfoItem[];
  toc: MigratedPostTocItem[];
  heroImage: MigratedPostImage | null;
  contentHtml: string;
  sourceMetrics?: {
    htmlBytes: number;
    tocCount: number;
    imageCount: number;
    originalHtmlBytes: number;
  };
};

const normalizeMigratedPostPath = (value: string) => {
  let pathname = value;
  try {
    pathname = new URL(value).pathname;
  } catch {
    pathname = value;
  }
  pathname = pathname.split(/[?#]/)[0] || "/";
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
};

const decodeEntities = (value = "") =>
  value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#039;/g, "'");

const cleanText = (value = "") =>
  decodeEntities(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const escapeHtmlAttr = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const attr = (tag: string, name: string) => {
  const match = tag.match(new RegExp(`${name}=["']([^"']*)["']`, "i"));
  return match?.[1] || "";
};

const assetLabel = (href: string) => {
  const pathname = normalizeMigratedPostPath(href).split(/[?#]/)[0] || href;
  const fileName = pathname.split("/").filter(Boolean).pop() || "画像";
  let label = decodeEntities(fileName);
  try {
    label = decodeURIComponent(label);
  } catch {
    // Keep the readable fallback from the original URL.
  }
  return label
    .replace(/\.(?:jpe?g|png|webp|gif|avif)$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim() || "画像";
};

const imageLinkLabel = (href: string, inner: string) => {
  const imageTag = inner.match(/<img\b[^>]*>/i)?.[0] || "";
  const imageAlt = cleanText(attr(imageTag, "alt"));
  if (imageAlt) return `画像を拡大する: ${imageAlt}`;
  const pathname = normalizeMigratedPostPath(href).split(/[?#]/)[0] || "";
  if (/\.(?:jpe?g|png|webp|gif|avif)$/i.test(pathname)) return `画像を拡大する: ${assetLabel(href)}`;
  return "";
};

const labelNamelessLinks = (html: string) =>
  html.replace(
    /<a\b([^>]*?)href=(["'])(.*?)\2([^>]*)>([\s\S]*?)<\/a>/gi,
    (match, before, quote, href, after, inner) => {
      if (/\saria-label=(["']).*?\1/i.test(`${before} ${after}`)) return match;
      if (cleanText(inner)) return match;
      const label = imageLinkLabel(href, inner);
      if (!label) return match;
      return `<a${before}aria-label="${escapeHtmlAttr(label)}" href=${quote}${href}${quote}${after}>${inner}</a>`;
    },
  );

const postTitleOverrides: Record<string, string> = {
  "/information-faq/": "医学部入試のQ&A｜倍率・学費・卒業率を医学部予備校レクサスが解説",
};

const dedicatedFixedPostPaths = new Set(["/information-faq/"]);

const uniqueStrings = (items: string[]) => [...new Set(items.filter(Boolean))];

const universityTypeCategory = (value: string) => {
  if (value === "国公立") return "国公立医学部";
  if (value === "私立") return "私立医学部";
  return "";
};

const prepareMigratedPost = (post: MigratedPost): MigratedPost => {
  const path = normalizeMigratedPostPath(post.path);
  const normalizedPost = {
    ...post,
    path,
    title: postTitleOverrides[path] || post.title,
  };
  const taxonomy = classifyArticlePost(normalizedPost);
  const taxonomyCategories = uniqueStrings([
    taxonomy.primaryCategory,
    taxonomy.subCategory,
    universityTypeCategory(taxonomy.facets.universityType),
    taxonomy.facets.region !== "全国" ? taxonomy.facets.region : "",
  ]);
  const taxonomyTags = uniqueStrings([
    ...(post.tags || []).filter((tag) => tag !== "未分類"),
    taxonomy.facets.examType,
    ...taxonomy.facets.subjects,
    ...taxonomy.facets.storyTags,
  ]);

  return {
    ...normalizedPost,
    categories: taxonomyCategories,
    tags: taxonomyTags,
    contentHtml: labelNamelessLinks(post.contentHtml),
  };
};

export const migratedPosts = [
  ...admissionInfoPosts,
  ...universityStrategyPosts,
  ...interviewPrepPosts,
  ...voiceInterviewPosts,
]
  .filter((post) => !dedicatedFixedPostPaths.has(normalizeMigratedPostPath((post as MigratedPost).path)))
  .map((post) => prepareMigratedPost(post as MigratedPost)) as MigratedPost[];

export const getMigratedPostStaticPaths = () =>
  migratedPosts.map((post) => ({
    params: { slug: decodeURIComponent(post.path).replace(/^\/|\/$/g, "") },
    props: { post },
  }));

const postPathname = (value: string) => {
  try {
    return new URL(value).pathname;
  } catch {
    return value;
  }
};

const postPathVariants = (value: string) => {
  const variants = new Set<string>();
  const add = (item: string) => {
    const pathname = postPathname(item).split(/[?#]/)[0] || "/";
    variants.add(pathname.endsWith("/") ? pathname : `${pathname}/`);
  };

  add(value);
  try {
    add(decodeURIComponent(value));
  } catch {
    // Keep the original encoded route when decoding is not possible.
  }

  return variants;
};

export const getMigratedPostByPath = (path: string) => {
  const requestedVariants = postPathVariants(path);
  return migratedPosts.find((post) =>
    [...postPathVariants(post.path)].some((variant) => requestedVariants.has(variant)),
  );
};
