import { admissionPlanningRoutes2027, admissionPlanningMetadata2027, type AdmissionPlanningRoute2027, type PlanningExamGroup2027, type PlanningCalendarEvent2027 } from "./admissionPlanning2027";
import { privateMedicalSpecialAdmissionsUniversities2027, specialAdmissionCategoryLabels, type SpecialAdmissionEvent, type SpecialAdmissionRoute } from "./privateMedicalSpecialAdmissions2027";

const publicationLabels = {
  complete: "募集要項公表済み", partial: "一部要項公表済み", outline: "公式概要公表済み",
  unpublished: "詳細未公表", "previous-year-only": "前年度版のみ", "not-offered": "対象方式なし",
} as const;

const eventDetail = (event: SpecialAdmissionEvent) =>
  [event.label, event.time, event.deadlineRule, event.choiceRule].filter(Boolean).join("／");

// A range represented by its first date is not a fixed appointment (e.g. Tokyo Women's).
const datesForEvent = (event: SpecialAdmissionEvent) => {
  const range = event.label.match(/(\d{1,2})月(\d{1,2})日[～〜](\d{1,2})月(\d{1,2})日の間/);
  if (!range) return [event.date];
  const year = Number(event.date.slice(0, 4));
  const start = Date.UTC(year, Number(range[1]) - 1, Number(range[2]));
  const end = Date.UTC(year, Number(range[3]) - 1, Number(range[4]));
  if (end < start || end - start > 31 * 86400000) return [event.date];
  return Array.from({ length: (end - start) / 86400000 + 1 }, (_, index) =>
    new Date(start + index * 86400000).toISOString().slice(0, 10));
};

export const specialPlanningExamGroups2027 = (id: string, route: SpecialAdmissionRoute): PlanningExamGroup2027[] => {
  const exams = route.events.filter((event) => /-exam$/.test(event.stage));
  const hasStages = route.events.some((event) => event.stage === "second-exam" || event.stage === "first-result");
  const hasAlternativeTests = exams.some((event) => /EJUを選ぶ場合/.test(event.choiceRule ?? ""));
  const buckets = new Map<string, SpecialAdmissionEvent[]>();
  for (const event of exams) {
    const kind = /共通テスト/.test(event.label) ? "common" : /日本留学試験/.test(event.label) ? "eju" : event.stage;
    buckets.set(kind, [...(buckets.get(kind) ?? []), event]);
  }
  const groups: PlanningExamGroup2027[] = [...buckets].map(([kind, events]) => {
    const dates = [...new Set(events.flatMap(datesForEvent))].sort();
    const detail = events.map(eventDetail).join(" ／ ");
    const adjusted = events.some((event) => datesForEvent(event).length > 1 || /大学指定|調整した1日/.test(eventDetail(event)));
    const choice = kind === "eju" && events.some((event) => /1回を選択/.test(event.choiceRule ?? ""));
    const unpublished = ["unpublished", "previous-year-only"].includes(route.publicationStatus);
    const examOptionId = hasAlternativeTests ? kind === "common" ? "common" : kind === "eju" ? "eju" : undefined : undefined;
    return {
      id: `${id}--${kind}`,
      stage: kind === "common" ? "common_test" : kind === "second-exam" || kind === "eju" ? "second_exam" : hasStages ? "first_exam" : "single_exam",
      dates,
      attendance: choice || adjusted ? "exactly_one" : "all",
      assignment: unpublished ? "unknown" : adjusted ? "university_assignment" : choice ? "candidate_choice" : "fixed",
      raw: detail,
      dateDetails: Object.fromEntries(dates.map((date) => [date, events.filter((event) => datesForEvent(event).includes(date)).map(eventDetail).join(" ／ ")])),
      note: unpublished ? "実施・日程の確定状況を募集要項で確認してください" : adjusted ? "期間内の1日を大学と調整。表示日は仮の候補で、確定ではありません" : undefined,
      sharedEventGroupId: kind === "common" ? "common-test-2027" : undefined,
      examOptionId,
    };
  });
  if (!groups.length) groups.push({ id: `${id}--pending`, stage: "single_exam", dates: [], attendance: "all", assignment: "unknown", raw: "試験日未公表" });
  return groups;
};

const calendarTypes = {
  "application-start": "applicationStart", "application-deadline": "applicationDeadline",
  "first-result": "firstResult", "final-result": "finalResult", "procedure-deadline": "procedureDeadline",
} as const;

export const specialAdmissionPlanningRoutes2027: AdmissionPlanningRoute2027[] = privateMedicalSpecialAdmissionsUniversities2027
  .filter((university) => university.scopeStatus !== "not-offered")
  .flatMap((university) => university.routes.filter((route) => route.publicationStatus !== "not-offered").map((route) => {
    const id = `special--${university.id}--${route.id}` as const;
    const sourceUrl = route.sourceUrls[0] ?? university.officialUrl;
    const examGroups = specialPlanningExamGroups2027(id, route);
    return {
      id, canonicalRouteId: id, universityId: university.id, universityName: university.name,
      region: university.region, prefecture: university.prefecture, routeName: route.officialName,
      category: route.category, categoryLabel: specialAdmissionCategoryLabels[route.category],
      publicationLabel: publicationLabels[route.publicationStatus],
      status: route.publicationStatus === "complete" ? "official" : ["unpublished", "previous-year-only"].includes(route.publicationStatus) ? "pending" : "preliminary",
      sourceUrl, examGroups,
      calendarEvents: route.events.flatMap((event): PlanningCalendarEvent2027[] => {
        const type = calendarTypes[event.stage as keyof typeof calendarTypes];
        const examOptionId = examGroups.some((group) => group.examOptionId) && /利用者のみ/.test(event.label)
          ? /EJU/.test(event.label) ? "eju" : /共通テスト/.test(event.label) ? "common" : undefined : undefined;
        return type ? [{ date: event.date, type, detail: eventDetail(event), sourceUrl,
          conditional: /免除|見込み|実施する場合|利用者のみ/.test(event.label), examOptionId }] : [];
      }),
      requirements: { exclusive: route.exclusive, eligibility: route.eligibility, grade: route.gradeRequirement, restrictions: route.restrictions, note: route.note },
      examOptions: examGroups.some((group) => group.examOptionId) ? [{ id: "common", label: "大学入学共通テストを利用" }, { id: "eju", label: "日本留学試験（EJU）を利用（出願条件の確認が必要）" }] : undefined,
    } satisfies AdmissionPlanningRoute2027;
  }));

// Keep the general-only dataset and saved general route IDs backwards compatible.
export const unifiedAdmissionPlanningRoutes2027: AdmissionPlanningRoute2027[] = [
  ...admissionPlanningRoutes2027, ...specialAdmissionPlanningRoutes2027,
];
export const unifiedAdmissionPlanningMetadata2027 = {
  ...admissionPlanningMetadata2027,
  publicUrl: "https://lexus-ec.com/private-medical-school-admission-planner-2027/",
  sourceFiles: ["frontend/src/data/privateMedicalAdmissions2027.ts", "frontend/src/data/privateMedicalSpecialAdmissions2027.ts"],
};
if (new Set(unifiedAdmissionPlanningRoutes2027.map((route) => route.id)).size !== unifiedAdmissionPlanningRoutes2027.length) {
  throw new Error("統合プランニングの方式IDが重複しています");
}
