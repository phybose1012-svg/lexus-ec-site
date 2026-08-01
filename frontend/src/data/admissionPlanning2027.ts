import {
  fullScheduleCalendar2027,
  privateMedicalUniversities2027,
  type AdmissionRouteCategory,
  type AdmissionRouteStatus,
  type FullScheduleColumnKey2027,
} from "./privateMedicalAdmissions2027";

export type PlanningExamStage2027 = "common_test" | "first_exam" | "second_exam";
export type PlanningAttendance2027 = "exactly_one" | "all";
export type PlanningAssignment2027 =
  | "fixed"
  | "candidate_choice"
  | "candidate_preference"
  | "university_assignment"
  | "unknown";

export type PlanningExamGroup2027 = {
  id: string;
  stage: PlanningExamStage2027;
  dates: string[];
  attendance: PlanningAttendance2027;
  assignment: PlanningAssignment2027;
  raw: string;
  note?: string;
  sharedEventGroupId?: string;
  optionalExtraDates?: boolean;
};

export type PlanningCalendarEvent2027 = {
  date: string;
  type: Exclude<FullScheduleColumnKey2027, "firstExam" | "secondExam">;
  detail: string;
  sourceUrl?: string;
};

export type AdmissionPlanningRoute2027 = {
  id: string;
  universityId: string;
  universityName: string;
  region: string;
  prefecture: string;
  routeName: string;
  category: AdmissionRouteCategory;
  status: AdmissionRouteStatus;
  sourceUrl?: string;
  examGroups: PlanningExamGroup2027[];
  calendarEvents: PlanningCalendarEvent2027[];
};

export const admissionPlanningMetadata2027 = {
  academicYear: 2027,
  sourceFile: "frontend/src/data/privateMedicalAdmissions2027.ts",
  publicUrl: "https://lexus-ec.com/private-medical-school-admissions-schedule-2027/",
  lastVerified: "2026-08-01",
} as const;

const toDateKey = (year: number, month: number, day: number) =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const parseDateKeys = (value: string | undefined, expandSameMonthRanges = false) => {
  if (!value) return [];

  const keys: string[] = [];
  const pattern =
    /(?:(20\d{2})\/)?(\d{1,2})\/(\d{1,2})(?:\s*(・|〜|または)\s*(\d{1,2})(?![\d:/]))?/g;

  for (const match of value.matchAll(pattern)) {
    const year = Number(match[1] ?? 2027);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const base = new Date(Date.UTC(year, month - 1, day));

    if (
      base.getUTCFullYear() !== year ||
      base.getUTCMonth() !== month - 1 ||
      base.getUTCDate() !== day
    ) {
      continue;
    }

    keys.push(toDateKey(year, month, day));
    const separator = match[4];
    const shortDay = Number(match[5]);
    if (!separator || !shortDay) continue;

    const days =
      separator === "〜" && expandSameMonthRanges
        ? Array.from({ length: Math.max(shortDay - day, 0) }, (_, index) => day + index + 1)
        : [shortDay];

    days.forEach((candidateDay) => {
      const candidate = new Date(Date.UTC(year, month - 1, candidateDay));
      if (
        candidate.getUTCFullYear() === year &&
        candidate.getUTCMonth() === month - 1 &&
        candidate.getUTCDate() === candidateDay
      ) {
        keys.push(toDateKey(year, month, candidateDay));
      }
    });
  }

  return [...new Set(keys)];
};

const stableHash = (value: string) => {
  let hash = 5381;
  for (const character of value) hash = (hash * 33) ^ character.charCodeAt(0);
  return (hash >>> 0).toString(36);
};

const routeId = (universityId: string, category: AdmissionRouteCategory, routeName: string) =>
  `${universityId}--${category}--${stableHash(routeName)}`;

const isPendingValue = (value: string) =>
  /未公表|公表待ち|実施未定|方式・日程は未公表/.test(value);

const assignmentFor = (value: string, dates: string[]): PlanningAssignment2027 => {
  if (dates.length === 0) return "unknown";
  if (dates.length === 1) return "fixed";
  if (/希望をもとに大学が指定|希望日を選択し大学が指定|希望調査.*大学が指定|希望に添えない/.test(value)) {
    return "candidate_preference";
  }
  if (/指定方法未公表|大学指定日|指定日|出願が早い順/.test(value)) {
    return "university_assignment";
  }
  if (
    /自由選択|選択日|出願時選択|Web出願登録時に選択|出願時に1日選択|希望する1日|1〜3日受験可|1日または両日受験可|両日受験可/.test(
      value,
    )
  ) {
    return "candidate_choice";
  }
  if (/希望日|希望する/.test(value)) return "candidate_preference";
  if (/いずれか1日|または/.test(value)) return "university_assignment";
  return "fixed";
};

const attendanceFor = (
  value: string,
  dates: string[],
  assignment: PlanningAssignment2027,
): PlanningAttendance2027 => {
  if (dates.length <= 1) return "all";
  if (/両日受験/.test(value) && !/両日受験可/.test(value)) return "all";
  if (assignment === "fixed") return "all";
  return "exactly_one";
};

const noteFor = (value: string, assignment: PlanningAssignment2027) => {
  if (/1〜3日受験可/.test(value)) return "1〜3日受験可";
  if (/1日または両日受験可|両日受験可/.test(value)) return "1日または両日受験可";
  if (/一般選抜受験者は一部免除/.test(value)) return "一般選抜受験者は一部免除あり";
  if (/1回のみ/.test(value)) return "併願時は共通の試験を1回のみ受験";
  if (assignment === "candidate_preference") return "希望日に沿えない場合があります";
  if (assignment === "university_assignment") return "大学指定または指定方法未公表";
  if (assignment === "unknown") return "日程または指定方法が未公表です";
  return undefined;
};

const hasSharedExamWording = (value: string) =>
  /1回のみ|同じ日を選択|一般前期と同日|一般後期と同日|同一日/.test(value);

const calendarEventsByRoute = new Map<string, PlanningCalendarEvent2027[]>();

fullScheduleCalendar2027.forEach((day) => {
  (
    [
      "applicationStart",
      "applicationDeadline",
      "firstResult",
      "finalResult",
      "procedureDeadline",
    ] as const
  ).forEach((type) => {
    day.events[type].forEach((entry) => {
      entry.routes.forEach((routeName) => {
        const key = `${entry.university}::${routeName}`;
        const events = calendarEventsByRoute.get(key) ?? [];
        events.push({
          date: day.dateTime,
          type,
          detail: entry.detail ?? routeName,
          sourceUrl: entry.sourceUrl,
        });
        calendarEventsByRoute.set(key, events);
      });
    });
  });
});

const planningRoutes = privateMedicalUniversities2027.flatMap((university) =>
  university.routes.map((route) => {
    const id = routeId(university.id, route.category, route.name);
    const examGroups: PlanningExamGroup2027[] = [];
    const firstDates = parseDateKeys(route.firstExam, true);
    const commonTestDateSet = new Set<string>(["2027-01-16", "2027-01-17"]);
    const commonTestDates = firstDates.filter((date) => commonTestDateSet.has(date));
    const individualFirstDates = firstDates.filter(
      (date) => !commonTestDates.includes(date),
    );

    if (route.firstExam.includes("共通テスト") && commonTestDates.length > 0) {
      examGroups.push({
        id: `${id}--common-test`,
        stage: "common_test",
        dates: commonTestDates,
        attendance: "all",
        assignment: "fixed",
        raw: route.firstExam,
        note: "共通テスト利用・併用方式で共有する本試験",
        sharedEventGroupId: "common-test-2027",
      });
    }

    if (individualFirstDates.length > 0 || (!route.firstExam.includes("共通テスト") && isPendingValue(route.firstExam))) {
      const assignment = assignmentFor(route.firstExam, individualFirstDates);
      examGroups.push({
        id: `${id}--first-exam`,
        stage: "first_exam",
        dates: individualFirstDates,
        attendance: attendanceFor(route.firstExam, individualFirstDates, assignment),
        assignment,
        raw: route.firstExam,
        note: noteFor(route.firstExam, assignment),
        optionalExtraDates: /1〜3日受験可|1日または両日受験可|両日受験可/.test(route.firstExam),
      });
    }

    const secondDates = parseDateKeys(route.secondExam, true);
    const secondAssignment = assignmentFor(route.secondExam, secondDates);
    examGroups.push({
      id: `${id}--second-exam`,
      stage: "second_exam",
      dates: secondDates,
      attendance: attendanceFor(route.secondExam, secondDates, secondAssignment),
      assignment: secondAssignment,
      raw: route.secondExam,
      note: noteFor(route.secondExam, secondAssignment),
      sharedEventGroupId: hasSharedExamWording(route.secondExam)
        ? `${university.id}--second--${secondDates.join("-")}`
        : undefined,
    });

    return {
      id,
      universityId: university.id,
      universityName: university.name,
      region: university.region,
      prefecture: university.prefecture,
      routeName: route.name,
      category: route.category,
      status: route.status,
      sourceUrl: route.sourceUrl,
      examGroups,
      calendarEvents: calendarEventsByRoute.get(`${university.name}::${route.name}`) ?? [],
    } satisfies AdmissionPlanningRoute2027;
  }),
);

const sharedSecondExamKeys = new Set(
  planningRoutes.flatMap((route) =>
    route.examGroups
      .filter((group) => group.stage === "second_exam" && group.sharedEventGroupId)
      .map((group) => `${route.universityId}::${group.dates.join("|")}`),
  ),
);

planningRoutes.forEach((route) => {
  route.examGroups.forEach((group) => {
    const sharedKey = `${route.universityId}::${group.dates.join("|")}`;
    if (group.stage === "second_exam" && group.dates.length > 0 && sharedSecondExamKeys.has(sharedKey)) {
      group.sharedEventGroupId = `${route.universityId}--second--${group.dates.join("-")}`;
    }
  });
});

const universityIds = new Set(privateMedicalUniversities2027.map((university) => university.id));
if (universityIds.size !== 31) {
  throw new Error(`受験大学プランニングの大学数が31校ではありません: ${universityIds.size}`);
}

if (new Set(planningRoutes.map((route) => route.id)).size !== planningRoutes.length) {
  throw new Error("受験大学プランニングの入試方式IDが重複しています");
}

export const admissionPlanningRoutes2027: AdmissionPlanningRoute2027[] = planningRoutes;
