import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { seo } from "../data/home";

export type VoiceImage = {
  src: string;
  alt: string;
  width?: string;
  height?: string;
  pos: number;
  headline?: string;
  stats?: string;
};

export type VoiceSuccessStat = {
  label: string;
  value: string;
};

export type VoiceSuccessStory = {
  headline: string;
  image: VoiceImage;
  stats: VoiceSuccessStat[];
  videoUrl?: string;
  videoLabel: string;
};

export type VoiceVideo = {
  title: string;
  url: string;
  duration: string;
  thumbnail?: VoiceImage;
};

export type VoiceInterview = {
  title: string;
  href: string;
  image?: VoiceImage;
};

export type VoicePage = {
  title: string;
  description: string;
  canonical: string;
  h1: string;
  mainCopy: string;
  graduateCopy: string;
  logoStrip?: VoiceImage;
  successPhotos: VoiceSuccessStory[];
  videos: VoiceVideo[];
  garden?: VoiceImage;
  interviews: VoiceInterview[];
  guideTitle: string;
  guideLead: string;
};

type HeadingRow = {
  tag: "h1" | "h2" | "h3" | "h4";
  text: string;
  pos: number;
};

const firstReadableFile = (urls: URL[]) => {
  for (const url of urls) {
    const file = fileURLToPath(url);
    try {
      readFileSync(file, "utf8");
      return file;
    } catch {
      // Astro resolves import.meta.url differently in dev source files and built route modules.
    }
  }
  return fileURLToPath(urls[0]);
};

const baselineFile = () =>
  firstReadableFile([
    new URL("../../baseline/pages/top_voice.html", import.meta.url),
    new URL("../../../baseline/pages/top_voice.html", import.meta.url),
    new URL("../../../../baseline/pages/top_voice.html", import.meta.url),
    new URL("../../../../../baseline/pages/top_voice.html", import.meta.url),
    new URL("../../../../../../baseline/pages/top_voice.html", import.meta.url),
  ]);

const decodeEntities = (value = "") =>
  value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&#038;|&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#039;/g, "'")
    .replace(/&rarr;/g, "→")
    .replace(/&hellip;/g, "...");

const cleanText = (value = "") =>
  decodeEntities(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const attr = (tag: string, name: string) => {
  const match = tag.match(new RegExp(`${name}=["']([^"']*)["']`, "i"));
  return decodeEntities(match?.[1] || "");
};

const localLegacyAsset = (src: string) => {
  try {
    const url = new URL(src);
    if (url.hostname === "lexus-ec.com" && url.pathname.startsWith("/wp-content/uploads/")) {
      return `/assets/legacy${decodeURI(url.pathname)}`;
    }
  } catch {
    // Relative URLs and malformed legacy values are returned unchanged.
  }
  return src;
};

const imageFromTag = (tag: string, pos: number): VoiceImage | undefined => {
  const src = attr(tag, "data-lazy-src") || attr(tag, "src");
  if (!src || src.startsWith("data:image")) return undefined;
  return {
    src: localLegacyAsset(src),
    alt: cleanText(attr(tag, "alt")),
    width: attr(tag, "width"),
    height: attr(tag, "height"),
    pos,
  };
};

const isVoiceImage = (image: VoiceImage | undefined): image is VoiceImage => Boolean(image);

const sourceImages = (html: string) => {
  const seen = new Set<string>();
  return [...html.matchAll(/<img[^>]+>/gi)]
    .map((match) => imageFromTag(match[0], match.index || 0))
    .filter(isVoiceImage)
    .filter((image) => {
      if (seen.has(image.src)) return false;
      seen.add(image.src);
      return true;
    });
};

const headingRows = (html: string): HeadingRow[] =>
  [...html.matchAll(/<h([1-4])[^>]*>([\s\S]*?)<\/h\1>/gi)]
    .map((match) => ({
      tag: `h${match[1]}` as HeadingRow["tag"],
      text: cleanText(match[2]),
      pos: match.index || 0,
    }))
    .filter((heading) => heading.text);

const metaContent = (html: string, name: string) => {
  const tag = html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]*>`, "i"))?.[0] || "";
  return cleanText(attr(tag, "content"));
};

const pageTitle = (html: string, h1: string) => cleanText(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "") || `${h1} | ${seo.title}`;

const normalizeHref = (href: string) => href || "/";

const imageForTitle = (images: VoiceImage[], title: string) => images.find((image) => cleanText(image.alt).replace(/\s+/g, "") === title.replace(/\s+/g, ""));

const normalizeVideoUrl = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) return "";
  try {
    const parsed = new URL(trimmed);
    const isLegacyUploadVideo =
      parsed.hostname === "lexus-ec.com" &&
      parsed.pathname.startsWith("/wp-content/uploads/") &&
      /\.(?:mp4|mov|webm)$/i.test(parsed.pathname);
    if (isLegacyUploadVideo) return "";
  } catch {
    // Keep relative or malformed legacy values out of the rendered video links.
    return "";
  }
  return trimmed;
};

const extractVideos = (html: string, images: VoiceImage[]) =>
  [...html.matchAll(/<div[^>]+data-video-url=["'][^"']*["'][^>]*data-video-title=["'][^"']*["'][^>]*>/gi)].map((match) => {
    const tag = match[0];
    const title = attr(tag, "data-video-title");
    return {
      title,
      url: normalizeVideoUrl(attr(tag, "data-video-url")),
      duration: attr(tag, "data-video-duration"),
      thumbnail: imageForTitle(images, title),
    };
  });

const videoUrlFromId = (videoId: string) => (videoId ? `https://www.youtube.com/watch?v=${videoId}` : "");

const extractSuccessStats = (block: string): VoiceSuccessStat[] =>
  [...block.matchAll(/<span>([\s\S]*?)<\/span>/gi)]
    .map((match) => {
      const row = match[1];
      const label = cleanText(row.match(/<strong>([\s\S]*?)<\/strong>/i)?.[1] || "");
      const value = cleanText(row.replace(/<strong>[\s\S]*?<\/strong>/i, ""));
      return { label, value };
    })
    .filter((row) => row.label || row.value);

const extractSuccessStories = (html: string): VoiceSuccessStory[] =>
  [...html.matchAll(/<div class=["']lexus-card["']>([\s\S]*?)(?=<div class=["']lexus-card["']>|<button class=["']lexus-readmore-btn["'])/gi)]
    .flatMap((match): VoiceSuccessStory[] => {
      const block = match[1];
      const imageTag = block.match(/<img[^>]+>/i)?.[0] || "";
      const image = imageFromTag(imageTag, match.index || 0);
      const headline = cleanText(block.match(/<div class=["']lexus-card-header["']>([\s\S]*?)<\/div>/i)?.[1] || "");
      const button = block.match(/<a[^>]+class=["']lexus-video-btn["'][\s\S]*?<\/a>/i)?.[0] || "";
      const videoId = button.match(/openLexusModal\(["']([^"']+)["']\)/i)?.[1] || "";
      const videoLabel = cleanText(button) || "インタビュー動画を見る";
      return image && headline
        ? [
            {
              headline,
              image,
              stats: extractSuccessStats(block),
              videoUrl: videoUrlFromId(videoId),
              videoLabel,
            },
          ]
        : [];
    });

const extractInterviews = (html: string, images: VoiceImage[], gardenPos: number) => {
  const articleInterviews = extractInterviewsFromArticles(html);
  if (articleInterviews.length) return articleInterviews;

  const seen = new Set<string>();
  const articleImages = images.filter((image) => image.pos > gardenPos && !image.src.includes("遉ｾ蜷阪Ο繧ｴ") && !image.src.includes("アイコン"));

  return [...html.matchAll(/<h3[^>]+class=["'][^"']*elementor-post__title[^"']*["'][^>]*>[\s\S]*?<\/h3>/gi)]
    .map((match) => {
      const openingTag = match[0].match(/<a\b[^>]*>/i)?.[0] || "";
      return {
        title: cleanText(match[0]),
        href: normalizeHref(attr(openingTag, "href")),
      };
    })
    .filter((item) => item.href && item.title)
    .filter((item) => {
      if (seen.has(item.href)) return false;
      seen.add(item.href);
      return true;
    })
    .map((item, index) => ({
      ...item,
      image: articleImages[index],
    }));
};

const interviewImageFromBlock = (block: string, blockPos: number) =>
  [...block.matchAll(/<img[^>]+>/gi)]
    .map((match) => imageFromTag(match[0], blockPos + (match.index || 0)))
    .filter(isVoiceImage)
    .find((image) => !image.src.includes("社名ロゴ") && !image.src.includes("背景ロゴ") && !image.src.includes("アイコン"));

const extractInterviewsFromArticles = (html: string): VoiceInterview[] => {
  const seen = new Set<string>();
  return [...html.matchAll(/<article\b[\s\S]*?elementor-post[\s\S]*?<\/article>/gi)]
    .flatMap((match): VoiceInterview[] => {
      const block = match[0];
      const titleHtml = block.match(/<h3[^>]+class=["'][^"']*elementor-post__title[^"']*["'][^>]*>[\s\S]*?<\/h3>/i)?.[0] || "";
      const openingTag = titleHtml.match(/<a\b[^>]*>/i)?.[0] || "";
      const title = cleanText(titleHtml);
      const href = normalizeHref(attr(openingTag, "href"));
      const image = interviewImageFromBlock(block, match.index || 0);
      return title && href && image ? [{ title, href, image }] : [];
    })
    .filter((item) => {
      if (seen.has(item.href)) return false;
      seen.add(item.href);
      return true;
    });
};

export const getVoicePage = (): VoicePage => {
  const html = readFileSync(baselineFile(), "utf8");
  const headings = headingRows(html);
  const images = sourceImages(html);
  const h1 = headings.find((heading) => heading.tag === "h1")?.text || "合格体験記";
  const logoStrip = images.find((image) => image.src.includes("背景ロゴだらけメニュー透明3"));
  const garden = images.find((image) => image.src.includes("レクサスガーデン-1-04"));
  const successPhotos = extractSuccessStories(html);
  const successEnd = logoStrip?.pos || images[24]?.pos || html.length;
  const successDetails: VoiceImage[] = [];
  const legacySuccessPhotos = images
    .filter((image) => image.pos < successEnd && image.alt.includes("合格") && image.alt.includes("生徒"))
    .slice(0, 19)
    .map((image, index) => ({ ...image, ...successDetails[index] }));
  void legacySuccessPhotos;
  const videos = extractVideos(html, images);
  const interviews = extractInterviews(html, images, garden?.pos || 0);
  const guideTitle = headings.find((heading) => heading.text === "資料請求した方へプレゼント")?.text || "資料請求した方へプレゼント";
  const guideLead =
    headings.find((heading) => heading.text.includes("レクサスのプロ講師") && heading.tag === "h2")?.text ||
    "レクサスのプロ講師と、レクサスの卒業生が、共同で作りました。";

  void pageTitle;
  return {
    title: "医学部の合格体験記｜逆転合格した卒業生・保護者の声｜レクサスE.C.",
    description: metaContent(html, "description") || "医学部予備校レクサス教育センターの合格体験記、合格者インタビュー、保護者様の声を紹介します。",
    canonical: "https://lexus-ec.com/top/voice/",
    h1,
    mainCopy: headings.find((heading) => heading.text.includes("厳しさ") && heading.tag === "h2")?.text || "「厳しさ」が最短合格の絶対条件",
    graduateCopy: headings.find((heading) => heading.text.includes("１０００人以上"))?.text || "レクサスを卒業した１０００人以上が、医師として活躍中！",
    logoStrip,
    successPhotos,
    videos,
    garden,
    interviews,
    guideTitle,
    guideLead,
  };
};
