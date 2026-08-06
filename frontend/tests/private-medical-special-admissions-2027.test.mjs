import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  privateMedicalSpecialAdmissionsEvents2027,
  privateMedicalSpecialAdmissionsRoutes2027,
  privateMedicalSpecialAdmissionsSummary2027,
  privateMedicalSpecialAdmissionsUniversities2027,
  specialAdmissionCategoryLabels,
} from "../src/data/privateMedicalSpecialAdmissions2027.ts";
import { privateMedicalSpecialAdmissions2027Metadata } from "../src/data/privateMedicalSpecialAdmissions2027Metadata.ts";

const expectedPagePath = "/private-medical-school-special-admissions-schedule-2027/";
const expectedDatasetPath = "/data/private-medical-special-admissions-2027.json";
const allowedCategories = new Set([
  "comprehensive",
  "recommendation",
  "designated",
  "regional",
  "returnee",
  "ib",
  "international",
  "special",
]);
const allowedCurrentStudentEligibility = new Set([
  true,
  "conditional",
  "unconfirmed",
]);
const excludedEffectiveGeneralSelections = [
  {
    universityId: "kyorin",
    routeId: "international-student",
    officialNamePattern: /外国人留学生選抜/u,
  },
  {
    universityId: "kyorin",
    routeId: "tokyo-regional",
    officialNamePattern: /東京都地域枠選抜/u,
  },
  {
    universityId: "kyorin",
    routeId: "niigata-regional",
    officialNamePattern: /新潟県地域枠選抜/u,
  },
  {
    universityId: "kyorin",
    routeId: "gunma-regional",
    officialNamePattern: /群馬県地域枠選抜/u,
  },
  {
    universityId: "juntendo",
    routeId: "tokyo-regional",
    officialNamePattern: /東京都地域枠選抜/u,
  },
  {
    universityId: "juntendo",
    routeId: "niigata-regional",
    officialNamePattern: /新潟県地域枠選抜/u,
  },
  {
    universityId: "juntendo",
    routeId: "chiba-regional",
    officialNamePattern: /千葉県地域枠選抜/u,
  },
  {
    universityId: "juntendo",
    routeId: "saitama-regional",
    officialNamePattern: /埼玉県地域枠選抜/u,
  },
  {
    universityId: "juntendo",
    routeId: "shizuoka-regional",
    officialNamePattern: /静岡県地域枠選抜/u,
  },
  {
    universityId: "juntendo",
    routeId: "ibaraki-regional",
    officialNamePattern: /茨城県地域枠選抜/u,
  },
  {
    universityId: "juntendo",
    routeId: "gunma-regional",
    officialNamePattern: /群馬県地域枠選抜/u,
  },
  {
    universityId: "showa-medical",
    routeId: "regional-quota",
    officialNamePattern: /医学部地域枠選抜/u,
  },
  {
    universityId: "nihon",
    routeId: "alumni-quota",
    officialNamePattern: /校友枠選抜/u,
  },
  {
    universityId: "nippon-medical",
    routeId: "global-special-first",
    officialNamePattern: /グローバル特別選抜/u,
  },
];
const commonTestUsingSpecialSelectionsToKeep = [
  ["juntendo", "research-doctor"],
  ["juntendo", "returnee"],
  ["juntendo", "ib-cambridge"],
  ["teikyo", "comprehensive"],
  ["tokai", "star-development"],
  ["osaka-med-pharm", "shisei-jinjutsu"],
  ["uoeh", "ramazzini"],
];
const pageSourcePath = fileURLToPath(
  new URL(
    "../src/pages/private-medical-school-special-admissions-schedule-2027/index.astro",
    import.meta.url,
  ),
);
const generalPageSourcePath = fileURLToPath(
  new URL(
    "../src/pages/private-medical-school-admissions-schedule-2027/index.astro",
    import.meta.url,
  ),
);
const scheduleSwitcherSourcePath = fileURLToPath(
  new URL("../src/components/admissions/AdmissionsScheduleSwitcher.astro", import.meta.url),
);
const styleSourcePath = fileURLToPath(
  new URL("../src/styles/special-admissions-2027.css", import.meta.url),
);
const sharedStyleSourcePath = fileURLToPath(
  new URL("../src/styles/admissions-2027.css", import.meta.url),
);
const datasetEndpointSourcePath = fileURLToPath(
  new URL(
    "../src/pages/data/private-medical-special-admissions-2027.json.ts",
    import.meta.url,
  ),
);
const datasetModuleSourcePath = fileURLToPath(
  new URL(
    "../src/data/privateMedicalSpecialAdmissions2027Dataset.ts",
    import.meta.url,
  ),
);
const builtDatasetPath = fileURLToPath(
  new URL("../dist/data/private-medical-special-admissions-2027.json", import.meta.url),
);
const builtPagePath = fileURLToPath(
  new URL(
    "../dist/private-medical-school-special-admissions-schedule-2027/index.html",
    import.meta.url,
  ),
);
const builtGeneralPagePath = fileURLToPath(
  new URL(
    "../dist/private-medical-school-admissions-schedule-2027/index.html",
    import.meta.url,
  ),
);

const routeKey = (university, route) => `${university.id}/${route.id}`;
const flatEventRouteKey = (event) => `${event.universityId}/${event.routeId}`;

const addToMapArray = (map, key, value) => {
  map.set(key, [...(map.get(key) ?? []), value]);
};

const deadlineDetailSignature = (event) =>
  [event.label, event.time ?? "", event.deadlineRule ?? ""].join("\u0000");

const buildDeadlineDisplayEntries = (events) => {
  const eventsByRouteAndDate = new Map();
  for (const event of events.filter((entry) => entry.stage === "application-deadline")) {
    addToMapArray(
      eventsByRouteAndDate,
      `${event.date}\u0000${flatEventRouteKey(event)}`,
      event,
    );
  }

  const groupedEntries = new Map();
  for (const routeEvents of eventsByRouteAndDate.values()) {
    const firstEvent = routeEvents[0];
    const details = routeEvents
      .map((event) => ({
        label: event.label,
        time: event.time,
        deadlineRule: event.deadlineRule,
      }))
      .sort((a, b) =>
        [a.label, a.time ?? "", a.deadlineRule ?? ""]
          .join("\u0000")
          .localeCompare(
            [b.label, b.time ?? "", b.deadlineRule ?? ""].join("\u0000"),
            "ja",
          ),
      );
    const detailKey = routeEvents
      .map(deadlineDetailSignature)
      .sort((a, b) => a.localeCompare(b, "ja"))
      .join("\u0001");
    const groupKey = [
      firstEvent.date,
      firstEvent.universityId,
      firstEvent.sourceUrl,
      detailKey,
    ].join("\u0000");
    const existing = groupedEntries.get(groupKey);

    if (existing) {
      existing.routeKeys.push(flatEventRouteKey(firstEvent));
      existing.routeNames.push(firstEvent.routeName);
      continue;
    }

    groupedEntries.set(groupKey, {
      date: firstEvent.date,
      universityId: firstEvent.universityId,
      university: firstEvent.university,
      sourceUrl: firstEvent.sourceUrl,
      details,
      routeKeys: [flatEventRouteKey(firstEvent)],
      routeNames: [firstEvent.routeName],
    });
  }

  return [...groupedEntries.values()].sort(
    (a, b) =>
      a.date.localeCompare(b.date) ||
      a.university.localeCompare(b.university, "ja") ||
      a.routeNames[0].localeCompare(b.routeNames[0], "ja"),
  );
};

const buildExamDisplayEntries = (events) => {
  const groupedEntries = new Map();
  const examEvents = events.filter(
    (entry) => entry.stage === "first-exam" || entry.stage === "second-exam",
  );
  const routesWithSecondExam = new Set(
    examEvents
      .filter((entry) => entry.stage === "second-exam")
      .map(flatEventRouteKey),
  );

  for (const event of examEvents) {
    const eventRouteKey = flatEventRouteKey(event);
    const displayColumn =
      event.stage === "second-exam"
        ? "second-exam"
        : routesWithSecondExam.has(eventRouteKey)
          ? "first-exam"
          : "single-exam";
    const groupKey = [
      event.date,
      event.universityId,
      event.stage,
      displayColumn,
      event.label,
      event.time ?? "",
      event.deadlineRule ?? "",
      event.sequence ?? "",
      event.choiceRule ?? "",
      event.sourceUrl,
    ].join("\u0000");
    const existing = groupedEntries.get(groupKey);

    if (existing) {
      existing.routeKeys.push(flatEventRouteKey(event));
      existing.routeNames.push(event.routeName);
      continue;
    }

    groupedEntries.set(groupKey, {
      date: event.date,
      universityId: event.universityId,
      university: event.university,
      stage: event.stage,
      displayColumn,
      label: event.label,
      time: event.time,
      deadlineRule: event.deadlineRule,
      sequence: event.sequence,
      choiceRule: event.choiceRule,
      sourceUrl: event.sourceUrl,
      routeKeys: [flatEventRouteKey(event)],
      routeNames: [event.routeName],
    });
  }

  return [...groupedEntries.values()].sort(
    (a, b) =>
      a.date.localeCompare(b.date) ||
      a.stage.localeCompare(b.stage) ||
      a.university.localeCompare(b.university, "ja") ||
      a.routeNames[0].localeCompare(b.routeNames[0], "ja"),
  );
};

const setFrom = (values) => new Set(values);
const sortedSetValues = (values) => [...values].sort((a, b) => a.localeCompare(b));

const assertSameSet = (actual, expected, message) => {
  assert.deepEqual(sortedSetValues(actual), sortedSetValues(expected), message);
};

const busiestDeadlineDate = (entries) => {
  const counts = new Map();
  for (const entry of entries) {
    counts.set(entry.date, (counts.get(entry.date) ?? 0) + 1);
  }

  return [...counts.entries()].sort(
    ([dateA, countA], [dateB, countB]) => countB - countA || dateA.localeCompare(dateB),
  )[0]?.[0];
};

const openingTagWithClass = (source, className) => {
  const escapedClassName = className.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return source.match(
    new RegExp(
      `<[^>]+class="[^"]*\\b${escapedClassName}\\b[^"]*"[^>]*>`,
      "u",
    ),
  )?.[0];
};

const sectionBetween = (html, startId, nextId) => {
  const startMarker = `id="${startId}"`;
  const endMarker = `id="${nextId}"`;
  const start = html.lastIndexOf("<section", html.indexOf(startMarker));
  const end = html.lastIndexOf("<section", html.indexOf(endMarker));

  assert.ok(start >= 0, `${startId}: セクション開始位置を取得できません`);
  assert.ok(end > start, `${startId}: 次セクションまでの範囲を取得できません`);
  return html.slice(start, end);
};

const attributeValues = (html, attribute) => {
  const escapedAttribute = attribute.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return [...html.matchAll(new RegExp(`\\b${escapedAttribute}="([^"]*)"`, "gu"))].map(
    (match) => match[1],
  );
};

const assertValidIsoDate = (value, context) => {
  assert.match(value, /^\d{4}-\d{2}-\d{2}$/, `${context}: ISO日付ではありません`);

  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  assert.equal(parsed.getUTCFullYear(), year, `${context}: 年が不正です`);
  assert.equal(parsed.getUTCMonth(), month - 1, `${context}: 月が不正です`);
  assert.equal(parsed.getUTCDate(), day, `${context}: 日が不正です`);
};

test("対象は私立医学部31大学で大学IDが一意", () => {
  assert.equal(privateMedicalSpecialAdmissionsUniversities2027.length, 31);
  assert.equal(privateMedicalSpecialAdmissionsSummary2027.universityCount, 31);

  const universityIds = privateMedicalSpecialAdmissionsUniversities2027.map(
    (university) => university.id,
  );
  assert.equal(new Set(universityIds).size, 31, "大学IDに重複があります");

  for (const university of privateMedicalSpecialAdmissionsUniversities2027) {
    assert.match(
      university.id,
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      `${university.name}: 大学IDはURL安全なkebab-caseで指定してください`,
    );

    const routeIds = university.routes.map((route) => route.id);
    assert.equal(
      new Set(routeIds).size,
      routeIds.length,
      `${university.name}: 大学内の方式IDに重複があります`,
    );
  }

  const compositeRouteIds = privateMedicalSpecialAdmissionsRoutes2027.map(
    ({ university, route }) => routeKey(university, route),
  );
  assert.equal(
    new Set(compositeRouteIds).size,
    compositeRouteIds.length,
    "大学IDと方式IDの組み合わせは一意でなければなりません",
  );
});

test("岩手医科大学は令和9年度公式概要の5方式と資格条件を保持", () => {
  const iwate = privateMedicalSpecialAdmissionsUniversities2027.find(
    (university) => university.id === "iwate-medical",
  );

  assert.ok(iwate, "岩手医科大学のデータがありません");
  assert.equal(iwate.publicationStatus, "outline");
  assert.equal(iwate.officialUrl, "https://www.imu-admission.jp/guidelines/gl_med/");
  assert.deepEqual(
    iwate.routes.map((route) => route.officialName),
    [
      "総合型選抜（地域医療医師育成特別枠）",
      "学校推薦型選抜（公募制）",
      "学校推薦型選抜地域枠A（岩手県出身者枠）",
      "学校推薦型選抜地域枠B（東北出身者枠）",
      "学校推薦型選抜秋田県地域枠（秋田県出身者枠）",
    ],
  );

  const routeById = new Map(iwate.routes.map((route) => [route.id, route]));
  const comprehensive = routeById.get("comprehensive-regional-doctor");
  const publicRecommendation = routeById.get("recommendation-public");
  const regionalA = routeById.get("regional-a");
  const regionalB = routeById.get("regional-b");
  const akita = routeById.get("akita-regional");

  assert.match(comprehensive?.eligibility ?? "", /2025年3月以降/u);
  assert.match(comprehensive?.restrictions.join(" ") ?? "", /2親等以内.*7年以上/u);
  assert.match(publicRecommendation?.eligibility ?? "", /2026年3月.*2027年3月/u);
  assert.match(publicRecommendation?.restrictions.join(" ") ?? "", /1校2名以内/u);
  assert.match(regionalA?.eligibility ?? "", /岩手県医師修学資金の貸与候補生/u);
  assert.match(regionalA?.restrictions.join(" ") ?? "", /2023年12月1日以前.*11年間/u);
  assert.equal(regionalB?.quota, "8名（岩手県4名を含む）");
  assert.match(regionalB?.eligibility ?? "", /医療局医師奨学資金の貸与候補生/u);
  assert.match(regionalB?.restrictions.join(" ") ?? "", /青森・秋田・宮城・山形・福島県内校.*9年間/u);
  assert.match(akita?.eligibility ?? "", /秋田県内高校.*2027年3月卒業見込み/u);
  assert.match(akita?.restrictions.join(" ") ?? "", /9年間勤務.*4年間/u);

  const officialSources = [
    "https://www.imu-admission.jp/guidelines/gl_med/",
    "https://www.imu-admission.jp/guidelines/gl_gaiyou/",
  ];
  const expectedSchedule = [
    { stage: "application-start", date: "2026-11-02", label: "出願開始" },
    {
      stage: "application-deadline",
      date: "2026-11-11",
      label: "出願締切",
      deadlineRule: "消印有効",
    },
    { stage: "first-exam", date: "2026-11-21", label: "試験日" },
    { stage: "final-result", date: "2026-12-02", label: "合格発表" },
    { stage: "procedure-deadline", date: "2026-12-11", label: "入学手続締切" },
  ];

  for (const route of iwate.routes) {
    assert.equal(route.currentStudentEligible, true);
    assert.equal(route.exclusive, "専願");
    assert.deepEqual(route.events, expectedSchedule);
    assert.deepEqual(route.sourceUrls, officialSources);
  }

  assert.match(iwate.excludedRoutes?.join(" ") ?? "", /一般選抜地域枠C・D/u);
  assert.match(iwate.excludedRoutes?.join(" ") ?? "", /学士編入.*現役高校生は出願不可/u);
});

test("東北医科薬科大学は令和9年度公式資料の総合型1方式と二段階出願を保持", () => {
  const tohoku = privateMedicalSpecialAdmissionsUniversities2027.find(
    (university) => university.id === "tohoku-med-pharm",
  );

  assert.ok(tohoku, "東北医科薬科大学のデータがありません");
  assert.equal(tohoku.scopeStatus, "available");
  assert.equal(tohoku.publicationStatus, "outline");
  assert.equal(tohoku.routes.length, 1);

  const selection = tohoku.routes[0];
  assert.equal(selection.officialName, "総合型選抜（東北地域定着枠）");
  assert.equal(selection.quota, "20名");
  assert.equal(selection.currentStudentEligible, true);
  assert.match(selection.eligibility, /2027年3月卒業見込み.*2022年3月以降.*18歳/u);
  assert.equal(selection.exclusive, "専願");
  assert.equal(selection.principalRecommendation, "未公表");
  assert.match(selection.gradeRequirement, /3\.8以上.*3年次1学期・前期/u);
  assert.match(selection.restrictions.join(" "), /宮城県以外の東北5県.*修学資金制度へ必ず応募/u);
  assert.match(selection.restrictions.join(" "), /9年程度.*すべて不採用.*5年間勤務/u);
  assert.match(selection.restrictions.join(" "), /推薦書の提出が必要.*推薦者要件は完成版募集要項/u);
  assert.match(selection.note ?? "", /書類選考.*グループ面接.*大学入学共通テストは利用しません/u);

  assert.deepEqual(selection.events, [
    { stage: "application-start", date: "2026-09-14", label: "出願開始" },
    {
      stage: "application-deadline",
      date: "2026-10-02",
      label: "出願登録締切",
      deadlineRule: "Web登録",
    },
    {
      stage: "application-deadline",
      date: "2026-10-04",
      label: "出願書類提出期限",
      deadlineRule: "必着",
    },
    { stage: "first-result", date: "2026-10-16", label: "第一次選考結果発表" },
    {
      stage: "second-exam",
      date: "2026-10-24",
      label: "第二次選考①（理科・数学・英語小論文）",
      sequence: 1,
      choiceRule: "2日間とも受験",
    },
    {
      stage: "second-exam",
      date: "2026-10-25",
      label: "第二次選考②（グループ面接）",
      sequence: 2,
      choiceRule: "2日間とも受験",
    },
    { stage: "final-result", date: "2026-11-02", label: "合格発表" },
    { stage: "procedure-deadline", date: "2026-11-16", label: "入学金等納付期限" },
    { stage: "procedure-deadline", date: "2026-11-16", label: "手続書類提出期限" },
  ]);
  assert.deepEqual(selection.sourceUrls, [
    "https://www.tohoku-mpu.ac.jp/admission/medicine-application/",
    "https://www.tohoku-mpu.ac.jp/wp/wp-content/uploads/2026/05/963a4d3c20d5c1e17605bf8aa1e7293c-1.pdf",
    "https://www.tohoku-mpu.ac.jp/about/information/admissions_policy/",
    "https://www.tohoku-mpu.ac.jp/medicine/scholarship/",
  ]);
  assert.match(tohoku.excludedRoutes?.join(" ") ?? "", /一般選抜.*東北5県定着枠/u);
  assert.match(tohoku.excludedRoutes?.join(" ") ?? "", /大学入学共通テスト利用選抜/u);
});

test("自治医科大学は令和9年度完成版要項の年内2方式と郵送締切を保持", () => {
  const jichi = privateMedicalSpecialAdmissionsUniversities2027.find(
    (university) => university.id === "jichi-medical",
  );

  assert.ok(jichi, "自治医科大学のデータがありません");
  assert.equal(jichi.scopeStatus, "available");
  assert.equal(jichi.publicationStatus, "complete");
  assert.equal(jichi.officialUrl, "https://www.jichi.ac.jp/exam/medicine/exam/special/");
  assert.deepEqual(jichi.routes.map((route) => route.officialName), ["総合型選抜", "学校推薦型選抜"]);

  const officialSources = [
    "https://www.jichi.ac.jp/exam/medicine/exam/special/",
    "https://www.jichi.ac.jp/assets/pdf/exam/medicine/exam/exam_youkou_R9.pdf",
    "https://www.jichi.ac.jp/exam/medicine/exam/",
    "https://www.jichi.ac.jp/news/exam/2026070301/",
  ];
  const commonSelectionEvents = [
    { stage: "first-result", date: "2026-11-13", label: "書類選考合格発表", time: "13:00" },
    { stage: "first-exam", date: "2026-11-18", label: "基礎学力検査（数学・英語）・個人面接", time: "9:00～16:00" },
    { stage: "final-result", date: "2026-12-01", label: "基礎学力検査・面接試験合格発表", time: "13:00" },
    { stage: "procedure-deadline", date: "2027-02-25", label: "入学手続①", sequence: 1, choiceRule: "両日とも本人手続" },
    { stage: "procedure-deadline", date: "2027-03-12", label: "入学手続②", sequence: 2, choiceRule: "両日とも本人手続" },
  ];

  const comprehensive = jichi.routes.find((route) => route.id === "comprehensive-prefectural");
  assert.ok(comprehensive, "自治医科大学の総合型選抜がありません");
  assert.equal(comprehensive.quota, "栃木2名・富山1名・山梨2名・山口2名・佐賀2名");
  assert.equal(comprehensive.currentStudentEligible, true);
  assert.match(comprehensive.eligibility, /2027年3月卒業見込み.*既卒.*対象5県/u);
  assert.equal(comprehensive.exclusive, "条件付き");
  assert.equal(comprehensive.principalRecommendation, "不要");
  assert.match(comprehensive.gradeRequirement, /全体の学習成績の状況4\.0以上/u);
  assert.match(comprehensive.restrictions.join(" "), /出願地は1県のみ.*他大学への出願自体は可/u);
  assert.match(comprehensive.restrictions.join(" "), /2024年4月1日以前.*高卒認定.*18歳/u);
  assert.match(comprehensive.restrictions.join(" "), /キャリア形成プログラム.*学校推薦型選抜との重複出願不可/u);
  assert.match(comprehensive.restrictions.join(" "), /客観的に評価できる者.*志願者評価書/u);
  assert.match(comprehensive.note ?? "", /受付8:20～8:30.*書留速達.*共通テスト利用選抜ではありません.*学力参考資料/u);
  assert.deepEqual(comprehensive.events, [
    { stage: "application-start", date: "2026-10-14", label: "出願開始" },
    { stage: "application-deadline", date: "2026-10-19", label: "郵送消印有効期限", deadlineRule: "消印有効" },
    { stage: "application-deadline", date: "2026-10-20", label: "出願締切", time: "17:00", deadlineRule: "必着" },
    ...commonSelectionEvents,
  ]);
  assert.deepEqual(comprehensive.sourceUrls, officialSources);

  const recommendation = jichi.routes.find((route) => route.id === "recommendation-toyama");
  assert.ok(recommendation, "自治医科大学の学校推薦型選抜がありません");
  assert.equal(recommendation.quota, "1名");
  assert.match(recommendation.eligibility, /2026年3月から2027年3月.*富山県/u);
  assert.equal(recommendation.exclusive, "条件付き");
  assert.equal(recommendation.principalRecommendation, "必要");
  assert.match(recommendation.gradeRequirement, /全体の学習成績の状況4\.0以上/u);
  assert.match(recommendation.restrictions.join(" "), /富山県.*2024年4月1日以前.*1校1名.*他大学への出願自体は可/u);
  assert.match(recommendation.note ?? "", /受付8:20～8:30.*書留速達.*大学入学共通テストは利用しません/u);
  assert.deepEqual(recommendation.events, [
    { stage: "application-start", date: "2026-11-01", label: "出願開始" },
    { stage: "application-deadline", date: "2026-11-06", label: "郵送消印有効期限", deadlineRule: "消印有効" },
    { stage: "application-deadline", date: "2026-11-07", label: "出願締切", time: "17:00", deadlineRule: "必着" },
    ...commonSelectionEvents,
  ]);
  assert.deepEqual(recommendation.sourceUrls, officialSources);

  for (const route of jichi.routes) {
    assert.ok(route.events.every((event) => !event.label.includes("共通テスト")));
  }
  assert.match(jichi.excludedRoutes?.join(" ") ?? "", /一般選抜.*大学入学共通テスト利用選抜の実施なし/u);
});

test("獨協医科大学は令和9年度公式情報の現役生向け推薦6方式と選考段階を保持", () => {
  const dokkyo = privateMedicalSpecialAdmissionsUniversities2027.find(
    (university) => university.id === "dokkyo-medical",
  );

  assert.ok(dokkyo, "獨協医科大学のデータがありません");
  assert.equal(dokkyo.scopeStatus, "available");
  assert.equal(dokkyo.publicationStatus, "partial");
  assert.equal(dokkyo.officialUrl, "https://www.dokkyomed.ac.jp/dusm/exam/entrance/");
  assert.doesNotMatch(dokkyo.statusNote, /総合型|対象外/u);
  assert.deepEqual(
    dokkyo.routes.map((route) => route.officialName),
    [
      "学校推薦型選抜（公募（地域特別枠））",
      "学校推薦型選抜（指定校制）",
      "学校推薦型選抜（指定校制（栃木県地域枠））",
      "学校推薦型選抜（指定校制（埼玉県地域枠））",
      "学校推薦型選抜（指定校制（茨城県地域枠））",
      "学校推薦型選抜（系列校）",
    ],
  );

  const routeById = new Map(dokkyo.routes.map((route) => [route.id, route]));
  const publicRegional = routeById.get("recommendation-public-regional");
  assert.ok(publicRegional, "公募（地域特別枠）がありません");
  assert.equal(publicRegional.category, "regional");
  assert.equal(publicRegional.publicationStatus, "complete");
  assert.equal(publicRegional.currentStudentEligible, true);
  assert.equal(publicRegional.exclusive, "専願");
  assert.match(publicRegional.eligibility, /2027年3月卒業見込み.*地域.*学校長推薦.*地域医療/u);
  assert.match(publicRegional.gradeRequirement, /3年次は1学期まで.*4\.0以上/u);
  assert.match(publicRegional.restrictions.join(" "), /2024年4月1日.*指定校制との併願.*県別指定校地域枠とは併願不可/u);
  assert.deepEqual(publicRegional.events, [
    { stage: "application-start", date: "2026-11-02", label: "出願開始" },
    { stage: "application-deadline", date: "2026-11-09", label: "出願締切", time: "17:00", deadlineRule: "必着" },
    { stage: "first-exam", date: "2026-11-14", label: "第1次試験（小論文・基礎適性・書類審査）", time: "8:50～12:20" },
    { stage: "first-result", date: "2026-11-18", label: "第1次合格発表", time: "10:00" },
    { stage: "second-exam", date: "2026-11-20", label: "第2次試験（MMI面接）", time: "9:30～" },
    { stage: "final-result", date: "2026-12-01", label: "最終合格発表", time: "10:00" },
    { stage: "procedure-deadline", date: "2026-12-08", label: "入学手続締切" },
  ]);
  assert.deepEqual(publicRegional.sourceUrls, [
    "https://www.dokkyomed.ac.jp/dusm/exam/entrance/",
    "https://www.dokkyomed.ac.jp/dusm/exam/entrance/recommendation.html",
    "https://www.dokkyomed.ac.jp/files/dusm/jyuken/form_requirements-area.pdf?v=4d94d4a48697e063dd1c9cc02ae0beae",
  ]);

  const designated = routeById.get("recommendation-designated");
  assert.ok(designated, "指定校制がありません");
  assert.equal(designated.category, "designated");
  assert.equal(designated.exclusive, "未公表");
  assert.match(designated.eligibility, /出願資格の詳細は各指定校へ通知/u);

  const regionalRoutes = [
    ["recommendation-tochigi", "7名以内", "designated_tochigi.html", /通常9年.*栃木県指定/u],
    ["recommendation-saitama", "2名", "saitama.html", /県内病院等に9年間.*特定診療科/u],
    ["recommendation-ibaraki", "2名", "ibaraki.html", /9年間勤務.*4\.5年以上/u],
  ];
  for (const [routeId, quota, sourceSuffix, restrictionPattern] of regionalRoutes) {
    const route = routeById.get(routeId);
    assert.ok(route, `${routeId}: 県別指定校地域枠がありません`);
    assert.equal(route.category, "regional");
    assert.equal(route.quota, quota);
    assert.equal(route.publicationStatus, "partial");
    assert.equal(route.exclusive, "条件付き");
    assert.match(route.restrictions.join(" "), restrictionPattern);
    assert.match(route.restrictions.join(" "), /指定校制との併願可.*公募（地域特別枠）とは併願不可/u);
    assert.ok(route.sourceUrls.some((url) => url.endsWith(sourceSuffix)));
    assert.match(route.note ?? "", /臨時定員増の認可申請予定/u);
  }

  const ibaraki = routeById.get("recommendation-ibaraki");
  assert.deepEqual(ibaraki?.events.slice(0, 5), [
    { stage: "application-start", date: "2026-10-01", label: "茨城県への応募開始" },
    { stage: "application-deadline", date: "2026-10-23", label: "茨城県への応募締切" },
    { stage: "application-deadline", date: "2026-10-30", label: "茨城県eラーニング回答期限" },
    { stage: "application-start", date: "2026-11-02", label: "大学出願開始" },
    { stage: "application-deadline", date: "2026-11-09", label: "大学出願締切" },
  ]);

  const affiliated = routeById.get("recommendation-affiliated");
  assert.ok(affiliated, "系列校推薦がありません");
  assert.equal(affiliated.exclusive, "未公表");
  assert.deepEqual(
    affiliated.events.filter((event) => event.stage === "first-exam" || event.stage === "second-exam"),
    [
      { stage: "first-exam", date: "2026-11-14", label: "試験1日目", sequence: 1, choiceRule: "2日間とも受験" },
      { stage: "first-exam", date: "2026-11-20", label: "試験2日目", sequence: 2, choiceRule: "2日間とも受験" },
    ],
  );

  assert.match(dokkyo.excludedRoutes?.join(" ") ?? "", /総合型選抜.*現役高校生は出願できない/u);
  assert.match(dokkyo.excludedRoutes?.join(" ") ?? "", /栃木県地域枠・新潟県地域枠.*一般選抜（前期）に準じる/u);
  assert.match(dokkyo.excludedRoutes?.join(" ") ?? "", /共通テスト利用選抜.*2025年度入試から廃止/u);
  assert.ok(dokkyo.routes.every((route) => route.events.every((event) => !event.label.includes("共通テスト"))));
});

test("埼玉医科大学は令和9年度公式情報の年内5方式・資格・一段階選考を保持", () => {
  const saitama = privateMedicalSpecialAdmissionsUniversities2027.find(
    (university) => university.id === "saitama-medical",
  );

  assert.ok(saitama, "埼玉医科大学のデータがありません");
  assert.equal(saitama.scopeStatus, "available");
  assert.equal(saitama.publicationStatus, "partial");
  assert.equal(saitama.officialUrl, "https://adm.saitama-med.ac.jp/admission/examination/");
  assert.match(saitama.statusNote, /地域枠19名.*認可申請予定.*参考掲載.*正式要項/u);
  assert.deepEqual(
    saitama.routes.map((route) => route.officialName),
    [
      "学校推薦型選抜（指定校枠）",
      "学校推薦型選抜（一般公募枠）",
      "学校推薦型選抜（埼玉県地域枠）",
      "学校推薦型選抜（特別枠）",
      "帰国生選抜",
    ],
  );

  const expectedSchedule = [
    { stage: "application-start", date: "2026-11-05", label: "Web出願開始", time: "9:00" },
    { stage: "application-deadline", date: "2026-11-12", label: "Web出願締切" },
    { stage: "application-deadline", date: "2026-11-13", label: "出願書類締切", deadlineRule: "必着" },
    { stage: "first-exam", date: "2026-11-22", label: "試験（適性検査・小論文・面接）", time: "9:00～17:00頃" },
    { stage: "final-result", date: "2026-12-01", label: "合格発表", time: "16:00" },
    { stage: "procedure-deadline", date: "2026-12-11", label: "入学手続締切" },
  ];
  for (const route of saitama.routes) {
    assert.deepEqual(route.events, expectedSchedule, `${route.officialName}: 公式日程と一致しません`);
    assert.ok(
      route.events.every((event) => event.stage !== "second-exam"),
      `${route.officialName}: 一段階選考を二次試験に分割しないでください`,
    );
    assert.equal(
      route.sourceUrls[0],
      "https://adm.saitama-med.ac.jp/wp-content/uploads/2026/07/fa58cf881ba4ac57b5c60b69b2ac25d2.pdf",
    );
  }

  const routeById = new Map(saitama.routes.map((route) => [route.id, route]));
  const designated = routeById.get("recommendation-designated");
  assert.ok(designated, "指定校枠がありません");
  assert.equal(designated.currentStudentEligible, "conditional");
  assert.match(designated.eligibility, /2026年3月卒業または2027年3月卒業見込み/u);
  assert.match(designated.gradeRequirement, /全体.*数学・理科・外国語.*3\.8以上.*最終学年1学期/u);
  assert.match(designated.restrictions.join(" "), /4名まで.*一般公募枠にも自動出願/u);

  const publicRecommendation = routeById.get("recommendation-public");
  assert.ok(publicRecommendation, "一般公募枠がありません");
  assert.equal(publicRecommendation.currentStudentEligible, true);
  assert.match(publicRecommendation.gradeRequirement, /全体.*数学・理科・外国語.*4\.0以上/u);
  assert.match(publicRecommendation.restrictions.join(" "), /推薦できる人数は2名まで/u);

  const regional = routeById.get("recommendation-saitama");
  assert.ok(regional, "埼玉県地域枠がありません");
  assert.equal(regional.category, "regional");
  assert.equal(regional.quota, "19名申請予定");
  assert.equal(regional.publicationStatus, "outline");
  assert.match(regional.gradeRequirement, /4\.0以上.*指定校出身者.*3\.8以上/u);
  assert.match(regional.restrictions.join(" "), /月20万円・6年間.*卒業後9年間.*準特定診療科/u);
  assert.ok(regional.sourceUrls.includes("https://adm.saitama-med.ac.jp/payment/"));
  assert.match(regional.note ?? "", /臨時定員増.*認可申請予定.*参考掲載/u);

  const special = routeById.get("recommendation-special");
  assert.ok(special, "特別枠がありません");
  assert.equal(special.category, "recommendation");
  assert.match(special.eligibility, /学校長推薦.*英語資格または科学競技/u);
  assert.match(special.gradeRequirement, /数値基準なし.*英語資格.*科学オリンピック/u);
  assert.match(special.restrictions.join(" "), /英検1級.*TOEFL iBT 100以上.*推薦人数に制限なし/u);

  const returnee = routeById.get("returnee");
  assert.ok(returnee, "帰国生選抜がありません");
  assert.equal(returnee.currentStudentEligible, "conditional");
  assert.equal(returnee.exclusive, "専願");
  assert.equal(returnee.principalRecommendation, "不要");
  assert.match(returnee.eligibility, /日本国籍、永住者または特別永住者.*卒業年次を含め2学年以上.*2025年4月から2027年3月/u);
  assert.match(returnee.gradeRequirement, /数値基準なし.*成績証明書/u);

  const saitamaExamEntries = buildExamDisplayEntries(
    privateMedicalSpecialAdmissionsEvents2027.filter(
      (event) => event.universityId === "saitama-medical",
    ),
  );
  assert.equal(saitamaExamEntries.length, 1, "同日同大学の5方式は1件にまとめてください");
  assert.equal(saitamaExamEntries[0].displayColumn, "single-exam");
  assert.equal(saitamaExamEntries[0].date, "2026-11-22");
  assertSameSet(
    saitamaExamEntries[0].routeNames,
    saitama.routes.map((route) => route.officialName),
    "一段階選考に5方式を欠落なく列挙してください",
  );

  assert.match(saitama.excludedRoutes?.join(" ") ?? "", /一般選抜（前期・後期）は対象外/u);
  assert.match(saitama.excludedRoutes?.join(" ") ?? "", /共通テスト利用選抜.*通常の共通テスト利用方式/u);
  assert.match(saitama.excludedRoutes?.join(" ") ?? "", /研究医枠.*入学後に募集・選抜/u);
  assert.ok(saitama.routes.every((route) => route.events.every((event) => !event.label.includes("共通テスト"))));
});

test("国際医療福祉大学は2027年度完成版要項の対象5方式・資格確認期限・専併願条件を保持", () => {
  const iuhw = privateMedicalSpecialAdmissionsUniversities2027.find(
    (university) => university.id === "iuhw",
  );

  assert.ok(iuhw, "国際医療福祉大学のデータがありません");
  assert.equal(iuhw.scopeStatus, "available");
  assert.equal(iuhw.publicationStatus, "complete");
  assert.equal(
    iuhw.officialUrl,
    "https://narita.iuhw.ac.jp/gakubu/igakubu/admission/download.html",
  );
  assert.deepEqual(
    iuhw.routes.map((route) => route.officialName),
    [
      "総合型選抜（専願制）",
      "留学生特別選抜（第1回）",
      "留学生特別選抜（第2回）",
      "帰国生および外国人学校卒業生特別選抜（第1回）",
      "帰国生および外国人学校卒業生特別選抜（第2回）",
    ],
  );

  const routeById = new Map(iuhw.routes.map((route) => [route.id, route]));
  const comprehensive = routeById.get("comprehensive-exclusive");
  assert.ok(comprehensive, "総合型選抜（専願制）がありません");
  assert.equal(comprehensive.quota, "10名");
  assert.equal(comprehensive.currentStudentEligible, true);
  assert.equal(comprehensive.exclusive, "専願");
  assert.equal(comprehensive.principalRecommendation, "不要");
  assert.match(comprehensive.eligibility, /2026年3月.*2027年3月卒業見込み.*第一志望/u);
  assert.match(comprehensive.gradeRequirement, /数値基準なし.*調査書/u);
  assert.match(
    comprehensive.restrictions.join(" "),
    /説明会・オープンキャンパス.*Web説明動画.*他の学校・教育課程.*他大学.*入学辞退不可/u,
  );
  assert.match(comprehensive.note ?? "", /大学入学共通テストは利用しません.*12月14日.*12月21日/u);
  assert.deepEqual(comprehensive.events, [
    { stage: "application-start", date: "2026-10-26", label: "Web出願開始", time: "9:00" },
    { stage: "application-deadline", date: "2026-11-09", label: "Web出願登録締切", time: "23:00", deadlineRule: "Web登録" },
    { stage: "application-deadline", date: "2026-11-09", label: "入学検定料納入締切", time: "23:59" },
    { stage: "application-deadline", date: "2026-11-09", label: "出願書類締切", deadlineRule: "必着" },
    { stage: "first-exam", date: "2026-11-21", label: "一次選考（学力試験・小論文・集団面接）" },
    { stage: "first-result", date: "2026-11-30", label: "一次合格発表", time: "15:00" },
    { stage: "second-exam", date: "2026-12-05", label: "二次選考（個別面接）" },
    { stage: "final-result", date: "2026-12-14", label: "最終合格発表", time: "15:00" },
    { stage: "procedure-deadline", date: "2026-12-21", label: "入学手続締切", deadlineRule: "消印有効" },
  ]);
  assert.deepEqual(comprehensive.sourceUrls, [
    "https://narita.iuhw.ac.jp/gakubu/igakubu/admission/doc/guideline_app_sogo.pdf",
    "https://narita.iuhw.ac.jp/gakubu/igakubu/admission/doc/guideline_app.pdf?ver=3",
    "https://narita.iuhw.ac.jp/gakubu/igakubu/admission/sogo.html",
    "https://narita.iuhw.ac.jp/gakubu/igakubu/admission/download.html",
  ]);

  const firstSchedule = [
    { stage: "application-deadline", date: "2026-08-04", label: "出願資格確認締切", deadlineRule: "必着" },
    { stage: "application-start", date: "2026-08-12", label: "Web出願開始", time: "9:00" },
    { stage: "application-deadline", date: "2026-08-20", label: "Web出願登録締切", time: "23:00", deadlineRule: "Web登録" },
    { stage: "application-deadline", date: "2026-08-20", label: "入学検定料納入締切", time: "23:59" },
    { stage: "application-deadline", date: "2026-08-20", label: "出願書類締切", deadlineRule: "必着" },
    { stage: "first-exam", date: "2026-09-01", label: "一次選考（学力試験・小論文）" },
    { stage: "first-result", date: "2026-09-07", label: "一次合格発表", time: "15:00" },
    { stage: "second-exam", date: "2026-09-12", label: "二次選考（面接試験）" },
    { stage: "final-result", date: "2026-09-24", label: "最終合格発表", time: "15:00" },
    { stage: "procedure-deadline", date: "2026-09-30", label: "入学手続締切", deadlineRule: "消印有効" },
  ];
  const secondSchedule = [
    { stage: "application-deadline", date: "2026-10-22", label: "出願資格確認締切", deadlineRule: "必着" },
    { stage: "application-start", date: "2026-11-02", label: "Web出願開始", time: "9:00" },
    { stage: "application-deadline", date: "2026-11-09", label: "Web出願登録締切", time: "23:00", deadlineRule: "Web登録" },
    { stage: "application-deadline", date: "2026-11-09", label: "入学検定料納入締切", time: "23:59" },
    { stage: "application-deadline", date: "2026-11-09", label: "出願書類締切", deadlineRule: "必着" },
    { stage: "first-exam", date: "2026-11-21", label: "一次選考（学力試験・小論文）" },
    { stage: "first-result", date: "2026-11-30", label: "一次合格発表", time: "15:00" },
    { stage: "second-exam", date: "2026-12-05", label: "二次選考（面接試験）" },
    { stage: "final-result", date: "2026-12-14", label: "最終合格発表", time: "15:00" },
    { stage: "procedure-deadline", date: "2026-12-21", label: "入学手続締切", deadlineRule: "消印有効" },
  ];
  const specialSources = [
    "https://narita.iuhw.ac.jp/gakubu/igakubu/admission/doc/guideline_app.pdf?ver=3",
    "https://narita.iuhw.ac.jp/gakubu/igakubu/admission/special.html",
    "https://narita.iuhw.ac.jp/gakubu/igakubu/admission/download.html",
  ];

  for (const routeId of ["international-first", "returnee-first"]) {
    assert.deepEqual(routeById.get(routeId)?.events, firstSchedule, `${routeId}: 第1回日程が公式要項と一致しません`);
  }
  for (const routeId of ["international-second", "returnee-second"]) {
    assert.deepEqual(routeById.get(routeId)?.events, secondSchedule, `${routeId}: 第2回日程が公式要項と一致しません`);
    assert.match(routeById.get(routeId)?.note ?? "", /第1回二次選考受験者.*第2回一次選考.*免除/u);
  }

  for (const routeId of ["international-first", "international-second"]) {
    const selection = routeById.get(routeId);
    assert.ok(selection, `${routeId}: 留学生特別選抜がありません`);
    assert.equal(selection.quota, "20名（第1・2回合計）");
    assert.equal(selection.exclusive, "併願可");
    assert.equal(selection.principalRecommendation, "不要");
    assert.match(selection.eligibility, /日本国籍・日本の永住許可を持たず.*日本在住通算6年以内.*2027年3月31日/u);
    assert.match(selection.gradeRequirement, /一律の評定基準なし.*TOEFL iBT 80.*IELTS 6\.0.*望ましい/u);
    assert.match(selection.restrictions.join(" "), /在籍期間は通算3年以内.*在留資格「留学」.*事前確認/u);
    assert.match(selection.note ?? "", /日本語または英語.*協定に基づく.*個別調整.*三次選考/u);
    assert.deepEqual(selection.sourceUrls, specialSources);
  }

  for (const routeId of ["returnee-first", "returnee-second"]) {
    const selection = routeById.get(routeId);
    assert.ok(selection, `${routeId}: 帰国生・外国人学校卒業生特別選抜がありません`);
    assert.equal(selection.quota, "若干名（第1・2回合計）");
    assert.equal(selection.exclusive, "併願可");
    assert.equal(selection.principalRecommendation, "不要");
    assert.match(selection.eligibility, /日本国籍.*永住許可.*海外学校歴.*海外在住歴.*IB/u);
    assert.match(selection.gradeRequirement, /一律の評定基準なし.*IB資格経路.*32点以上.*指定3科目/u);
    assert.match(selection.restrictions.join(" "), /最終学年を含む4年以上.*海外大学・大学院に2年以上.*満6歳未満.*事前確認/u);
    assert.match(selection.note ?? "", /すべて英語.*日本語での質疑応答.*三次選考/u);
    assert.deepEqual(selection.sourceUrls, specialSources);
  }

  const iuhwDeadlineEntries = buildDeadlineDisplayEntries(
    privateMedicalSpecialAdmissionsEvents2027.filter((event) => event.universityId === "iuhw"),
  );
  const firstApplicationDeadline = iuhwDeadlineEntries.find(
    (entry) => entry.date === "2026-08-20",
  );
  assert.ok(firstApplicationDeadline, "第1回出願締切の表示データがありません");
  assert.equal(firstApplicationDeadline.details.length, 3, "Web・検定料・書類の3締切を保持してください");
  assertSameSet(
    firstApplicationDeadline.routeNames,
    ["留学生特別選抜（第1回）", "帰国生および外国人学校卒業生特別選抜（第1回）"],
    "同一日程の第1回2方式を欠落なく列挙してください",
  );

  assert.match(iuhw.excludedRoutes?.join(" ") ?? "", /一般選抜は対象外/u);
  assert.match(iuhw.excludedRoutes?.join(" ") ?? "", /大学入学共通テスト利用選抜.*通常の共通テスト利用方式/u);
  assert.match(iuhw.excludedRoutes?.join(" ") ?? "", /国際バカロレア資格.*独立した入試方式ではない/u);
  assert.ok(iuhw.routes.every((route) => route.events.every((event) => !event.label.includes("共通テスト"))));
});

test("慶應義塾大学は2027年度完成版要項の独立2方式・資格・書類一次後の日程を保持", () => {
  const keio = privateMedicalSpecialAdmissionsUniversities2027.find(
    (university) => university.id === "keio",
  );

  assert.ok(keio, "慶應義塾大学のデータがありません");
  assert.equal(keio.scopeStatus, "available");
  assert.equal(keio.publicationStatus, "complete");
  assert.equal(keio.officialUrl, "https://www.keio.ac.jp/ja/med/admission/exam/");
  assert.match(keio.statusNote, /2027年度完成版要項.*書類選考.*総合問題・模擬講義・面接/u);
  assert.deepEqual(
    keio.routes.map((route) => route.officialName),
    ["医学部外国人留学生対象入学試験", "帰国生対象入学試験"],
  );

  const expectedSchedule = [
    { stage: "application-start", date: "2026-07-03", label: "Webエントリー・入学検定料支払開始", time: "10:00" },
    { stage: "application-deadline", date: "2026-07-14", label: "Webエントリー締切", time: "16:00", deadlineRule: "Web登録" },
    { stage: "application-deadline", date: "2026-07-14", label: "入学検定料支払締切", time: "16:00" },
    { stage: "application-deadline", date: "2026-07-15", label: "出願書類郵送締切", deadlineRule: "必着" },
    { stage: "first-result", date: "2026-09-08", label: "第1次選考合格発表", time: "10:00" },
    { stage: "second-exam", date: "2026-09-27", label: "第2次選考（総合問題・模擬講義・面接）", time: "9:00" },
    { stage: "final-result", date: "2026-09-29", label: "最終合格発表", time: "10:00" },
    { stage: "procedure-deadline", date: "2026-12-11", label: "入学手続期間最終日" },
  ];
  for (const route of keio.routes) {
    assert.equal(route.quota, "若干名");
    assert.equal(route.publicationStatus, "complete");
    assert.equal(route.currentStudentEligible, "conditional");
    assert.equal(route.exclusive, "併願可");
    assert.equal(route.principalRecommendation, "不要");
    assert.deepEqual(route.events, expectedSchedule, `${route.officialName}: 公式日程と一致しません`);
    assert.ok(route.events.every((event) => event.stage !== "first-exam"));
    assert.match(route.note ?? "", /第1次選考は書類選考のため試験日なし.*8:45集合・9:00開始.*11月30日～12月11日/u);
  }

  const routeById = new Map(keio.routes.map((route) => [route.id, route]));
  const international = routeById.get("international-student");
  assert.ok(international, "医学部外国人留学生対象入学試験がありません");
  assert.match(international.eligibility, /2027年3月31日.*12年以上.*中高6学年.*国籍・在留資格は不問/u);
  assert.match(international.gradeRequirement, /評定の数値基準なし.*EJU.*数学コース2.*理科2科目.*TOEFL.*IELTS.*基準点なし/u);
  assert.match(international.restrictions.join(" "), /交換留学.*1年以内.*過去.*出願.*不可.*帰国生.*併願不可.*校長・教員・スクールカウンセラー.*2名/u);
  assert.deepEqual(international.sourceUrls, [
    "https://www.keio.ac.jp/ja/med/admission/exam/",
    "https://www.keio.ac.jp/ja/admissions/faculty/examinations/international-student/",
    "https://www.keio.ac.jp/fixed-files/ryugaku_medicine_youkou.pdf",
  ]);

  const returnee = routeById.get("returnee");
  assert.ok(returnee, "帰国生対象入学試験がありません");
  assert.match(returnee.eligibility, /2027年3月31日.*最終学年を含め2年以上連続.*日本国籍者・永住者・特別永住者/u);
  assert.match(returnee.gradeRequirement, /評定・語学試験の数値基準なし.*TOEFL.*IELTS.*数学・自然科学.*確定成績/u);
  assert.match(returnee.restrictions.join(" "), /見込み点・予測点不可.*過去.*出願.*不可.*外国人留学生.*併願不可.*校長・教員・スクールカウンセラー.*1名/u);
  assert.deepEqual(returnee.sourceUrls, [
    "https://www.keio.ac.jp/ja/med/admission/exam/",
    "https://www.keio.ac.jp/ja/admissions/faculty/examinations/japanese-returnees/",
    "https://www.keio.ac.jp/fixed-files/kikoku_youkou.pdf",
  ]);

  const keioDeadlineEntries = buildDeadlineDisplayEntries(
    privateMedicalSpecialAdmissionsEvents2027.filter((event) => event.universityId === "keio"),
  );
  const webDeadline = keioDeadlineEntries.find((entry) => entry.date === "2026-07-14");
  assert.ok(webDeadline, "Web・検定料締切の表示データがありません");
  assert.equal(webDeadline.details.length, 2, "Webと検定料の締切を分けて保持してください");
  assertSameSet(
    webDeadline.routeNames,
    keio.routes.map((route) => route.officialName),
    "同一日程の2方式を大学単位にまとめてください",
  );

  const keioExamEntries = buildExamDisplayEntries(
    privateMedicalSpecialAdmissionsEvents2027.filter((event) => event.universityId === "keio"),
  );
  assert.equal(keioExamEntries.length, 1, "同日同大学の2方式は1件にまとめてください");
  assert.equal(keioExamEntries[0].displayColumn, "second-exam");
  assertSameSet(
    keioExamEntries[0].routeNames,
    keio.routes.map((route) => route.officialName),
    "第2次選考に2方式を欠落なく列挙してください",
  );

  assert.match(keio.excludedRoutes?.join(" ") ?? "", /栃木県地域枠.*一般選抜66名のうち1名.*対象外/u);
  assert.ok(keio.routes.every((route) => route.events.every((event) => !event.label.includes("共通テスト"))));
});

test("順天堂大学は2027年度公式要項の対象4方式・二次免除経路・評価材料を保持", () => {
  const juntendo = privateMedicalSpecialAdmissionsUniversities2027.find(
    (university) => university.id === "juntendo",
  );

  assert.ok(juntendo, "順天堂大学のデータがありません");
  assert.equal(juntendo.scopeStatus, "available");
  assert.equal(juntendo.publicationStatus, "partial");
  assert.equal(
    juntendo.officialUrl,
    "https://www.juntendo.ac.jp/admission/exam/nyushi/med/exam_info/boshu_youkou.html",
  );
  assert.match(juntendo.statusNote, /国際バカロレア.*公表済み.*研究医特別選抜.*増員認可後.*最終版/u);
  assert.deepEqual(
    juntendo.routes.map((route) => [route.id, route.officialName]),
    [
      ["research-doctor", "研究医特別選抜"],
      ["international", "外国人選抜"],
      ["returnee", "帰国生選抜"],
      ["ib-cambridge", "国際バカロレア／ケンブリッジ・インターナショナル選抜（総合型選抜）"],
    ],
  );

  const routeById = new Map(juntendo.routes.map((route) => [route.id, route]));
  const researchDoctor = routeById.get("research-doctor");
  assert.ok(researchDoctor, "研究医特別選抜がありません");
  assert.equal(researchDoctor.category, "comprehensive");
  assert.equal(researchDoctor.quota, "2名（入学定員増員認可申請予定）");
  assert.equal(researchDoctor.publicationStatus, "outline");
  assert.equal(researchDoctor.currentStudentEligible, true);
  assert.equal(researchDoctor.exclusive, "専願");
  assert.equal(researchDoctor.principalRecommendation, "不要");
  assert.match(researchDoctor.eligibility, /2027年3月卒業見込み.*入学を確約.*特別コース.*奨学金/u);
  assert.match(researchDoctor.gradeRequirement, /評定の数値基準なし.*共通テスト7科目.*外部英語資格.*任意.*25点/u);
  assert.match(researchDoctor.restrictions.join(" "), /地域枠選抜との併願不可/u);
  assert.deepEqual(researchDoctor.sourceUrls, [
    "https://www.juntendo.ac.jp/admission/exam/nyushi/med/exam_info/boshu_youkou.html",
    "https://www.juntendo.ac.jp/assets/2027_Juntendo_Med_NyugakuShikenYoukou.pdf",
    "https://www.juntendo.ac.jp/kenkyui/",
  ]);

  const researchEssay = researchDoctor.events.find(
    (event) => event.date === "2027-02-03",
  );
  assert.deepEqual(researchEssay, {
    stage: "second-exam",
    date: "2027-02-03",
    label: "小論文試験（二次判定資料）",
    time: "17:30～18:40",
    sequence: 1,
    choiceRule: "小論文は全志願者、面接・プレゼンテーションは一次合格者が受験",
  });
  assert.deepEqual(
    researchDoctor.events.find((event) => event.date === "2027-02-16"),
    {
      stage: "second-exam",
      date: "2027-02-16",
      label: "二次試験（面接約20分・プレゼンテーション約20分）",
      sequence: 2,
      choiceRule: "小論文は全志願者、面接・プレゼンテーションは一次合格者が受験",
    },
  );
  assert.match(
    researchDoctor.note ?? "",
    /小論文は一次合否には使いません.*未受験者は一次選抜対象外.*実施時刻は一次試験合格発表時/u,
  );

  const internationalRouteIds = ["international", "returnee", "ib-cambridge"];
  const internationalRoutes = internationalRouteIds.map((routeId) => {
    const route = routeById.get(routeId);
    assert.ok(route, `${routeId}がありません`);
    return route;
  });
  for (const route of internationalRoutes) {
    assert.equal(route.publicationStatus, "complete");
    assert.equal(route.currentStudentEligible, "conditional");
    assert.equal(route.exclusive, "併願可");
    assert.equal(route.principalRecommendation, "不要");
    assert.match(route.restrictions.join(" "), /3方式から1方式のみ出願可/u);
    assert.deepEqual(route.sourceUrls, [
      "https://www.juntendo.ac.jp/admission/exam/nyushi/med/exam_info/boshu_youkou.html",
      "https://www.juntendo.ac.jp/assets/2027_Juntendo_Med_GakuseiBoshuYoukou_Kokusai.pdf",
    ]);
    assert.ok(
      route.events.some(
        (event) =>
          event.stage === "first-exam" &&
          event.date === "2026-10-13" &&
          event.label === "一次試験（小論文・英作文）" &&
          event.time === "14:30～16:30",
      ),
    );
    assert.ok(
      route.events.some(
        (event) =>
          event.stage === "final-result" &&
          event.date === "2026-11-01" &&
          event.label === "二次試験免除者合格発表" &&
          event.time === "12:00",
      ),
    );
  }

  const international = routeById.get("international");
  assert.match(international.eligibility, /外国籍.*2027年3月31日.*日本の大学入学資格/u);
  assert.match(international.gradeRequirement, /JLPT N1.*N2.*112点.*TOEFL.*IELTS.*英検.*TEAP.*GTEC.*ケンブリッジ/u);
  assert.ok(
    international.events.every(
      (event) => event.stage !== "second-exam" || !event.label.includes("共通テスト"),
    ),
  );

  const returnee = routeById.get("returnee");
  assert.match(returnee.eligibility, /日本国籍または日本国の永住許可.*最終学年.*継続在学/u);
  assert.match(returnee.gradeRequirement, /評定の数値基準なし.*EJUまたは大学入学共通テスト/u);

  const ibCambridge = routeById.get("ib-cambridge");
  assert.match(ibCambridge.eligibility, /IB Diploma.*物理・化学・生物.*数学.*GCE Aレベル/u);
  assert.match(ibCambridge.gradeRequirement, /通常出願.*総合点下限なし.*TOEFL.*IELTS/u);
  assert.match(
    ibCambridge.restrictions.join(" "),
    /日本の教育制度.*共通テスト必須.*外国教育制度.*共通テストまたはEJU/u,
  );
  for (const route of internationalRoutes) {
    assert.match(route.note ?? "", /IB最終40点以上.*Aレベル.*SAT 1450.*ACT 33/u);
  }

  const procedureSignatures = (route) =>
    new Set(
      route.events
        .filter((event) => event.stage === "procedure-deadline")
        .map((event) => `${event.date}|${event.label}|${event.time ?? ""}`),
    );
  assertSameSet(procedureSignatures(researchDoctor), new Set([
    "2027-02-26|入学手続期間最終日|17:00",
  ]));
  assertSameSet(procedureSignatures(international), new Set([
    "2026-11-13|二次試験免除者 入学手続期間最終日|17:00",
    "2027-02-02|二次試験合格者 入学手続期間最終日|17:00",
    "2027-02-05|二次試験免除見込み者 入学手続期間最終日|17:00",
  ]));
  for (const route of [returnee, ibCambridge]) {
    assertSameSet(procedureSignatures(route), new Set([
      "2026-11-06|二次試験免除者 入学手続期間最終日|17:00",
      "2027-01-29|二次試験免除見込み者 入学手続期間最終日|17:00",
      "2027-02-18|二次試験合格者 入学手続期間最終日|17:00",
    ]));
  }

  assert.ok(
    internationalRoutes.every((route) =>
      route.events.some(
        (event) =>
          event.stage === "application-deadline" &&
          event.date === "2026-11-13" &&
          event.label.includes("EJU第2回受験票"),
      ),
    ),
  );
  for (const route of [returnee, ibCambridge]) {
    assert.ok(
      route.events.some(
        (event) =>
          event.stage === "application-deadline" &&
          event.date === "2026-12-23" &&
          event.label.includes("共通テスト成績請求チケット"),
      ),
    );
  }
  assert.ok(
    internationalRoutes.every((route) =>
      route.events.some(
        (event) =>
          event.stage === "application-deadline" &&
          event.date === "2027-01-14" &&
          event.label === "IB取得見込みの一次合格者 最終6科目成績証明書発送期限",
      ),
    ),
  );

  const researchDeadlineEntries = buildDeadlineDisplayEntries(
    privateMedicalSpecialAdmissionsEvents2027.filter(
      (event) => event.universityId === "juntendo" && event.routeId === "research-doctor",
    ),
  );
  const researchApplicationDeadline = researchDeadlineEntries.find(
    (entry) => entry.date === "2027-01-15",
  );
  assert.ok(researchApplicationDeadline, "研究医特別選抜の出願締切がありません");
  assert.deepEqual(researchApplicationDeadline.details, [
    { label: "Web出願登録・入学検定料納入期限", time: undefined, deadlineRule: undefined },
    { label: "出願書類締切", time: undefined, deadlineRule: "必着" },
  ]);

  const juntendoDeadlineEntries = buildDeadlineDisplayEntries(
    privateMedicalSpecialAdmissionsEvents2027.filter(
      (event) => event.universityId === "juntendo",
    ),
  );
  const sharedApplicationDeadline = juntendoDeadlineEntries.find(
    (entry) => entry.date === "2026-09-17",
  );
  assert.ok(sharedApplicationDeadline, "国際3方式の共通出願締切がありません");
  assert.deepEqual(sharedApplicationDeadline.details, [
    { label: "Web出願登録・入学検定料納入期限", time: undefined, deadlineRule: undefined },
    { label: "出願書類締切", time: undefined, deadlineRule: "必着" },
  ]);
  assertSameSet(
    sharedApplicationDeadline.routeKeys,
    new Set(internationalRouteIds.map((routeId) => `juntendo/${routeId}`)),
    "国際3方式の出願締切を大学単位にまとめてください",
  );

  const juntendoExamEntries = buildExamDisplayEntries(
    privateMedicalSpecialAdmissionsEvents2027.filter(
      (event) => event.universityId === "juntendo",
    ),
  );
  const sharedEssayExam = juntendoExamEntries.find(
    (entry) =>
      entry.date === "2026-10-13" &&
      entry.label === "一次試験（小論文・英作文）",
  );
  assert.ok(sharedEssayExam, "国際3方式の共通一次試験がありません");
  assertSameSet(
    sharedEssayExam.routeKeys,
    new Set(internationalRouteIds.map((routeId) => `juntendo/${routeId}`)),
    "国際3方式の一次試験を大学単位にまとめてください",
  );

  assert.equal(juntendo.excludedRoutes?.length, 7);
  assert.match(juntendo.excludedRoutes?.join(" ") ?? "", /東京都.*新潟県.*千葉県.*埼玉県.*静岡県.*茨城県.*群馬県/u);
  assert.ok(
    juntendo.routes.every((route) => !route.id.endsWith("regional")),
    "実質一般選抜の地域枠を再掲載しないでください",
  );
});

test("帝京大学は2027年度完成版要項の対象2方式・二次出願・一段階推薦を保持", () => {
  const teikyo = privateMedicalSpecialAdmissionsUniversities2027.find(
    (university) => university.id === "teikyo",
  );

  assert.ok(teikyo, "帝京大学のデータがありません");
  assert.equal(teikyo.scopeStatus, "available");
  assert.equal(teikyo.publicationStatus, "complete");
  assert.equal(teikyo.officialUrl, "https://www.teikyo-u.ac.jp/applicants/faculty/medicine_d");
  assert.match(teikyo.statusNote, /完成版要項.*独自の一次選考後.*二次選考で共通テスト/u);
  assert.deepEqual(
    teikyo.routes.map((route) => [route.id, route.officialName, route.quota]),
    [
      ["comprehensive", "総合型選抜", "10名"],
      ["recommendation-public", "学校推薦型選抜（公募制）", "15名"],
    ],
  );

  const routeById = new Map(teikyo.routes.map((route) => [route.id, route]));
  const comprehensive = routeById.get("comprehensive");
  assert.ok(comprehensive, "総合型選抜がありません");
  assert.equal(comprehensive.currentStudentEligible, true);
  assert.equal(comprehensive.exclusive, "併願可");
  assert.equal(comprehensive.principalRecommendation, "不要");
  assert.match(comprehensive.eligibility, /2026年3月.*2027年3月卒業見込み.*6年間の医学教育/u);
  assert.match(comprehensive.gradeRequirement, /数値基準なし.*調査書等は面接資料/u);
  assert.match(
    comprehensive.restrictions.join(" "),
    /募集対象者A〜D.*英語必須.*数学1科目.*理科2科目.*指定校制.*他大学と併願可/u,
  );
  assert.deepEqual(comprehensive.sourceUrls, [
    "https://www.teikyo-u.ac.jp/application/files/4017/8409/4615/01_2027.pdf",
    "https://www.teikyo-u.ac.jp/applicants/faculty/medicine_d",
    "https://www.teikyo-u.ac.jp/applicants/download",
    "https://www.dnc.ac.jp/kyotsu/shiken_jouhou/r9/index.html",
  ]);

  const deadlineSignatures = (route, date) =>
    new Set(
      route.events
        .filter((event) => event.stage === "application-deadline" && event.date === date)
        .map((event) => `${event.label}|${event.time ?? ""}|${event.deadlineRule ?? ""}`),
    );
  assertSameSet(deadlineSignatures(comprehensive, "2026-10-07"), new Set([
    "Web出願登録締切|16:30|Web登録",
    "入学検定料納入締切|16:30|",
    "出願書類締切|16:30|必着",
  ]));
  assert.ok(
    comprehensive.events.some(
      (event) =>
        event.stage === "application-start" &&
        event.date === "2026-12-14" &&
        event.label.includes("二次選考") &&
        event.time === "9:00",
    ),
    "総合型の二次選考出願開始がありません",
  );
  assertSameSet(deadlineSignatures(comprehensive, "2026-12-21"), new Set([
    "二次選考 Web出願登録締切|16:30|Web登録",
  ]));
  assert.deepEqual(
    comprehensive.events.find((event) => event.date === "2026-10-17"),
    {
      stage: "first-exam",
      date: "2026-10-17",
      label: "一次選考（論述課題・グループディスカッション・面接）",
      time: "9:00〜15:30頃",
    },
  );
  assert.deepEqual(
    comprehensive.events.filter((event) => event.stage === "second-exam"),
    [
      {
        stage: "second-exam",
        date: "2027-01-16",
        label: "大学入学共通テスト（英語）",
        time: "15:20〜18:20",
        sequence: 1,
        choiceRule: "指定科目受験のため2日間とも受験",
      },
      {
        stage: "second-exam",
        date: "2027-01-17",
        label: "大学入学共通テスト（理科2科目・数学1科目）",
        time: "9:30〜16:10",
        sequence: 2,
        choiceRule: "指定科目受験のため2日間とも受験",
      },
    ],
  );
  assert.ok(
    comprehensive.events.some(
      (event) => event.stage === "first-result" && event.date === "2026-11-02" && event.time === "11:00",
    ),
  );
  assert.ok(
    comprehensive.events.some(
      (event) => event.stage === "final-result" && event.date === "2027-02-13" && event.time === "11:00",
    ),
  );
  assert.match(comprehensive.note ?? "", /紙の成績請求チケット.*追加の入学検定料は不要.*本学へ着金/u);

  const recommendation = routeById.get("recommendation-public");
  assert.ok(recommendation, "学校推薦型選抜（公募制）がありません");
  assert.equal(recommendation.currentStudentEligible, true);
  assert.equal(recommendation.exclusive, "専願");
  assert.equal(recommendation.principalRecommendation, "必要");
  assert.match(recommendation.eligibility, /2027年3月卒業見込み.*6年間の医学教育.*学校長.*推薦/u);
  assert.match(recommendation.gradeRequirement, /最終学年第1学期.*調査書全体.*4\.0以上.*二期制.*第2学年後期/u);
  assert.match(recommendation.restrictions.join(" "), /入学を確約.*共通テストは利用しない/u);
  assertSameSet(deadlineSignatures(recommendation, "2026-11-11"), new Set([
    "Web出願登録締切|16:30|Web登録",
    "入学検定料納入締切|16:30|",
    "出願書類締切|16:30|必着",
  ]));
  assert.deepEqual(
    recommendation.events.find((event) => event.date === "2026-11-21"),
    {
      stage: "first-exam",
      date: "2026-11-21",
      label: "試験（基礎能力適性検査・小論文・面接・書類審査）",
      time: "8:30〜17:00頃",
    },
  );
  assert.ok(
    recommendation.events.some(
      (event) => event.stage === "final-result" && event.date === "2026-12-01" && event.time === "11:00",
    ),
  );
  assert.match(recommendation.note ?? "", /英語・数学・理科1科目.*同日で選考.*英語外部試験.*本学へ着金/u);

  assert.match(
    teikyo.excludedRoutes?.join(" ") ?? "",
    /一般選抜.*各特別地域枠.*一般選抜の募集人員.*大学入学共通テスト利用選抜.*対象外/u,
  );
  assert.ok(
    teikyo.routes.every(
      (route) => !route.id.includes("regional") && !route.id.includes("general") && route.id !== "common-test",
    ),
    "一般選抜の地域枠や通常の共通テスト利用選抜を再掲載しないでください",
  );
});

test("東京医科大学は2027年度完成版要項の推薦7方式・資格差・締切・選考段階を保持", () => {
  const tokyoMedical = privateMedicalSpecialAdmissionsUniversities2027.find(
    (university) => university.id === "tokyo-medical",
  );

  assert.ok(tokyoMedical, "東京医科大学のデータがありません");
  assert.equal(tokyoMedical.scopeStatus, "available");
  assert.equal(tokyoMedical.publicationStatus, "partial");
  assert.equal(tokyoMedical.officialUrl, "https://admissions-tokyo-med.jp/med/youkou-dl/");
  assert.match(tokyoMedical.statusNote, /募集要項.*対象7方式.*認可申請中.*変更される場合/u);
  assert.deepEqual(
    tokyoMedical.routes.map((route) => [route.id, route.officialName, route.quota]),
    [
      ["recommendation-public", "学校推薦型選抜（一般公募）", "20名以内"],
      ["recommendation-ibaraki", "学校推薦型選抜（茨城県地域枠）", "8名以内"],
      ["recommendation-niigata", "学校推薦型選抜（新潟県地域枠）", "3名以内"],
      ["recommendation-saitama", "学校推薦型選抜（埼玉県地域枠）", "2名以内"],
      ["recommendation-gunma", "学校推薦型選抜（群馬県地域枠）", "2名以内"],
      ["recommendation-english", "学校推薦型選抜（英語検定試験利用）", "3名以内"],
      ["recommendation-national-block", "全国ブロック別学校推薦型選抜", "12名以内（6ブロック各2名以内）"],
    ],
  );

  const routeById = new Map(tokyoMedical.routes.map((route) => [route.id, route]));
  const publicRecommendation = routeById.get("recommendation-public");
  const englishRecommendation = routeById.get("recommendation-english");
  const nationalBlock = routeById.get("recommendation-national-block");
  const regionalRouteIds = [
    "recommendation-ibaraki",
    "recommendation-niigata",
    "recommendation-saitama",
    "recommendation-gunma",
  ];

  assert.match(publicRecommendation?.eligibility ?? "", /2026年4月1日.*2027年3月31日.*学校長推薦/u);
  assert.match(publicRecommendation?.gradeRequirement ?? "", /4\.0以上.*第3学年第1学期/u);
  assert.match(
    publicRecommendation?.restrictions.join(" ") ?? "",
    /同一高等学校等から2名以内.*県地域枠・全国ブロック別.*英語検定試験利用.*共通テストは利用しない/u,
  );
  assert.equal(publicRecommendation?.exclusive, "専願");

  for (const routeId of regionalRouteIds) {
    const regionalRoute = routeById.get(routeId);
    assert.ok(regionalRoute, `${routeId}: 地域枠がありません`);
    assert.equal(regionalRoute.publicationStatus, "partial");
    assert.match(regionalRoute.eligibility, /2025年4月1日.*2027年3月31日/u);
    assert.match(regionalRoute.gradeRequirement, /4\.0以上/u);
    assert.match(
      regionalRoute.restrictions.join(" "),
      /出身地.*不問.*4県地域枠相互.*英語検定試験利用とは併願不可.*一般公募・全国ブロック別とは併願可.*認可申請予定.*共通テストは利用しない/u,
    );
  }
  for (const routeId of ["recommendation-public", "recommendation-english", "recommendation-national-block"]) {
    assert.equal(routeById.get(routeId)?.publicationStatus, "complete");
  }
  assert.match(routeById.get("recommendation-ibaraki")?.restrictions.join(" ") ?? "", /eラーニング.*9年間/u);
  assert.match(routeById.get("recommendation-niigata")?.restrictions.join(" ") ?? "", /卒前支援プラン.*9年間/u);
  assert.match(routeById.get("recommendation-saitama")?.restrictions.join(" ") ?? "", /特定地域.*特定・準特定診療科/u);
  assert.match(routeById.get("recommendation-gunma")?.restrictions.join(" ") ?? "", /キャリアパス.*10年間/u);

  assert.match(englishRecommendation?.eligibility ?? "", /2025年4月1日.*2027年3月31日.*CEFR B1以上/u);
  assert.match(englishRecommendation?.gradeRequirement ?? "", /4\.0以上.*2年以内.*CEFR B1以上/u);
  assert.match(
    englishRecommendation?.restrictions.join(" ") ?? "",
    /一般公募とのみ.*両方式に合格.*USMLE受験準備コース.*共通テストは利用しない/u,
  );

  assert.match(nationalBlock?.eligibility ?? "", /2025年4月1日.*2027年3月31日.*高校所在地.*保護者居住地/u);
  assert.match(
    nationalBlock?.restrictions.join(" ") ?? "",
    /全国6ブロック.*卒後の勤務地・勤務年限の義務なし.*一般公募・4県地域枠とは併願可.*英語検定試験利用とは併願不可.*共通テストは利用しない/u,
  );
  assert.deepEqual(
    nationalBlock?.events.filter((event) => event.stage === "first-result" || event.stage === "second-exam"),
    [
      {
        stage: "first-result",
        date: "2026-12-03",
        label: "基礎学力検査合格発表",
        time: "10:00",
      },
      {
        stage: "second-exam",
        date: "2026-12-12",
        label: "面接（MMI）",
        sequence: 2,
        choiceRule: "基礎学力検査合格者のみ。実施時刻は合格発表時に通知",
      },
    ],
  );

  const deadlineSignatures = (route) =>
    new Set(
      route.events
        .filter((event) => event.stage === "application-deadline" && event.date === "2026-11-13")
        .map((event) => `${event.label}|${event.time ?? ""}|${event.deadlineRule ?? ""}`),
    );
  const expectedDeadlineSignatures = new Set([
    "Web出願登録締切|23:59|Web登録",
    "入学検定料納入締切|23:59|",
    "出願書類郵送締切||消印有効",
  ]);
  for (const route of tokyoMedical.routes) {
    assert.ok(
      route.events.some(
        (event) => event.stage === "application-start" && event.date === "2026-11-02" && event.time === "0:00",
      ),
      `${route.officialName}: Web出願開始時刻がありません`,
    );
    assertSameSet(
      deadlineSignatures(route),
      expectedDeadlineSignatures,
      `${route.officialName}: Web・検定料・郵送の締切を区別してください`,
    );
    assert.ok(route.sourceUrls.includes("https://admissions-tokyo-med.jp/med/exam/"));
    assert.ok(route.sourceUrls.includes("https://admissions-tokyo-med.jp/med/youkou-dl/"));
  }

  const examEntries = buildExamDisplayEntries(
    privateMedicalSpecialAdmissionsEvents2027.filter(
      (event) => event.universityId === "tokyo-medical",
    ),
  );
  const sharedSingleExams = examEntries.filter(
    (entry) =>
      entry.date === "2026-11-28" &&
      entry.displayColumn === "single-exam" &&
      entry.label === "試験（日本語・英語小論文・基礎学力検査・個人面接）",
  );
  assert.ok(sharedSingleExams.length > 0, "一般公募・4地域枠の共通する一段階試験がありません");
  assertSameSet(
    sharedSingleExams.flatMap((entry) => entry.routeKeys),
    new Set(["tokyo-medical/recommendation-public", ...regionalRouteIds.map((routeId) => `tokyo-medical/${routeId}`)]),
    "一般公募・4地域枠の一段階試験を欠落させないでください",
  );
  assert.ok(
    examEntries.some(
      (entry) =>
        entry.routeKeys.includes("tokyo-medical/recommendation-english") &&
        entry.displayColumn === "single-exam" &&
        !entry.label.includes("英語小論文"),
    ),
    "英語検定試験利用を英語小論文ありとして表示しないでください",
  );
  assert.ok(
    examEntries.some(
      (entry) =>
        entry.routeKeys.includes("tokyo-medical/recommendation-national-block") &&
        entry.displayColumn === "first-exam",
    ),
    "全国ブロック別の基礎学力検査を一次列に表示してください",
  );

  assert.match(
    tokyoMedical.excludedRoutes?.join(" ") ?? "",
    /一般選抜・共通テスト利用選抜.*学士選抜.*高校卒業見込み者は出願できない/u,
  );
  assert.ok(
    tokyoMedical.routes.every((route) => route.id !== "bachelor" && !route.officialName.includes("学士選抜")),
    "現役高校生が出願できない学士選抜を掲載しないでください",
  );
});

test("東京女子医科大学は2027年度更新版要項の対象3方式・資格・締切・選考段階を保持", () => {
  const twmu = privateMedicalSpecialAdmissionsUniversities2027.find(
    (university) => university.id === "tokyo-womens-medical",
  );

  assert.ok(twmu, "東京女子医科大学のデータがありません");
  assert.equal(twmu.scopeStatus, "available");
  assert.equal(twmu.publicationStatus, "partial");
  assert.equal(
    twmu.officialUrl,
    "https://www.twmu-u.jp/wp-content/uploads/2026/08/30cfa9d6198a1f4ca4a002eee2df2651.pdf",
  );
  assert.match(twmu.statusNote, /2026年8月4日.*完成版要項.*対象3方式.*外国医療人人材育成促進事業.*詳細.*別途公表待ち/u);
  assert.deepEqual(
    twmu.routes.map((route) => [route.id, route.officialName, route.quota, route.publicationStatus]),
    [
      ["comprehensive", "総合型選抜（一般枠）", "約19名", "complete"],
      ["foreign-healthcare-human-resources", "総合型選抜（外国医療人人材育成促進事業）", "最大1名", "partial"],
      ["school-recommendation", "学校推薦型選抜（一般推薦）", "約40名", "complete"],
    ],
  );

  const routeById = new Map(twmu.routes.map((route) => [route.id, route]));
  const comprehensive = routeById.get("comprehensive");
  const foreignHealthcare = routeById.get("foreign-healthcare-human-resources");
  const recommendation = routeById.get("school-recommendation");
  const guideUrl = "https://www.twmu-u.jp/wp-content/uploads/2026/08/30cfa9d6198a1f4ca4a002eee2df2651.pdf";
  const updateNoticeUrl = "https://www.twmu-u.jp/wp-content/uploads/2026/08/4ce351a52448d061c7add286862b2e9b.pdf";
  const admissionsUrl = "https://www.twmu-u.jp/medical-ent-suisen/";

  assert.match(comprehensive?.eligibility ?? "", /2022年3月以降.*2027年3月.*IB資格/u);
  assert.equal(comprehensive?.exclusive, "専願");
  assert.equal(comprehensive?.principalRecommendation, "不要");
  assert.match(comprehensive?.gradeRequirement ?? "", /3\.8以上.*IB資格.*34点以上/u);
  assert.match(
    comprehensive?.restrictions.join(" ") ?? "",
    /女子に限る.*2027年4月1日.*2026年8月31日.*他大学との併願不可.*入学前教育.*共通テストは利用しない/u,
  );

  assert.match(recommendation?.eligibility ?? "", /2026年3月.*2027年3月.*出身学校長の推薦/u);
  assert.equal(recommendation?.exclusive, "専願");
  assert.equal(recommendation?.principalRecommendation, "必要");
  assert.match(recommendation?.gradeRequirement ?? "", /4\.0以上/u);
  assert.match(
    recommendation?.restrictions.join(" ") ?? "",
    /女子に限る.*数学III.*理科2科目.*課外活動.*2026年9月30日.*他大学との併願不可.*共通テストは利用しない/u,
  );
  assert.equal(foreignHealthcare?.currentStudentEligible, "conditional");
  assert.match(foreignHealthcare?.eligibility ?? "", /ASEAN地域の大学の医学部に在籍する女子.*詳細.*別途/u);
  assert.equal(foreignHealthcare?.exclusive, "未公表");
  assert.equal(foreignHealthcare?.principalRecommendation, "未公表");
  assert.equal(foreignHealthcare?.gradeRequirement, "未公表");
  assert.match(
    foreignHealthcare?.restrictions.join(" ") ?? "",
    /女子に限る.*ASEAN地域の大学医学部在籍者のみ.*出願資格・選考方法.*別途.*共通テストを利用しない/u,
  );
  for (const route of twmu.routes) {
    assert.ok(route.sourceUrls.includes(guideUrl));
    assert.ok(route.sourceUrls.includes(updateNoticeUrl));
    assert.ok(route.sourceUrls.includes(admissionsUrl));
  }

  const deadlineSet = (route) =>
    new Set(
      route.events
        .filter((event) => event.stage === "application-deadline")
        .map((event) => `${event.date}|${event.label}|${event.time ?? ""}|${event.deadlineRule ?? ""}`),
    );
  assertSameSet(
    deadlineSet(comprehensive),
    new Set([
      "2026-08-31|外国学校課程等の出願資格事前相談書類提出期限||",
      "2026-09-28|Web出願登録締切|23:00|Web登録",
      "2026-09-28|入学検定料支払締切|23:00|",
      "2026-09-30|出願書類締切||必着",
    ]),
    "総合型の事前相談・Web・検定料・書類締切を区別してください",
  );
  assertSameSet(
    deadlineSet(recommendation),
    new Set([
      "2026-09-30|外国学校課程等の出願資格事前相談書類提出期限||",
      "2026-11-10|Web出願登録締切|23:00|Web登録",
      "2026-11-10|入学検定料支払締切|23:00|",
      "2026-11-12|出願書類締切||必着",
    ]),
    "一般推薦の事前相談・Web・検定料・書類締切を区別してください",
  );
  assertSameSet(
    deadlineSet(foreignHealthcare),
    new Set(["2026-10-20|出願締切||"]),
    "外国医療人材育成促進事業の出願締切を保持してください",
  );

  assert.deepEqual(
    comprehensive?.events.filter(
      (event) => event.stage === "first-result" || event.stage === "second-exam" || event.stage === "final-result",
    ),
    [
      { stage: "first-result", date: "2026-10-27", label: "第1次試験合格発表", time: "14:00" },
      {
        stage: "second-exam",
        date: "2026-10-31",
        label: "第2次試験（プレゼンテーションを含む個人面接）",
        sequence: 2,
        choiceRule: "第1次試験合格者のみ。集合時刻は第1次試験合格発表時に通知",
      },
      { stage: "final-result", date: "2026-11-06", label: "最終合格発表", time: "14:00" },
    ],
  );
  assert.deepEqual(
    recommendation?.events.filter((event) => event.stage === "first-exam"),
    [
      {
        stage: "first-exam",
        date: "2026-11-21",
        label: "選考1日目（思考力試験・小論文・小グループ討論）",
        time: "8:40集合、9:00～17:30頃",
        sequence: 1,
        choiceRule: "2日間とも受験",
      },
      {
        stage: "first-exam",
        date: "2026-11-22",
        label: "選考2日目（個人面接）",
        sequence: 2,
        choiceRule: "2日間とも受験。集合時刻は1日目に通知",
      },
    ],
  );
  assert.deepEqual(foreignHealthcare?.events, [
    { stage: "application-start", date: "2026-10-01", label: "出願開始" },
    { stage: "application-deadline", date: "2026-10-20", label: "出願締切" },
    {
      stage: "first-exam",
      date: "2026-10-26",
      label: "試験（10月26日～11月4日の間で受験生と調整した1日）",
    },
    { stage: "final-result", date: "2026-11-06", label: "合格発表", time: "14:00（日本時間）" },
  ]);
  assert.deepEqual(
    [comprehensive, recommendation].map((route) =>
      route?.events.find((event) => event.stage === "procedure-deadline"),
    ),
    [
      { stage: "procedure-deadline", date: "2026-11-17", label: "入学手続締切", time: "16:00", deadlineRule: "必着" },
      { stage: "procedure-deadline", date: "2026-12-15", label: "入学手続締切", time: "16:00", deadlineRule: "必着" },
    ],
  );
  assert.equal(
    foreignHealthcare?.events.find((event) => event.stage === "procedure-deadline"),
    undefined,
    "未公表の入学手続期限を補完しないでください",
  );
  assert.match(
    twmu.excludedRoutes?.join(" ") ?? "",
    /一般選抜.*地域枠/u,
  );
  assert.ok(
    !twmu.excludedRoutes?.some((route) => route.includes("外国医療人人材育成促進事業")),
    "一般選抜・共通テスト利用ではない総合型選抜を対象外にしないでください",
  );
});

test("東邦大学は2027年度公式情報の対象5方式・資格・地域枠日程を保持", () => {
  const toho = privateMedicalSpecialAdmissionsUniversities2027.find(
    (university) => university.id === "toho",
  );

  assert.ok(toho, "東邦大学のデータがありません");
  assert.equal(toho.scopeStatus, "available");
  assert.equal(toho.publicationStatus, "partial");
  assert.equal(toho.officialUrl, "https://www.toho-u.ac.jp/med/info_exam/sum.html");
  assert.match(toho.statusNote, /2027年度.*対象5方式.*千葉県.*新潟県.*設置認可構想中.*完成版募集要項.*作成中/u);
  assert.deepEqual(
    toho.routes.map((route) => [
      route.id,
      route.officialName,
      route.category,
      route.quota,
      route.publicationStatus,
      route.currentStudentEligible,
    ]),
    [
      ["comprehensive", "総合入試", "comprehensive", "約10名", "partial", true],
      ["alumni-children", "同窓生子女入試", "comprehensive", "約5名", "partial", true],
      ["affiliated-school", "推薦入試（付属校制）", "designated", "約20名", "partial", "conditional"],
      ["chiba-regional", "推薦入試（公募制－千葉県地域枠）", "regional", "3名", "partial", true],
      ["niigata-regional", "推薦入試（公募制－新潟県地域枠）", "regional", "5名", "partial", true],
    ],
  );

  const routeById = new Map(toho.routes.map((route) => [route.id, route]));
  const comprehensive = routeById.get("comprehensive");
  const alumni = routeById.get("alumni-children");
  const affiliated = routeById.get("affiliated-school");
  const chiba = routeById.get("chiba-regional");
  const niigata = routeById.get("niigata-regional");

  assert.match(comprehensive?.eligibility ?? "", /2026年3月.*2027年3月卒業見込み/u);
  assert.equal(comprehensive?.exclusive, "専願");
  assert.equal(comprehensive?.principalRecommendation, "不要");
  assert.match(comprehensive?.gradeRequirement ?? "", /全体.*3\.8以上.*数学・理科.*4\.0以上.*高校3年1学期/u);
  assert.match(
    comprehensive?.restrictions.join(" ") ?? "",
    /入学を確約.*同窓生子女入試.*付属校制.*併願不可.*共通テストは利用しない/u,
  );

  assert.match(alumni?.eligibility ?? "", /2022年3月以降.*2027年3月卒業見込み.*医学部卒業生.*血族2親等/u);
  assert.equal(alumni?.exclusive, "専願");
  assert.equal(alumni?.principalRecommendation, "不要");
  assert.match(alumni?.gradeRequirement ?? "", /数値基準の記載なし/u);
  assert.match(
    alumni?.restrictions.join(" ") ?? "",
    /2024年4月1日以前.*養子縁組.*入学を確約.*総合入試.*付属校制.*併願不可.*共通テストは利用しない/u,
  );

  assert.match(affiliated?.eligibility ?? "", /東邦大学付属東邦高等学校.*駒場東邦高等学校.*推薦/u);
  assert.equal(affiliated?.exclusive, "専願");
  assert.equal(affiliated?.principalRecommendation, "必要");
  assert.equal(affiliated?.gradeRequirement, "対象校へ通知");
  assert.match(
    affiliated?.restrictions.join(" ") ?? "",
    /付属東邦高等学校.*駒場東邦高等学校.*学校長を経由.*入学を確約.*併願不可.*共通テストは利用しない/u,
  );
  assert.ok(affiliated?.events.every((event) => event.stage !== "application-start" && event.stage !== "application-deadline"));

  for (const regional of [chiba, niigata]) {
    assert.match(regional?.eligibility ?? "", /2022年3月以降.*2027年3月卒業見込み.*募集要項待ち/u);
    assert.equal(regional?.exclusive, "未公表");
    assert.equal(regional?.principalRecommendation, "未公表");
    assert.equal(regional?.gradeRequirement, "未公表");
    assert.match(
      regional?.restrictions.join(" ") ?? "",
      /設置認可構想中.*推薦・地域・修学資金・卒後勤務.*募集要項待ち.*共通テストは利用しない/u,
    );
    assert.match(regional?.note ?? "", /完成版募集要項は作成中.*前年要項.*転用していません/u);
  }

  const publishedSchedule = [
    {
      stage: "application-start",
      date: "2026-11-02",
      label: "Web出願登録・郵送受付開始",
      time: "10:00（Web出願）",
    },
    { stage: "application-deadline", date: "2026-11-11", label: "郵送受付締切", deadlineRule: "必着" },
    {
      stage: "application-deadline",
      date: "2026-11-11",
      label: "窓口受付（当日のみ）",
      time: "9:00～17:00",
      deadlineRule: "大学指定",
    },
    { stage: "first-exam", date: "2026-11-20", label: "第1次試験", sequence: 1 },
    { stage: "first-result", date: "2026-11-27", label: "第1次試験合格発表", time: "12:00" },
    {
      stage: "second-exam",
      date: "2026-12-05",
      label: "第2次試験",
      choiceRule: "第1次試験合格者のみ",
      sequence: 2,
    },
    { stage: "final-result", date: "2026-12-09", label: "最終合格発表", time: "12:00" },
    { stage: "procedure-deadline", date: "2026-12-15", label: "入学手続期限" },
  ];
  for (const route of [comprehensive, alumni, chiba, niigata]) {
    assert.deepEqual(route?.events, publishedSchedule);
  }

  const overviewUrl = "https://www.toho-u.ac.jp/med/info_exam/sum.html";
  const changesUrl = "https://www.toho-u.ac.jp/info_exam/toho_nyushi2027_web_apply.html";
  const guideStatusUrl = "https://www.toho-u.ac.jp/info_exam/web_apply.html";
  for (const route of toho.routes) {
    assert.ok(route.sourceUrls.includes(overviewUrl));
    assert.ok(route.sourceUrls.includes(guideStatusUrl));
  }
  for (const route of [comprehensive, alumni, chiba, niigata]) {
    assert.ok(route?.sourceUrls.includes(changesUrl));
  }
  assert.ok(comprehensive?.sourceUrls.includes("https://www.toho-u.ac.jp/med/info_exam/sogo.html"));
  assert.ok(alumni?.sourceUrls.includes("https://www.toho-u.ac.jp/med/info_exam/doso.html"));
  assert.ok(affiliated?.sourceUrls.includes("https://www.toho-u.ac.jp/med/info_exam/fuzoku.html"));

  assert.match(toho.excludedRoutes?.join(" ") ?? "", /一般入試.*千葉県.*新潟県.*統一入試.*一般選抜/u);
  assert.ok(
    toho.routes.every((route) => !/一般入試|統一入試/u.test(route.officialName)),
    "一般選抜に当たる方式を東邦大学の対象方式へ含めないでください",
  );
});

test("日本大学は2027年度公式概要の公募制1方式と一段階選考を保持", () => {
  const nihon = privateMedicalSpecialAdmissionsUniversities2027.find(
    (university) => university.id === "nihon",
  );

  assert.ok(nihon, "日本大学のデータがありません");
  assert.equal(nihon.scopeStatus, "available");
  assert.equal(nihon.publicationStatus, "outline");
  assert.equal(nihon.officialUrl, "https://www.nihon-u.ac.jp/assets/gakkou_i_260518.pdf");
  assert.match(
    nihon.statusNote,
    /2027年度.*公募制1方式.*詳細募集要項は未公表.*地域枠.*令和8年度.*転用していません/u,
  );
  assert.equal(nihon.routes.length, 1);

  const recommendation = nihon.routes[0];
  assert.deepEqual(
    [
      recommendation.id,
      recommendation.officialName,
      recommendation.category,
      recommendation.quota,
      recommendation.publicationStatus,
      recommendation.currentStudentEligible,
    ],
    ["recommendation-public", "学校推薦型選抜（公募制）", "recommendation", "10名", "outline", true],
  );
  assert.match(recommendation.eligibility, /2026年3月.*2027年3月卒業見込み/u);
  assert.equal(recommendation.exclusive, "専願");
  assert.equal(recommendation.principalRecommendation, "必要");
  assert.match(
    recommendation.gradeRequirement,
    /全体の学習成績の状況4\.0以上.*第3学年9月30日まで/u,
  );
  assert.match(
    recommendation.restrictions.join(" "),
    /第一志望.*入学を確約.*物理基礎・物理.*化学基礎・化学.*生物基礎・生物.*2組以上.*入学前教育.*課題.*共通テストは利用しない/u,
  );
  assert.deepEqual(recommendation.events, [
    { stage: "application-start", date: "2026-11-17", label: "出願開始" },
    { stage: "application-deadline", date: "2026-11-27", label: "出願締切" },
    { stage: "first-exam", date: "2026-12-12", label: "選考日" },
    { stage: "final-result", date: "2026-12-23", label: "合格発表", time: "16:00" },
    { stage: "procedure-deadline", date: "2027-01-13", label: "入学手続締切" },
  ]);
  assert.match(
    recommendation.note ?? "",
    /1日・一段階.*個人面接.*基礎学力検査（数学・英語）.*小論文.*必着・消印.*公表待ち/u,
  );
  assert.deepEqual(recommendation.sourceUrls, [
    "https://www.nihon-u.ac.jp/assets/gakkou_i_260518.pdf",
    "https://www.med.nihon-u.ac.jp/resource/pdf/examinee/igakubuGUIDEBOOK2027.pdf",
    "https://www.nihon-u.ac.jp/admission_info/application/general_information/recommendation/",
  ]);

  const examEntry = buildExamDisplayEntries(privateMedicalSpecialAdmissionsEvents2027).find(
    (entry) => entry.universityId === "nihon" && entry.routeKeys.includes("nihon/recommendation-public"),
  );
  assert.ok(examEntry, "日本大学の選考日表示がありません");
  assert.equal(examEntry.displayColumn, "single-exam");
  assert.equal(examEntry.date, "2026-12-12");
  assert.equal(examEntry.label, "選考日");

  assert.match(
    nihon.excludedRoutes?.join(" ") ?? "",
    /校友枠選抜.*実質一般選抜.*N全学統一方式第1期・第2期.*地域枠選抜（一般選抜利用）.*新潟県地域枠.*埼玉県地域枠.*令和8年度.*指定校制.*付属校/u,
  );
  assert.ok(
    nihon.routes.every((route) => !/校友枠|N全学統一|地域枠|指定校|付属校/u.test(route.officialName)),
    "実質一般選抜・旧年度地域枠・付属校系を日本大学の対象方式へ含めないでください",
  );
});

test("日本医科大学は2027年度完成版要項を確認し実質一般・共テ併用方式を除外", () => {
  const nipponMedical = privateMedicalSpecialAdmissionsUniversities2027.find(
    (university) => university.id === "nippon-medical",
  );

  assert.ok(nipponMedical, "日本医科大学のデータがありません");
  assert.equal(nipponMedical.scopeStatus, "not-offered");
  assert.equal(nipponMedical.publicationStatus, "not-offered");
  assert.equal(
    nipponMedical.officialUrl,
    "https://www.nms.ac.jp/college/nyushi-book/pdf_2027/guidelines_2027.pdf",
  );
  assert.deepEqual(nipponMedical.routes, []);
  assert.match(
    nipponMedical.statusNote,
    /2027年度完成版要項.*全選抜区分.*独立した総合型選抜・学校推薦型選抜等はありません/u,
  );
  assert.doesNotMatch(
    nipponMedical.statusNote,
    /グローバル特別選抜|一般選抜（前期|後期|地域枠）/u,
    "対象外として確認した方式名をページ表示用の注記へ出さないでください",
  );
  assert.match(
    nipponMedical.excludedRoutes?.join(" ") ?? "",
    /グローバル特別選抜（前期）.*一般入学者選抜 概要.*共通テスト国語.*一般選抜（前期）.*同日・同一.*英語・数学・理科.*一般選抜（前期・後期・地域枠）.*一般選抜.*対象外/u,
  );
  assert.equal(
    privateMedicalSpecialAdmissionsEvents2027.some(
      (event) => event.universityId === "nippon-medical",
    ),
    false,
    "日本医科大学の対象外方式を日程イベントへ含めないでください",
  );
});

test("東海大学は2027年度完成版要項の希望の星育成1方式と三段階選考を保持", () => {
  const tokai = privateMedicalSpecialAdmissionsUniversities2027.find(
    (university) => university.id === "tokai",
  );

  assert.ok(tokai, "東海大学のデータがありません");
  assert.equal(tokai.scopeStatus, "available");
  assert.equal(tokai.publicationStatus, "complete");
  assert.equal(tokai.officialUrl, "https://www.med.u-tokai.ac.jp/faculty/medicine/exam/");
  assert.match(
    tokai.statusNote,
    /2027年度完成版要項.*書類審査.*大学独自の第二次選考.*大学入学共通テスト.*総合型選抜1方式/u,
  );
  assert.doesNotMatch(
    tokai.statusNote,
    /一般選抜|地域枠|展学のすすめ|プレトク/u,
    "対象外として確認した方式名をページ表示用の注記へ出さないでください",
  );
  assert.equal(tokai.routes.length, 1);

  const hopeStar = tokai.routes[0];
  assert.deepEqual(
    [
      hopeStar.id,
      hopeStar.officialName,
      hopeStar.category,
      hopeStar.quota,
      hopeStar.publicationStatus,
      hopeStar.currentStudentEligible,
    ],
    [
      "star-development",
      "総合型選抜 医学部医学科（希望の星育成）",
      "comprehensive",
      "10名",
      "complete",
      true,
    ],
  );
  assert.match(
    hopeStar.eligibility,
    /高校・中等教育学校.*2027年3月卒業見込み.*特別支援学校高等部・高等専門学校第3学年.*外国の12年課程・在外教育施設・文部科学大臣指定.*2026年4月1日～2027年3月31日.*令和9年度大学入学共通テスト/u,
  );
  assert.equal(hopeStar.exclusive, "併願可");
  assert.equal(hopeStar.principalRecommendation, "不要");
  assert.equal(hopeStar.gradeRequirement, "評定要件なし（調査書は書類審査資料）");
  assert.match(
    hopeStar.restrictions.join(" "),
    /国内の高校.*2027年3月卒業見込み.*外国12年課程.*2026年4月1日～2027年3月31日.*英語（リスニングを含む）.*数学I A.*数学II B C.*物理／化学／生物から2科目.*活動報告書.*特になし.*他大学との併願可/u,
  );

  assert.deepEqual(hopeStar.events, [
    { stage: "application-start", date: "2026-09-01", label: "第一次選考出願開始" },
    {
      stage: "application-deadline",
      date: "2026-09-14",
      label: "第一次選考出願締切",
      deadlineRule: "必着",
    },
    { stage: "first-result", date: "2026-10-05", label: "第一次選考結果発表", time: "9:30" },
    {
      stage: "application-start",
      date: "2026-10-05",
      label: "第二次選考出願開始",
      choiceRule: "第一次選考合格者のみ",
    },
    {
      stage: "application-deadline",
      date: "2026-10-12",
      label: "第二次選考出願締切",
      time: "23:59",
    },
    {
      stage: "second-exam",
      date: "2026-10-24",
      label: "第二次選考（小論文・オブザベーション評価・個人面接）",
      time: "9:00開始",
    },
    { stage: "final-result", date: "2026-10-30", label: "第二次選考合格発表", time: "9:30" },
    {
      stage: "application-start",
      date: "2026-12-11",
      label: "最終選考出願開始",
      choiceRule: "第二次選考合格者のみ",
    },
    {
      stage: "application-deadline",
      date: "2026-12-18",
      label: "最終選考出願締切",
      deadlineRule: "必着",
    },
    {
      stage: "first-exam",
      date: "2027-01-16",
      label: "大学入学共通テスト①",
      sequence: 1,
      choiceRule: "最終選考として2日間とも受験",
    },
    {
      stage: "first-exam",
      date: "2027-01-17",
      label: "大学入学共通テスト②",
      sequence: 2,
      choiceRule: "最終選考として2日間とも受験",
    },
    { stage: "final-result", date: "2027-02-07", label: "最終合格発表", time: "9:30" },
    {
      stage: "procedure-deadline",
      date: "2027-02-13",
      label: "Web入学手続締切",
      time: "17:00",
      deadlineRule: "Web登録",
    },
  ]);
  assert.match(
    hopeStar.note ?? "",
    /第一次選考.*書類審査.*第二次選考.*小論文.*オブザベーション評価.*個人面接.*最終選考.*共通テスト科目600点.*本学独自試験はありません.*2月7日.*2月13日17:00/u,
  );
  assert.deepEqual(hopeStar.sourceUrls, [
    "https://www.u-tokai.ac.jp/uploads/2026/07/65834d7e0d45140addd0835093f90a58.pdf",
    "https://www.med.u-tokai.ac.jp/faculty/medicine/exam/",
    "https://www.u-tokai.ac.jp/examination-admissions/exam/",
    "https://www.med.u-tokai.ac.jp/news/",
  ]);
  assert.match(
    tokai.excludedRoutes?.join(" ") ?? "",
    /一般選抜.*神奈川県地域枠選抜・静岡県地域枠選抜.*大学入学共通テスト利用型.*展学のすすめ.*大学2年以上・62単位.*プレトク.*医学部医学科を募集対象としていない/u,
  );
});

test("金沢医科大学は2027年度公式概要の確定4方式と認可申請中2方式を保持", () => {
  const kanazawa = privateMedicalSpecialAdmissionsUniversities2027.find(
    (university) => university.id === "kanazawa-medical",
  );

  assert.ok(kanazawa, "金沢医科大学のデータがありません");
  assert.equal(kanazawa.scopeStatus, "available");
  assert.equal(kanazawa.publicationStatus, "outline");
  assert.equal(
    kanazawa.officialUrl,
    "https://www.kanazawa-med.ac.jp/medicine_exam/assets/m_admissionguide.pdf.pdf",
  );
  assert.match(
    kanazawa.statusNote,
    /2027年度入試ガイド.*4方式.*研究医枠・新潟県地域枠.*認可申請中.*募集人員・資格・日程は未公表.*完成版要項/u,
  );

  assertSameSet(
    new Set(kanazawa.routes.map((route) => route.id)),
    new Set([
      "ao",
      "graduate-child",
      "designated-region",
      "designated-school",
      "research-doctor",
      "niigata-regional",
    ]),
    "金沢医科大学の確定4方式と認可申請中2方式を保持してください",
  );

  const ao = kanazawa.routes.find((route) => route.id === "ao");
  const graduateChild = kanazawa.routes.find((route) => route.id === "graduate-child");
  const designatedRegion = kanazawa.routes.find((route) => route.id === "designated-region");
  const designatedSchool = kanazawa.routes.find((route) => route.id === "designated-school");
  const researchDoctor = kanazawa.routes.find((route) => route.id === "research-doctor");
  const niigataRegional = kanazawa.routes.find((route) => route.id === "niigata-regional");
  assert.ok(
    ao && graduateChild && designatedRegion && designatedSchool && researchDoctor && niigataRegional,
  );

  assert.deepEqual(
    [ao.officialName, ao.category, ao.quota, ao.currentStudentEligible],
    ["総合型選抜（AO入試）", "comprehensive", "15名", true],
  );
  assert.match(ao.eligibility, /2026年4月1日現在25歳以下.*2027年3月卒業見込み/u);
  assert.equal(ao.exclusive, "専願");
  assert.equal(ao.principalRecommendation, "不要");
  assert.match(ao.gradeRequirement, /評定の数値基準なし.*調査書等を評価/u);
  assert.match(
    ao.restrictions.join(" "),
    /本人を熟知する者.*近親者・教員等を問わず.*推薦書.*卒業後5年間.*指定臨床研修/u,
  );

  assert.deepEqual(
    [
      graduateChild.officialName,
      graduateChild.category,
      graduateChild.quota,
      graduateChild.currentStudentEligible,
    ],
    ["総合型選抜（卒業生子女入試）", "comprehensive", "8名", true],
  );
  assert.match(
    graduateChild.eligibility,
    /本学医学部卒業生の子女.*2026年4月1日現在25歳以下.*2027年3月卒業見込み.*2024年4月1日以前の養子縁組/u,
  );
  assert.equal(graduateChild.principalRecommendation, "不要");
  assert.match(
    graduateChild.restrictions.join(" "),
    /推薦書.*卒業後5年間.*その後4年間.*継続勤務/u,
  );

  assert.deepEqual(
    [
      designatedRegion.officialName,
      designatedRegion.category,
      designatedRegion.quota,
      designatedRegion.currentStudentEligible,
    ],
    ["総合型選抜（指定地域）", "regional", "1名", true],
  );
  assert.match(
    designatedRegion.eligibility,
    /富山県氷見市在住.*氷見市長および高校長の推薦.*2027年3月高校卒業見込み.*2026年3月卒業.*2027年4月1日現在19歳以下/u,
  );
  assert.equal(designatedRegion.principalRecommendation, "必要");
  assert.match(
    designatedRegion.restrictions.join(" "),
    /氷見市修学資金.*地域勤務条件.*卒業後5年間.*指定臨床研修/u,
  );

  assert.deepEqual(
    [
      designatedSchool.officialName,
      designatedSchool.category,
      designatedSchool.quota,
      designatedSchool.currentStudentEligible,
    ],
    ["学校推薦型選抜（指定校）", "designated", "4名", true],
  );
  assert.match(
    designatedSchool.eligibility,
    /本学指定高校.*2027年3月卒業見込み.*2026年3月卒業.*2027年4月1日現在19歳以下.*高校長/u,
  );
  assert.equal(designatedSchool.principalRecommendation, "必要");

  const publishedRoutes = [ao, graduateChild, designatedRegion, designatedSchool];
  for (const route of publishedRoutes) {
    assert.equal(route.publicationStatus, "outline");
    assert.equal(route.exclusive, "専願");
    assert.equal(route.events.length, 8);
    assert.deepEqual(route.events[0], {
      stage: "application-start",
      date: "2026-11-09",
      label: "Web出願開始",
      time: "9:00",
    });
    assert.deepEqual(route.events[1], {
      stage: "application-deadline",
      date: "2026-11-14",
      label: "Web出願締切",
      time: "15:00",
    });
    assert.deepEqual(route.events[2], {
      stage: "application-deadline",
      date: "2026-11-14",
      label: "出願書類提出締切",
      deadlineRule: "消印有効",
    });
    assert.deepEqual(route.events[3], {
      stage: "first-exam",
      date: "2026-11-21",
      label: "第1次選抜（基礎学力テスト・自己推薦書）",
      time: "9:30～12:40",
      sequence: 1,
    });
    assert.deepEqual(route.events[4], {
      stage: "first-result",
      date: "2026-11-26",
      label: "第1次選抜合格発表",
      time: "17:30",
    });
    assert.deepEqual(route.events[5], {
      stage: "second-exam",
      date: "2026-12-06",
      label: "第2次選抜（個人面接・約15分）",
      sequence: 2,
    });
    assert.deepEqual(route.events[6], {
      stage: "final-result",
      date: "2026-12-10",
      label: "最終合格発表",
      time: "17:30",
    });
    assert.deepEqual(route.events[7], {
      stage: "procedure-deadline",
      date: "2026-12-17",
      label: "入学手続締切",
      time: "15:00",
    });
    assert.match(route.note ?? "", /第1次選抜.*第2次選抜.*個人面接.*共通テストは使用しません/u);
    assert.ok(route.sourceUrls.includes(kanazawa.officialUrl));
    assert.ok(route.sourceUrls.some((url) => url.endsWith("/news/001268.html")));
    assert.ok(route.sourceUrls.some((url) => url.endsWith("/summary/post-5.html")));
  }

  for (const route of [researchDoctor, niigataRegional]) {
    assert.equal(route.publicationStatus, "unpublished");
    assert.equal(route.currentStudentEligible, "unconfirmed");
    assert.equal(route.quota, null);
    assert.equal(route.exclusive, "未公表");
    assert.equal(route.principalRecommendation, "未公表");
    assert.deepEqual(route.events, []);
    assert.match(route.eligibility, /2027年度.*認可申請中.*募集人員・出願資格は未公表/u);
    assert.match(route.note ?? "", /2026年度.*転用していません/u);
    assert.doesNotMatch(`${route.eligibility} ${route.restrictions.join(" ")}`, /1名|2名|2026年3月/u);
  }

  assert.equal(
    privateMedicalSpecialAdmissionsEvents2027.filter(
      (event) => event.universityId === "kanazawa-medical",
    ).length,
    32,
  );
  assert.match(kanazawa.excludedRoutes?.join(" ") ?? "", /一般選抜（前期・後期）は対象外/u);
  assert.equal(
    kanazawa.routes.some((route) => /一般選抜|共通テスト利用/u.test(route.officialName)),
    false,
  );
});

test("愛知医科大学は2027年度完成版要項の対象4方式と一段階選抜を保持", () => {
  const aichi = privateMedicalSpecialAdmissionsUniversities2027.find(
    (university) => university.id === "aichi-medical",
  );

  assert.ok(aichi, "愛知医科大学のデータがありません");
  assert.equal(aichi.scopeStatus, "available");
  assert.equal(aichi.publicationStatus, "complete");
  assert.equal(
    aichi.officialUrl,
    "https://www.aichi-med-u.ac.jp/files/igaku/2027nenndogakuseibosyuuyoukou_0731.pdf",
  );
  assert.match(aichi.statusNote, /2027年度本冊・別冊.*4方式.*確認済み/u);
  assert.doesNotMatch(aichi.statusNote, /地域特別枠B|共通テスト利用/u);

  assertSameSet(
    new Set(aichi.routes.map((route) => route.id)),
    new Set(["recommendation-public", "ib", "aichi-regional-a", "foreign-roots"]),
    "愛知医科大学の対象4方式を保持してください",
  );

  const publicRecommendation = aichi.routes.find(
    (route) => route.id === "recommendation-public",
  );
  const ib = aichi.routes.find((route) => route.id === "ib");
  const regionalA = aichi.routes.find((route) => route.id === "aichi-regional-a");
  const foreignRoots = aichi.routes.find((route) => route.id === "foreign-roots");
  assert.ok(publicRecommendation && ib && regionalA && foreignRoots);

  assert.deepEqual(
    [
      publicRecommendation.officialName,
      publicRecommendation.category,
      publicRecommendation.quota,
      publicRecommendation.exclusive,
      publicRecommendation.principalRecommendation,
    ],
    [
      "学校推薦型選抜（公募制）",
      "recommendation",
      "約20名（IB若干名を内数に含む）",
      "専願",
      "必要",
    ],
  );
  assert.match(
    publicRecommendation.eligibility,
    /2026年3月.*2027年3月卒業見込み.*学校長推薦.*評定.*指定科目/u,
  );
  assert.match(publicRecommendation.gradeRequirement, /全体・数学・理科・外国語各3\.7以上/u);
  assert.match(publicRecommendation.restrictions.join(" "), /指定科目.*地域特別枠A方式と併願不可/u);

  assert.deepEqual(
    [ib.officialName, ib.category, ib.quota, ib.exclusive, ib.principalRecommendation],
    ["国際バカロレア選抜", "ib", "若干名（公募制の内数）", "未公表", "不要"],
  );
  assert.match(ib.eligibility, /2025年4月.*2027年3月.*18歳.*科目・成績要件/u);
  assert.match(ib.gradeRequirement, /言語A（日本語）4以上.*1科目以上HL.*全科目5以上/u);
  assert.match(ib.restrictions.join(" "), /英語外部試験.*IELTS.*TOEIC.*TOEFL iBT/u);
  assert.ok(
    ib.events.some(
      (event) =>
        event.stage === "application-deadline" &&
        event.date === "2027-02-19" &&
        /IB取得見込み合格者.*最終試験成績証明書/u.test(event.label),
    ),
    "IB取得見込み合格者の最終試験成績証明書期限がありません",
  );
  assert.match(ib.note ?? "", /日本語小論文.*個人面接.*共通テストは利用しません.*専願・併願の記載がありません/u);

  assert.deepEqual(
    [regionalA.officialName, regionalA.category, regionalA.quota, regionalA.exclusive],
    [
      "学校推薦型選抜（愛知県地域特別枠A方式）",
      "regional",
      "約5名（臨時定員増の認可申請予定）",
      "専願",
    ],
  );
  assert.match(
    regionalA.eligibility,
    /2026年3月.*2027年3月卒業見込み.*愛知県内校出身.*本人・保護者が県内居住.*学校長推薦/u,
  );
  assert.match(
    regionalA.restrictions.join(" "),
    /修学資金.*本学5年.*愛知県指定医療機関等5年.*公募制と併願不可.*認可申請予定/u,
  );
  assert.match(regionalA.note ?? "", /一段階選抜.*共通テストは利用しません.*12月11日.*12月22日/u);

  assert.deepEqual(
    [foreignRoots.officialName, foreignRoots.category, foreignRoots.quota, foreignRoots.exclusive],
    [
      "外国にルーツを持つ生徒特別選抜",
      "international",
      "若干名（一般選抜募集人員の内数）",
      "条件付き",
    ],
  );
  assert.match(foreignRoots.eligibility, /卒業または卒業見込み.*国籍.*在留資格.*科学オリンピック.*日本語能力/u);
  assert.match(foreignRoots.gradeRequirement, /数値評定基準なし.*科学オリンピック/u);
  assert.match(
    foreignRoots.restrictions.join(" "),
    /国籍取得6年以内.*在留期間が通算9年以内.*留学・短期滞在を除く.*日本語能力試験N2以上.*未取得者も受験可.*公募制.*地域特別枠A方式と併願不可/u,
  );

  for (const route of aichi.routes) {
    assert.equal(route.publicationStatus, "complete");
    assert.equal(route.events.some((event) => event.stage === "second-exam"), false);
    assert.ok(
      route.events.some(
        (event) =>
          event.stage === "first-exam" &&
          event.date === "2026-11-28" &&
          event.time === "8:30～8:45受付",
      ),
      `${route.officialName}の一段階試験日がありません`,
    );
    assert.ok(
      route.events.some(
        (event) =>
          event.stage === "final-result" &&
          event.date === "2026-12-10" &&
          event.time === "18:00頃",
      ),
      `${route.officialName}の合格発表がありません`,
    );
    assert.ok(route.sourceUrls.every((url) => url.startsWith("https://www.aichi-med-u.ac.jp/")));
  }

  assert.equal(
    privateMedicalSpecialAdmissionsEvents2027.filter(
      (event) => event.universityId === "aichi-medical",
    ).length,
    25,
  );
  assert.match(aichi.excludedRoutes?.join(" ") ?? "", /地域特別枠B.*共通テスト利用.*対象外/u);
});

test("藤田医科大学は2027年度公式概要の対象2方式・枠別資格・二段階選抜を保持", () => {
  const fujita = privateMedicalSpecialAdmissionsUniversities2027.find(
    (university) => university.id === "fujita",
  );

  assert.ok(fujita, "藤田医科大学のデータがありません");
  assert.equal(fujita.scopeStatus, "available");
  assert.equal(fujita.publicationStatus, "outline");
  assert.equal(
    fujita.officialUrl,
    "https://www.fujita-hu.ac.jp/admission/exam-med/dubv6r0000001ec6-att/j93sdv000000ub7q.pdf",
  );
  assert.match(fujita.statusNote, /2027年度入試概要.*対象2方式.*完成版学生募集要項.*8月公開予定.*入学手続日.*未公表/u);
  assert.doesNotMatch(fujita.statusNote, /愛知県地域枠|共通テスト利用入試/u);

  assertSameSet(
    new Set(fujita.routes.map((route) => route.id)),
    new Set(["fujita-future", "returnee-ib"]),
    "藤田医科大学の対象2方式を保持してください",
  );

  const future = fujita.routes.find((route) => route.id === "fujita-future");
  const returneeIb = fujita.routes.find((route) => route.id === "returnee-ib");
  assert.ok(future && returneeIb);

  assert.deepEqual(
    [
      future.officialName,
      future.category,
      future.quota,
      future.currentStudentEligible,
      future.exclusive,
      future.principalRecommendation,
    ],
    [
      "ふじた未来入試（一般枠／独創一理枠）",
      "comprehensive",
      "一般枠と独創一理枠を合わせて12名（独創一理枠は最大3名）",
      true,
      "条件付き",
      "不要",
    ],
  );
  assert.match(future.eligibility, /日本国内.*2027年3月.*卒業見込み.*入学確約.*卒後研修/u);
  assert.match(future.gradeRequirement, /数値評定基準の記載なし/u);
  assert.match(
    future.restrictions.join(" "),
    /現役のみ.*一般枠は入学確約.*国公立大学医学科.*独創一理枠.*本学（大学・短大）卒業生の2親等以内.*辞退例外の記載なし.*専門研修プログラム/u,
  );
  assert.doesNotMatch(future.restrictions.join(" "), /大学等への在籍歴なし/u);
  assert.match(
    future.note ?? "",
    /大学入学共通テストは利用しません.*英語・数学の200点.*小論文.*二次判定.*辞退条件が異なります/u,
  );

  assert.deepEqual(
    [
      returneeIb.officialName,
      returneeIb.category,
      returneeIb.quota,
      returneeIb.currentStudentEligible,
      returneeIb.exclusive,
      returneeIb.principalRecommendation,
    ],
    [
      "帰国生・国際バカロレア入試",
      "returnee",
      "若干名（一般入試一般枠90名に含む）",
      "conditional",
      "条件付き",
      "不要",
    ],
  );
  assert.match(
    returneeIb.eligibility,
    /日本国籍.*永住許可.*2024年4月以降.*2027年3月.*IB資格.*英語資格.*年齢/u,
  );
  assert.match(returneeIb.gradeRequirement, /数値評定・IB得点基準の記載なし.*TOEFL iBT.*IELTS Academic Module/u);
  assert.match(
    returneeIb.restrictions.join(" "),
    /最終学年を含め2年以上.*日本人学校等を除く.*国内外を問わず.*TOEFL iBT.*IELTS Academic Module.*2006年4月2日.*2009年4月1日.*国公立大学医学科の国際バカロレア入試/u,
  );
  assert.match(
    returneeIb.note ?? "",
    /一般入試一般枠の内数.*固有の出願資格.*独立日程.*大学入学共通テストは利用しません.*英語・数学の200点.*小論文.*二次判定.*最低点・有効期限.*入学手続日.*公表待ち/u,
  );

  for (const route of fujita.routes) {
    assert.equal(route.publicationStatus, "outline");
    assert.deepEqual(
      route.events.map(({ stage, date }) => ({ stage, date })),
      [
        { stage: "application-start", date: "2026-10-01" },
        {
          stage: "application-deadline",
          date: route.id === "fujita-future" ? "2026-10-30" : "2026-10-23",
        },
        {
          stage: "application-deadline",
          date: route.id === "fujita-future" ? "2026-11-02" : "2026-10-26",
        },
        { stage: "first-exam", date: "2026-11-08" },
        { stage: "first-result", date: "2026-11-13" },
        { stage: "second-exam", date: "2026-11-22" },
        { stage: "final-result", date: "2026-11-30" },
      ],
    );
    assert.equal(route.events[2]?.deadlineRule, "必着");
    assert.equal(route.events.some((event) => event.stage === "procedure-deadline"), false);
    assert.ok(route.sourceUrls.every((url) => url.startsWith("https://www.fujita-hu.ac.jp/")));
    assert.ok(route.sourceUrls.includes("https://www.fujita-hu.ac.jp/admission/admission_infoi.html"));
  }

  assert.equal(
    privateMedicalSpecialAdmissionsEvents2027.filter(
      (event) => event.universityId === "fujita",
    ).length,
    14,
  );
  assert.match(
    fujita.excludedRoutes?.join(" ") ?? "",
    /一般入試（愛知県地域枠を含む）.*共通テスト利用入試.*対象外/u,
  );
});

test("大阪医科薬科大学は2027年度公式概要の対象4方式・英語資格・一段階推薦選考を保持", () => {
  const ompu = privateMedicalSpecialAdmissionsUniversities2027.find(
    (university) => university.id === "osaka-med-pharm",
  );

  assert.ok(ompu, "大阪医科薬科大学のデータがありません");
  assert.equal(ompu.scopeStatus, "available");
  assert.equal(ompu.publicationStatus, "outline");
  assert.equal(
    ompu.officialUrl,
    "https://www.ompu.ac.jp/admission/undergraduate/qt931k000000801q-att/afif3u000000fsvj.pdf",
  );
  assert.match(
    ompu.statusNote,
    /2027年度入試概要・変更予告.*対象4方式.*完成版入試要項は未公表.*学習成績・指定校・推薦者.*断定していません/u,
  );
  assert.doesNotMatch(
    ompu.statusNote,
    /一般選抜（前期|大阪府地域枠|後期）|大学入学共通テスト利用選抜/u,
    "対象外として確認した方式名をページ表示用の注記へ出さないでください",
  );

  assertSameSet(
    new Set(ompu.routes.map((route) => route.id)),
    new Set([
      "shisei-jinjutsu",
      "recommendation-public",
      "recommendation-designated",
      "recommendation-regional-designated",
    ]),
    "大阪医科薬科大学の対象4方式を保持してください",
  );

  const shisei = ompu.routes.find((route) => route.id === "shisei-jinjutsu");
  const publicRecommendation = ompu.routes.find(
    (route) => route.id === "recommendation-public",
  );
  const designated = ompu.routes.find(
    (route) => route.id === "recommendation-designated",
  );
  const regionalDesignated = ompu.routes.find(
    (route) => route.id === "recommendation-regional-designated",
  );
  assert.ok(shisei && publicRecommendation && designated && regionalDesignated);

  assert.deepEqual(
    [
      shisei.officialName,
      shisei.category,
      shisei.quota,
      shisei.currentStudentEligible,
      shisei.exclusive,
      shisei.principalRecommendation,
    ],
    [
      "総合型選抜「至誠仁術」入試（併願制）",
      "comprehensive",
      "5名",
      true,
      "併願可",
      "未公表",
    ],
  );
  assert.match(shisei.eligibility, /2027年3月卒業見込み.*卒業後1年以内.*指定共通テスト科目/u);
  assert.match(shisei.gradeRequirement, /数値基準.*2027年度概要で未公表/u);
  assert.match(
    shisei.restrictions.join(" "),
    /卒業後1年以内.*共通テストを第一次選考に利用.*活動報告書.*志願者評価書2通/u,
  );
  assert.match(
    shisei.note ?? "",
    /共通テスト.*国語100点.*数学200点.*理科200点.*英語200点.*第一次選考.*第二次選考.*小論文・面接.*独立した総合型選抜.*通常の共通テスト利用選抜とは異なります/u,
  );
  assert.deepEqual(
    shisei.events.map(({ stage, date, deadlineRule }) => ({
      stage,
      date,
      ...(deadlineRule === undefined ? {} : { deadlineRule }),
    })),
    [
      { stage: "application-start", date: "2026-12-09" },
      { stage: "application-deadline", date: "2027-01-15", deadlineRule: "消印有効" },
      { stage: "first-exam", date: "2027-01-16" },
      { stage: "first-exam", date: "2027-01-17" },
      { stage: "first-result", date: "2027-02-17" },
      { stage: "second-exam", date: "2027-03-14" },
      { stage: "final-result", date: "2027-03-16" },
      { stage: "procedure-deadline", date: "2027-03-23" },
    ],
  );
  assert.deepEqual(
    shisei.events
      .filter((event) => event.stage === "first-exam")
      .map(({ sequence, choiceRule }) => ({ sequence, choiceRule })),
    [
      { sequence: 1, choiceRule: "2日間とも受験" },
      { sequence: 2, choiceRule: "2日間とも受験" },
    ],
  );

  const recommendationRoutes = [publicRecommendation, designated, regionalDesignated];
  assert.deepEqual(
    recommendationRoutes.map((route) => route.currentStudentEligible),
    [true, "unconfirmed", "unconfirmed"],
  );
  assert.equal(publicRecommendation.eligibility.includes("既卒者は出願不可"), true);
  assert.match(designated.eligibility, /本学指定の高校.*卒業見込み時期・既卒可否.*未公表/u);
  assert.match(regionalDesignated.eligibility, /医師少数県.*本学指定の高校.*対象県.*未公表/u);
  assert.doesNotMatch(designated.eligibility, /2027年3月卒業見込み|現役生/u);
  assert.doesNotMatch(regionalDesignated.eligibility, /2027年3月卒業見込み|現役生/u);

  for (const route of recommendationRoutes) {
    assert.equal(route.publicationStatus, "outline");
    assert.equal(route.exclusive, "専願");
    assert.equal(route.principalRecommendation, "未公表");
    assert.match(route.gradeRequirement, /学習成績の数値基準.*未公表.*2026年11月1日時点.*所定スコア/u);
    assert.match(
      route.restrictions.join(" "),
      /受験後2年以内.*TOEFL iBT 3以上.*42以上.*IELTS Academic 4.0以上.*英検CSE 1980以上.*TEAP 4技能225以上.*GTEC CBT 930以上.*ケンブリッジ英語検定140以上.*MyBest.*Home Edition.*志望理由書.*入学前教育/u,
    );
    assert.match(route.note ?? "", /数学100点.*理科2科目150点.*小論文・面接.*一段階選考.*共通テストは利用しません/u);
    assert.deepEqual(
      route.events.map(({ stage, date, label, deadlineRule }) => ({
        stage,
        date,
        label,
        ...(deadlineRule === undefined ? {} : { deadlineRule }),
      })),
      [
        { stage: "application-start", date: "2026-11-01", label: "出願開始" },
        {
          stage: "application-deadline",
          date: "2026-11-07",
          label: "出願締切",
          deadlineRule: "消印有効",
        },
        {
          stage: "first-exam",
          date: "2026-11-21",
          label: "試験（数学・理科・小論文・面接）",
        },
        { stage: "final-result", date: "2026-12-01", label: "合格発表" },
        { stage: "procedure-deadline", date: "2026-12-11", label: "入学手続締切" },
      ],
    );
    assert.equal(route.events.some((event) => event.stage === "first-result"), false);
    assert.equal(route.events.some((event) => event.stage === "second-exam"), false);
    assert.equal(route.sourceUrls[0], ompu.officialUrl);
    assert.ok(route.sourceUrls.includes("https://www.ompu.ac.jp/admission/undergraduate/qt931k000000801q-att/hphm900000000alu.pdf"));
    assert.ok(route.sourceUrls.includes("https://www.ompu.ac.jp/admission/undergraduate/medical.html"));
    assert.ok(route.sourceUrls.includes("https://www.ompu.ac.jp/admission/undergraduate/medical/index.html"));
  }

  const recommendationExamEntry = buildExamDisplayEntries(
    privateMedicalSpecialAdmissionsEvents2027.filter(
      (event) => event.universityId === "osaka-med-pharm",
    ),
  ).find((entry) => entry.date === "2026-11-21");
  assert.ok(recommendationExamEntry);
  assert.equal(recommendationExamEntry.displayColumn, "single-exam");
  assertSameSet(
    recommendationExamEntry.routeNames,
    recommendationRoutes.map((route) => route.officialName),
    "同日の推薦3方式を大学単位にまとめ、一段階試験列へ表示してください",
  );

  for (const route of ompu.routes) {
    assert.ok(route.sourceUrls.every((url) => url.startsWith("https://www.ompu.ac.jp/")));
  }
  assert.equal(
    privateMedicalSpecialAdmissionsEvents2027.filter(
      (event) => event.universityId === "osaka-med-pharm",
    ).length,
    23,
  );
  assert.match(
    ompu.excludedRoutes?.join(" ") ?? "",
    /一般選抜（前期・大阪府地域枠・後期）.*大学入学共通テスト利用選抜.*対象外/u,
  );
});

test("北里大学は2027年度公式資料の指定校・系列校推薦と実施未定の地域枠を保持", () => {
  const kitasato = privateMedicalSpecialAdmissionsUniversities2027.find(
    (university) => university.id === "kitasato",
  );

  assert.ok(kitasato, "北里大学のデータがありません");
  assert.equal(kitasato.scopeStatus, "available");
  assert.equal(kitasato.publicationStatus, "partial");
  assert.equal(
    kitasato.officialUrl,
    "https://www.kitasato-u.ac.jp/jp/goukaku/undergraduate_ad/system/search.html",
  );
  assert.match(
    kitasato.statusNote,
    /2027年度入試ガイド・日程一覧.*指定校（38名）.*系列校推薦.*8月下旬.*対象校への通知.*地域枠指定校は実施未定/u,
  );
  assert.doesNotMatch(
    kitasato.statusNote,
    /一般選抜試験|大学入学共通テスト利用選抜試験|学士入学者選抜試験/u,
    "対象外として確認した方式名をページ表示用の注記へ出さないでください",
  );

  assertSameSet(
    new Set(kitasato.routes.map((route) => route.id)),
    new Set(["recommendation-designated", "recommendation-affiliated", "regional-designated"]),
    "北里大学の対象3方式を保持してください",
  );

  const designated = kitasato.routes.find((route) => route.id === "recommendation-designated");
  const affiliated = kitasato.routes.find((route) => route.id === "recommendation-affiliated");
  const regional = kitasato.routes.find((route) => route.id === "regional-designated");
  assert.ok(designated && affiliated && regional);

  assert.equal(designated.officialName, "学校推薦型選抜試験（指定校）");
  assert.equal(designated.quota, "38名");
  assert.equal(designated.publicationStatus, "partial");
  assert.equal(designated.currentStudentEligible, "unconfirmed");
  assert.match(designated.eligibility, /大学が指定する学校の生徒.*卒業見込み可否.*対象校へ通知/u);
  assert.doesNotMatch(designated.eligibility, /2027年3月卒業見込み/u);
  assert.equal(designated.exclusive, "専願");
  assert.equal(designated.principalRecommendation, "未公表");
  assert.match(designated.gradeRequirement, /対象校へ通知.*数値基準は未公表/u);
  assert.deepEqual(
    designated.events.map(({ stage, date, label }) => ({ stage, date, label })),
    [
      { stage: "application-start", date: "2026-11-02", label: "出願受付開始" },
      { stage: "first-exam", date: "2026-11-15", label: "試験日" },
    ],
  );

  assert.equal(affiliated.officialName, "学校推薦型選抜試験（系列校）");
  assert.equal(affiliated.quota, null);
  assert.equal(affiliated.publicationStatus, "partial");
  assert.equal(affiliated.currentStudentEligible, "unconfirmed");
  assert.match(affiliated.eligibility, /系列校の生徒.*卒業見込み可否.*対象校へ通知/u);
  assert.doesNotMatch(affiliated.eligibility, /2027年3月卒業見込み/u);
  assert.equal(affiliated.exclusive, "専願");
  assert.equal(affiliated.principalRecommendation, "未公表");
  assert.deepEqual(
    affiliated.events.map(({ stage, date, label }) => ({ stage, date, label })),
    designated.events.map(({ stage, date, label }) => ({ stage, date, label })),
  );

  assert.equal(regional.officialName, "学校推薦型選抜試験（地域枠指定校）");
  assert.equal(regional.quota, null);
  assert.equal(regional.publicationStatus, "unpublished");
  assert.equal(regional.currentStudentEligible, "unconfirmed");
  assert.equal(regional.exclusive, "専願");
  assert.equal(regional.principalRecommendation, "未公表");
  assert.match(
    regional.restrictions.join(" "),
    /2027年度は実施未定.*指定校のみ.*修学資金制度.*卒業後.*指定地域内の病院.*第1志望.*必ず入学/u,
  );
  assert.deepEqual(
    regional.events.map(({ stage, date, label }) => ({ stage, date, label })),
    [{ stage: "first-exam", date: "2026-11-15", label: "試験日（実施する場合）" }],
  );

  for (const route of kitasato.routes) {
    assert.equal(route.sourceUrls[0], kitasato.officialUrl);
    assert.ok(route.sourceUrls.some((url) => url.includes("abm00048841.pdf")));
    assert.ok(route.sourceUrls.some((url) => url.includes("abm00048817.pdf")));
    assert.ok(route.sourceUrls.some((url) => url.includes("abm00048736.pdf")));
    assert.ok(route.sourceUrls.includes("https://www.kitasato-u.ac.jp/jp/goukaku/undergraduate_ad/flow/admission-policy.html"));
  }
  assert.ok(regional.sourceUrls.includes("https://www.kitasato-u.ac.jp/med/admission/index_1.html"));

  const examEntries = buildExamDisplayEntries(
    privateMedicalSpecialAdmissionsEvents2027.filter((event) => event.universityId === "kitasato"),
  );
  const confirmedExam = examEntries.find((entry) => entry.label === "試験日");
  const provisionalExam = examEntries.find((entry) => entry.label === "試験日（実施する場合）");
  assert.ok(confirmedExam && provisionalExam);
  assert.equal(confirmedExam.displayColumn, "single-exam");
  assertSameSet(
    confirmedExam.routeNames,
    [designated.officialName, affiliated.officialName],
    "指定校・系列校の同日試験を大学単位にまとめてください",
  );
  assert.deepEqual(provisionalExam.routeNames, [regional.officialName]);

  assert.match(
    kitasato.excludedRoutes?.join(" ") ?? "",
    /一般選抜試験.*地域枠一般選抜.*大学入学共通テスト利用選抜試験（前期・後期）.*通常の共通テスト利用選抜.*学士入学者選抜試験.*現役高校生/u,
  );
});

test("聖マリアンナ医科大学は2027年度完成版要項の推薦2方式と一段階選考を保持", () => {
  const marianna = privateMedicalSpecialAdmissionsUniversities2027.find(
    (university) => university.id === "marianna",
  );

  assert.ok(marianna, "聖マリアンナ医科大学のデータがありません");
  assert.equal(marianna.scopeStatus, "available");
  assert.equal(marianna.publicationStatus, "complete");
  assert.equal(
    marianna.officialUrl,
    "https://www.marianna-u.ac.jp/univ/ent_info/pdf/selection_guidelines_2027.pdf",
  );
  assert.match(
    marianna.statusNote,
    /2027年度完成版要項.*一般公募制は約20名.*神奈川県地域枠は7名.*臨時定員増認可申請中/u,
  );
  assert.doesNotMatch(
    marianna.statusNote,
    /一般選抜（前期・後期）|大学入学共通テスト利用選抜|指定校制/u,
    "対象外として確認した方式名をページ表示用の注記へ出さないでください",
  );

  assertSameSet(
    new Set(marianna.routes.map((route) => route.id)),
    new Set(["recommendation-public", "recommendation-kanagawa"]),
    "聖マリアンナ医科大学の対象2方式を保持してください",
  );
  const publicRecommendation = marianna.routes.find(
    (route) => route.id === "recommendation-public",
  );
  const kanagawa = marianna.routes.find((route) => route.id === "recommendation-kanagawa");
  assert.ok(publicRecommendation && kanagawa);

  assert.equal(publicRecommendation.officialName, "学校推薦型選抜（一般公募制）");
  assert.equal(publicRecommendation.category, "recommendation");
  assert.equal(publicRecommendation.quota, "約20名");
  assert.equal(publicRecommendation.publicationStatus, "complete");
  assert.equal(publicRecommendation.currentStudentEligible, true);
  assert.match(
    publicRecommendation.eligibility,
    /日本国内の全日制高校・中等教育学校.*2027年3月卒業見込み.*外国の12年課程・認定教育施設.*2026年6月から2027年3月.*入学を確約/u,
  );
  assert.equal(publicRecommendation.exclusive, "条件付き");
  assert.equal(publicRecommendation.principalRecommendation, "必要");
  assert.equal(
    publicRecommendation.gradeRequirement,
    "3年1学期までの全体3.8以上、数学・理科・外国語各4.0以上",
  );
  assert.match(
    publicRecommendation.restrictions.join(" "),
    /国内既卒者は出願不可.*出願開始1か月前までに個別審査.*合格時に入学を確約.*神奈川県地域枠と相互併願可.*地域枠を優先/u,
  );
  assert.match(
    publicRecommendation.note ?? "",
    /基礎学力試験.*小論文.*個人面接Ⅰ・Ⅱ.*一段階選考.*大学入学共通テストは利用しません/u,
  );

  assert.equal(kanagawa.officialName, "学校推薦型選抜（神奈川県地域枠）");
  assert.equal(kanagawa.category, "regional");
  assert.equal(kanagawa.quota, "7名（臨時定員増認可申請中）");
  assert.equal(kanagawa.publicationStatus, "complete");
  assert.equal(kanagawa.currentStudentEligible, true);
  assert.equal(kanagawa.exclusive, "条件付き");
  assert.equal(kanagawa.principalRecommendation, "必要");
  assert.match(
    kanagawa.eligibility,
    /2027年4月1日まで.*神奈川県内に通算1年以上の居住歴.*神奈川県内の高校を卒業見込み/u,
  );
  assert.equal(kanagawa.gradeRequirement, publicRecommendation.gradeRequirement);
  assert.match(
    kanagawa.restrictions.join(" "),
    /月額10万円.*キャリア形成プログラム.*卒前支援プラン.*県内基幹型臨床研修病院.*9年以上.*指定診療科.*4年間.*卒後6年目から9年目.*医師不足地域.*臨時定員増認可申請中/u,
  );

  const expectedSchedule = [
    {
      stage: "application-deadline",
      date: "2026-10-02",
      label: "出願資格個別審査相談・書類送付期限",
      deadlineRule: "大学指定",
      choiceRule: "外国12年課程・認定教育施設等の該当者のみ",
    },
    { stage: "application-start", date: "2026-11-02", label: "Web出願開始" },
    {
      stage: "application-deadline",
      date: "2026-11-05",
      label: "Web出願登録締切",
      deadlineRule: "Web登録",
    },
    {
      stage: "application-deadline",
      date: "2026-11-05",
      label: "入学検定料支払締切",
      time: "23:59",
    },
    {
      stage: "application-deadline",
      date: "2026-11-06",
      label: "出願書類郵送締切",
      deadlineRule: "必着",
    },
    {
      stage: "first-exam",
      date: "2026-11-14",
      label: "試験（基礎学力試験・小論文・個人面接）",
      time: "8:30集合",
    },
    { stage: "final-result", date: "2026-12-01", label: "合格発表", time: "10:00" },
    {
      stage: "procedure-deadline",
      date: "2026-12-08",
      label: "入学手続締切",
      time: "17:00",
      deadlineRule: "必着",
    },
  ];
  const scheduleProjection = ({ stage, date, label, time, deadlineRule, choiceRule }) => ({
    stage,
    date,
    label,
    ...(time === undefined ? {} : { time }),
    ...(deadlineRule === undefined ? {} : { deadlineRule }),
    ...(choiceRule === undefined ? {} : { choiceRule }),
  });
  assert.deepEqual(publicRecommendation.events.map(scheduleProjection), expectedSchedule);
  assert.deepEqual(kanagawa.events.map(scheduleProjection), expectedSchedule);
  assert.equal(
    marianna.routes.some((route) => route.events.some((event) => event.stage === "second-exam")),
    false,
    "二次選考のない一段階選考へ架空の二次試験を追加しないでください",
  );

  const examEntry = buildExamDisplayEntries(
    privateMedicalSpecialAdmissionsEvents2027.filter(
      (event) => event.universityId === "marianna",
    ),
  ).find((entry) => entry.date === "2026-11-14");
  assert.ok(examEntry);
  assert.equal(examEntry.displayColumn, "single-exam");
  assertSameSet(
    examEntry.routeNames,
    [publicRecommendation.officialName, kanagawa.officialName],
    "同日の推薦2方式を大学単位にまとめてください",
  );

  for (const route of marianna.routes) {
    assert.equal(route.sourceUrls[0], marianna.officialUrl);
    assert.ok(route.sourceUrls.includes("https://www.marianna-u.ac.jp/univ/ent_info/ent_exam.html"));
    assert.ok(route.sourceUrls.includes("https://www.marianna-u.ac.jp/univ/ent_info/ent_outline.html"));
    assert.ok(route.sourceUrls.some((url) => url.includes("web_entry_guide_2027.pdf")));
  }
  assert.ok(kanagawa.sourceUrls.some((url) => url.includes("ent_exam_04_2026.pdf")));
  assert.match(
    marianna.excludedRoutes?.join(" ") ?? "",
    /一般選抜（前期・後期）.*一般選抜.*大学入学共通テスト利用選抜.*通常の共通テスト利用選抜.*指定校制.*2023年度入試から廃止.*2027年度も実施なし/u,
  );
});

test("すべての入試イベント日が実在するISO 8601日付", () => {
  assert.ok(privateMedicalSpecialAdmissionsEvents2027.length > 0);

  for (const event of privateMedicalSpecialAdmissionsEvents2027) {
    assertValidIsoDate(
      event.date,
      `${event.university} ${event.routeName} ${event.label}`,
    );
  }
});

test("複数試験日のsequenceが明示され連番になっている", () => {
  const circledNumberToSequence = new Map([
    ["①", 1],
    ["②", 2],
    ["③", 3],
    ["④", 4],
    ["⑤", 5],
  ]);

  for (const { university, route } of privateMedicalSpecialAdmissionsRoutes2027) {
    const examEvents = route.events.filter(
      (event) => event.stage === "first-exam" || event.stage === "second-exam",
    );

    for (const event of examEvents) {
      const marker = event.label.at(-1);
      const labelSequence = circledNumberToSequence.get(marker);
      const isPartOfMultipleDates =
        event.choiceRule !== undefined ||
        event.sequence !== undefined ||
        labelSequence !== undefined;

      if (!isPartOfMultipleDates) continue;

      assert.ok(
        Number.isInteger(event.sequence) && event.sequence > 0,
        `${routeKey(university, route)} ${event.label}: 複数試験日はsequenceが必要です`,
      );
      if (labelSequence !== undefined) {
        assert.equal(
          event.sequence,
          labelSequence,
          `${routeKey(university, route)} ${event.label}: ラベルとsequenceが一致しません`,
        );
      }
    }

    const groups = new Map();
    for (const event of examEvents.filter(
      (candidate) => candidate.choiceRule !== undefined,
    )) {
      const key = `${event.stage}\u0000${event.choiceRule}`;
      groups.set(key, [...(groups.get(key) ?? []), event]);
    }

    for (const groupedEvents of groups.values()) {
      if (groupedEvents.length < 2) continue;

      const sequences = groupedEvents
        .map((event) => event.sequence)
        .sort((a, b) => a - b);
      assert.deepEqual(
        sequences,
        Array.from({ length: groupedEvents.length }, (_, index) => index + 1),
        `${routeKey(university, route)}: 同一選択ルールの複数試験日は1始まりの連番が必要です`,
      );
      assert.equal(
        new Set(groupedEvents.map((event) => event.date)).size,
        groupedEvents.length,
        `${routeKey(university, route)}: 複数試験日に同じ日付が重複しています`,
      );
    }
  }
});

test("締切・試験日の表示集約で元イベントの方式を欠落させない", () => {
  const deadlineEvents = privateMedicalSpecialAdmissionsEvents2027.filter(
    (event) => event.stage === "application-deadline",
  );
  const examEvents = privateMedicalSpecialAdmissionsEvents2027.filter(
    (event) => event.stage === "first-exam" || event.stage === "second-exam",
  );
  const deadlineEntries = buildDeadlineDisplayEntries(deadlineEvents);
  const examEntries = buildExamDisplayEntries(examEvents);

  assertSameSet(
    setFrom(deadlineEntries.flatMap((entry) => entry.routeKeys)),
    setFrom(deadlineEvents.map(flatEventRouteKey)),
    "締切表示の集約で方式が欠落しています",
  );
  assertSameSet(
    setFrom(examEntries.flatMap((entry) => entry.routeKeys)),
    setFrom(examEvents.map(flatEventRouteKey)),
    "試験日表示の集約で方式が欠落しています",
  );
  assert.ok(
    deadlineEntries.length < deadlineEvents.length,
    "同一締切を共有する方式が大学単位に集約されていません",
  );
  assert.ok(
    examEntries.length < examEvents.length,
    "同一試験日程を共有する方式が大学単位に集約されていません",
  );

  const iwateDeadline = deadlineEntries.find(
    (entry) => entry.date === "2026-11-11" && entry.universityId === "iwate-medical",
  );
  assert.equal(
    iwateDeadline?.routeKeys.length,
    5,
    "岩手医科大学の同一締切5方式を一つの表示へ集約できません",
  );
  const iwateExam = examEntries.find(
    (entry) =>
      entry.date === "2026-11-21" &&
      entry.universityId === "iwate-medical" &&
      entry.stage === "first-exam" &&
      entry.displayColumn === "single-exam",
  );
  assert.equal(
    iwateExam?.routeKeys.length,
    5,
    "岩手医科大学の同一試験日5方式を一つの表示へ集約できません",
  );

  const displayColumnsForRoute = (examRouteKey) =>
    [...new Set(
      examEntries
        .filter((entry) => entry.routeKeys.includes(examRouteKey))
        .map((entry) => entry.displayColumn),
    )].sort((a, b) => a.localeCompare(b));
  for (const firstOnlyRouteKey of [
    "iwate-medical/comprehensive-regional-doctor",
    "iwate-medical/recommendation-public",
    "jichi-medical/comprehensive-prefectural",
    "jichi-medical/recommendation-toyama",
  ]) {
    assert.deepEqual(
      displayColumnsForRoute(firstOnlyRouteKey),
      ["single-exam"],
      `${firstOnlyRouteKey}: 二次試験がない方式は単独試験列へ表示してください`,
    );
  }
  for (const secondOnlyRouteKey of [
    "keio/international-student",
    "keio/returnee",
    "tohoku-med-pharm/comprehensive-tohoku-retention",
  ]) {
    assert.deepEqual(
      displayColumnsForRoute(secondOnlyRouteKey),
      ["second-exam"],
      `${secondOnlyRouteKey}: 書類一次後の試験は二次列へ表示してください`,
    );
  }
  for (const twoStageRouteKey of [
    "juntendo/international",
    "juntendo/returnee",
    "juntendo/ib-cambridge",
    "juntendo/research-doctor",
  ]) {
    assert.deepEqual(
      displayColumnsForRoute(twoStageRouteKey),
      ["first-exam", "second-exam"],
      `${twoStageRouteKey}: 一次・二次の両列へ分離できていません`,
    );
  }

  for (const entry of examEntries) {
    assert.ok(
      entry.stage === "first-exam" || entry.stage === "second-exam",
      `${entry.university} ${entry.label}: 元イベントのstageが不正です`,
    );
    assert.ok(
      entry.displayColumn === "single-exam" ||
        entry.displayColumn === "first-exam" ||
        entry.displayColumn === "second-exam",
      `${entry.university} ${entry.label}: 表示列が不正です`,
    );
    const sourceEvents = examEvents.filter(
      (event) =>
        event.date === entry.date &&
        event.universityId === entry.universityId &&
        event.stage === entry.stage &&
        event.label === entry.label &&
        (event.sequence ?? null) === (entry.sequence ?? null) &&
        (event.choiceRule ?? null) === (entry.choiceRule ?? null) &&
        entry.routeKeys.includes(flatEventRouteKey(event)),
    );
    assert.equal(
      sourceEvents.length,
      entry.routeKeys.length,
      `${entry.university} ${entry.label}: sequence・choiceRuleを変えて集約しています`,
    );
    for (const sourceEvent of sourceEvents) {
      const routeHasSecondExam = examEvents.some(
        (candidate) =>
          flatEventRouteKey(candidate) === flatEventRouteKey(sourceEvent) &&
          candidate.stage === "second-exam",
      );
      const expectedColumn =
        sourceEvent.stage === "second-exam"
          ? "second-exam"
          : routeHasSecondExam
            ? "first-exam"
            : "single-exam";
      assert.equal(
        entry.displayColumn,
        expectedColumn,
        `${flatEventRouteKey(sourceEvent)} ${sourceEvent.label}: 方式の試験段階と表示列が一致しません`,
      );
    }
  }
});

test("締切表示は可変detailと動的な集中日を扱える", () => {
  const deadlineEvents = privateMedicalSpecialAdmissionsEvents2027.filter(
    (event) => event.stage === "application-deadline",
  );
  const deadlineEntries = buildDeadlineDisplayEntries(deadlineEvents);

  const aichiEntry = deadlineEntries.find(
    (entry) =>
      entry.date === "2026-11-13" &&
      entry.universityId === "aichi-medical" &&
      entry.routeKeys.includes("aichi-medical/recommendation-public"),
  );
  assert.deepEqual(
    aichiEntry?.details.map((detail) => detail.label).sort((a, b) => a.localeCompare(b, "ja")),
    ["Web出願締切", "出願書類締切"].sort((a, b) => a.localeCompare(b, "ja")),
    "同日のWeb締切と書類締切を可変detailとして保持できません",
  );

  const tokaiEntries = deadlineEntries.filter((entry) =>
    entry.routeKeys.includes("tokai/star-development"),
  );
  assert.deepEqual(
    tokaiEntries.map((entry) => [entry.date, entry.details[0]?.label]),
    [
      ["2026-09-14", "第一次選考出願締切"],
      ["2026-10-12", "第二次選考出願締切"],
      ["2026-12-18", "最終選考出願締切"],
    ],
    "独立した複数選考フェーズの締切を一つに潰しています",
  );

  const rawFocusDate = busiestDeadlineDate(deadlineEvents);
  const groupedFocusDate = busiestDeadlineDate(deadlineEntries);
  assert.equal(rawFocusDate, "2026-11-13", "現在の締切集中日の基礎データが想定外です");
  assert.equal(
    groupedFocusDate,
    rawFocusDate,
    "表示集約後の件数から求めた締切集中日が元イベントと一致しません",
  );
});

test("締切・試験日セクションは一般選抜ページと同じ構造契約を使う", () => {
  const pageSource = readFileSync(pageSourcePath, "utf8");
  const requiredClasses = [
    "admissions-deadline-layout",
    "admissions-deadline-focus",
    "admissions-deadline-list",
    "admissions-deadline-group",
    "admissions-deadline-entry",
    "admissions-calendar-viewport",
    "admissions-calendar-head",
    "admissions-calendar-row",
    "admissions-calendar-date",
    "admissions-calendar-exams",
  ];

  for (const className of requiredClasses) {
    assert.match(
      pageSource,
      new RegExp(`\\b${className}\\b`, "u"),
      `${className}: 一般選抜ページ共通の構造がありません`,
    );
  }
  assert.doesNotMatch(pageSource, /\bspecial-event-groups\b/u);
  assert.doesNotMatch(pageSource, /\bspecial-exam-timeline\b/u);

  for (const className of ["admissions-deadline-list", "admissions-calendar-viewport"]) {
    const openingTag = openingTagWithClass(pageSource, className);
    assert.ok(openingTag, `${className}: スクロール領域の開始タグがありません`);
    assert.match(openingTag, /\btabindex="0"/u, `${className}: キーボードでフォーカスできません`);
    assert.match(openingTag, /\brole="region"/u, `${className}: regionランドマークがありません`);
    assert.match(openingTag, /\baria-label=/u, `${className}: スクロール領域の名前がありません`);
  }

  assert.match(
    pageSource,
    /data-deadline-focus-date=\{[^}]+\}/u,
    "締切集中日を派生値として出力する契約がありません",
  );
  assert.doesNotMatch(
    pageSource,
    /<strong>\s*11\/13\s*<\/strong>/u,
    "締切集中日を表示へハードコードしないでください",
  );
  assert.match(
    pageSource,
    /\.details\.map\s*\(/u,
    "締切カードが可変数のdetailを描画していません",
  );
  assert.match(pageSource, /\bdata-deadline-entry\b/u);
  assert.match(pageSource, /\bdata-exam-entry\b/u);
  assert.match(pageSource, /\bdata-route-keys=/u);
  assert.match(pageSource, /data-exam-column="single-exam"/u);
  assert.match(pageSource, /data-exam-column="first-exam"/u);
  assert.match(pageSource, /data-exam-column="second-exam"/u);
  assert.match(pageSource, /\bdata-display-column=\{[^}]+\}/u);
  assert.match(pageSource, /\bdata-stage=\{[^}]+\}/u);
  assert.match(pageSource, /role="table"/u);
  assert.match(pageSource, /role="columnheader"/u);
  assert.match(pageSource, /role="rowgroup"/u);
  assert.match(pageSource, /role="rowheader"/u);
  assert.match(pageSource, /role="cell"/u);
  assert.match(pageSource, /<time\b[^>]*datetime=\{group\.date\}>/u);
  for (const heading of ["一段階選考", "一次選考", "二次選考"]) {
    assert.match(pageSource, new RegExp(`<span\\b[^>]*>${heading}<\\/span>`, "u"));
  }
});

test("全日程カレンダーは左端の日付をスクロール中もヘッダー直下に固定する", () => {
  const pageSource = readFileSync(pageSourcePath, "utf8");
  const styleSource = readFileSync(styleSourcePath, "utf8");
  const viewportRule = styleSource.match(
    /\.special-full-calendar__viewport\s*\{([^}]*)\}/u,
  )?.[1];
  const headerRule = styleSource.match(
    /\.special-full-calendar thead th\s*\{([^}]*)\}/u,
  )?.[1];
  const dateCellRule = styleSource.match(
    /\.special-full-calendar tbody th\s*\{([^}]*)\}/u,
  )?.[1];
  const cornerRule = styleSource.match(
    /\.special-full-calendar thead th:first-child\s*\{([^}]*)\}/u,
  )?.[1];
  const dateTimeRule = styleSource.match(
    /\.special-full-calendar tbody th time\s*\{([^}]*)\}/u,
  )?.[1];

  assert.match(
    pageSource,
    /class="special-full-calendar__viewport"[^>]*tabindex="0"[^>]*role="region"/u,
    "全日程カレンダーのスクロール領域がキーボード操作できません",
  );
  assert.match(
    pageSource,
    /<tbody>[\s\S]*?<th scope="row"><time datetime=\{day\.date\}>/u,
    "日付列に行見出しとtime要素がありません",
  );

  assert.ok(viewportRule, "全日程カレンダーのviewportルールがありません");
  assert.match(viewportRule, /--admissions-full-schedule-head-height\s*:\s*54px/u);
  assert.match(viewportRule, /position\s*:\s*relative/u);
  assert.match(viewportRule, /overflow\s*:\s*auto/u);
  assert.match(viewportRule, /overscroll-behavior\s*:\s*contain/u);

  assert.ok(headerRule, "全日程カレンダーのヘッダールールがありません");
  assert.match(headerRule, /position\s*:\s*sticky/u);
  assert.match(headerRule, /top\s*:\s*0/u);
  assert.match(
    headerRule,
    /height\s*:\s*var\(--admissions-full-schedule-head-height\)/u,
  );

  assert.ok(cornerRule, "日付列ヘッダーの固定ルールがありません");
  assert.match(cornerRule, /left\s*:\s*0/u);
  assert.match(cornerRule, /z-index\s*:\s*7/u);

  assert.ok(dateCellRule, "全日程カレンダーの日付列ルールがありません");
  assert.match(dateCellRule, /position\s*:\s*sticky/u);
  assert.match(dateCellRule, /left\s*:\s*0/u);
  assert.match(
    dateCellRule,
    /font-family\s*:\s*Arial,\s*Helvetica,\s*sans-serif/u,
    "Calendar dates must use the sans-serif date style",
  );
  assert.doesNotMatch(dateCellRule, /var\(--font-serif\)/u);

  assert.ok(dateTimeRule, "日付文字を行内で固定するルールがありません");
  assert.match(dateTimeRule, /position\s*:\s*sticky/u);
  assert.match(
    dateTimeRule,
    /top\s*:\s*calc\(var\(--admissions-full-schedule-head-height\)\s*\+\s*11px\)/u,
  );
  assert.match(dateTimeRule, /z-index\s*:\s*1/u);
  assert.match(
    styleSource,
    /@media\s*\(max-width:\s*620px\)[\s\S]*?\.special-full-calendar__viewport\s*\{[^}]*--admissions-full-schedule-head-height\s*:\s*50px/u,
    "スマホのヘッダー高と日付固定位置が同期していません",
  );
});

test("生成ページの締切・試験日表示は集約後も全方式と選択条件を保持", () => {
  if (!existsSync(builtPagePath)) return;

  const html = readFileSync(builtPagePath, "utf8");
  const deadlineSection = sectionBetween(html, "deadlines", "exam-calendar");
  const examSection = sectionBetween(html, "exam-calendar", "universities");
  const deadlineEvents = privateMedicalSpecialAdmissionsEvents2027.filter(
    (event) => event.stage === "application-deadline",
  );
  const examEvents = privateMedicalSpecialAdmissionsEvents2027.filter(
    (event) => event.stage === "first-exam" || event.stage === "second-exam",
  );

  assert.equal(
    attributeValues(deadlineSection, "data-deadline-focus-date")[0],
    busiestDeadlineDate(buildDeadlineDisplayEntries(deadlineEvents)),
    "生成ページの締切集中日が動的集計結果と一致しません",
  );
  assert.ok(
    attributeValues(deadlineSection, "data-deadline-entry").length < deadlineEvents.length,
    "生成ページで同一締切を共有する方式が集約されていません",
  );
  assert.ok(
    attributeValues(examSection, "data-exam-entry").length < examEvents.length,
    "生成ページで同一試験日程を共有する方式が集約されていません",
  );

  const deadlineRouteKeys = attributeValues(deadlineSection, "data-route-keys")
    .flatMap((value) => value.trim().split(/\s+/u))
    .filter(Boolean);
  const examRouteKeys = attributeValues(examSection, "data-route-keys")
    .flatMap((value) => value.trim().split(/\s+/u))
    .filter(Boolean);
  assertSameSet(
    setFrom(deadlineRouteKeys),
    setFrom(deadlineEvents.map(flatEventRouteKey)),
    "生成ページの締切一覧で方式が欠落しています",
  );
  assertSameSet(
    setFrom(examRouteKeys),
    setFrom(examEvents.map(flatEventRouteKey)),
    "生成ページの試験日一覧で方式が欠落しています",
  );

  for (const label of [
    "Web出願締切",
    "出願書類締切",
    "第一次選考出願締切",
    "第二次選考出願締切",
    "最終選考出願締切",
    "出願資格事前審査締切",
  ]) {
    assert.match(deadlineSection, new RegExp(label, "u"), `${label}: 可変締切detailがありません`);
  }
  for (const routeName of new Set(deadlineEvents.map((event) => event.routeName))) {
    assert.match(deadlineSection, new RegExp(routeName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "u"));
  }
  for (const routeName of new Set(examEvents.map((event) => event.routeName))) {
    assert.match(examSection, new RegExp(routeName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "u"));
  }

  const calendarRows = [...examSection.matchAll(
    /<article\b[^>]*class="[^"]*\badmissions-calendar-row\b[^"]*"[^>]*>([\s\S]*?)<\/article>/gu,
  )].map((match) => match[1]);
  assert.ok(calendarRows.length > 0, "生成ページに試験日行がありません");
  for (const row of calendarRows) {
    const singleStart = row.indexOf('data-exam-column="single-exam"');
    const firstStart = row.indexOf('data-exam-column="first-exam"');
    const secondStart = row.indexOf('data-exam-column="second-exam"');
    assert.ok(
      singleStart >= 0 && firstStart > singleStart && secondStart > firstStart,
      "単独試験・一次・二次の列順が不正です",
    );
    const singleColumn = row.slice(singleStart, firstStart);
    const firstColumn = row.slice(firstStart, secondStart);
    const secondColumn = row.slice(secondStart);
    assert.doesNotMatch(singleColumn, /data-stage="second-exam"/u, "二次試験が単独試験列へ混入しています");
    assert.doesNotMatch(
      singleColumn,
      /data-display-column="(?:first-exam|second-exam)"/u,
      "単独試験列に別列の表示イベントが混入しています",
    );
    assert.doesNotMatch(firstColumn, /data-stage="second-exam"/u, "二次試験が一次列へ混入しています");
    assert.doesNotMatch(
      firstColumn,
      /data-display-column="(?:single-exam|second-exam)"/u,
      "一次列に別列の表示イベントが混入しています",
    );
    assert.doesNotMatch(secondColumn, /data-stage="first-exam"/u, "一次試験が二次列へ混入しています");
    assert.doesNotMatch(
      secondColumn,
      /data-display-column="(?:single-exam|first-exam)"/u,
      "二次列に別列の表示イベントが混入しています",
    );
  }

  const renderedExamEntries = [...examSection.matchAll(
    /<li\b[^>]*\bdata-exam-entry="[^"]*"[^>]*>/gu,
  )].map((match) => ({
    openingTag: match[0],
    routeKeys: match[0].match(/\bdata-route-keys="([^"]*)"/u)?.[1].trim().split(/\s+/u) ?? [],
    stage: match[0].match(/\bdata-stage="([^"]*)"/u)?.[1],
    displayColumn: match[0].match(/\bdata-display-column="([^"]*)"/u)?.[1],
  }));
  assert.ok(renderedExamEntries.length > 0, "生成ページに試験イベントがありません");
  for (const entry of renderedExamEntries) {
    assert.ok(entry.routeKeys.length > 0, "試験イベントに方式IDがありません");
    assert.ok(entry.displayColumn, "試験イベントに表示列がありません");
    assert.equal(
      entry.stage,
      entry.displayColumn === "second-exam" ? "second-exam" : "first-exam",
      `表示列${entry.displayColumn}と元stageが一致しません: ${entry.openingTag}`,
    );
  }

  const renderedColumnsForRoute = (routeKeyValue) =>
    [...new Set(
      renderedExamEntries
        .filter((entry) => entry.routeKeys.includes(routeKeyValue))
        .map((entry) => entry.displayColumn),
    )].sort((a, b) => a.localeCompare(b));
  const routesWithSecondExam = new Set(
    examEvents
      .filter((event) => event.stage === "second-exam")
      .map(flatEventRouteKey),
  );
  const expectedColumnsByRoute = new Map();
  for (const event of examEvents) {
    const eventRouteKey = flatEventRouteKey(event);
    const expectedColumn =
      event.stage === "second-exam"
        ? "second-exam"
        : routesWithSecondExam.has(eventRouteKey)
          ? "first-exam"
          : "single-exam";
    const expectedColumns = expectedColumnsByRoute.get(eventRouteKey) ?? new Set();
    expectedColumns.add(expectedColumn);
    expectedColumnsByRoute.set(eventRouteKey, expectedColumns);
  }
  for (const [eventRouteKey, expectedColumns] of expectedColumnsByRoute) {
    assert.deepEqual(
      renderedColumnsForRoute(eventRouteKey),
      [...expectedColumns].sort((a, b) => a.localeCompare(b)),
      `${eventRouteKey}: 生成ページの試験日表示列が元イベントと一致しません`,
    );
  }

  for (const choiceRule of new Set(examEvents.map((event) => event.choiceRule).filter(Boolean))) {
    assert.match(
      examSection,
      new RegExp(choiceRule.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "u"),
      `${choiceRule}: 選択条件が生成ページから欠落しています`,
    );
  }
});

test("一般選抜・通常の共通テスト利用選抜を方式一覧へ混入させない", () => {
  assert.deepEqual(
    new Set(Object.keys(specialAdmissionCategoryLabels)),
    allowedCategories,
  );

  for (const { university, route } of privateMedicalSpecialAdmissionsRoutes2027) {
    const context = `${routeKey(university, route)} ${route.officialName}`;
    assert.ok(
      allowedCategories.has(route.category),
      `${context}: 特別選抜の対象外カテゴリです`,
    );
    assert.doesNotMatch(
      route.officialName,
      /一般選抜|(?:大学入学)?共通テスト利用選抜/u,
      `${context}: 一般選抜または通常の共通テスト利用選抜が混入しています`,
    );
  }
});

test("昭和医科大学の2027年度推薦2方式を公式要項どおり保持", () => {
  const showaMedical = privateMedicalSpecialAdmissionsUniversities2027.find(
    (entry) => entry.id === "showa-medical",
  );
  assert.ok(showaMedical, "昭和医科大学のデータがありません");
  assert.equal(showaMedical.scopeStatus, "available");
  assert.equal(showaMedical.publicationStatus, "complete");
  assert.equal(showaMedical.officialUrl, "https://adm.showa-u.ac.jp/admission/info/web-apply.html");
  assert.deepEqual(
    showaMedical.routes.map((route) => [route.id, route.officialName, route.category, route.quota]),
    [
      ["school-recommendation", "学校推薦型選抜入試（公募・指定校・特別協定校）", "recommendation", "17名"],
      ["graduate-recommendation", "卒業生推薦入試", "special", "10名"],
    ],
  );

  const schoolRecommendation = showaMedical.routes.find(
    (route) => route.id === "school-recommendation",
  );
  const graduateRecommendation = showaMedical?.routes.find(
    (route) => route.id === "graduate-recommendation",
  );

  assert.ok(schoolRecommendation, "昭和医科大学の学校推薦型選抜入試がありません");
  assert.equal(schoolRecommendation.currentStudentEligible, true);
  assert.equal(schoolRecommendation.exclusive, "専願");
  assert.equal(schoolRecommendation.principalRecommendation, "必要");
  assert.match(schoolRecommendation.eligibility, /2027年3月卒業見込み.*認定在外教育施設.*学校長推薦/u);
  assert.match(schoolRecommendation.gradeRequirement, /全体の評定平均4\.3以上.*高校1年.*中等教育学校4年/u);
  assert.match(
    schoolRecommendation.restrictions.join(" "),
    /入学を確約.*卒業生推薦入試との併願不可.*対象高校へ別途通知/u,
  );

  const commonSchedule = [
    { stage: "application-start", date: "2026-11-01", label: "Web出願登録開始", time: "10:00" },
    {
      stage: "application-deadline",
      date: "2026-11-08",
      label: "Web出願登録締切",
      time: "16:00",
      deadlineRule: "Web登録",
    },
    { stage: "application-deadline", date: "2026-11-08", label: "出願書類締切", deadlineRule: "必着" },
    {
      stage: "first-exam",
      date: "2026-11-14",
      label: "試験（基礎学力試験・小論文・面接）",
      time: "8:30～（入場7:30～8:00）",
    },
    { stage: "final-result", date: "2026-12-01", label: "合格発表", time: "15:00" },
    { stage: "procedure-deadline", date: "2026-12-08", label: "入学手続締切", time: "12:00", deadlineRule: "必着" },
  ];
  assert.deepEqual(schoolRecommendation.events, commonSchedule);

  assert.ok(graduateRecommendation, "昭和医科大学の卒業生推薦入試がありません");
  assert.equal(graduateRecommendation.category, "special");
  assert.equal(specialAdmissionCategoryLabels[graduateRecommendation.category], "その他特別選抜");
  assert.equal(graduateRecommendation.currentStudentEligible, true);
  assert.equal(graduateRecommendation.exclusive, "専願");
  assert.equal(graduateRecommendation.principalRecommendation, "不要");
  assert.match(graduateRecommendation.eligibility, /2027年3月まで.*祖父母または両親.*昭和大学医療短期大学/u);
  assert.match(graduateRecommendation.gradeRequirement, /数値基準なし/u);
  assert.match(
    graduateRecommendation.restrictions.join(" "),
    /入学を確約.*学校推薦型選抜入試との併願不可.*2024年3月31日以前.*卒業証明書.*続柄/u,
  );
  assert.deepEqual(graduateRecommendation.events, [
    {
      stage: "application-deadline",
      date: "2026-10-30",
      label: "個別入学資格審査申請期限（該当者のみ）",
      deadlineRule: "必着",
      choiceRule: "外国の高校・中等教育学校に在籍した該当者のみ",
    },
    ...commonSchedule,
  ]);

  const officialSources = [
    "https://adm.showa-u.ac.jp/albums/abm.php?d=2405&f=abm00072419.pdf",
    "https://adm.showa-u.ac.jp/admission/info/web-apply.html",
    "https://adm.showa-u.ac.jp/admission/info/schedule.html",
  ];
  assert.deepEqual(schoolRecommendation.sourceUrls, officialSources);
  assert.deepEqual(graduateRecommendation.sourceUrls, officialSources);
  for (const route of showaMedical.routes) {
    assert.match(route.note ?? "", /大学入学共通テストは利用しません.*同日に実施/u);
    assert.ok(route.events.every((event) => event.stage !== "first-result" && event.stage !== "second-exam"));
  }
  assert.doesNotMatch(showaMedical.routes.map((route) => route.officialName).join(" "), /地域枠/u);
  assert.match(showaMedical.excludedRoutes?.join(" ") ?? "", /地域枠.*一般選抜.*対象外/u);
  const pageSource = readFileSync(pageSourcePath, "utf8");
  assert.match(pageSource, /卒業生推薦入試を、学校推薦型から「その他特別選抜」へ変更/u);
  assert.doesNotMatch(pageSource, /卒業生推薦入学試験/u);
});

test("実質一般選抜・共通テスト利用選抜に当たる方式を派生データまで除外", () => {
  for (const excluded of excludedEffectiveGeneralSelections) {
    const university = privateMedicalSpecialAdmissionsUniversities2027.find(
      (entry) => entry.id === excluded.universityId,
    );
    assert.ok(university, `${excluded.universityId}: 大学データがありません`);
    assert.equal(
      university.routes.some((route) => route.id === excluded.routeId),
      false,
      `${excluded.universityId}/${excluded.routeId}: 対象方式へ残っています`,
    );
    assert.doesNotMatch(
      university.routes.map((route) => route.officialName).join("\n"),
      excluded.officialNamePattern,
      `${excluded.universityId}: 正式名称を変えた対象外方式が残っています`,
    );
    assert.match(
      (university.excludedRoutes ?? []).join("\n"),
      excluded.officialNamePattern,
      `${excluded.universityId}: 対象外理由の記録がありません`,
    );
    assert.equal(
      privateMedicalSpecialAdmissionsEvents2027.some(
        (event) => event.universityId === excluded.universityId &&
          (event.routeId === excluded.routeId || excluded.officialNamePattern.test(event.routeName)),
      ),
      false,
      `${excluded.universityId}/${excluded.routeId}: 日程イベントへ残っています`,
    );
  }

  const nihon = privateMedicalSpecialAdmissionsUniversities2027.find((entry) => entry.id === "nihon");
  assert.equal(nihon?.scopeStatus, "available");
  assert.ok(nihon?.routes.some((route) => route.id === "recommendation-public"));

  const nipponMedical = privateMedicalSpecialAdmissionsUniversities2027.find(
    (entry) => entry.id === "nippon-medical",
  );
  assert.deepEqual(nipponMedical?.routes, []);
  assert.equal(nipponMedical?.scopeStatus, "not-offered");
  assert.equal(nipponMedical?.publicationStatus, "not-offered");
  assert.doesNotMatch(nipponMedical?.statusNote ?? "", /掲載しています|特別選抜を確認/u);

  const kyorin = privateMedicalSpecialAdmissionsUniversities2027.find(
    (entry) => entry.id === "kyorin",
  );
  assert.deepEqual(kyorin?.routes, []);
  assert.equal(kyorin?.scopeStatus, "not-offered");
  assert.equal(kyorin?.publicationStatus, "not-offered");
  assert.match(kyorin?.statusNote ?? "", /一般選抜と同一日程・同一試験/u);

  if (existsSync(builtDatasetPath)) {
    const builtDataset = JSON.parse(readFileSync(builtDatasetPath, "utf8"));
    for (const excluded of excludedEffectiveGeneralSelections) {
      assert.equal(
        builtDataset.routes.some(
          (route) => route.universityId === excluded.universityId &&
            (route.id === excluded.routeId || excluded.officialNamePattern.test(route.officialName)),
        ),
        false,
        `${excluded.universityId}/${excluded.routeId}: 生成JSONの方式一覧へ残っています`,
      );
      assert.equal(
        builtDataset.events.some(
          (event) => event.universityId === excluded.universityId &&
            (event.routeId === excluded.routeId || excluded.officialNamePattern.test(event.routeName)),
        ),
        false,
        `${excluded.universityId}/${excluded.routeId}: 生成JSONの日程一覧へ残っています`,
      );
      assert.equal(
        builtDataset.calendar.some((day) => day.events.some(
          (event) => event.universityId === excluded.universityId &&
            (event.routeId === excluded.routeId || excluded.officialNamePattern.test(event.routeName)),
        )),
        false,
        `${excluded.universityId}/${excluded.routeId}: 生成JSONのカレンダーへ残っています`,
      );
    }
  }
});

test("共通テストを選考の一部に使う独立した総合型等は掲載を維持", () => {
  for (const [universityId, routeId] of commonTestUsingSpecialSelectionsToKeep) {
    const university = privateMedicalSpecialAdmissionsUniversities2027.find(
      (entry) => entry.id === universityId,
    );
    const route = university?.routes.find((entry) => entry.id === routeId);

    assert.ok(route, `${universityId}/${routeId}: 対象方式から誤って除外されています`);
    assert.match(
      route.events.map((event) => event.label).join("\n"),
      /大学入学共通テスト/u,
      `${universityId}/${routeId}: 共通テスト利用の根拠イベントがありません`,
    );
  }
});

test("全掲載方式で2027年3月卒業見込み者の出願可否を明示", () => {
  for (const { university, route } of privateMedicalSpecialAdmissionsRoutes2027) {
    const context = routeKey(university, route);
    assert.ok(
      Object.hasOwn(route, "currentStudentEligible"),
      `${context}: currentStudentEligibleがありません`,
    );
    assert.ok(
      allowedCurrentStudentEligibility.has(route.currentStudentEligible),
      `${context}: currentStudentEligibleはtrue・conditional・unconfirmedのいずれかで明示してください`,
    );
    assert.ok(
      typeof route.eligibility === "string" && route.eligibility.trim().length > 0,
      `${context}: 出願資格の説明がありません`,
    );
  }

  for (const university of privateMedicalSpecialAdmissionsUniversities2027) {
    if (university.routes.length === 0) {
      assert.notEqual(
        university.scopeStatus,
        "available",
        `${university.id}: 掲載方式がない大学はavailableにできません`,
      );
    }
  }
});

test("固定ページのslugとJSONエンドポイント契約が一致", () => {
  const canonicalUrl = new URL(privateMedicalSpecialAdmissions2027Metadata.canonicalUrl);
  const datasetUrl = new URL(privateMedicalSpecialAdmissions2027Metadata.datasetUrl);

  assert.equal(canonicalUrl.origin, "https://lexus-ec.com");
  assert.equal(canonicalUrl.pathname, expectedPagePath);
  assert.equal(canonicalUrl.search, "");
  assert.equal(canonicalUrl.hash, "");
  assert.equal(datasetUrl.origin, canonicalUrl.origin);
  assert.equal(datasetUrl.pathname, expectedDatasetPath);
  assert.equal(datasetUrl.search, "");
  assert.equal(datasetUrl.hash, "");
  assert.equal(privateMedicalSpecialAdmissions2027Metadata.academicYear, 2027);

  assert.ok(existsSync(pageSourcePath), "canonical slugに対応する固定ページがありません");
  assert.ok(
    existsSync(datasetEndpointSourcePath),
    "datasetUrlに対応するJSONエンドポイントがありません",
  );

  const endpointSource = readFileSync(datasetEndpointSourcePath, "utf8");
  const datasetModuleSource = readFileSync(datasetModuleSourcePath, "utf8");
  assert.match(endpointSource, /getPrivateMedicalSpecialAdmissions2027Dataset\(\)/);
  assert.match(endpointSource, /application\/json; charset=utf-8/);
  assert.match(datasetModuleSource, /schemaVersion:\s*"1\.0\.0"/);
  for (const key of ["metadata", "scope", "universities", "routes", "events", "calendar"]) {
    assert.match(
      datasetModuleSource,
      new RegExp(`\\b${key}:`),
      `JSONデータセットに${key}がありません`,
    );
  }

  if (existsSync(builtDatasetPath)) {
    const builtDataset = JSON.parse(readFileSync(builtDatasetPath, "utf8"));
    assert.equal(builtDataset.schemaVersion, "1.0.0");
    assert.equal(builtDataset.metadata.canonicalUrl, canonicalUrl.href);
    assert.equal(builtDataset.metadata.datasetUrl, datasetUrl.href);
    assert.equal(builtDataset.scope.academicYear, 2027);
    assert.equal(builtDataset.scope.universityCount, 31);
    assert.equal(builtDataset.universities.length, 31);
    assert.equal(
      builtDataset.universities.some((university) => Object.hasOwn(university, "excludedRoutes")),
      false,
      "対象外方式の内部監査記録を公開JSONへ出力しないでください",
    );
    assert.ok(Array.isArray(builtDataset.routes));
    assert.ok(Array.isArray(builtDataset.events));
    assert.ok(Array.isArray(builtDataset.calendar));
  }
});

test("方式別一覧は01概要内で8方式・全大学・全95方式を省略せず描画する", () => {
  const pageSource = readFileSync(pageSourcePath, "utf8");
  const summarySource = sectionBetween(pageSource, "summary", "deadlines");
  const universityListTag = openingTagWithClass(
    summarySource,
    "special-route-type__university-list",
  );

  assert.equal(Object.keys(specialAdmissionCategoryLabels).length, 8);
  assert.equal(privateMedicalSpecialAdmissionsRoutes2027.length, 95);
  assert.match(summarySource, /<h2\b[^>]*id="summary-title"[^>]*>概要<\/h2>/u);
  assert.match(summarySource, /class="special-route-type-grid"/u);
  assert.match(summarySource, /categoryEntries\.map\(\(entry, index\)/u);
  assert.match(summarySource, /\{entry\.universities\.length\}<small>大学<\/small>/u);
  assert.match(summarySource, /entry\.universities\.map\(\(\{ university, routes \}\)/u);
  assert.match(summarySource, /routes\.map\(\(route\)/u);
  assert.match(summarySource, /\bdata-category-university\b/u);
  assert.match(summarySource, /\bdata-route-key=/u);
  assert.match(summarySource, /aria-labelledby=\{titleId\}/u);
  assert.match(summarySource, /<h3 id=\{titleId\}>/u);
  assert.doesNotMatch(pageSource, /<section\b[^>]*\bid="route-types"[^>]*>/u);
  assert.doesNotMatch(summarySource, /entry\.routes\.slice\(|ほか\{entry\.routes\.length/u);
  assert.ok(universityListTag, "方式別の大学一覧コンテナがありません");
  assert.match(universityListTag, /^<details\b/u);
  assert.match(universityListTag, /\bdata-route-type-disclosure\b/u);
  assert.match(universityListTag, /\bopen\b/u);
  assert.doesNotMatch(universityListTag, /\btabindex=/u);
  assert.doesNotMatch(universityListTag, /\brole=/u);
  assert.match(
    summarySource,
    /<summary\b[^>]*class="[^"]*\bspecial-route-type__university-summary\b[^"]*"[^>]*>/u,
  );
  assert.doesNotMatch(
    summarySource,
    /special-route-type__scroll-note|一覧内をスクロール/u,
  );
});

test("生成ページの01概要は6項目ナビと方式別全件データを保持する", () => {
  if (!existsSync(builtPagePath)) return;

  const html = readFileSync(builtPagePath, "utf8");
  const summaryHtml = sectionBetween(html, "summary", "deadlines");
  const navHtml = html.match(
    /<nav\b(?=[^>]*class="[^"]*\bspecial-admissions-jump-nav\b[^"]*")[^>]*>[\s\S]*?<\/nav>/u,
  )?.[0];
  const expectedNavHrefs = [
    "#summary",
    "#deadlines",
    "#exam-calendar",
    "#universities",
    "#full-calendar",
    "#sources",
  ];

  assert.ok(navHtml, "ページ内ナビを取得できません");
  assert.deepEqual(attributeValues(navHtml, "href"), expectedNavHrefs);
  assert.deepEqual(
    [...navHtml.matchAll(
      /<span\b[^>]*class="[^"]*\badmissions-jump-nav__index\b[^"]*"[^>]*>\s*(\d{2})\s*<\/span>/gu,
    )].map((match) => match[1]),
    ["01", "02", "03", "04", "05", "06"],
  );
  assert.doesNotMatch(navHtml, /href="#route-types"/u);
  assert.match(summaryHtml, /class="[^"]*\bspecial-route-type-grid\b[^"]*"/u);
  assert.doesNotMatch(html, /<section\b[^>]*\bid="route-types"[^>]*>/u);

  const expectedByCategory = new Map(
    Object.keys(specialAdmissionCategoryLabels).map((category) => [category, new Map()]),
  );
  for (const { university, route } of privateMedicalSpecialAdmissionsRoutes2027) {
    const categoryUniversities = expectedByCategory.get(route.category);
    assert.ok(categoryUniversities, `${route.category}: 未定義の方式分類です`);
    const keys = categoryUniversities.get(university.id) ?? new Set();
    keys.add(`${university.id}/${route.id}`);
    categoryUniversities.set(university.id, keys);
  }

  const cards = [...summaryHtml.matchAll(
    /(<article\b[^>]*\bdata-category="([^"]+)"[^>]*>)([\s\S]*?)<\/article>/gu,
  )];
  assert.equal(cards.length, 8, "概要内の方式分類カードは8件である必要があります");
  assertSameSet(
    new Set(cards.map((match) => match[2])),
    new Set(expectedByCategory.keys()),
    "生成ページの方式分類に過不足があります",
  );

  const renderedRouteKeys = [];
  for (const [, openingTag, category, body] of cards) {
    const expectedUniversities = expectedByCategory.get(category);
    assert.ok(expectedUniversities, `${category}: 想定外の方式分類カードです`);
    const declaredUniversityCount = Number(
      openingTag.match(/\bdata-university-count="(\d+)"/u)?.[1],
    );
    const renderedUniversityCount = [
      ...body.matchAll(/<li\b[^>]*\bdata-category-university(?:="[^"]*")?[^>]*>/gu),
    ].length;
    const categoryRouteKeys = attributeValues(body, "data-route-key");
    const expectedRouteKeys = new Set(
      [...expectedUniversities.values()].flatMap((keys) => [...keys]),
    );

    assert.equal(
      declaredUniversityCount,
      expectedUniversities.size,
      `${category}: data-university-count が元データと一致しません`,
    );
    assert.equal(
      renderedUniversityCount,
      expectedUniversities.size,
      `${category}: 大学を省略せず大学単位で描画してください`,
    );
    assertSameSet(
      new Set(categoryRouteKeys),
      expectedRouteKeys,
      `${category}: 描画された方式に過不足があります`,
    );
    renderedRouteKeys.push(...categoryRouteKeys);
  }

  assert.equal(renderedRouteKeys.length, 95);
  assertSameSet(
    new Set(renderedRouteKeys),
    new Set(
      privateMedicalSpecialAdmissionsRoutes2027.map(({ university, route }) =>
        `${university.id}/${route.id}`,
      ),
    ),
    "概要内に全95方式を重複・省略なく描画してください",
  );

  const universityListTags = [...summaryHtml.matchAll(
    /<details\b[^>]*class="[^"]*\bspecial-route-type__university-list\b[^"]*"[^>]*>/gu,
  )].map((match) => match[0]);
  assert.equal(universityListTags.length, 8);
  for (const tag of universityListTags) {
    assert.match(tag, /\bdata-route-type-disclosure(?:="[^"]*")?\b/u);
    assert.match(tag, /\bopen(?:="[^"]*")?\b/u);
    assert.doesNotMatch(tag, /\btabindex=/u);
    assert.doesNotMatch(tag, /\brole=/u);
  }
  assert.equal(
    [...summaryHtml.matchAll(
      /<summary\b[^>]*class="[^"]*\bspecial-route-type__university-summary\b[^"]*"[^>]*>/gu,
    )].length,
    8,
    "8方式それぞれに大学一覧の開閉UIが必要です",
  );
  assert.doesNotMatch(
    summaryHtml,
    /special-route-type__scroll-note|一覧内をスクロール/u,
  );
});

test("方式別一覧のCSSは内部スクロールを設けず横長カードで表示する", () => {
  const styleSource = readFileSync(styleSourcePath, "utf8");
  const navRule = styleSource.match(
    /\.special-admissions-jump-nav \.admissions-jump-nav__inner\s*\{([^}]*)\}/u,
  )?.[1];
  const gridRule = styleSource.match(
    /(?:^|\n)\.special-route-type-grid\s*\{([^}]*)\}/u,
  )?.[1];
  const cardRule = styleSource.match(
    /(?:^|\n)\.special-route-type\s*\{([^}]*)\}/u,
  )?.[1];
  const universityListRule = styleSource.match(
    /(?:^|\n)\.special-route-type__university-list\s*\{([^}]*)\}/u,
  )?.[1];

  assert.ok(navRule, "ページ内ナビのCSSルールがありません");
  assert.match(navRule, /grid-template-columns\s*:\s*repeat\(6,/u);
  assert.ok(gridRule, "方式別グリッドのCSSルールがありません");
  assert.match(gridRule, /display\s*:\s*grid/u);
  assert.match(
    gridRule,
    /grid-template-columns\s*:\s*minmax\(\s*0\s*,\s*1fr\s*\)/u,
  );
  assert.ok(cardRule, "方式別カードのCSSルールがありません");
  assert.match(cardRule, /display\s*:\s*grid/u);
  const cardColumns = cardRule.match(/grid-template-columns\s*:\s*([^;]+);/u)?.[1];
  assert.ok(cardColumns, "方式別カードに横方向の列定義がありません");
  assert.ok(
    (cardColumns.match(/minmax\(/gu) ?? []).length >= 2,
    "デスクトップでは説明と大学一覧を横並びにしてください",
  );
  assert.ok(universityListRule, "方式別の大学一覧CSSルールがありません");
  assert.doesNotMatch(
    universityListRule,
    /max-height\s*:|overflow-y\s*:\s*auto|scrollbar(?:-width|-color|-gutter)?\s*:/iu,
  );
});

test("概要の大学一覧はスマホだけ初期状態を閉じる", () => {
  const pageSource = readFileSync(pageSourcePath, "utf8");
  const styleSource = readFileSync(styleSourcePath, "utf8");

  assert.match(
    pageSource,
    /window\.matchMedia\("\(max-width: 620px\)"\)/u,
    "スマホ表示を判定するメディアクエリがありません",
  );
  assert.match(
    pageSource,
    /disclosure\.open\s*=\s*!mobileRouteTypeQuery\.matches/u,
    "PCでは展開し、スマホでは閉じる初期化がありません",
  );
  assert.match(
    pageSource,
    /mobileRouteTypeQuery\.addEventListener\("change",\s*syncRouteTypeDisclosures\)/u,
    "画面幅変更時に開閉状態を同期してください",
  );
  assert.match(
    styleSource,
    /\.special-route-type__university-list:not\(\[open\]\)\s*>\s*ul\s*\{[^}]*display\s*:\s*none/u,
    "閉じた大学一覧を非表示にするCSSがありません",
  );
  assert.match(
    styleSource,
    /@media\s*\(max-width:\s*620px\)[\s\S]*?\.special-route-type__university-action\s*\{[^}]*display\s*:\s*flex/u,
    "スマホで開閉操作を表示するCSSがありません",
  );
});

test("概要の8方式を受験生向けの読みやすい説明文で案内する", () => {
  const pageSource = readFileSync(pageSourcePath, "utf8");
  const styleSource = readFileSync(styleSourcePath, "utf8");
  const descriptionsSource = pageSource.match(
    /const categoryDescriptions:[\s\S]*?=\s*\{([\s\S]*?)\n\};/u,
  )?.[1];
  const descriptionRule = styleSource.match(
    /\.special-route-type__intro\s*>\s*p\s*\{([^}]*)\}/u,
  )?.[1];

  assert.ok(descriptionsSource, "方式別の説明文定義がありません");
  const descriptions = [...descriptionsSource.matchAll(/^\s*\w+:\s*"([^"]+)",?$/gmu)]
    .map((match) => match[1]);
  assert.equal(descriptions.length, 8, "8方式すべてに説明文が必要です");
  for (const description of descriptions) {
    assert.match(description, /選抜です。/u);
    assert.match(description, /確認しましょう。$/u);
  }
  assert.match(descriptionsSource, /大学入学共通テストの得点も評価対象/u);
  assert.match(descriptionsSource, /専願・併願の別、評定/u);
  assert.doesNotMatch(descriptionsSource, /後段で使う方式も含みます|条件に注意します/u);

  assert.ok(descriptionRule, "方式説明文のCSSルールがありません");
  assert.match(descriptionRule, /color\s*:\s*#294b49/u);
  assert.match(descriptionRule, /font-size\s*:\s*clamp\(0\.9rem,/u);
  assert.match(descriptionRule, /font-weight\s*:\s*600/u);
  assert.match(descriptionRule, /line-height\s*:\s*1\.8/u);
  assert.doesNotMatch(descriptionRule, /var\(--special-muted\)/u);
});

test("大学別一覧には対象外として確認した方式を表示しない", () => {
  const pageSource = readFileSync(pageSourcePath, "utf8");

  assert.doesNotMatch(pageSource, /対象外として確認した方式/);
  assert.doesNotMatch(pageSource, /entry\.excludedRoutes/);
});

test("一般・共テ利用ページと特別選抜ページを上部と本文末で相互に行き来できる", () => {
  const generalPageSource = readFileSync(generalPageSourcePath, "utf8");
  const specialPageSource = readFileSync(pageSourcePath, "utf8");
  const switcherSource = readFileSync(scheduleSwitcherSourcePath, "utf8");

  assert.match(generalPageSource, /<AdmissionsScheduleSwitcher current="general"\s*\/>/u);
  assert.match(specialPageSource, /<AdmissionsScheduleSwitcher current="special"\s*\/>/u);
  assert.match(
    generalPageSource,
    /一般選抜・共通テスト利用[\s\S]*?<AdmissionsScheduleSwitcher current="general"\s*\/>[\s\S]*?<div class="admissions-hero__grid">/u,
  );
  assert.match(
    specialPageSource,
    /総合型・学校推薦型[\s\S]*?<AdmissionsScheduleSwitcher current="special"\s*\/>[\s\S]*?<div class="admissions-hero__grid">/u,
  );
  assert.match(
    switcherSource,
    /href:\s*"\/private-medical-school-admissions-schedule-2027\/"/u,
  );
  assert.match(
    switcherSource,
    /href:\s*"\/private-medical-school-special-admissions-schedule-2027\/"/u,
  );
  assert.match(switcherSource, /aria-current=\{isCurrent \? "page" : undefined\}/u);
  assert.match(switcherSource, /isCurrent \? "表示中" : "切替 →"/u);
  assert.match(
    generalPageSource,
    /class="admissions-related-schedule admissions-related-schedule--special"[\s\S]*?href="\/private-medical-school-special-admissions-schedule-2027\/"/u,
  );
  assert.match(
    specialPageSource,
    /class="admissions-related-schedule admissions-related-schedule--general"[\s\S]*?href="\/private-medical-school-admissions-schedule-2027\/"/u,
  );

  if (!existsSync(builtGeneralPagePath) || !existsSync(builtPagePath)) return;
  const generalHtml = readFileSync(builtGeneralPagePath, "utf8");
  const specialHtml = readFileSync(builtPagePath, "utf8");
  const switcherPattern = /<nav\b(?=[^>]*class="[^"]*\badmissions-page-switcher\b[^"]*")[^>]*>[\s\S]*?<\/nav>/u;
  const generalSwitcher = generalHtml.match(switcherPattern)?.[0];
  const specialSwitcher = specialHtml.match(switcherPattern)?.[0];

  assert.ok(generalSwitcher, "一般・共テ利用ページの切替ナビがありません");
  assert.ok(specialSwitcher, "特別選抜ページの切替ナビがありません");
  assert.equal(attributeValues(generalSwitcher, "href").length, 2);
  assert.equal(attributeValues(specialSwitcher, "href").length, 2);
  assert.match(
    generalSwitcher,
    /href="\/private-medical-school-admissions-schedule-2027\/" aria-current="page"/u,
  );
  assert.match(
    specialSwitcher,
    /href="\/private-medical-school-special-admissions-schedule-2027\/" aria-current="page"/u,
  );
});

test("特別選抜ページはティール系の独自配色で一般・共テ利用ページと区別する", () => {
  const specialStyle = readFileSync(styleSourcePath, "utf8");
  const sharedStyle = readFileSync(sharedStyleSourcePath, "utf8");
  const rootRule = specialStyle.match(/\.special-admissions-page\s*\{([^}]*)\}/u)?.[1];

  assert.ok(rootRule, "特別選抜ページのテーマ定義がありません");
  assert.match(rootRule, /--special-brand\s*:\s*#0f6b65/u);
  assert.match(rootRule, /--special-brand-dark\s*:\s*#073d3a/u);
  assert.match(rootRule, /--admissions-blue\s*:\s*#0a5c57/u);
  assert.match(rootRule, /--admissions-yellow-soft\s*:\s*#e9f5f2/u);
  assert.match(rootRule, /--admissions-line\s*:\s*#c5ddd8/u);
  assert.match(
    specialStyle,
    /\.special-admissions-page \.admissions-hero\s*\{[\s\S]*?var\(--special-tint\)/u,
  );
  assert.match(
    specialStyle,
    /\.special-admissions-jump-nav\s*\{[^}]*border-top\s*:\s*4px solid var\(--special-brand\)/u,
  );
  assert.match(
    sharedStyle,
    /\.admissions-page-switcher__option--general\.is-current\s*\{[^}]*#8b0000/u,
  );
  assert.match(
    sharedStyle,
    /\.admissions-page-switcher__option--special\.is-current\s*\{[^}]*#0f6b65/u,
  );
  assert.match(
    sharedStyle,
    /@media\s*\(max-width:\s*620px\)[\s\S]*?\.admissions-page-switcher__option\s*\{[^}]*min-height\s*:\s*96px/u,
  );
});
