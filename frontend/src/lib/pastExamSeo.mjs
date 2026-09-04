// Keep metadata, visible breadcrumbs and JSON-LD in sync for every imported exam.
export const SITE_ORIGIN = "https://lexus-ec.com";
export const PAST_EXAM_SOCIAL_IMAGE = "/assets/optimized/footer-logo-760.webp";
export const PAST_EXAM_SOCIAL_IMAGE_ALT = "鬼特訓する医学部予備校 レクサス E.C.（レクサス教育センター）";

/** @typedef {{name: string, path: string}} Breadcrumb */
/** @param {string} path */
export function canonicalFor(path) {
  const url = new URL(path, SITE_ORIGIN);
  if (url.origin !== SITE_ORIGIN || !url.pathname.startsWith("/")) throw new Error("Expected a Lexus page URL");
  url.search = "";
  url.hash = "";
  if (!url.pathname.endsWith("/")) url.pathname += "/";
  return url.href;
}

/** @param {unknown} data */
export function serializeJsonLd(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

/**
 * @param {{title: string, description: string, path: string, breadcrumbs: Breadcrumb[],
 * collection?: boolean, resource?: {name: string, kind: string, about: string}}} input
 */
export function buildPastExamPageSeo(input) {
  const canonical = canonicalFor(input.path);
  const organization = { "@id": `${SITE_ORIGIN}/#organization` };
  const webpage = { "@id": `${canonical}#webpage` };
  const resourceId = { "@id": `${canonical}#learning-resource` };
  const breadcrumbId = { "@id": `${canonical}#breadcrumb` };
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": input.collection ? "CollectionPage" : "WebPage",
        ...webpage,
        url: canonical,
        name: input.title,
        description: input.description,
        inLanguage: "ja",
        publisher: organization,
        breadcrumb: breadcrumbId,
        ...(input.resource ? { mainEntity: resourceId } : {}),
      },
      ...(input.resource ? [{
        "@type": "LearningResource",
        ...resourceId,
        url: canonical,
        name: input.resource.name,
        description: input.description,
        inLanguage: "ja",
        learningResourceType: input.resource.kind,
        about: { "@type": "Thing", name: input.resource.about },
        mainEntityOfPage: webpage,
        provider: organization,
      }] : []),
      {
        "@type": "BreadcrumbList",
        ...breadcrumbId,
        itemListElement: input.breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem", position: index + 1, name: crumb.name, item: canonicalFor(crumb.path),
        })),
      },
      {
        "@type": "EducationalOrganization",
        ...organization,
        name: "レクサス教育センター",
        url: `${SITE_ORIGIN}/`,
        logo: new URL(PAST_EXAM_SOCIAL_IMAGE, SITE_ORIGIN).href,
      },
    ],
  };
  return { title: input.title, description: input.description, canonical, breadcrumbs: input.breadcrumbs, structuredData };
}

/**
 * No invented dates, official-answer claims or university authorship.
 * @param {{mode: "questions" | "answers" | "analysis", university: string, year: string | number,
 * subject: string, examLabel: string, majorCount: number, path: string, universityPath: string}} input
 */
export function buildExamDocumentSeo(input) {
  const labels = { questions: "問題", answers: "解答・解説", analysis: "出題分析" };
  const label = labels[input.mode];
  const name = `${input.university}医学部 ${input.year}年度 ${input.subject}の過去問${input.mode === "questions" ? "" : ` ${label}`}`;
  const introduction = `${input.university}医学部の${input.year}年度${input.examLabel}・${input.subject}。`;
  const descriptions = {
    questions: `過去問全${input.majorCount}題を大問別に掲載。問題文・数式を確認でき、印刷にも対応しています。解答・解説と出題分析へも移動できます。`,
    answers: `過去問全${input.majorCount}題の解答と、計算過程・考え方を大問別に解説。レクサスE.C.独自作成の解説を、問題と照らし合わせて確認・印刷できます。`,
    analysis: "出題分野、難易度別の仮配点、目標点、解く順番を図表で整理。レクサスE.C.の編集評価をもとに、優先して解く小問と復習のポイントを確認できます。",
  };
  const breadcrumbs = [
    { name: "ホーム", path: "/" },
    { name: "過去問ライブラリー", path: "/past-exam-library/" },
    { name: input.university, path: input.universityPath },
    { name: `${input.year}年度 ${input.subject} ${label}`, path: input.path },
  ];
  return buildPastExamPageSeo({
    title: `${name}｜レクサス教育センター`,
    description: introduction + descriptions[input.mode],
    path: input.path,
    breadcrumbs,
    resource: { name, kind: label, about: `${input.university}医学部 ${input.year}年度 ${input.examLabel} ${input.subject}` },
  });
}
