import admissionInfoPosts from "../data/generated/admissionInfoPosts.json";
import interviewPrepPosts from "../data/generated/interviewPrepPosts.json";
import universityStrategyPosts from "../data/generated/universityStrategyPosts.json";
import voiceInterviewPosts from "../data/generated/voiceInterviewPosts.json";
import type { ArticleTemplateId } from "../data/articleTemplates";

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

export const migratedPosts = [
  ...admissionInfoPosts,
  ...universityStrategyPosts,
  ...interviewPrepPosts,
  ...voiceInterviewPosts,
] as MigratedPost[];

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
