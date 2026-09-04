export type AnalysisPage = {
  schemaVersion: string;
  packageId: string;
  route: { university: string; year: string; subject: string; path: string };
  university: string; year: number; subject: string; examLabel: string; duration: string; format: string;
  headline: string; summary: string; requirementsSummary: string;
  difficultyCounts: number[];
  profiles: Array<{ id: string; title: string; text: string }>;
  majorQuestions: Array<{
    id: string; label: string; title: string; subtitle: string; summary: string; studyAction: string;
    requirements: number[]; questionsPath: string; answersPath: string;
    subquestions: Array<{ id: string; label: string; title: string; note: string; difficulty: number; weak: number; strong: number }>;
  }>;
  source: { approved: boolean; project: string; html: string; sha256: string };
  links: { questions: string; answers: string; university: string };
};

export const analysisPages = Object.values(import.meta.glob("./generated/pastExamAnalyses/*.json", { eager: true, import: "default" })) as AnalysisPage[];
export const analysisPathFor = (packageId: string, fallback: string | null = null) => analysisPages.find((p) => p.packageId === packageId)?.route.path ?? fallback;
