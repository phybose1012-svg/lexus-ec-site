// Registry for the per-university past-exam index pages.
//
// Availability is derived from the generated question/answer/analysis data, so a
// university row cannot claim a page that was never built. The registry itself
// only carries what is genuinely university-specific: which years to show, the
// exam wording, related links, and the few editorial states (for example a
// subject still held back for a rights review) that no generated file can imply.
import { analysisPages } from "./pastExamAnalyses";

type Availability = { university: string; year: string; subject: string; path: string };

const routesOf = (modules: Record<string, unknown>): Availability[] =>
  Object.values(modules).map((page) => {
    const { route } = page as { route: Availability };
    return { university: route.university, year: route.year, subject: route.subject, path: route.path };
  });

const questionRoutes = routesOf(
  import.meta.glob("./generated/pastExamQuestions/*.json", { eager: true, import: "default" }),
);
const answerRoutes = routesOf(
  import.meta.glob("./generated/pastExamAnswers/*.json", { eager: true, import: "default" }),
);
const analysisRoutes: Availability[] = analysisPages.map((page) => ({
  university: page.route.university,
  year: page.route.year,
  subject: page.route.subject,
  path: page.route.path,
}));

const find = (routes: Availability[], university: string, year: string, subject: string) =>
  routes.find((route) => route.university === university && route.year === year && route.subject === subject)?.path;

export type SubjectDefinition = { index: string; id: string; name: string; english: string; tone: string };

// Every Lexus past-exam university uses the same four-subject frame.
export const subjectDefinitions: SubjectDefinition[] = [
  { index: "01", id: "mathematics", name: "数学", english: "MATHEMATICS", tone: "mathematics" },
  { index: "02", id: "chemistry", name: "化学", english: "CHEMISTRY", tone: "chemistry" },
  { index: "03", id: "physics", name: "物理", english: "PHYSICS", tone: "physics" },
  { index: "04", id: "biology", name: "生物", english: "BIOLOGY", tone: "biology" },
];

type YearDefinition = { year: string; label: string; tone: "latest" | "active" | "placeholder" };
type SubjectOverride = {
  problem?: { label: string; tone: "waiting" | "empty" };
  answer?: { label: string; tone: "waiting" | "empty" };
  analysisPath?: string;
};

export type UniversityLibrary = {
  id: string;
  name: string;
  examLabel: string;
  stageLabel: string;
  years: YearDefinition[];
  strategyPath: string;
  strategyLabel: string;
  informationPath: string;
  informationLabel: string;
  currentStatus: string;
  /** Keyed by `${year}:${subjectId}` for states no generated file can imply. */
  overrides?: Record<string, SubjectOverride>;
};

export const universityLibraries: UniversityLibrary[] = [
  {
    id: "iwate-medical",
    name: "岩手医科大学",
    examLabel: "一般選抜",
    stageLabel: "一次試験",
    years: [
      { year: "2026", label: "最新年度", tone: "latest" },
      { year: "2025", label: "一部公開中", tone: "active" },
      { year: "2024", label: "掲載準備中", tone: "placeholder" },
      { year: "2023", label: "掲載準備中", tone: "placeholder" },
      { year: "2022", label: "掲載準備中", tone: "placeholder" },
    ],
    strategyPath: "/iwateika-university-entrance-exam-measures2027/",
    strategyLabel: "2027年度 一般選抜対策",
    informationPath: "/information-iwate/",
    informationLabel: "岩手医科大学 入試情報",
    currentStatus: "2025年度数学・物理の問題・解答解説・分析を閲覧できます",
    overrides: {
      "2025:chemistry": {
        problem: { label: "権利確認中", tone: "waiting" },
        answer: { label: "準備中", tone: "waiting" },
        analysisPath: "/iwateika-university-entrance-exam-measures2027/#化学",
      },
      "2025:biology": {
        problem: { label: "未収録", tone: "empty" },
        answer: { label: "未収録", tone: "empty" },
        analysisPath: "/iwateika-university-entrance-exam-measures2027/#生物",
      },
    },
  },
  {
    id: "juntendo",
    name: "順天堂大学",
    examLabel: "一般選抜A方式",
    stageLabel: "一次試験",
    years: [
      { year: "2026", label: "最新年度", tone: "latest" },
      { year: "2025", label: "一部公開中", tone: "active" },
      { year: "2024", label: "掲載準備中", tone: "placeholder" },
      { year: "2023", label: "掲載準備中", tone: "placeholder" },
      { year: "2022", label: "掲載準備中", tone: "placeholder" },
    ],
    strategyPath: "/juntendo-medical-entrance-exam2027-measures/",
    strategyLabel: "2027年度 一般選抜対策",
    informationPath: "/information-jyunten/",
    informationLabel: "順天堂大学 入試情報",
    currentStatus: "2025年度数学の問題・解答解説・分析を閲覧できます",
  },
];

export const libraryPathFor = (universityId: string) =>
  universityLibraries.some((library) => library.id === universityId)
    ? `/past-exam-library/${universityId}/`
    : undefined;

export type SubjectRow = SubjectDefinition & {
  problem: string;
  problemTone: "ready" | "waiting" | "empty";
  problemPath?: string;
  answer: string;
  answerTone: "ready" | "waiting" | "empty";
  answerPath?: string;
  analysis: string;
  analysisTone: "ready" | "empty";
  analysisPath?: string;
};

export function subjectRowsFor(library: UniversityLibrary, year: string): SubjectRow[] {
  return subjectDefinitions.map((subject) => {
    const override = library.overrides?.[`${year}:${subject.id}`] ?? {};
    const problemPath = find(questionRoutes, library.id, year, subject.id);
    const answerPath = find(answerRoutes, library.id, year, subject.id);
    const analysisPath = find(analysisRoutes, library.id, year, subject.id) ?? override.analysisPath;
    return {
      ...subject,
      problem: problemPath ? "問題を見る" : (override.problem?.label ?? "準備中"),
      problemTone: problemPath ? "ready" : (override.problem?.tone ?? "empty"),
      ...(problemPath ? { problemPath } : {}),
      answer: answerPath ? "解答を見る" : (override.answer?.label ?? "準備中"),
      answerTone: answerPath ? "ready" : (override.answer?.tone ?? "empty"),
      ...(answerPath ? { answerPath } : {}),
      analysis: analysisPath ? "分析を見る" : "準備中",
      analysisTone: analysisPath ? "ready" : "empty",
      ...(analysisPath ? { analysisPath } : {}),
    };
  });
}

/** Counts shown in the library's step navigation, derived from what actually exists. */
export function librarySummaryFor(library: UniversityLibrary) {
  const rows = library.years.flatMap((entry) => subjectRowsFor(library, entry.year));
  return {
    years: library.years.length,
    subjects: subjectDefinitions.length,
    questions: rows.filter((row) => row.problemPath).length,
    answers: rows.filter((row) => row.answerPath).length,
    analyses: rows.filter((row) => row.analysisPath).length,
  };
}
