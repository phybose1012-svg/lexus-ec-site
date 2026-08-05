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

test("方式別一覧は01概要内で8方式・全大学・全92方式を省略せず描画する", () => {
  const pageSource = readFileSync(pageSourcePath, "utf8");
  const summarySource = sectionBetween(pageSource, "summary", "deadlines");
  const universityListTag = openingTagWithClass(
    summarySource,
    "special-route-type__university-list",
  );

  assert.equal(Object.keys(specialAdmissionCategoryLabels).length, 8);
  assert.equal(privateMedicalSpecialAdmissionsRoutes2027.length, 92);
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

  assert.equal(renderedRouteKeys.length, 92);
  assertSameSet(
    new Set(renderedRouteKeys),
    new Set(
      privateMedicalSpecialAdmissionsRoutes2027.map(({ university, route }) =>
        `${university.id}/${route.id}`,
      ),
    ),
    "概要内に全92方式を重複・省略なく描画してください",
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
