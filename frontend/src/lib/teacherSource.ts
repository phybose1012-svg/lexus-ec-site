import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { seo } from "../data/home";

export type TeacherTrait = {
  label: string;
  value: string;
};

export type TeacherCard = {
  name: string;
  role: string;
  kana: string;
  history: string;
  traits: TeacherTrait[];
  review: string;
  videoLabel: string;
  videoUrl?: string;
  image: {
    src: string;
    alt: string;
  };
};

export type TeacherSubject = {
  subject: string;
  english: string;
  slug: string;
  tone: "math" | "english" | "chemistry" | "biology" | "physics" | "essay";
  teachers: TeacherCard[];
};

export type TeacherPage = {
  title: string;
  description: string;
  canonical: string;
  h1: string;
  lead: string;
  confidence: string;
  ctaLabel: string;
  logoStrip: string;
  heroPortraits: { src: string; alt: string }[];
  representative: {
    title: string;
    role: string;
    name: string;
    image: { src: string; alt: string };
    message: string[];
  };
  note: string;
  subjects: TeacherSubject[];
};

type HeadingRow = {
  tag: "h1" | "h2" | "h3" | "h4";
  text: string;
  pos: number;
};

type SourceImage = {
  src: string;
  alt: string;
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
    new URL("../../baseline/pages/top_teacher.html", import.meta.url),
    new URL("../../../baseline/pages/top_teacher.html", import.meta.url),
    new URL("../../../../baseline/pages/top_teacher.html", import.meta.url),
    new URL("../../../../../baseline/pages/top_teacher.html", import.meta.url),
    new URL("../../../../../../baseline/pages/top_teacher.html", import.meta.url),
  ]);

const reviewMarker = "～ 授業を受けた生徒の感想 ～";
const ctaMarker = "ぼくらの授業を体験しよう";

const subjectMeta: Record<string, Omit<TeacherSubject, "teachers" | "subject">> = {
  数学科講師: { english: "Mathematics", slug: "mathematics", tone: "math" },
  英語科講師: { english: "English", slug: "english", tone: "english" },
  化学科講師: { english: "Chemistry", slug: "chemistry", tone: "chemistry" },
  生物科講師: { english: "Biology", slug: "biology", tone: "biology" },
  物理科講師: { english: "Physics", slug: "physics", tone: "physics" },
  "小論文・面接講師": { english: "Essay / Interview", slug: "essay-interview", tone: "essay" },
};

const decodeEntities = (value = "") =>
  value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&#038;|&amp;/g, "&")
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

const attr = (tag: string, name: string) => {
  const match = tag.match(new RegExp(`${name}=["']([^"']+)["']`, "i"));
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

const sourceImages = (html: string) =>
  [...html.replace(/<noscript[\s\S]*?<\/noscript>/gi, (match) => " ".repeat(match.length)).matchAll(/<img[^>]+>/gi)]
    .map((match) => {
      const tag = match[0];
      return {
        src: localLegacyAsset(attr(tag, "data-lazy-src") || attr(tag, "src")),
        alt: attr(tag, "alt"),
        pos: match.index || 0,
      };
    })
    .filter((image) => image.src && !image.src.startsWith("data:image"));

const streamCustomerSubdomain = "customer-306wg26hqgs83akz.cloudflarestream.com";

const teacherStreamVideoIds: Record<string, string> = {
  "東京女子医科数学.mp4": "6f895cc5eacc75d011bf697718f01a77",
  "慶応義塾数学_1.mp4": "c14e4c331825dc7777992305f67f3b9b",
  "順天堂数学.mp4": "65dc073022ec19528200e5c3be60d25c",
  "東京医科英語.mp4": "ea0461d4aec3399d717eb8f40fe25450",
  "昭和英語.mp4": "a330a69d4ff2ae89d5b181c6cee0c02a",
  "国際医療福祉英語.mp4": "bc3e5ae09fe03ea2250407730e84d5c7",
  "帝京英語.mp4": "74ad4c2b3bf37c56deb4833ae06557a0",
  "東京女子医科英語.mp4": "f48052d85d951d63aa91a72962d1fe11",
  "東京慈恵会医科英語.mp4": "582fb88f6ac0e5677131f847ef23cfc6",
  "日本医科化学.mp4": "56b46a70990cc3b5cef23ad1b8d7e013",
  "杏林化学.mp4": "6b35cbcd3ea6bf29f317caa0a6357223",
  "大阪医科薬科化学.mp4": "733a9d3d518d087a792c3bef742c9e49",
  "日本医科生物.mp4": "30d4204d1bc574e2ec79d67b4a831c0f",
  "慶応義塾生物.mp4": "bde8995c85b6286ba4234399135b25f7",
  "東京慈恵会医科生物.mp4": "bdb2abdd6dcd4ec79fb33ddbbb993040",
  "順天堂物理.mp4": "f19726e3293c8d14fee3938944698a49",
  "東京慈恵会医科物理.mp4": "19d8ff67bf573d693ce903d44109244f",
  "川崎医科物理.mp4": "169589f2ed4854540e2f76a2cd5186bc",
};

const teacherStreamVideoIdsByTeacher: Record<string, string> = {
  "高橋 一八": "94d5066c16f08419cd78fcd46f9863e7",
};

const streamVideoUrlFromId = (videoId: string) => `https://${streamCustomerSubdomain}/${videoId}/iframe`;

const streamVideoUrl = (legacyUrl: string) => {
  const pathname = new URL(legacyUrl).pathname;
  const filename = decodeURIComponent(pathname.slice(pathname.lastIndexOf("/") + 1));
  const videoId = teacherStreamVideoIds[filename];

  if (!videoId) {
    throw new Error(`Cloudflare Stream video is not mapped: ${filename}`);
  }

  return streamVideoUrlFromId(videoId);
};

const sourceVideos = (html: string) =>
  [...html.matchAll(/<video[\s\S]*?<\/video>/gi)]
    .flatMap((match) => [...match[0].matchAll(/(?:src|data-lazy-src)=["']([^"']+\.mp4[^"']*)/gi)].map((videoMatch) => decodeEntities(videoMatch[1])))
    .filter(Boolean)
    .map(streamVideoUrl);

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

const meaningfulTeacherImage = (image: SourceImage) =>
  !image.src.includes("アイコン") && !image.src.includes("ロゴ") && !image.src.includes("背景ロゴ") && !image.src.includes("社名ロゴ");

const imageBefore = (images: SourceImage[], pos: number, minPos = 0) => {
  const candidates = images.filter((image) => image.pos >= minPos && image.pos < pos && meaningfulTeacherImage(image));
  return candidates[candidates.length - 1];
};

const imageAfter = (images: SourceImage[], pos: number, maxPos: number) =>
  images.find((image) => image.pos > pos && image.pos < maxPos && meaningfulTeacherImage(image));

const imageByTeacherName = (images: SourceImage[], name: string) => {
  const surname = name.split(/\s+/)[0];
  if (!surname) return undefined;
  return images.find((image) => meaningfulTeacherImage(image) && cleanText(image.alt).includes(surname));
};

const cleanRole = (role: string) => {
  const compact = role.replace(/\s+/g, " ").trim();
  if (!compact) return "";
  if (compact.length > 32) return "";
  if (/指導歴|授業|感想|動画|体験授業|講師$/.test(compact)) return "";
  return compact;
};

const extractTeacher = (html: string, images: SourceImage[], subjectStart: number, heading: HeadingRow, blockEnd: number): TeacherCard => {
  const image =
    imageBefore(images, heading.pos, subjectStart) ||
    imageByTeacherName(images, heading.text) ||
    imageAfter(images, heading.pos, blockEnd) || {
    src: "",
    alt: heading.text,
    pos: heading.pos,
  };
  const blockStart = Math.max(subjectStart, Math.min(image.pos, heading.pos));
  const block = cleanText(html.slice(blockStart, blockEnd));
  const nameIndex = block.indexOf(heading.text);
  const role = cleanRole(nameIndex >= 0 ? block.slice(0, nameIndex).trim() : "");
  let rest = nameIndex >= 0 ? block.slice(nameIndex + heading.text.length).trim() : block;

  const historyMatch = rest.match(/指導歴[：:]\s*([^\s]+(?:以上)?)/u);
  const kana = historyMatch ? rest.slice(0, historyMatch.index).trim() : "";
  const history = historyMatch ? historyMatch[1] : "";
  rest = historyMatch ? rest.slice((historyMatch.index || 0) + historyMatch[0].length).trim() : rest;

  const reviewIndex = rest.indexOf(reviewMarker);
  const traitsText = reviewIndex >= 0 ? rest.slice(0, reviewIndex).trim() : "";
  let review = reviewIndex >= 0 ? rest.slice(reviewIndex + reviewMarker.length).trim() : "";
  const videoMatch = review.match(/([^\s]+?先生の動画(?:を見る|準備中))/u);
  const videoLabel = videoMatch?.[1] || "";
  if (videoMatch) review = review.slice(0, videoMatch.index).trim();

  const traits = [...traitsText.matchAll(/([^\s：:]+)[：:]\s*([★☆\s]+)/gu)].map((match) => ({
    label: match[1],
    value: match[2].replace(/\s+/g, ""),
  }));

  return {
    name: heading.text,
    role,
    kana,
    history,
    traits,
    review,
    videoLabel,
    image: {
      src: image.src,
      alt: image.alt || heading.text,
    },
  };
};

const extractSubjects = (html: string, headings: HeadingRow[], images: SourceImage[], videos: string[]) => {
  const h2s = headings.filter((heading) => heading.tag === "h2");
  const subjects = h2s.map((h2, subjectIndex) => {
    const nextH2 = h2s[subjectIndex + 1]?.pos ?? html.indexOf(ctaMarker, h2.pos);
    const sectionEnd = nextH2 > 0 ? nextH2 : html.length;
    const teacherHeadings = headings.filter((heading) => heading.tag === "h3" && heading.pos > h2.pos && heading.pos < sectionEnd);
    const meta = subjectMeta[h2.text] || { english: h2.text, slug: `subject-${subjectIndex + 1}`, tone: "math" as const };

    return {
      subject: h2.text,
      ...meta,
      teachers: teacherHeadings.map((heading, teacherIndex) => {
        const nextHeading = teacherHeadings[teacherIndex + 1]?.pos ?? sectionEnd;
        return extractTeacher(html, images, h2.pos, heading, nextHeading);
      }),
    };
  });

  let videoIndex = 0;
  for (const subject of subjects) {
    for (const teacher of subject.teachers) {
      if (teacher.videoLabel.includes("準備中")) continue;
      const directVideoId = teacherStreamVideoIdsByTeacher[teacher.name];
      if (directVideoId) {
        teacher.videoUrl = streamVideoUrlFromId(directVideoId);
        continue;
      }
      teacher.videoUrl = videos[videoIndex];
      videoIndex += 1;
    }
  }

  return subjects;
};

export const getTeacherPage = (): TeacherPage => {
  const html = readFileSync(baselineFile(), "utf8");
  const headings = headingRows(html);
  const h1 = headings.find((heading) => heading.tag === "h1")?.text || "医学部受験を知り尽くした講師陣";
  const images = sourceImages(html);
  const videos = sourceVideos(html);
  const firstSubjectPos = headings.find((heading) => heading.tag === "h2")?.pos || html.length;
  const pageImages = images.filter((image) => image.pos > (headings.find((heading) => heading.tag === "h1")?.pos || 0) && image.pos < firstSubjectPos);
  const heroPortraits = pageImages.filter(meaningfulTeacherImage).slice(0, 2).map(({ src, alt }) => ({ src, alt }));
  const representativeImage = images.find((image) => image.alt.includes("島内")) || pageImages.find(meaningfulTeacherImage) || images[0];
  const logoStrip = images.find((image) => image.src.includes("背景ロゴだらけメニュー透明3"))?.src || "";

  void pageTitle;
  return {
    title: "医学部予備校の講師紹介｜質にこだわり抜いたプロ講師陣｜レクサスE.C.",
    description: metaContent(html, "description") || "レクサス教育センターの医学部受験を知り尽くした講師陣を紹介します。",
    canonical: "https://lexus-ec.com/top/teacher/",
    h1,
    lead: "レクサス教育センターの講師達は10年以上の指導歴をもつプロ集団です。",
    confidence: "質の高さに\n自信があります。",
    ctaLabel: "体験授業を予約",
    logoStrip,
    heroPortraits,
    representative: {
      title: "30年以上こだわり抜いた「講師の質」",
      role: "レクサス教育センター代表",
      name: "島内 義仁",
      image: {
        src: representativeImage.src,
        alt: representativeImage.alt || "レクサス教育センター代表 島内義仁",
      },
      message: [
        "レクサスは、生徒ができるようになるまで見届ける予備校である。",
        "「―――。あとは復習しておくように！」で終わらせる予備校にはしたくない。",
        "私の予備校では曖昧なアドバイスはしない。アドバイスには具体性（いつ、何を、どのようにするのか）が必要だ。過保護かも知れないがその進捗確認も。",
        "そして、できるまで導くには、ダメなものはダメだと指摘する「厳しさ」も必要だ。",
        "生徒の人気取りに必死な講師は必要ない。生徒を受からせる情熱と実力のある講師が欲しい。",
        "このような思いに賛同し集まったのが、現在の講師達です。",
      ],
    },
    note: "※ 講師本人の希望で、顔写真の掲載を望まない講師の情報は掲載していません。本ページで紹介していない講師を含めた全ての講師がレクサスの自慢です。",
    subjects: extractSubjects(html, headings, images, videos),
  };
};
