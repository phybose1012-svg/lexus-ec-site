export type ArticleTemplateId =
  | "university-entrance-strategy"
  | "admission-info"
  | "interview-prep-guide"
  | "waitlist-info"
  | "subject-analysis"
  | "parent-letter"
  | "voice-interview"
  | "general-column";

export type ArticleCtaVariant = "exam" | "consultation" | "voice" | "parent" | "default";

export interface ArticleTemplateDefinition {
  id: ArticleTemplateId;
  label: string;
  componentName: string;
  count: number;
  source2026Count: number;
  legacyRewriteCount: number;
  ctaVariant: ArticleCtaVariant;
  visualTone: "data" | "guide" | "story" | "column";
  referenceSlugs: string[];
  requiredFields: string[];
  sectionOrder: string[];
  rewritePolicy: string;
}

export const articleTemplates: ArticleTemplateDefinition[] = [
  {
    id: "admission-info",
    label: "入試情報記事",
    componentName: "AdmissionInfoArticle",
    count: 183,
    source2026Count: 102,
    legacyRewriteCount: 81,
    ctaVariant: "exam",
    visualTone: "data",
    referenceSlugs: [
      "2026-yamagata-niji",
      "2026-kouchi-niji",
      "2026-kanazawa-niji",
      "2026-asahikawaika-niji",
    ],
    requiredFields: [
      "universityName",
      "year",
      "examType",
      "region",
      "lead",
      "quickFacts",
      "bodySections",
      "relatedLinks",
    ],
    sectionOrder: [
      "overview",
      "examSchedule",
      "selectionPolicy",
      "difficulty",
      "preparationPoints",
      "lexusSupport",
      "relatedArticles",
    ],
    rewritePolicy:
      "2024/2025 articles should be normalized into the 2026 public/national medical school information style. Keep facts, dates, and URL intent; remove ad hoc decorations and inconsistent inline styles.",
  },
  {
    id: "university-entrance-strategy",
    label: "大学別・科目別対策記事",
    componentName: "UniversityStrategyArticle",
    count: 126,
    source2026Count: 49,
    legacyRewriteCount: 77,
    ctaVariant: "exam",
    visualTone: "guide",
    referenceSlugs: [
      "dokkyouika-university-entrance-exam-measures2027",
      "jichiika-university-entrance-exam-measures2027",
      "saitamaika-university-entrance-exam-measures2027",
      "kinnki-university-entrance-exam-measures2027",
    ],
    requiredFields: [
      "universityName",
      "faculty",
      "targetYear",
      "examType",
      "lead",
      "subjectStrategies",
      "tables",
      "cta",
    ],
    sectionOrder: [
      "overview",
      "english",
      "math",
      "science",
      "interviewOrEssay",
      "annualPlan",
      "lexusSupport",
      "relatedArticles",
    ],
    rewritePolicy:
      "Use 2026-created 2027 strategy articles as the master. Older university articles should be rewritten into subject-by-subject strategy blocks with consistent tables and no Elementor-specific layout assumptions.",
  },
  {
    id: "interview-prep-guide",
    label: "医学部面接・志望理由対策記事",
    componentName: "InterviewPrepArticle",
    count: 114,
    source2026Count: 31,
    legacyRewriteCount: 83,
    ctaVariant: "consultation",
    visualTone: "guide",
    referenceSlugs: [
      "keiougijyuku-interview-guide",
      "aichiika-interview-guide",
      "kokusaiiryoufukushi-interview-guide",
      "zitiika-interview-guide",
    ],
    requiredFields: [
      "universityName",
      "interviewTheme",
      "lead",
      "answerFramework",
      "ngExamples",
      "practiceChecklist",
    ],
    sectionOrder: [
      "whyThisUniversity",
      "evaluationCriteria",
      "answerFramework",
      "badAnswers",
      "practiceChecklist",
      "lexusSupport",
      "relatedArticles",
    ],
    rewritePolicy:
      "Preserve the search intent of older interview articles, but rewrite them into a practical guide structure with answer frameworks, bad examples, and preparation checklists.",
  },
  {
    id: "waitlist-info",
    label: "補欠・繰り上げ合格記事",
    componentName: "WaitlistInfoArticle",
    count: 8,
    source2026Count: 7,
    legacyRewriteCount: 1,
    ctaVariant: "consultation",
    visualTone: "data",
    referenceSlugs: [
      "saitama-med-waitlist-guide",
      "nihonn-waitlist-guide",
      "kanazawa-med-waitlist-guide",
      "tokyo-med-waitlist-status_2026",
    ],
    requiredFields: [
      "universityName",
      "year",
      "waitlistRange",
      "historicalData",
      "lead",
      "actionGuide",
    ],
    sectionOrder: [
      "currentStatus",
      "historicalData",
      "whenContactComes",
      "whatToDoNow",
      "riskNotes",
      "lexusSupport",
      "relatedArticles",
    ],
    rewritePolicy:
      "Treat data accuracy as the first priority. Older waitlist content should be rewritten into table-first, action-oriented pages with clear date and source boundaries.",
  },
  {
    id: "subject-analysis",
    label: "科目別・過去問分析記事",
    componentName: "SubjectAnalysisArticle",
    count: 5,
    source2026Count: 5,
    legacyRewriteCount: 0,
    ctaVariant: "exam",
    visualTone: "data",
    referenceSlugs: [
      "iwate-med-english-2025-analysis",
      "iwate-med-math-2025-analysis",
      "iwate-med-chemi-2025-analysis",
      "iwate-med-physic-2025-analysis",
    ],
    requiredFields: [
      "universityName",
      "subject",
      "examYear",
      "trendSummary",
      "timeAllocation",
      "preparationTasks",
    ],
    sectionOrder: [
      "trendSummary",
      "questionBreakdown",
      "timeAllocation",
      "scoreStrategy",
      "preparationTasks",
      "lexusSupport",
      "relatedArticles",
    ],
    rewritePolicy:
      "This is already a 2026-only type. Keep the data-heavy structure and use it as a future template for subject-level analysis expansions.",
  },
  {
    id: "parent-letter",
    label: "保護者向け手紙・体験談記事",
    componentName: "ParentLetterArticle",
    count: 5,
    source2026Count: 2,
    legacyRewriteCount: 3,
    ctaVariant: "parent",
    visualTone: "column",
    referenceSlugs: ["oya-to-kodomo", "yobikou-change", "mail-01", "mail-02", "mail-03"],
    requiredFields: [
      "lead",
      "readerSituation",
      "mainMessage",
      "practicalAdvice",
      "cta",
    ],
    sectionOrder: [
      "readerSituation",
      "mainMessage",
      "practicalAdvice",
      "caseOrLetter",
      "lexusSupport",
      "relatedArticles",
    ],
    rewritePolicy:
      "Do not preserve old letter-page decoration. Keep the emotional core and facts, then rebuild as a readable parent-facing column with restrained typography.",
  },
  {
    id: "voice-interview",
    label: "合格者インタビュー記事",
    componentName: "VoiceInterviewArticle",
    count: 88,
    source2026Count: 0,
    legacyRewriteCount: 88,
    ctaVariant: "voice",
    visualTone: "story",
    referenceSlugs: ["voice-087", "voice-086", "voice-085", "voice-084"],
    requiredFields: [
      "studentProfile",
      "acceptedUniversities",
      "lead",
      "storySections",
      "videoUrl",
      "photos",
    ],
    sectionOrder: [
      "profile",
      "resultSummary",
      "beforeLexus",
      "turningPoint",
      "studyMethod",
      "message",
      "video",
      "relatedVoices",
    ],
    rewritePolicy:
      "No 2026 post exists for this type, so do not copy the old post styling. Use the current voice page direction and rebuild all old interviews into one story template.",
  },
  {
    id: "general-column",
    label: "汎用コラム",
    componentName: "GeneralColumnArticle",
    count: 2,
    source2026Count: 0,
    legacyRewriteCount: 2,
    ctaVariant: "default",
    visualTone: "column",
    referenceSlugs: ["information001", "%e6%80%9d%e8%80%83-vs-%e6%9a%97%e8%a8%98"],
    requiredFields: ["lead", "bodySections", "relatedLinks"],
    sectionOrder: ["lead", "body", "summary", "relatedArticles"],
    rewritePolicy:
      "Handle individually after the major templates. Keep URL and search intent, but normalize markup into the shared article system.",
  },
];

export const articleTemplateById = Object.fromEntries(
  articleTemplates.map((template) => [template.id, template]),
) as Record<ArticleTemplateId, ArticleTemplateDefinition>;

export function getArticleTemplateDefinition(id: ArticleTemplateId): ArticleTemplateDefinition {
  return articleTemplateById[id];
}
