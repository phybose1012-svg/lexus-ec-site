import {
  privateMedicalSpecialAdmissionsCalendar2027,
  privateMedicalSpecialAdmissionsDeadlines2027,
  privateMedicalSpecialAdmissionsEvents2027,
  privateMedicalSpecialAdmissionsExamEvents2027,
  privateMedicalSpecialAdmissionsRoutes2027,
  privateMedicalSpecialAdmissionsSourceUrls2027,
  privateMedicalSpecialAdmissionsSummary2027,
  privateMedicalSpecialAdmissionsUniversities2027,
  specialAdmissionCategoryLabels,
  specialAdmissionStageLabels,
} from "./privateMedicalSpecialAdmissions2027";
import {
  privateMedicalSpecialAdmissions2027FieldDefinitions,
  privateMedicalSpecialAdmissions2027Metadata,
  privateMedicalSpecialAdmissions2027PublicationStatusDefinitions,
} from "./privateMedicalSpecialAdmissions2027Metadata";

export const getPrivateMedicalSpecialAdmissions2027Dataset = () => ({
  schemaVersion: "1.0.0",
  metadata: privateMedicalSpecialAdmissions2027Metadata,
  scope: {
    country: "JP",
    academicYear: 2027,
    universityCount: privateMedicalSpecialAdmissionsSummary2027.universityCount,
    included:
      "2027年3月卒業見込みの高校生が出願できる、一般選抜・通常の共通テスト利用選抜以外の医学科選抜",
    excluded: [
      "一般選抜",
      "通常の大学入学共通テスト利用選抜",
      "編入学・学士入学",
      "大学在学者・社会人等だけを対象とする方式",
      "医学科以外の方式",
    ],
  },
  definitions: {
    fields: privateMedicalSpecialAdmissions2027FieldDefinitions,
    publicationStatuses:
      privateMedicalSpecialAdmissions2027PublicationStatusDefinitions,
    categories: specialAdmissionCategoryLabels,
    eventStages: specialAdmissionStageLabels,
  },
  summary: privateMedicalSpecialAdmissionsSummary2027,
  universities: privateMedicalSpecialAdmissionsUniversities2027,
  routes: privateMedicalSpecialAdmissionsRoutes2027.map(({ university, route }) => ({
    universityId: university.id,
    university: university.name,
    ...route,
  })),
  applicationDeadlines: privateMedicalSpecialAdmissionsDeadlines2027,
  examEvents: privateMedicalSpecialAdmissionsExamEvents2027,
  events: privateMedicalSpecialAdmissionsEvents2027,
  calendar: privateMedicalSpecialAdmissionsCalendar2027,
  provenance: {
    policy:
      "既存KBのHTMLエンティティを起点とし、2027年度の大学公式募集要項・公式概要で再確認。未公表値を前年情報や推測で補完しない。",
    sourceUrls: privateMedicalSpecialAdmissionsSourceUrls2027,
  },
  disclaimer:
    "出願前に各大学が公表する最新の学生募集要項を必ず確認してください。認可申請中・予定・対象校通知のみの情報は変更される場合があります。",
});
