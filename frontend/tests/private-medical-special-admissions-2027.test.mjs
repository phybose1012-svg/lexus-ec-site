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
const pageSourcePath = fileURLToPath(
  new URL(
    "../src/pages/private-medical-school-special-admissions-schedule-2027/index.astro",
    import.meta.url,
  ),
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

const routeKey = (university, route) => `${university.id}/${route.id}`;

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
    assert.ok(Array.isArray(builtDataset.routes));
    assert.ok(Array.isArray(builtDataset.events));
    assert.ok(Array.isArray(builtDataset.calendar));
  }
});
