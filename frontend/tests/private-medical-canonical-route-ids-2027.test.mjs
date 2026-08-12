import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import {
  getPrivateMedicalCanonicalRouteId2027,
  privateMedicalCanonicalRouteIds2027,
} from "../src/data/privateMedicalCanonicalRouteIds2027.ts";
import { privateMedicalUniversities2027 } from "../src/data/privateMedicalAdmissions2027.ts";

const planningSourcePath = new URL("../src/data/admissionPlanning2027.ts", import.meta.url);
const datasetSourcePath = new URL(
  "../src/data/privateMedicalAdmissions2027Dataset.ts",
  import.meta.url,
);
const metadataSourcePath = new URL(
  "../src/data/privateMedicalAdmissions2027Metadata.ts",
  import.meta.url,
);
const builtDatasetPath = new URL(
  "../dist/data/private-medical-admissions-2027.json",
  import.meta.url,
);

const routeRecords = privateMedicalUniversities2027.flatMap((university) =>
  university.routes.map((route) => ({ university, route })),
);

const canonicalKey = (universityId, routeName) => `${universityId}::${routeName}`;

const stableHash = (value) => {
  let hash = 5381;
  for (const character of value) hash = (hash * 33) ^ character.charCodeAt(0);
  return (hash >>> 0).toString(36);
};

const legacyRouteIdOverrides = new Map([
  [
    "aichi-medical::common::大学入学共通テスト利用選抜（愛知県地域特別枠B方式）",
    "aichi-medical--common--1ynn7f9",
  ],
]);

const expectedLegacyRouteId = (universityId, category, routeName) =>
  legacyRouteIdOverrides.get(`${universityId}::${category}::${routeName}`) ??
  `${universityId}--${category}--${stableHash(routeName)}`;

test("31大学83方式とKB準拠canonical route IDが1対1で対応する", () => {
  const routeKeys = routeRecords.map(({ university, route }) =>
    canonicalKey(university.id, route.name),
  );
  const canonicalEntries = Object.entries(privateMedicalCanonicalRouteIds2027);
  const canonicalIds = canonicalEntries.map(([, routeId]) => routeId);

  assert.equal(privateMedicalUniversities2027.length, 31);
  assert.equal(routeRecords.length, 83);
  assert.equal(new Set(routeKeys).size, routeKeys.length, "大学ID＋方式名が重複しています");
  assert.equal(canonicalEntries.length, 83);
  assert.equal(new Set(canonicalIds).size, canonicalIds.length, "canonical route IDが重複しています");
  assert.deepEqual(
    Object.keys(privateMedicalCanonicalRouteIds2027).sort((a, b) => a.localeCompare(b, "ja")),
    [...routeKeys].sort((a, b) => a.localeCompare(b, "ja")),
    "日程正本とcanonical route ID allowlistの方式集合が一致しません",
  );

  for (const { university, route } of routeRecords) {
    const routeId = getPrivateMedicalCanonicalRouteId2027(university.id, route.name);
    assert.equal(
      routeId,
      privateMedicalCanonicalRouteIds2027[canonicalKey(university.id, route.name)],
    );
    assert.match(routeId, /^[a-z0-9-]+--(?:general|common)--[a-z0-9-]+$/u);
  }

  assert.throws(
    () => getPrivateMedicalCanonicalRouteId2027("missing-university", "未登録方式"),
    /Missing 2027 private medical canonical route ID/u,
  );

  const snapshot = canonicalEntries
    .sort(([left], [right]) => left.localeCompare(right, "ja"))
    .map(([key, routeId]) => `${key}=${routeId}`)
    .join("\n");
  assert.equal(
    createHash("sha256").update(snapshot).digest("hex"),
    "977d3d0727a0d04377c92b8d53f86d884ec683834a1c9623a3c8c476ce8f9a90",
    "KB照合済みcanonical route ID snapshotが変わっています",
  );
});

test("plannerはlegacy idを維持したままcanonicalRouteIdを併記する", () => {
  const planningSource = readFileSync(planningSourcePath, "utf8");
  const datasetSource = readFileSync(datasetSourcePath, "utf8");
  const metadataSource = readFileSync(metadataSourcePath, "utf8");

  assert.match(planningSource, /getPrivateMedicalCanonicalRouteId2027/u);
  assert.match(planningSource, /const id = routeId\(university\.id, route\.category, route\.name\)/u);
  assert.match(planningSource, /canonicalRouteId,/u);
  assert.match(planningSource, /routeIdPolicy:/u);
  assert.match(datasetSource, /schemaVersion:\s*"1\.1\.0"/u);
  assert.match(datasetSource, /universities:\s*privateMedicalUniversities2027\.map\(toPublicUniversity\)/u);
  assert.doesNotMatch(datasetSource, /universities:\s*privateMedicalUniversities2027\s*,/u);
  assert.match(datasetSource, /canonicalRouteId:\s*getPrivateMedicalCanonicalRouteId2027/u);
  assert.match(metadataSource, /key:\s*"canonicalRouteId"/u);
});

test("build後の一般日程JSONはcanonical IDを公開しlegacy planner IDを保持する", {
  skip: !existsSync(builtDatasetPath),
}, () => {
  const dataset = JSON.parse(readFileSync(builtDatasetPath, "utf8"));
  const publicRouteAllowedKeys = new Set([
    "canonicalRouteId",
    "name",
    "category",
    "application",
    "applicationDeadlineDateDetails",
    "firstExam",
    "secondExam",
    "result",
    "procedure",
    "procedureDateDetails",
    "status",
    "sourceUrl",
  ]);
  const planningRouteAllowedKeys = new Set([
    "id",
    "canonicalRouteId",
    "universityId",
    "universityName",
    "region",
    "prefecture",
    "routeName",
    "category",
    "status",
    "sourceUrl",
    "examGroups",
    "calendarEvents",
  ]);

  assert.equal(dataset.schemaVersion, "1.1.0");
  assert.equal(dataset.universities.length, 31);
  assert.ok(
    dataset.fieldDefinitions.some((field) => field.key === "canonicalRouteId"),
    "canonicalRouteIdのfield definitionがありません",
  );
  assert.match(dataset.admissionPlanning.metadata.routeIdPolicy.id, /保存済み受験プラン/u);
  assert.match(
    dataset.admissionPlanning.metadata.routeIdPolicy.canonicalRouteId,
    /複数データ間の結合/u,
  );

  const publicRoutes = dataset.universities.flatMap((university) =>
    university.routes.map((route) => ({ university, route })),
  );
  assert.equal(publicRoutes.length, 83);

  for (const { university, route } of publicRoutes) {
    const expectedCanonicalRouteId = getPrivateMedicalCanonicalRouteId2027(
      university.id,
      route.name,
    );
    assert.equal(route.canonicalRouteId, expectedCanonicalRouteId);
    assert.deepEqual(
      Object.keys(route).filter((key) => !publicRouteAllowedKeys.has(key)),
      [],
      `${expectedCanonicalRouteId}に公開allowlist外のfieldがあります`,
    );
  }

  const planningRoutes = dataset.admissionPlanning.routes;
  assert.equal(planningRoutes.length, 83);
  assert.equal(
    new Set(planningRoutes.map((route) => route.canonicalRouteId)).size,
    planningRoutes.length,
  );

  const planningByCanonicalId = new Map(
    planningRoutes.map((route) => [route.canonicalRouteId, route]),
  );
  for (const { university, route } of routeRecords) {
    const expectedCanonicalRouteId = getPrivateMedicalCanonicalRouteId2027(
      university.id,
      route.name,
    );
    const publicPlanningRoute = planningByCanonicalId.get(expectedCanonicalRouteId);
    assert.ok(publicPlanningRoute, `${expectedCanonicalRouteId}がplanner JSONにありません`);
    assert.equal(
      publicPlanningRoute.id,
      expectedLegacyRouteId(university.id, route.category, route.name),
      `${expectedCanonicalRouteId}の保存互換legacy idが変わっています`,
    );
    assert.ok(
      publicPlanningRoute.examGroups.every((group) =>
        group.id.startsWith(`${publicPlanningRoute.id}--`),
      ),
      `${expectedCanonicalRouteId}の保存済みgroup ID互換が変わっています`,
    );
    assert.deepEqual(
      Object.keys(publicPlanningRoute).filter((key) => !planningRouteAllowedKeys.has(key)),
      [],
      `${expectedCanonicalRouteId}のplanner公開allowlist外fieldがあります`,
    );
  }
});
