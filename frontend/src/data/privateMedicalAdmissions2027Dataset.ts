import {
  admissionPlanningMetadata2027,
  admissionPlanningRoutes2027,
  type AdmissionPlanningRoute2027,
} from "./admissionPlanning2027";
import {
  applicationDeadlineEntries2027,
  commonTestDates2027,
  examCalendar2027,
  fullScheduleCalendar2027,
  fullSchedulePendingItems2027,
  privateMedicalUniversities2027,
} from "./privateMedicalAdmissions2027";
import { getPrivateMedicalCanonicalRouteId2027 } from "./privateMedicalCanonicalRouteIds2027";
import {
  privateMedicalAdmissions2027FieldDefinitions,
  privateMedicalAdmissions2027Metadata,
  privateMedicalAdmissions2027StatusDefinitions,
} from "./privateMedicalAdmissions2027Metadata";

const sourceUrls = [
  commonTestDates2027.sourceUrl,
  ...privateMedicalUniversities2027.flatMap((university) =>
    university.routes.map((route) => route.sourceUrl),
  ),
  ...applicationDeadlineEntries2027.map((entry) => entry.sourceUrl),
].filter((url): url is string => Boolean(url));

export const privateMedicalAdmissions2027SourceUrls = [...new Set(sourceUrls)];

type PrivateMedicalUniversity2027 = (typeof privateMedicalUniversities2027)[number];
type PrivateMedicalAdmissionRoute2027 = PrivateMedicalUniversity2027["routes"][number];

const toPublicAdmissionRoute = (
  universityId: string,
  route: PrivateMedicalAdmissionRoute2027,
) => ({
  canonicalRouteId: getPrivateMedicalCanonicalRouteId2027(universityId, route.name),
  name: route.name,
  category: route.category,
  application: route.application,
  ...(route.applicationDeadlineDateDetails
    ? { applicationDeadlineDateDetails: [...route.applicationDeadlineDateDetails] }
    : {}),
  firstExam: route.firstExam,
  secondExam: route.secondExam,
  ...(route.result ? { result: route.result } : {}),
  procedure: route.procedure,
  ...(route.procedureDateDetails
    ? { procedureDateDetails: [...route.procedureDateDetails] }
    : {}),
  status: route.status,
  ...(route.sourceUrl ? { sourceUrl: route.sourceUrl } : {}),
});

const toPublicUniversity = (university: PrivateMedicalUniversity2027) => ({
  id: university.id,
  name: university.name,
  region: university.region,
  prefecture: university.prefecture,
  strategyPath: university.strategyPath,
  routes: university.routes.map((route) => toPublicAdmissionRoute(university.id, route)),
});

const toPublicPlanningRoute = (route: AdmissionPlanningRoute2027) => ({
  id: route.id,
  canonicalRouteId: route.canonicalRouteId,
  universityId: route.universityId,
  universityName: route.universityName,
  region: route.region,
  prefecture: route.prefecture,
  routeName: route.routeName,
  category: route.category,
  status: route.status,
  ...(route.sourceUrl ? { sourceUrl: route.sourceUrl } : {}),
  examGroups: route.examGroups.map((group) => ({
    id: group.id,
    stage: group.stage,
    dates: [...group.dates],
    attendance: group.attendance,
    assignment: group.assignment,
    raw: group.raw,
    ...(group.note ? { note: group.note } : {}),
    ...(group.sharedEventGroupId
      ? { sharedEventGroupId: group.sharedEventGroupId }
      : {}),
    ...(group.optionalExtraDates === undefined
      ? {}
      : { optionalExtraDates: group.optionalExtraDates }),
  })),
  calendarEvents: route.calendarEvents.map((event) => ({
    date: event.date,
    type: event.type,
    detail: event.detail,
    ...(event.sourceUrl ? { sourceUrl: event.sourceUrl } : {}),
  })),
});

export const getPrivateMedicalAdmissions2027Dataset = () => ({
  schemaVersion: "1.1.0",
  metadata: privateMedicalAdmissions2027Metadata,
  scope: {
    country: "JP",
    universityCount: privateMedicalUniversities2027.length,
    selectionCategories: [
      { key: "general", label: "一般選抜" },
      { key: "common", label: "共通テスト利用・併用方式" },
    ],
  },
  fieldDefinitions: privateMedicalAdmissions2027FieldDefinitions,
  statusDefinitions: privateMedicalAdmissions2027StatusDefinitions,
  commonTest: commonTestDates2027,
  universities: privateMedicalUniversities2027.map(toPublicUniversity),
  applicationDeadlines: applicationDeadlineEntries2027,
  examCalendar: examCalendar2027,
  fullScheduleCalendar: fullScheduleCalendar2027,
  pendingScheduleFields: fullSchedulePendingItems2027,
  admissionPlanning: {
    metadata: admissionPlanningMetadata2027,
    routes: admissionPlanningRoutes2027.map(toPublicPlanningRoute),
  },
  provenance: {
    policy:
      "大学公式サイト、公式募集要項、公式PDFおよび大学入試センターの公式資料を優先して確認し、未公表事項は推測で補完しません。",
    sourceUrls: privateMedicalAdmissions2027SourceUrls,
  },
  disclaimer:
    "本データは受験計画の補助を目的としています。出願時は必ず各大学が公表する最新の学生募集要項を確認してください。",
});
