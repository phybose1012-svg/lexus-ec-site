import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  privateMedicalExamVenueAssignments2027,
  privateMedicalExamVenueSummary2027,
  privateMedicalExamVenueUniversitySummaries2027,
  privateMedicalExamVenues2027,
} from "../src/data/privateMedicalExamVenues2027.ts";
import { getPrivateMedicalExamVenuesHotels2027Dataset } from "../src/data/privateMedicalExamVenuesHotels2027Dataset.ts";
import { privateMedicalExamVenuesHotels2027Metadata } from "../src/data/privateMedicalExamVenuesHotels2027Metadata.ts";
import { privateMedicalVenueHotels2027 } from "../src/data/privateMedicalVenueHotels2027.ts";

const expectedPagePath = "/private-medical-school-exam-venues-hotels-2027/";
const expectedDatasetPath = "/data/private-medical-exam-venues-hotels-2027.json";
const pageSourcePath = fileURLToPath(
  new URL("../src/pages/private-medical-school-exam-venues-hotels-2027/index.astro", import.meta.url),
);
const endpointSourcePath = fileURLToPath(
  new URL("../src/pages/data/private-medical-exam-venues-hotels-2027.json.ts", import.meta.url),
);
const switcherSourcePath = fileURLToPath(
  new URL("../src/components/admissions/AdmissionsScheduleSwitcher.astro", import.meta.url),
);
const seoRoutesSourcePath = fileURLToPath(new URL("../src/lib/seoRoutes.ts", import.meta.url));
const llmsSourcePath = fileURLToPath(new URL("../src/pages/llms.txt.ts", import.meta.url));
const headersSourcePath = fileURLToPath(new URL("../public/_headers", import.meta.url));
const directoryPageSourcePath = fileURLToPath(
  new URL("../src/pages/top/information-shiritsu/index.astro", import.meta.url),
);
const pagesCssSourcePath = fileURLToPath(new URL("../src/styles/pages.css", import.meta.url));
const builtPagePath = fileURLToPath(
  new URL("../dist/private-medical-school-exam-venues-hotels-2027/index.html", import.meta.url),
);
const builtDatasetPath = fileURLToPath(
  new URL("../dist/data/private-medical-exam-venues-hotels-2027.json", import.meta.url),
);

const unique = (values) => new Set(values).size === values.length;
const collectKeys = (value, keys = []) => {
  if (Array.isArray(value)) {
    value.forEach((entry) => collectKeys(entry, keys));
    return keys;
  }
  if (!value || typeof value !== "object") return keys;
  for (const [key, child] of Object.entries(value)) {
    keys.push(key);
    collectKeys(child, keys);
  }
  return keys;
};

test("会場台帳は私立医学部31大学・83方式を欠落なく安定IDで保持する", () => {
  assert.equal(privateMedicalExamVenueSummary2027.universityCount, 31);
  assert.equal(privateMedicalExamVenueSummary2027.routeCount, 83);
  assert.equal(privateMedicalExamVenueUniversitySummaries2027.length, 31);
  assert.ok(unique(privateMedicalExamVenueUniversitySummaries2027.map((entry) => entry.universityId)));

  const routeIds = [...new Set(privateMedicalExamVenueAssignments2027.map((entry) => entry.routeId))];
  assert.equal(routeIds.length, 83);
  assert.ok(unique(routeIds));
  assert.ok(routeIds.every((routeId) => /^[a-z0-9][a-z0-9-]+$/u.test(routeId)));

  const assignmentIds = privateMedicalExamVenueAssignments2027.map((entry) => entry.assignmentId);
  assert.ok(unique(assignmentIds));
  for (const routeId of routeIds) {
    const routeAssignments = privateMedicalExamVenueAssignments2027.filter(
      (entry) => entry.routeId === routeId,
    );
    assert.equal(
      routeAssignments.filter((entry) => entry.examStage === "second").length,
      1,
      `${routeId} の二次・面接段階が一意ではありません`,
    );
  }
});

test("共通テスト本試験だけを大学別会場として登録しない", () => {
  for (const assignment of privateMedicalExamVenueAssignments2027) {
    assert.doesNotMatch(assignment.announcedVenueText, /共通テスト本試験会場/u);
    if (assignment.examStage === "first") {
      assert.equal(
        /^(?:大学入学)?共通テスト(?:\s|$)/u.test(assignment.examDateLabel) &&
          !/[＋+]|個別|小論文|学力/u.test(assignment.examDateLabel),
        false,
        `${assignment.routeId} に共通テスト本試験だけの会場割当があります`,
      );
    }
  }
});

test("希望日・大学指定・固定会場を方式別に混同しない", () => {
  const conditionsFor = (routeId, examStage) =>
    privateMedicalExamVenueAssignments2027.find(
      (entry) => entry.routeId === routeId && entry.examStage === examStage,
    )?.conditions;

  assert.deepEqual(conditionsFor("showa-medical--general--general-phase-1", "second"), [
    "fixed",
    "applicant_preference",
  ]);
  assert.deepEqual(
    conditionsFor("showa-medical--general--general-phase-1-phase-2", "second"),
    ["fixed"],
  );
  assert.deepEqual(conditionsFor("hyogo-medical--general--general-regional-quota-3470a", "second"), [
    "fixed",
    "applicant_preference",
  ]);
  assert.deepEqual(conditionsFor("hyogo-medical--general--general", "second"), ["fixed"]);
  assert.deepEqual(conditionsFor("aichi-medical--common--common-test-regional-quota", "second"), [
    "fixed",
  ]);
});

test("会場・割当・ホテル・アクセスの参照が一意かつ整合する", () => {
  const venueIds = privateMedicalExamVenues2027.map((venue) => venue.venueId);
  const hotelIds = privateMedicalVenueHotels2027.map((hotel) => hotel.hotelId);
  const venueIdSet = new Set(venueIds);
  assert.ok(unique(venueIds));
  assert.ok(unique(hotelIds));

  for (const venue of privateMedicalExamVenues2027) {
    assert.match(venue.officialUrl, /^https:\/\//u);
    assert.ok(venue.address.length > 5);
    assert.ok(venue.prefecture.length > 2);
  }

  for (const assignment of privateMedicalExamVenueAssignments2027) {
    assert.ok(unique(assignment.venueLinks.map((link) => link.venueId)));
    assignment.venueLinks.forEach((link) => {
      assert.ok(venueIdSet.has(link.venueId), `${assignment.assignmentId}: ${link.venueId} が未定義です`);
    });
    if (assignment.publicationState === "unpublished") {
      assert.equal(assignment.venueLinks.length, 0);
    }
  }

  for (const hotel of privateMedicalVenueHotels2027) {
    assert.match(hotel.officialUrl, /^https:\/\//u);
    assert.equal(hotel.operatingStatus, "official_site_active");
    assert.ok(hotel.venueAccess.length > 0);
    for (const access of hotel.venueAccess) {
      assert.ok(venueIdSet.has(access.venueId), `${hotel.hotelId}: ${access.venueId} が未定義です`);
      assert.ok(access.evidenceUrls.length > 0);
      assert.ok(
        privateMedicalExamVenueAssignments2027.some(
          (assignment) =>
            assignment.publicationState === "confirmed" &&
            assignment.venueLinks.some((link) => link.venueId === access.venueId),
        ),
        `${hotel.hotelId} が正式会場の割当に結合されていません`,
      );
    }
  }
});

test("公開Datasetはallowlist投影で内部項目・価格・評価を含めない", () => {
  const dataset = getPrivateMedicalExamVenuesHotels2027Dataset();
  assert.equal(dataset.schemaVersion, "1.0.0");
  assert.equal(dataset.scope.universityCount, 31);
  assert.equal(dataset.scope.routeCount, 83);
  assert.equal(dataset.summary.hotelCount, dataset.hotels.length);
  assert.ok(dataset.hotels.every((hotel) => hotel.operatingStatus === "official_site_active"));

  const serialized = JSON.stringify(dataset);
  const keys = collectKeys(dataset);
  for (const hotel of dataset.hotels) {
    for (const access of hotel.venueAccess) {
      if (access.reviewState.includes("needs_route_review")) {
        assert.equal("travelTimeLabel" in access, false);
        assert.equal("distanceLabel" in access, false);
      }
    }
  }
  for (const forbiddenKey of [
    "knowledgeBaseIds",
    "internalOnly",
    "internal_only",
    "project_internal",
    "price",
    "priceRange",
    "rating",
    "starRating",
    "reviewScore",
  ]) {
    assert.equal(keys.includes(forbiddenKey), false, `公開JSONに ${forbiddenKey} が含まれます`);
  }
  assert.doesNotMatch(serialized, /C:\\|C:\/|\/Users\/|internal_only|project_internal/u);
});

test("canonical・JSON endpoint・sitemap・llms・配信headerが同じURLを参照する", () => {
  const canonical = new URL(privateMedicalExamVenuesHotels2027Metadata.canonicalUrl);
  const datasetUrl = new URL(privateMedicalExamVenuesHotels2027Metadata.datasetUrl);
  assert.equal(canonical.pathname, expectedPagePath);
  assert.equal(datasetUrl.pathname, expectedDatasetPath);
  assert.equal(canonical.origin, datasetUrl.origin);

  const pageSource = readFileSync(pageSourcePath, "utf8");
  const endpointSource = readFileSync(endpointSourcePath, "utf8");
  const switcherSource = readFileSync(switcherSourcePath, "utf8");
  const seoSource = readFileSync(seoRoutesSourcePath, "utf8");
  const llmsSource = readFileSync(llmsSourcePath, "utf8");
  const headersSource = readFileSync(headersSourcePath, "utf8");

  assert.match(pageSource, /<AdmissionsScheduleSwitcher current="venues"\s*\/>/u);
  assert.match(pageSource, /rel="alternate" type="application\/json"/u);
  assert.match(pageSource, /href="\/private-medical-school-admissions-schedule-2027\/"/u);
  assert.match(switcherSource, /private-medical-school-exam-venues-hotels-2027/u);
  assert.match(endpointSource, /Content-Disposition/u);
  assert.match(endpointSource, /rel="describedby"/u);
  assert.match(seoSource, /privateMedicalExamVenuesHotels2027Metadata/u);
  assert.match(llmsSource, /privateMedicalExamVenuesHotels2027Metadata/u);
  assert.match(headersSource, /\/data\/private-medical-exam-venues-hotels-2027\.json/u);
});

test("ページは会場中心・31大学・組合せフィルターをSSR本文から提供する", () => {
  const source = readFileSync(pageSourcePath, "utf8");
  assert.match(source, /id="finder"/u);
  assert.match(source, /id="venues"/u);
  assert.match(source, /id="universities"/u);
  assert.match(source, /id="planning"/u);
  assert.match(source, /id="updates"/u);
  assert.match(source, /filterRecords/u);
  assert.match(source, /records\.some/u);
  assert.match(source, /data-filter-assignment-id/u);
  assert.match(source, /matchingAssignmentIds/u);
  assert.match(source, /normalize\("NFKC"\)/u);
  assert.match(source, /privateMedicalExamVenueUniversitySummaries2027\.map/u);
  assert.match(source, /venueGroups\.map/u);
  assert.match(source, /data-venue-prefecture-group/u);
  assert.match(source, /data-prefecture-link/u);
  assert.match(source, /group\.hidden = visibleCount === 0/u);
  assert.match(source, /cardMatchesPrefecture/u);
  assert.doesNotMatch(source, /おすすめランキング|絶対に遅刻しない|最も安全/u);
});

test("会場ページのページ内メニューは5セクションへ移動でき画面上部に追従する", () => {
  const source = readFileSync(pageSourcePath, "utf8");
  const cssSource = readFileSync(
    fileURLToPath(new URL("../src/styles/venues-hotels-2027.css", import.meta.url)),
    "utf8",
  );

  assert.match(source, /class="admissions-jump-nav venue-guide-jump-nav"/u);
  for (const id of ["venues", "universities", "planning", "updates", "dataset"]) {
    assert.match(source, new RegExp(`id: "${id}"`, "u"));
  }
  assert.match(cssSource, /\.venue-guide-jump-nav\s*\{[\s\S]*?position:\s*sticky;[\s\S]*?top:\s*0;/u);
});

test("私立医学部情報ページは会場・ホテルガイドへの専用バナーを提供する", () => {
  const directorySource = readFileSync(directoryPageSourcePath, "utf8");
  const cssSource = readFileSync(pagesCssSourcePath, "utf8");

  assert.match(directorySource, /class="shiritsu-venue-banner"/u);
  assert.match(directorySource, /href="\/private-medical-school-exam-venues-hotels-2027\/"/u);
  assert.match(directorySource, /privateMedicalExamVenueSummary2027\.universityCount/u);
  assert.match(directorySource, /privateMedicalExamVenueSummary2027\.routeCount/u);
  assert.match(directorySource, /privateMedicalExamVenueSummary2027\.uniqueVenueCount/u);
  assert.match(directorySource, /publishedHotelCount/u);
  assert.match(directorySource, /一次・二次試験の会場を区別/u);
  assert.match(cssSource, /\.shiritsu-venue-banner:focus-visible/u);
  assert.match(cssSource, /@media \(max-width: 760px\)[\s\S]*\.shiritsu-venue-banner/u);
  assert.match(cssSource, /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.shiritsu-venue-banner/u);
});

test("build成果物のJSONと構造化データはparseでき、IDが重複しない", () => {
  if (!existsSync(builtDatasetPath) || !existsSync(builtPagePath)) return;

  const builtDataset = JSON.parse(readFileSync(builtDatasetPath, "utf8"));
  assert.equal(builtDataset.metadata.canonicalUrl, privateMedicalExamVenuesHotels2027Metadata.canonicalUrl);
  assert.equal(builtDataset.scope.universityCount, 31);
  assert.equal(builtDataset.scope.routeCount, 83);

  const html = readFileSync(builtPagePath, "utf8");
  const groupedPrefectures = [
    ...html.matchAll(
      /<section\b[^>]*class="venue-guide-prefecture"[^>]*data-venue-prefecture-group="([^"]+)"/gu,
    ),
  ].map((match) => match[1]);
  const expectedPrefectures = [
    ...new Set(
      privateMedicalExamVenues2027
        .filter((venue) =>
          privateMedicalExamVenueAssignments2027.some((assignment) =>
            assignment.venueLinks.some((link) => link.venueId === venue.venueId),
          ),
        )
        .map((venue) => venue.prefecture),
    ),
  ];
  assert.equal(groupedPrefectures.length, expectedPrefectures.length);
  assert.deepEqual(new Set(groupedPrefectures), new Set(expectedPrefectures));
  assert.ok(unique(groupedPrefectures), "都道府県グループが重複しています");

  const jsonLdBlocks = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gu)];
  assert.ok(jsonLdBlocks.length > 0);
  const documents = jsonLdBlocks.map((match) => JSON.parse(match[1]));
  const ids = documents.flatMap((document) =>
    (document["@graph"] ?? [document])
      .map((entry) => entry?.["@id"])
      .filter(Boolean),
  );
  assert.ok(unique(ids), "JSON-LDの@idが重複しています");

  const domIds = [...html.matchAll(/\sid="([^"]+)"/gu)].map((match) => match[1]);
  assert.ok(unique(domIds), "HTMLのid属性が重複しています");
  assert.doesNotMatch(html, /C:\\|C:\/|internal_only|project_internal/u);
});
