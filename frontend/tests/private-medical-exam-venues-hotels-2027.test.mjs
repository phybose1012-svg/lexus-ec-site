import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  privateMedicalExamVenueAssignments2027,
  privateMedicalJichiExamVenues2027,
  privateMedicalJichiVenueRelations2027,
  privateMedicalExamVenueSummary2027,
  privateMedicalExamVenueUniversitySummaries2027,
  privateMedicalExamVenues2027,
} from "../src/data/privateMedicalExamVenues2027.ts";
import { getPrivateMedicalCanonicalRouteId2027 } from "../src/data/privateMedicalCanonicalRouteIds2027.ts";
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

test("自治医科大学一次は47都道府県の学力・面接94関係を正式会場へ結合する", () => {
  assert.equal(privateMedicalJichiVenueRelations2027.length, 94);
  assert.equal(privateMedicalJichiExamVenues2027.length, 71);

  const relationsByPrefecture = Object.groupBy(
    privateMedicalJichiVenueRelations2027,
    (relation) => relation.applicantPrefecture,
  );
  assert.equal(Object.keys(relationsByPrefecture).length, 47);
  for (const [prefecture, relations] of Object.entries(relationsByPrefecture)) {
    assert.equal(relations.length, 2, `${prefecture}: 学力・面接の2関係ではありません`);
    assert.deepEqual(
      new Set(relations.map((relation) => relation.examPart)),
      new Set(["written", "interview"]),
    );
    assert.equal(
      relations.find((relation) => relation.examPart === "written")?.examDate,
      "2027-01-25",
    );
    assert.equal(
      relations.find((relation) => relation.examPart === "interview")?.examDate,
      "2027-01-26",
    );
  }

  const jichiVenueIds = new Set(privateMedicalJichiExamVenues2027.map((venue) => venue.venueId));
  for (const venue of privateMedicalJichiExamVenues2027) {
    assert.ok(venue.address.startsWith(venue.prefecture));
    if (venue.venueId === "venue-jichi-first-hokkaido-tkp-sapporo-kita3jo") {
      assert.deepEqual(venue.nearestStations, ["札幌市営地下鉄南北線 さっぽろ駅", "JR札幌駅"]);
      assert.match(venue.officialUrlLabel ?? "", /公式アクセス/u);
    } else if (venue.venueId === "venue-jichi-first-hokkaido-kaderu27") {
      assert.deepEqual(venue.nearestStations, [
        "札幌市営地下鉄南北線・東豊線 さっぽろ駅",
        "JR札幌駅",
      ]);
      assert.match(venue.officialUrlLabel ?? "", /公式アクセス/u);
    } else if (venue.venueId === "venue-jichi-first-aomori-toonippo-news") {
      assert.deepEqual(venue.nearestStations, ["JR奥羽本線・青い森鉄道線 青森駅"]);
      assert.match(venue.officialUrlLabel ?? "", /公式施設案内/u);
    } else if (venue.venueId === "venue-jichi-first-iwate-espoir") {
      assert.deepEqual(venue.nearestStations, ["JR東北本線・東北新幹線 盛岡駅"]);
      assert.match(venue.officialUrlLabel ?? "", /公式アクセス/u);
    } else if (venue.venueId === "venue-jichi-first-miyagi-jichikaikan") {
      assert.deepEqual(venue.nearestStations, ["仙台市営地下鉄南北線 勾当台公園駅"]);
      assert.match(venue.officialUrlLabel ?? "", /公式アクセス/u);
    } else {
      assert.equal(venue.nearestStations.length, 0);
      assert.match(venue.officialUrlLabel ?? "", /募集要項/u);
    }
  }
  assert.ok(
    privateMedicalJichiVenueRelations2027.every((relation) =>
      jichiVenueIds.has(relation.venueId),
    ),
  );

  const first = privateMedicalExamVenueAssignments2027.find(
    (assignment) => assignment.assignmentId === "jichi-medical--general--general--first-venue",
  );
  assert.equal(first?.publicationState, "confirmed");
  assert.equal(first?.announcedPrefectures.length, 47);
  assert.equal(first?.venueLinks.length, 94);
});

test("希望日・大学指定・固定会場を方式別に混同しない", () => {
  const dataset = getPrivateMedicalExamVenuesHotels2027Dataset();
  assert.equal(dataset.definitions.assignmentConditions.fixed, "試験地・会場は固定");
  assert.equal(
    dataset.definitions.assignmentConditions.applicant_preference,
    "受験日または試験地の希望・選択あり",
  );
  assert.equal(dataset.definitions.assignmentConditions.admission_ticket, "受験票で最終確認");
  const conditionsFor = (routeId, examStage) =>
    privateMedicalExamVenueAssignments2027.find(
      (entry) => entry.routeId === routeId && entry.examStage === examStage,
    )?.conditions;

  assert.deepEqual(conditionsFor("showa-medical--general--general-phase-1", "second"), [
    "fixed",
    "applicant_preference",
    "admission_ticket",
  ]);
  assert.deepEqual(
    conditionsFor("showa-medical--general--general-phase-1-phase-2", "second"),
    ["fixed", "admission_ticket"],
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

test("公式更新と未公表条件を前年情報で補完しない", () => {
  const assignmentFor = (routeId, examStage) =>
    privateMedicalExamVenueAssignments2027.find(
      (entry) => entry.routeId === routeId && entry.examStage === examStage,
    );

  const kitasatoFirst = assignmentFor("kitasato--general--general", "first");
  assert.equal(kitasatoFirst?.publicationState, "confirmed");
  assert.deepEqual(kitasatoFirst?.venueLinks, [
    { venueId: "venue-pacifico-yokohama-north", role: "primary" },
    { venueId: "venue-kitasato-sagamihara-campus", role: "overflow" },
  ]);
  const kitasatoSecond = assignmentFor("kitasato--general--general", "second");
  assert.equal(kitasatoSecond?.publicationState, "confirmed");
  assert.deepEqual(kitasatoSecond?.venueLinks, [
    { venueId: "venue-kitasato-sagamihara-campus", role: "fixed" },
  ]);

  const tohokuGeneralFirst = assignmentFor("tohoku-med-pharm--general--general", "first");
  assert.equal(tohokuGeneralFirst?.publicationState, "city_or_campus_only");
  assert.equal(tohokuGeneralFirst?.reviewState, "monitoring");
  assert.deepEqual(tohokuGeneralFirst?.conditions, ["admission_ticket"]);
  assert.deepEqual(tohokuGeneralFirst?.venueLinks, [
    { venueId: "venue-tohoku-med-pharm-komatsushima-campus", role: "choice" },
    { venueId: "venue-grand-cube-osaka", role: "choice" },
    { venueId: "venue-acu-a-asty45", role: "choice" },
  ]);
  assert.match(tohokuGeneralFirst?.announcedVenueText ?? "", /東京：正式施設は現在調整中/u);
  assert.doesNotMatch(
    tohokuGeneralFirst?.venueLinks.map((link) => link.venueId).join(" ") ?? "",
    /venue-bellesalle-shibuya-garden|venue-toc-gotanda/u,
  );
  assert.equal(
    tohokuGeneralFirst?.officialAdmissionUrl,
    "https://www.tohoku-mpu.ac.jp/admission/medicine-application/",
  );

  for (const routeId of [
    "showa-medical--general--general-phase-1",
    "showa-medical--general--general-phase-1-phase-2",
  ]) {
    const showaFirst = assignmentFor(routeId, "first");
    assert.deepEqual(showaFirst?.venueLinks, [
      { venueId: "venue-toc-gotanda", role: "primary" },
      { venueId: "venue-showa-medical-hatanodai-campus", role: "overflow" },
    ]);
    assert.deepEqual(showaFirst?.conditions, [
      "university_assigned",
      "admission_ticket",
      "capacity_overflow",
    ]);
    assert.match(showaFirst?.note ?? "", /五反田TOCビルの定員を超過/u);
    const showaSecond = assignmentFor(routeId, "second");
    assert.deepEqual(showaSecond?.venueLinks, [
      { venueId: "venue-showa-medical-hatanodai-campus", role: "fixed" },
    ]);
    assert.ok(showaSecond?.conditions.includes("admission_ticket"));
  }

  const tokyoMedicalFirst = assignmentFor("tokyo-medical--general--general", "first");
  assert.equal(tokyoMedicalFirst?.publicationState, "ticket_assigned");
  assert.deepEqual(tokyoMedicalFirst?.venueLinks, [
    { venueId: "venue-tokyo-medical-shinjuku-campus", role: "primary" },
    { venueId: "venue-bellesalle-shinjuku-grand", role: "primary" },
  ]);
  assert.deepEqual(tokyoMedicalFirst?.conditions, ["university_assigned", "admission_ticket"]);
  assert.match(tokyoMedicalFirst?.officialAdmissionUrl ?? "", /2027bosyuyoukou_ippan\.pdf$/u);
  assert.match(tokyoMedicalFirst?.note ?? "", /受験番号/u);

  assert.deepEqual(assignmentFor("nihon--general--unified-phase-2", "first")?.conditions, []);
  for (const routeId of [
    "fujita--general--general-regional-quota-17148",
    "osaka-med-pharm--general--general-regional-quota-385a3-early",
    "osaka-med-pharm--general--general-late",
    "kindai--general--general-early",
    "kindai--general--general-regional-quota-c5d34-385a3-3f44f-early",
    "kindai--general--general-late",
    "kindai--general--general-regional-quota-c5d34-late",
  ]) {
    assert.deepEqual(assignmentFor(routeId, "first")?.conditions, [], routeId);
  }

  assert.deepEqual(assignmentFor("fukuoka--general--general", "first")?.conditions, [
    "applicant_preference",
    "admission_ticket",
    "capacity_overflow",
  ]);
  assert.deepEqual(assignmentFor("fukuoka--general--general", "second")?.conditions, [
    "fixed",
    "admission_ticket",
  ]);
  assert.deepEqual(assignmentFor("fukuoka--common--common-test-phase-1", "second")?.conditions, [
    "fixed",
    "admission_ticket",
  ]);

  assert.equal(
    privateMedicalExamVenues2027.find((venue) => venue.venueId === "venue-makuhari-messe")?.name,
    "幕張メッセ 国際展示場1～3ホール",
  );
  assert.equal(
    privateMedicalExamVenues2027.find(
      (venue) => venue.venueId === "venue-pacifico-yokohama-north",
    )?.name,
    "パシフィコ横浜ノース",
  );
  const bellesalleShinjuku = privateMedicalExamVenues2027.find(
    (venue) => venue.venueId === "venue-bellesalle-shinjuku-grand",
  );
  assert.equal(bellesalleShinjuku?.name, "ベルサール新宿グランド イベントホール");
  assert.match(bellesalleShinjuku?.address ?? "", /西新宿8-17-3/u);
  assert.match(bellesalleShinjuku?.accessNote ?? "", /1階のイベントホール/u);
  const jikeiNishishimbashi = privateMedicalExamVenues2027.find(
    (venue) => venue.venueId === "venue-jikei-nishishimbashi-campus",
  );
  assert.match(jikeiNishishimbashi?.accessNote ?? "", /御成門駅A5出口から徒歩約3分/u);
  assert.match(jikeiNishishimbashi?.accessNote ?? "", /使用棟・階・試験室/u);
  const twmuYayoi = privateMedicalExamVenues2027.find(
    (venue) => venue.venueId === "venue-twmu-yayoi-memorial-education-building",
  );
  assert.match(twmuYayoi?.accessNote ?? "", /若松河田駅若松口から徒歩5分/u);
  assert.match(twmuYayoi?.accessNote ?? "", /下見と写真撮影/u);
  const tohoOmori = privateMedicalExamVenues2027.find(
    (venue) => venue.venueId === "venue-toho-omori-campus",
  );
  assert.equal(tohoOmori?.officialUrl, "https://www.toho-u.ac.jp/accessmap/omori_campus.html");
  assert.match(tohoOmori?.accessNote ?? "", /梅屋敷駅から徒歩約8分/u);
  assert.match(tohoOmori?.accessNote ?? "", /使用棟・階・試験室/u);
  const nihonMedical = privateMedicalExamVenues2027.find(
    (venue) => venue.venueId === "venue-nihon-medical-school-building",
  );
  assert.equal(nihonMedical?.officialUrl, "https://www.med.nihon-u.ac.jp/access.php");
  assert.match(nihonMedical?.accessNote ?? "", /大山駅から医学部まで徒歩約15分/u);
  assert.match(nihonMedical?.accessNote ?? "", /使用棟・階・試験室/u);
  const tkpShinosaka = privateMedicalExamVenues2027.find(
    (venue) => venue.venueId === "venue-tkp-shinosaka-conference-center",
  );
  assert.match(tkpShinosaka?.address ?? "", /J\.NODE新大阪 4～5階/u);
  const mariannaCampus = privateMedicalExamVenues2027.find(
    (venue) => venue.venueId === "venue-marianna-sugao-campus",
  );
  assert.equal(mariannaCampus?.name, "聖マリアンナ医科大学 本学校舎");
  assert.equal(mariannaCampus?.officialUrl, "https://www.marianna-u.ac.jp/houjin/access/univ/");
  assert.deepEqual(assignmentFor("tokyo-medical--general--general", "second")?.conditions, [
    "fixed",
    "university_assigned",
  ]);
  assert.deepEqual(assignmentFor("jikei--general--general", "second")?.conditions, ["fixed"]);
  assert.match(
    assignmentFor("jikei--general--general", "second")?.note ?? "",
    /2027年度学生募集要項/u,
  );
  assert.deepEqual(assignmentFor("toho--general--general", "second")?.conditions, ["fixed"]);
  assert.match(
    assignmentFor("toho--general--general", "second")?.note ?? "",
    /学生募集要項は作成中/u,
  );
  assert.match(
    assignmentFor("toho--general--unified", "second")?.note ?? "",
    /2027年3月3日/u,
  );
  assert.match(
    assignmentFor("nihon--general--unified-phase-1", "second")?.note ?? "",
    /2027年2月11日/u,
  );
  assert.match(
    assignmentFor("nihon--general--unified-phase-2", "second")?.note ?? "",
    /2027年3月17日/u,
  );
  assert.deepEqual(
    assignmentFor("fujita--general--general-regional-quota-17148", "second")?.conditions,
    ["fixed"],
  );
  assert.deepEqual(assignmentFor("fujita--common--common-test", "second")?.conditions, [
    "fixed",
  ]);
  assert.deepEqual(
    assignmentFor("tokyo-womens-medical--general--general-regional-quota", "second")
      ?.conditions,
    ["fixed", "applicant_preference", "university_assigned"],
  );
  assert.match(
    assignmentFor("tokyo-womens-medical--general--general-regional-quota", "second")
      ?.note ?? "",
    /一次試験合格発表時/u,
  );
  assert.deepEqual(assignmentFor("marianna--general--general-early", "second")?.conditions, [
    "fixed",
    "applicant_preference",
    "university_assigned",
  ]);
  const kawasakiRoute =
    "kawasaki-medical--general--general-regional-quota-c5d34-491fd-bf01d";
  assert.deepEqual(assignmentFor(kawasakiRoute, "first")?.conditions, ["fixed"]);
  assert.deepEqual(assignmentFor(kawasakiRoute, "second")?.conditions, [
    "fixed",
    "university_assigned",
  ]);
  for (const routeId of [
    "kansai-medical--general--general-early",
    "kansai-medical--general--general-regional-quota-c5d34-385a3",
    "kansai-medical--common--common-general-combined",
  ]) {
    assert.deepEqual(assignmentFor(routeId, "first")?.conditions, ["applicant_preference"]);
  }

  const venueOfficialUrls = new Set(privateMedicalExamVenues2027.map((venue) => venue.officialUrl));
  for (const retiredUrl of [
    "https://www.juntendo.ac.jp/about/access/",
    "https://www.nagoya.conventionhall.jp/access/",
    "https://www.uoeh-u.ac.jp/University/Access.html",
    "https://www.kashikaigishitsu.net/facilitys/gc-osaka-riverside-hotel/",
    "https://www.jikei.ac.jp/access/nishishimbashi/",
    "https://www.ompu.ac.jp/access/campus/honbu.html",
    "https://www.kindai.ac.jp/medicine/about/access/",
    "https://www.kashikaigishitsu.net/facilitys/cc-shimbashi/",
    "https://www.kurume-u.ac.jp/about/campus/mii/",
    "https://www.kurume-u.ac.jp/about/campus/asahimachi/",
    "https://www.kashikaigishitsu.net/facilitys/gcp-nagoya-shinkansenguchi/",
    "https://messe-kitakyushu.jp/access/",
    "https://www.tokyo-bigsight.co.jp/visitor/buildings/time/",
    "https://www.toho-u.ac.jp/access/omori_campus.html",
    "https://www.twmu.ac.jp/univ/access/",
    "https://fukuoka.iuhw.ac.jp/access/",
    "https://www.tokyo-med.ac.jp/univ/access/shinjuku.html",
    "https://www.kanazawa-med.ac.jp/access.html",
    "https://www.bellesalle.co.jp/shisetsu/shiodome/bs_shiodome/",
  ]) {
    assert.equal(venueOfficialUrls.has(retiredUrl), false, `404確認済みURLが残っています: ${retiredUrl}`);
  }
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
    assert.ok(unique(venue.nearestStations));
  }

  for (const assignment of privateMedicalExamVenueAssignments2027) {
    assert.ok(Array.isArray(assignment.announcedPrefectures));
    assert.ok(unique(assignment.announcedPrefectures));
    assert.equal(
      assignment.routeId,
      getPrivateMedicalCanonicalRouteId2027(assignment.universityId, assignment.routeName),
      `${assignment.assignmentId}: canonical方式IDが日程正本と一致しません`,
    );
    assert.ok(
      unique(
        assignment.venueLinks.map((link) =>
          [
            link.venueId,
            link.applicantPrefecture ?? "",
            link.examPart ?? "",
            link.examDate ?? "",
          ].join("|"),
        ),
      ),
      `${assignment.assignmentId}: 同じ会場関係が重複しています`,
    );
    assignment.venueLinks.forEach((link) => {
      assert.ok(venueIdSet.has(link.venueId), `${assignment.assignmentId}: ${link.venueId} が未定義です`);
      const hasRelationDetail = Boolean(
        link.applicantPrefecture || link.examPart || link.examDate || link.officialVenueText,
      );
      if (hasRelationDetail) {
        assert.equal(assignment.universityId, "jichi-medical");
        assert.ok(link.applicantPrefecture && link.examPart && link.examDate && link.officialVenueText);
      }
    });
    if (assignment.publicationState === "confirmed") {
      assert.ok(assignment.venueLinks.length > 0);
    }
    if (assignment.reviewState === "verified") {
      assert.match(assignment.officialAdmissionUrl ?? "", /^https:\/\//u);
      assert.ok(
        assignment.evidenceLocator?.trim(),
        `${assignment.assignmentId}: verifiedですが根拠位置がありません`,
      );
    }
    if (assignment.publicationState === "unpublished") {
      assert.equal(assignment.venueLinks.length, 0);
    }
  }
  for (const assignment of privateMedicalExamVenueAssignments2027.filter(
    (entry) => entry.publicationState === "city_or_campus_only",
  )) {
    assert.ok(
      assignment.announcedPrefectures.length > 0,
      `${assignment.assignmentId}: 公表済みの会場都道府県が欠落しています`,
    );
  }

  for (const hotel of privateMedicalVenueHotels2027) {
    assert.match(hotel.officialUrl, /^https:\/\//u);
    assert.match(hotel.officialBookingUrl ?? "", /^https:\/\//u);
    if (hotel.operatingStatusEvidenceUrl) {
      assert.match(hotel.operatingStatusEvidenceUrl, /^https:\/\//u);
    }
    assert.ok(
      ["official_site_active", "opening_planned", "needs_review"].includes(
        hotel.operatingStatus,
      ),
    );
    assert.ok(hotel.venueAccess.length > 0);
    assert.ok(unique(hotel.venueAccess.map((access) => access.venueId)));
    assert.ok(unique(hotel.amenities.map((amenity) => amenity.key)));
    for (const access of hotel.venueAccess) {
      assert.ok(unique(access.modes));
      assert.ok(unique(access.evidenceUrls));
      assert.ok(venueIdSet.has(access.venueId), `${hotel.hotelId}: ${access.venueId} が未定義です`);
      assert.ok(access.evidenceUrls.length > 0);
      assert.ok(
        privateMedicalExamVenueAssignments2027.some(
          (assignment) =>
            ["confirmed", "city_or_campus_only", "ticket_assigned"].includes(
              assignment.publicationState,
            ) &&
            assignment.venueLinks.some((link) => link.venueId === access.venueId),
        ),
        `${hotel.hotelId} が公表済みの具体的な会場リンクに結合されていません`,
      );
    }
  }
});

test("公開Datasetはallowlist投影で内部項目・価格・評価を含めない", () => {
  const dataset = getPrivateMedicalExamVenuesHotels2027Dataset();
  assert.equal(dataset.schemaVersion, "1.1.0");
  assert.equal(dataset.scope.universityCount, 31);
  assert.equal(dataset.scope.routeCount, 83);
  assert.equal(dataset.summary.hotelCount, dataset.hotels.length);
  assert.equal(dataset.hotels.length, 110);
  assert.ok(dataset.hotels.every((hotel) => hotel.operatingStatus === "official_site_active"));
  assert.equal(dataset.hotels.some((hotel) => hotel.hotelId === "tokyu-stay-gotanda"), false);
  assert.equal(dataset.hotels.some((hotel) => hotel.hotelId === "hotel-select-inn-saitama-moroyama"), true);
  for (const hotelId of ["ginza-kokusai-hotel", "hotel-check-in-shimbashi"]) {
    const hotel = dataset.hotels.find((entry) => entry.hotelId === hotelId);
    assert.ok(hotel, `${hotelId} が公開Datasetにありません`);
    assert.ok(
      hotel.venueAccess.some((access) => access.venueId === "venue-bellesalle-shiodome"),
      `${hotelId} がベルサール汐留に結合されていません`,
    );
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  for (const hotelId of ["forbell-stay-yurigaoka", "hotel-molino-shin-yurigaoka"]) {
    const hotel = dataset.hotels.find((entry) => entry.hotelId === hotelId);
    assert.ok(hotel, `${hotelId} が公開Datasetにありません`);
    assert.ok(
      hotel.venueAccess.some((access) => access.venueId === "venue-marianna-sugao-campus"),
      `${hotelId} が聖マリアンナ医科大学 本学校舎に結合されていません`,
    );
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-marianna-sugao-campus",
    );
    assert.equal(access?.measurementBasis, "route_only");
    assert.ok(access?.reviewState.includes("verified_with_caveat"));
    assert.ok(access?.reviewState.includes("venue_pdf_visual_review"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  for (const hotelId of ["comfort-hotel-kurosaki", "delight-stay-kurosaki-ekimae"]) {
    const hotel = dataset.hotels.find((entry) => entry.hotelId === hotelId);
    assert.ok(hotel, `${hotelId} が公開Datasetにありません`);
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-uoeh-main-campus",
    );
    assert.ok(access, `${hotelId} が産業医科大学 本学に結合されていません`);
    assert.equal(access.measurementBasis, "route_only");
    assert.equal(access.transferCount, 0);
    assert.ok(access.reviewState.includes("verified_with_caveat"));
    assert.ok(access.reviewState.includes("venue_pdf_visual_review"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  for (const hotelId of ["osaka-riverside-hotel", "sakura-garden-hotel"]) {
    const hotel = dataset.hotels.find((entry) => entry.hotelId === hotelId);
    assert.ok(hotel, `${hotelId} が公開Datasetにありません`);
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-tkp-osaka-riverside-hotel",
    );
    assert.ok(access, `${hotelId} がTKPガーデンシティ大阪リバーサイドホテルに結合されていません`);
    assert.equal(access.measurementBasis, "route_only");
    assert.equal(access.transferCount, 0);
    assert.equal(access.travelTimeLabel, undefined);
    assert.ok(access.reviewState.includes("venue_pdf_visual_review"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  assert.ok(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "osaka-riverside-hotel")
      ?.venueAccess[0]?.reviewState.includes("official_direct"),
  );
  for (const hotelId of ["keio-plaza-hotel-tokyo", "hotel-rose-garden-shinjuku"]) {
    const hotel = dataset.hotels.find((entry) => entry.hotelId === hotelId);
    assert.ok(hotel, `${hotelId} が公開Datasetにありません`);
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-keio-plaza-hotel-tokyo",
    );
    assert.ok(access, `${hotelId} が京王プラザホテル（東京）に結合されていません`);
    assert.equal(access.measurementBasis, "route_only");
    assert.equal(access.transferCount, 0);
    assert.equal(access.travelTimeLabel, undefined);
    assert.ok(access.reviewState.includes("venue_pdf_visual_review"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  assert.ok(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "keio-plaza-hotel-tokyo")
      ?.venueAccess[0]?.reviewState.includes("official_direct"),
  );
  assert.ok(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "hotel-rose-garden-shinjuku")
      ?.venueAccess[0]?.reviewState.includes("verified_with_caveat"),
  );
  for (const hotelId of ["hotel-fukuracia-osaka-bay", "family-lodge-hatagoya-osaka-port"]) {
    const hotel = dataset.hotels.find((entry) => entry.hotelId === hotelId);
    assert.ok(hotel, `${hotelId} が公開Datasetにありません`);
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-osaka-academia",
    );
    assert.ok(access, `${hotelId} が大阪アカデミアに結合されていません`);
    assert.equal(access.measurementBasis, "route_only");
    assert.ok(access.reviewState.includes("venue_pdf_visual_review"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  const fukuraciaAccess = dataset.hotels
    .find((hotel) => hotel.hotelId === "hotel-fukuracia-osaka-bay")
    ?.venueAccess.find((access) => access.venueId === "venue-osaka-academia");
  assert.equal(fukuraciaAccess?.transferCount, 0);
  assert.equal(fukuraciaAccess?.travelTimeLabel, undefined);
  assert.ok(fukuraciaAccess?.reviewState.includes("needs_route_review"));
  const hatagoyaAccess = dataset.hotels
    .find((hotel) => hotel.hotelId === "family-lodge-hatagoya-osaka-port")
    ?.venueAccess.find((access) => access.venueId === "venue-osaka-academia");
  assert.equal(hatagoyaAccess?.transferCount, 1);
  assert.ok(hatagoyaAccess?.reviewState.includes("verified_with_caveat"));
  for (const hotelId of ["fukuoka-garden-palace", "hotel-reference-tenjin-iii"]) {
    const hotel = dataset.hotels.find((entry) => entry.hotelId === hotelId);
    assert.ok(hotel, `${hotelId} が公開Datasetにありません`);
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-fukuoka-garden-palace",
    );
    assert.ok(access, `${hotelId} が福岡ガーデンパレスに結合されていません`);
    assert.equal(access.transferCount, 0);
    assert.equal(access.travelTimeLabel, undefined);
    assert.ok(access.reviewState.includes("venue_pdf_visual_review"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  const gardenPalaceAccess = dataset.hotels
    .find((hotel) => hotel.hotelId === "fukuoka-garden-palace")
    ?.venueAccess.find((access) => access.venueId === "venue-fukuoka-garden-palace");
  assert.equal(gardenPalaceAccess?.measurementBasis, "route_only");
  assert.ok(gardenPalaceAccess?.reviewState.includes("official_direct"));
  const referenceTenjinAccess = dataset.hotels
    .find((hotel) => hotel.hotelId === "hotel-reference-tenjin-iii")
    ?.venueAccess.find((access) => access.venueId === "venue-fukuoka-garden-palace");
  assert.equal(referenceTenjinAccess?.measurementBasis, "map_route_checked");
  assert.ok(referenceTenjinAccess?.reviewState.includes("verified_with_caveat"));
  for (const hotelId of ["hotel-graphy-nezu", "hotel-livemax-budget-nippori"]) {
    const hotel = dataset.hotels.find((entry) => entry.hotelId === hotelId);
    assert.ok(hotel, `${hotelId} が公開Datasetにありません`);
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-nippon-medical-sendagi-campus",
    );
    assert.ok(access, `${hotelId} が日本医科大学 千駄木校舎に結合されていません`);
    assert.equal(access.measurementBasis, "map_route_checked");
    assert.equal(access.transferCount, 0);
    assert.equal(access.travelTimeLabel, undefined);
    assert.ok(access.reviewState.includes("verified_with_caveat"));
    assert.ok(access.reviewState.includes("venue_pdf_visual_review"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  assert.ok(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "hotel-graphy-nezu")
      ?.amenities.some((item) => item.key === "desk"),
  );
  assert.equal(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "hotel-livemax-budget-nippori")
      ?.amenities.some((item) => item.key === "desk"),
    false,
  );
  for (const hotelId of [
    "big-i-international-communication-center",
    "daiwa-roynet-hotel-sakaihigashi",
  ]) {
    const hotel = dataset.hotels.find((entry) => entry.hotelId === hotelId);
    assert.ok(hotel, `${hotelId} が公開Datasetにありません`);
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-kindai-osaka-medical-campus",
    );
    assert.ok(access, `${hotelId} が近畿大学 おおさかメディカルキャンパスに結合されていません`);
    assert.equal(access.measurementBasis, "route_only");
    assert.ok(access.reviewState.includes("verified_with_caveat"));
    assert.ok(access.reviewState.includes("venue_pdf_visual_review"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  const bigIAccess = dataset.hotels
    .find((hotel) => hotel.hotelId === "big-i-international-communication-center")
    ?.venueAccess.find((access) => access.venueId === "venue-kindai-osaka-medical-campus");
  assert.equal(bigIAccess?.transferCount, 0);
  assert.ok(bigIAccess?.reviewState.includes("needs_route_review"));
  const sakaihigashiAccess = dataset.hotels
    .find((hotel) => hotel.hotelId === "daiwa-roynet-hotel-sakaihigashi")
    ?.venueAccess.find((access) => access.venueId === "venue-kindai-osaka-medical-campus");
  assert.equal(sakaihigashiAccess?.transferCount, 1);
  const kindaiVenue = dataset.venues.find(
    (venue) => venue.venueId === "venue-kindai-osaka-medical-campus",
  );
  assert.equal(kindaiVenue?.postalCode, "590-0197");
  assert.equal(kindaiVenue?.address, "大阪府堺市南区三原台1丁14番1号");
  assert.ok(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "daiwa-roynet-hotel-sakaihigashi")
      ?.amenities.some((item) => item.key === "desk"),
  );
  for (const hotelId of ["jr-east-hotel-mets-musashisakai", "citytel-musashisakai"]) {
    const hotel = dataset.hotels.find((entry) => entry.hotelId === hotelId);
    assert.ok(hotel, `${hotelId} が公開Datasetにありません`);
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-nippon-medical-musashisakai-campus",
    );
    assert.ok(access, `${hotelId} が日本医科大学 武蔵境校舎に結合されていません`);
    assert.equal(access.measurementBasis, "route_only");
    assert.equal(access.transferCount, 0);
    assert.ok(access.reviewState.includes("verified_with_caveat"));
    assert.ok(access.reviewState.includes("needs_route_review"));
    assert.ok(access.reviewState.includes("venue_pdf_visual_review"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  assert.ok(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "jr-east-hotel-mets-musashisakai")
      ?.amenities.some((item) => item.key === "coin_laundry"),
  );
  assert.ok(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "citytel-musashisakai")
      ?.amenities.some((item) => item.key === "washer_dryer"),
  );
  assert.equal(
    dataset.hotels
      .filter((hotel) =>
        hotel.venueAccess.some(
          (access) => access.venueId === "venue-nippon-medical-musashisakai-campus",
        ),
      ).length,
    2,
  );
  for (const hotelId of ["apa-hotel-shinjuku-gyoemmae", "shinjuku-city-hotel-nuts-tokyo"]) {
    const hotel = dataset.hotels.find((entry) => entry.hotelId === hotelId);
    assert.ok(hotel, `${hotelId} が公開Datasetにありません`);
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-tokyo-medical-shinjuku-campus",
    );
    assert.ok(access, `${hotelId} が東京医科大学 新宿キャンパスに結合されていません`);
    assert.equal(access.measurementBasis, "route_only");
    assert.equal(access.transferCount, 0);
    assert.ok(access.reviewState.includes("verified_with_caveat"));
    assert.ok(access.reviewState.includes("needs_route_review"));
    assert.ok(access.reviewState.includes("venue_pdf_visual_review"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  assert.equal(
    dataset.hotels
      .filter((hotel) =>
        hotel.venueAccess.some(
          (access) => access.venueId === "venue-tokyo-medical-shinjuku-campus",
        ),
      ).length,
    2,
  );
  assert.equal(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "apa-hotel-shinjuku-gyoemmae")
      ?.amenities.some((item) => item.key === "desk"),
    false,
  );
  assert.ok(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "shinjuku-city-hotel-nuts-tokyo")
      ?.amenities.some((item) => item.key === "desk"),
  );
  for (const hotelId of ["ab-hotel-kanazawa", "hotel-livemax-budget-kanazawa-idaimae"]) {
    const hotel = dataset.hotels.find((entry) => entry.hotelId === hotelId);
    assert.ok(hotel, `${hotelId} が公開Datasetにありません`);
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-kanazawa-medical-main-campus",
    );
    assert.ok(access, `${hotelId} が金沢医科大学 本学に結合されていません`);
    assert.equal(access.measurementBasis, "route_only");
    assert.equal(access.transferCount, 0);
    assert.ok(access.reviewState.includes("verified_with_caveat"));
    assert.ok(access.reviewState.includes("venue_pdf_visual_review"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  assert.ok(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "ab-hotel-kanazawa")
      ?.amenities.some((item) => item.key === "desk"),
  );
  assert.equal(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "hotel-livemax-budget-kanazawa-idaimae")
      ?.amenities.some((item) => item.key === "breakfast"),
    false,
  );
  assert.ok(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "hotel-livemax-budget-kanazawa-idaimae")
      ?.venueAccess[0]?.reviewState.includes("needs_route_review"),
  );
  assert.equal(
    dataset.hotels.filter((hotel) =>
      hotel.venueAccess.some((access) => access.venueId === "venue-kanazawa-medical-main-campus"),
    ).length,
    2,
  );
  for (const hotelId of [
    "paradis-inn-sagamihara",
    "toyoko-inn-jr-yokohama-line-sagamihara-ekimae",
  ]) {
    const hotel = dataset.hotels.find((entry) => entry.hotelId === hotelId);
    assert.ok(hotel, `${hotelId} が公開Datasetにありません`);
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-kitasato-sagamihara-campus",
    );
    assert.ok(access, `${hotelId} が北里大学 相模原キャンパスに結合されていません`);
    assert.equal(access.transferCount, 0);
    assert.ok(access.reviewState.includes("verified_with_caveat"));
    assert.ok(access.reviewState.includes("venue_pdf_visual_review"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  assert.equal(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "paradis-inn-sagamihara")
      ?.venueAccess[0]?.measurementBasis,
    "official",
  );
  assert.ok(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "paradis-inn-sagamihara")
      ?.venueAccess[0]?.reviewState.includes("official_direct"),
  );
  assert.equal(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "toyoko-inn-jr-yokohama-line-sagamihara-ekimae")
      ?.venueAccess[0]?.measurementBasis,
    "route_only",
  );
  assert.equal(
    dataset.hotels.filter((hotel) =>
      hotel.venueAccess.some((access) => access.venueId === "venue-kitasato-sagamihara-campus"),
    ).length,
    2,
  );
  for (const hotelId of ["comfort-hotel-sendai-west", "hotel-green-city-sendai"]) {
    const hotel = dataset.hotels.find((entry) => entry.hotelId === hotelId);
    assert.ok(hotel, `${hotelId} が公開Datasetにありません`);
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-tohoku-med-pharm-komatsushima-campus",
    );
    assert.ok(access, `${hotelId} が東北医科薬科大学 小松島キャンパスに結合されていません`);
    assert.equal(access.measurementBasis, "route_only");
    assert.equal(access.transferCount, 0);
    assert.ok(access.reviewState.includes("verified_with_caveat"));
    assert.ok(access.reviewState.includes("venue_pdf_visual_review"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  assert.ok(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "comfort-hotel-sendai-west")
      ?.amenities.some((item) => item.key === "desk"),
  );
  assert.equal(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "hotel-green-city-sendai")
      ?.amenities.some((item) => item.key === "desk"),
    false,
  );
  assert.equal(
    dataset.hotels.filter((hotel) =>
      hotel.venueAccess.some(
        (access) => access.venueId === "venue-tohoku-med-pharm-komatsushima-campus",
      ),
    ).length,
    2,
  );
  const iwateYahabaVenue = dataset.venues.find(
    (venue) => venue.venueId === "venue-iwate-medical-yahaba-campus",
  );
  assert.equal(iwateYahabaVenue?.address, "岩手県紫波郡矢巾町医大通1-1-1");
  for (const hotelId of ["hotel-route-inn-yahaba", "super-hotel-yahaba-station-east"]) {
    const hotel = dataset.hotels.find((entry) => entry.hotelId === hotelId);
    assert.ok(hotel, `${hotelId} が公開Datasetにありません`);
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-iwate-medical-yahaba-campus",
    );
    assert.ok(access, `${hotelId} が岩手医科大学 矢巾キャンパスに結合されていません`);
    assert.equal(access.measurementBasis, "route_only");
    assert.equal(access.transferCount, 0);
    assert.ok(access.reviewState.includes("verified_with_caveat"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  assert.ok(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "hotel-route-inn-yahaba")
      ?.venueAccess[0]?.reviewState.includes("needs_route_review"),
  );
  assert.equal(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "super-hotel-yahaba-station-east")
      ?.amenities.some((item) => item.key === "desk"),
    false,
  );
  assert.equal(
    dataset.hotels.filter((hotel) =>
      hotel.venueAccess.some((access) => access.venueId === "venue-iwate-medical-yahaba-campus"),
    ).length,
    2,
  );
  for (const hotelId of ["comfort-hotel-kokura", "asano-hotel-kokura"]) {
    const hotel = dataset.hotels.find((entry) => entry.hotelId === hotelId);
    assert.ok(hotel, `${hotelId} が公開Datasetにありません`);
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-kitakyushu-messe",
    );
    assert.ok(access, `${hotelId} が北九州メッセに結合されていません`);
    assert.equal(access.measurementBasis, "route_only");
    assert.equal(access.transferCount, 0);
    assert.ok(access.reviewState.includes("verified_with_caveat"));
    assert.ok(access.reviewState.includes("venue_pdf_visual_review"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  assert.ok(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "comfort-hotel-kokura")
      ?.amenities.some((item) => item.key === "desk"),
  );
  assert.equal(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "asano-hotel-kokura")
      ?.amenities.some((item) => item.key === "desk"),
    false,
  );
  assert.equal(
    dataset.hotels.filter((hotel) =>
      hotel.venueAccess.some((access) => access.venueId === "venue-kitakyushu-messe"),
    ).length,
    2,
  );
  const grandCubeOsakaVenue = dataset.venues.find(
    (venue) => venue.venueId === "venue-grand-cube-osaka",
  );
  assert.equal(grandCubeOsakaVenue?.officialUrl, "https://www.gco.co.jp/visitor/access/");
  for (const hotelId of ["hotel-ncb", "smile-hotel-osaka-nakanoshima"]) {
    const hotel = dataset.hotels.find((entry) => entry.hotelId === hotelId);
    assert.ok(hotel, `${hotelId} が公開Datasetにありません`);
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-grand-cube-osaka",
    );
    assert.ok(access, `${hotelId} がグランキューブ大阪に結合されていません`);
    assert.equal(access.transferCount, 0);
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  const hotelNcb = dataset.hotels.find((hotel) => hotel.hotelId === "hotel-ncb");
  assert.equal(hotelNcb?.venueAccess[0]?.measurementBasis, "official");
  assert.ok(hotelNcb?.venueAccess[0]?.reviewState.includes("official_direct"));
  assert.ok(hotelNcb?.amenities.some((item) => item.key === "desk"));
  const smileNakanoshima = dataset.hotels.find(
    (hotel) => hotel.hotelId === "smile-hotel-osaka-nakanoshima",
  );
  assert.equal(smileNakanoshima?.venueAccess[0]?.measurementBasis, "route_only");
  assert.ok(smileNakanoshima?.venueAccess[0]?.reviewState.includes("verified_with_caveat"));
  assert.equal(smileNakanoshima?.amenities.some((item) => item.key === "desk"), false);
  assert.equal(
    dataset.hotels.filter((hotel) =>
      hotel.venueAccess.some((access) => access.venueId === "venue-grand-cube-osaka"),
    ).length,
    2,
  );
  const acuASapporoVenue = dataset.venues.find(
    (venue) => venue.venueId === "venue-acu-a-asty45",
  );
  assert.equal(acuASapporoVenue?.address, "北海道札幌市中央区北4条西5丁目 アスティ45");
  assert.equal(acuASapporoVenue?.officialUrl, "https://www.acu-h.jp/sapporo/koutsu_access");
  for (const hotelId of ["hotel-gracery-sapporo", "hotel-hokke-club-sapporo"]) {
    const hotel = dataset.hotels.find((entry) => entry.hotelId === hotelId);
    assert.ok(hotel, `${hotelId} が公開Datasetにありません`);
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-acu-a-asty45",
    );
    assert.ok(access, `${hotelId} がACU-A（アスティ45）に結合されていません`);
    assert.equal(access.measurementBasis, "route_only");
    assert.equal(access.transferCount, 0);
    assert.ok(access.reviewState.includes("verified_with_caveat"));
    assert.ok(access.reviewState.includes("venue_pdf_visual_review"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  assert.equal(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "hotel-gracery-sapporo")
      ?.amenities.some((item) => item.key === "desk"),
    false,
  );
  assert.ok(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "hotel-hokke-club-sapporo")
      ?.amenities.some((item) => item.key === "desk"),
  );
  assert.equal(
    dataset.hotels.filter((hotel) =>
      hotel.venueAccess.some((access) => access.venueId === "venue-acu-a-asty45"),
    ).length,
    2,
  );
  for (const hotelId of ["jr-east-hotel-mets-shibuya", "hotel-graphy-shibuya"]) {
    const hotel = dataset.hotels.find((entry) => entry.hotelId === hotelId);
    assert.ok(hotel, `${hotelId} が公開Datasetにありません`);
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-bellesalle-shibuya-first",
    );
    assert.ok(access, `${hotelId} がベルサール渋谷ファーストに結合されていません`);
    assert.equal(access.measurementBasis, "map_route_checked");
    assert.equal(access.transferCount, 0);
    assert.equal(access.travelTimeLabel, undefined);
    assert.ok(access.reviewState.includes("verified_with_caveat"));
    assert.ok(access.reviewState.includes("venue_pdf_visual_review"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  assert.ok(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "jr-east-hotel-mets-shibuya")
      ?.amenities.some((item) => item.key === "desk"),
  );
  assert.equal(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "hotel-graphy-shibuya")
      ?.amenities.some((item) => item.key === "desk"),
    false,
  );
  assert.equal(
    dataset.hotels.filter((hotel) =>
      hotel.venueAccess.some((access) => access.venueId === "venue-bellesalle-shibuya-first"),
    ).length,
    2,
  );
  for (const hotelId of ["route-inn-grand-nagoya-fujigaoka-ekimae", "ab-hotel-nagoya-sakae"]) {
    const hotel = dataset.hotels.find((entry) => entry.hotelId === hotelId);
    assert.ok(hotel, `${hotelId} が公開Datasetにありません`);
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-aichi-medical-main-building",
    );
    assert.ok(access, `${hotelId} が愛知医科大学1号館に結合されていません`);
    assert.equal(access.measurementBasis, "route_only");
    assert.ok(access.reviewState.includes("verified_with_caveat"));
    assert.ok(access.reviewState.includes("venue_pdf_visual_review"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  assert.equal(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "route-inn-grand-nagoya-fujigaoka-ekimae")
      ?.amenities.some((item) => item.key === "desk"),
    false,
  );
  assert.ok(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "ab-hotel-nagoya-sakae")
      ?.amenities.some((item) => item.key === "desk"),
  );
  assert.equal(
    dataset.hotels.filter((hotel) =>
      hotel.venueAccess.some((access) => access.venueId === "venue-aichi-medical-main-building"),
    ).length,
    2,
  );
  const aichiGeneralSecondVenue = dataset.assignments.find(
    (assignment) => assignment.assignmentId === "aichi-medical--general--general--second-venue",
  );
  assert.deepEqual(aichiGeneralSecondVenue?.conditions, [
    "fixed",
    "applicant_preference",
    "university_assigned",
  ]);
  const aichiRegionalSecondVenue = dataset.assignments.find(
    (assignment) => assignment.assignmentId === "aichi-medical--common--common-test-regional-quota--second-venue",
  );
  assert.deepEqual(aichiRegionalSecondVenue?.conditions, ["fixed"]);
  for (const hotelId of ["vessel-inn-takadanobaba-ekimae", "hotel-new-takada"]) {
    const hotel = dataset.hotels.find((entry) => entry.hotelId === hotelId);
    assert.ok(hotel, `${hotelId} が公開Datasetにありません`);
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-bellesalle-takadanobaba",
    );
    assert.ok(access, `${hotelId} がベルサール高田馬場に結合されていません`);
    assert.equal(access.measurementBasis, "map_route_checked");
    assert.equal(access.transferCount, 0);
    assert.equal(access.travelTimeLabel, undefined);
    assert.ok(access.reviewState.includes("verified_with_caveat"));
    assert.ok(access.reviewState.includes("venue_pdf_visual_review"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
    assert.equal(hotel.amenities.some((item) => item.key === "desk"), false);
  }
  assert.ok(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "vessel-inn-takadanobaba-ekimae")
      ?.amenities.some((item) => item.key === "coin_laundry"),
  );
  assert.equal(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "hotel-new-takada")
      ?.amenities.some((item) => item.key === "coin_laundry"),
    false,
  );
  assert.equal(
    dataset.hotels.filter((hotel) =>
      hotel.venueAccess.some((access) => access.venueId === "venue-bellesalle-takadanobaba"),
    ).length,
    2,
  );
  const aichiGeneralFirstVenue = dataset.assignments.find(
    (assignment) => assignment.assignmentId === "aichi-medical--general--general--first-venue",
  );
  assert.deepEqual(aichiGeneralFirstVenue?.conditions, ["applicant_preference"]);
  for (const hotelId of ["hotel-hankyu-respire-osaka", "hotel-binario-umeda"]) {
    const hotel = dataset.hotels.find((entry) => entry.hotelId === hotelId);
    assert.ok(hotel, `${hotelId} が公開Datasetにありません`);
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-congres-convention-center",
    );
    assert.ok(access, `${hotelId} がコングレコンベンションセンターに結合されていません`);
    assert.equal(access.transferCount, 0);
    assert.ok(access.reviewState.includes("verified_with_caveat"));
    assert.ok(access.reviewState.includes("venue_pdf_visual_review"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  const respireOsaka = dataset.hotels.find(
    (hotel) => hotel.hotelId === "hotel-hankyu-respire-osaka",
  );
  assert.equal(respireOsaka?.venueAccess[0]?.measurementBasis, "map_route_checked");
  assert.equal(respireOsaka?.amenities.some((item) => item.key === "desk"), false);
  const binarioUmeda = dataset.hotels.find((hotel) => hotel.hotelId === "hotel-binario-umeda");
  assert.equal(binarioUmeda?.venueAccess[0]?.measurementBasis, "route_only");
  assert.ok(binarioUmeda?.amenities.some((item) => item.key === "desk"));
  assert.equal(
    dataset.hotels.filter((hotel) =>
      hotel.venueAccess.some((access) => access.venueId === "venue-congres-convention-center"),
    ).length,
    2,
  );
  for (const hotelId of ["daiwa-roynet-hotel-hakata-gion", "skyheart-hotel-hakata"]) {
    const hotel = dataset.hotels.find((entry) => entry.hotelId === hotelId);
    assert.ok(hotel, `${hotelId} が公開Datasetにありません`);
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-fukuoka-fashion-building",
    );
    assert.ok(access, `${hotelId} が福岡ファッションビルに結合されていません`);
    assert.equal(access.transferCount, 0);
    assert.equal(access.measurementBasis, "route_only");
    assert.ok(access.reviewState.includes("verified_with_caveat"));
    assert.ok(access.reviewState.includes("venue_pdf_visual_review"));
    assert.ok(hotel.amenities.some((item) => item.key === "desk"));
    assert.ok(hotel.amenities.some((item) => item.key === "coin_laundry"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  const fashionBuildingHotels = dataset.hotels.filter((hotel) =>
    hotel.venueAccess.some((access) => access.venueId === "venue-fukuoka-fashion-building"),
  );
  assert.deepEqual(
    fashionBuildingHotels.map((hotel) => hotel.name),
    ["ダイワロイネットホテル博多祇園", "スカイハートホテル博多"],
  );
  const jichiMedicalHotels = dataset.hotels.filter((hotel) =>
    hotel.venueAccess.some(
      (access) => access.venueId === "venue-jichi-medical-yakushiji-campus",
    ),
  );
  assert.deepEqual(
    jichiMedicalHotels.map((hotel) => hotel.name),
    ["東横INN小山駅東口2", "ホテルサンロイヤル小山"],
  );
  for (const hotel of jichiMedicalHotels) {
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-jichi-medical-yakushiji-campus",
    );
    assert.equal(access?.measurementBasis, "route_only");
    assert.equal(access?.transferCount, 0);
    assert.ok(access?.reviewState.includes("verified_with_caveat"));
    assert.ok(access?.reviewState.includes("venue_pdf_visual_review"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  const iuhwNaritaHotels = dataset.hotels.filter((hotel) =>
    hotel.venueAccess.some((access) => access.venueId === "venue-iuhw-narita-campus"),
  );
  assert.deepEqual(
    iuhwNaritaHotels.map((hotel) => hotel.name),
    ["コンフォートホテル成田", "ミートイン成田"],
  );
  for (const hotel of iuhwNaritaHotels) {
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-iuhw-narita-campus",
    );
    assert.equal(access?.measurementBasis, "route_only");
    assert.equal(access?.transferCount, 0);
    assert.ok(access?.reviewState.includes("verified_with_caveat"));
    assert.ok(access?.reviewState.includes("venue_pdf_visual_review"));
    assert.ok(hotel.amenities.some((item) => item.key === "desk"));
    assert.ok(hotel.amenities.some((item) => item.key === "coin_laundry"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  const iuhwAkasakaHotels = dataset.hotels.filter((hotel) =>
    hotel.venueAccess.some(
      (access) => access.venueId === "venue-iuhw-tokyo-akasaka-campus",
    ),
  );
  assert.deepEqual(
    iuhwAkasakaHotels.map((hotel) => hotel.name),
    ["the b 赤坂見附", "変なホテル東京 赤坂"],
  );
  for (const hotel of iuhwAkasakaHotels) {
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-iuhw-tokyo-akasaka-campus",
    );
    assert.equal(access?.measurementBasis, "route_only");
    assert.equal(access?.transferCount, 0);
    assert.deepEqual(access?.modes, ["walk"]);
    assert.ok(access?.reviewState.includes("verified_with_caveat"));
    assert.ok(access?.reviewState.includes("venue_pdf_visual_review"));
    assert.ok(hotel.amenities.some((item) => item.key === "desk"));
    assert.ok(hotel.amenities.some((item) => item.key === "coin_laundry"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  const iuhwFukuokaHotels = dataset.hotels.filter((hotel) =>
    hotel.venueAccess.some(
      (access) => access.venueId === "venue-iuhw-graduate-school-fukuoka-campus",
    ),
  );
  assert.deepEqual(
    iuhwFukuokaHotels.map((hotel) => hotel.name),
    ["シーサイドホテルツインズももち", "平和台ホテル5"],
  );
  for (const hotel of iuhwFukuokaHotels) {
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-iuhw-graduate-school-fukuoka-campus",
    );
    assert.equal(access?.measurementBasis, "route_only");
    assert.equal(access?.transferCount, 0);
    assert.ok(access?.reviewState.includes("verified_with_caveat"));
    assert.ok(access?.reviewState.includes("venue_pdf_visual_review"));
    assert.ok(hotel.amenities.some((item) => item.key === "coin_laundry"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  const fujitaToyoakeHotels = dataset.hotels.filter((hotel) =>
    hotel.venueAccess.some(
      (access) => access.venueId === "venue-fujita-health-toyoake-campus",
    ),
  );
  assert.deepEqual(
    fujitaToyoakeHotels.map((hotel) => hotel.name),
    ["コンフォートホテル名古屋金山", "ホテルいずみ"],
  );
  for (const hotel of fujitaToyoakeHotels) {
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-fujita-health-toyoake-campus",
    );
    assert.equal(access?.measurementBasis, "route_only");
    assert.ok(access?.reviewState.includes("verified_with_caveat"));
    assert.ok(access?.reviewState.includes("venue_pdf_visual_review"));
    assert.ok(hotel.amenities.some((item) => item.key === "wifi"));
    assert.ok(hotel.amenities.some((item) => item.key === "coin_laundry"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  assert.equal(
    fujitaToyoakeHotels.find((hotel) => hotel.hotelId === "comfort-hotel-nagoya-kanayama")
      ?.venueAccess[0]?.transferCount,
    1,
  );
  assert.equal(
    fujitaToyoakeHotels.find((hotel) => hotel.hotelId === "hotel-izumi-toyoake")
      ?.venueAccess[0]?.transferCount,
    0,
  );
  const fukuokaUniversityHotels = dataset.hotels.filter((hotel) =>
    hotel.venueAccess.some(
      (access) => access.venueId === "venue-fukuoka-university-nanakuma-campus",
    ),
  );
  assert.deepEqual(
    fukuokaUniversityHotels.map((hotel) => hotel.name),
    ["コンフォートイン福岡天神", "ホテルニューガイア薬院"],
  );
  for (const hotel of fukuokaUniversityHotels) {
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-fukuoka-university-nanakuma-campus",
    );
    assert.equal(access?.measurementBasis, "route_only");
    assert.equal(access?.transferCount, 0);
    assert.ok(access?.reviewState.includes("verified_with_caveat"));
    assert.ok(access?.reviewState.includes("venue_pdf_visual_review"));
    assert.ok(hotel.amenities.some((item) => item.key === "wifi"));
    assert.ok(hotel.amenities.some((item) => item.key === "coin_laundry"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  const showaHatanodaiHotels = dataset.hotels.filter((hotel) =>
    hotel.venueAccess.some(
      (access) => access.venueId === "venue-showa-medical-hatanodai-campus",
    ),
  );
  assert.deepEqual(
    showaHatanodaiHotels.map((hotel) => hotel.name),
    ["東横INN品川旗の台駅南口", "アワーズイン阪急"],
  );
  const toyokoHatanodai = showaHatanodaiHotels.find(
    (hotel) => hotel.hotelId === "toyoko-inn-shinagawa-hatanodai-eki-minami-guchi",
  );
  const oursInnHankyu = showaHatanodaiHotels.find(
    (hotel) => hotel.hotelId === "ours-inn-hankyu",
  );
  assert.equal(toyokoHatanodai?.venueAccess[0]?.measurementBasis, "map_route_checked");
  assert.deepEqual(toyokoHatanodai?.venueAccess[0]?.modes, ["walk"]);
  assert.equal(oursInnHankyu?.venueAccess[0]?.measurementBasis, "route_only");
  assert.deepEqual(oursInnHankyu?.venueAccess[0]?.modes, ["walk", "rail"]);
  for (const hotel of showaHatanodaiHotels) {
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-showa-medical-hatanodai-campus",
    );
    assert.equal(access?.transferCount, 0);
    assert.ok(access?.reviewState.includes("verified_with_caveat"));
    assert.ok(access?.reviewState.includes("venue_pdf_visual_review"));
    assert.ok(hotel.amenities.some((item) => item.key === "wifi"));
    assert.ok(hotel.amenities.some((item) => item.key === "coin_laundry"));
    assert.ok(hotel.amenities.some((item) => item.key === "breakfast"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  const bellesalleShinjukuHotels = dataset.hotels.filter((hotel) =>
    hotel.venueAccess.some(
      (access) => access.venueId === "venue-bellesalle-shinjuku-grand",
    ),
  );
  assert.deepEqual(
    bellesalleShinjukuHotels.map((hotel) => hotel.name),
    ["ホテルローズガーデン新宿", "ダイワロイネットホテル西新宿 PREMIER"],
  );
  const daiwaNishiShinjuku = bellesalleShinjukuHotels.find(
    (hotel) => hotel.hotelId === "daiwa-roynet-hotel-nishi-shinjuku-premier",
  );
  const roseGardenShinjuku = bellesalleShinjukuHotels.find(
    (hotel) => hotel.hotelId === "hotel-rose-garden-shinjuku",
  );
  assert.equal(daiwaNishiShinjuku?.venueAccess[0]?.measurementBasis, "map_route_checked");
  assert.equal(roseGardenShinjuku?.venueAccess[0]?.measurementBasis, "route_only");
  for (const hotel of bellesalleShinjukuHotels) {
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-bellesalle-shinjuku-grand",
    );
    assert.deepEqual(access?.modes, ["walk"]);
    assert.equal(access?.transferCount, 0);
    assert.ok(access?.reviewState.includes("verified_with_caveat"));
    assert.ok(access?.reviewState.includes("venue_pdf_visual_review"));
    assert.ok(hotel.amenities.some((item) => item.key === "wifi"));
    assert.ok(hotel.amenities.some((item) => item.key === "coin_laundry"));
    assert.ok(hotel.amenities.some((item) => item.key === "breakfast"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  const jikeiNishishimbashiHotels = dataset.hotels.filter((hotel) =>
    hotel.venueAccess.some(
      (access) => access.venueId === "venue-jikei-nishishimbashi-campus",
    ),
  );
  assert.deepEqual(
    jikeiNishishimbashiHotels.map((hotel) => hotel.name),
    ["KOKO HOTEL 新橋御成門", "リッチモンドホテル東京芝"],
  );
  for (const hotel of jikeiNishishimbashiHotels) {
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-jikei-nishishimbashi-campus",
    );
    assert.deepEqual(access?.modes, ["walk"]);
    assert.equal(access?.transferCount, 0);
    assert.equal(access?.measurementBasis, "route_only");
    assert.ok(access?.reviewState.includes("verified_with_caveat"));
    assert.ok(access?.reviewState.includes("venue_pdf_visual_review"));
    assert.ok(hotel.amenities.some((item) => item.key === "wifi"));
    assert.ok(hotel.amenities.some((item) => item.key === "coin_laundry"));
    assert.ok(hotel.amenities.some((item) => item.key === "breakfast"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  assert.ok(
    jikeiNishishimbashiHotels
      .find((hotel) => hotel.hotelId === "richmond-hotel-tokyo-shiba")
      ?.amenities.some((item) => item.key === "desk"),
  );
  const twmuYayoiHotels = dataset.hotels.filter((hotel) =>
    hotel.venueAccess.some(
      (access) => access.venueId === "venue-twmu-yayoi-memorial-education-building",
    ),
  );
  assert.deepEqual(
    twmuYayoiHotels.map((hotel) => hotel.name),
    ["パールホテル新宿曙橋", "相鉄フレッサイン 東新宿駅前"],
  );
  const pearlAkebonobashi = twmuYayoiHotels.find(
    (hotel) => hotel.hotelId === "pearl-hotel-shinjuku-akebonobashi",
  );
  const sotetsuHigashiShinjuku = twmuYayoiHotels.find(
    (hotel) => hotel.hotelId === "sotetsu-fresa-inn-higashi-shinjuku",
  );
  assert.deepEqual(pearlAkebonobashi?.venueAccess[0]?.modes, ["walk"]);
  assert.deepEqual(sotetsuHigashiShinjuku?.venueAccess[0]?.modes, ["walk", "rail"]);
  for (const hotel of twmuYayoiHotels) {
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-twmu-yayoi-memorial-education-building",
    );
    assert.equal(access?.transferCount, 0);
    assert.equal(access?.measurementBasis, "route_only");
    assert.ok(access?.reviewState.includes("verified_with_caveat"));
    assert.ok(access?.reviewState.includes("venue_pdf_visual_review"));
    assert.ok(hotel.amenities.some((item) => item.key === "wifi"));
    assert.ok(hotel.amenities.some((item) => item.key === "coin_laundry"));
    assert.ok(hotel.amenities.some((item) => item.key === "breakfast"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  const tohoOmoriHotels = dataset.hotels.filter((hotel) =>
    hotel.venueAccess.some((access) => access.venueId === "venue-toho-omori-campus"),
  );
  assert.deepEqual(
    tohoOmoriHotels.map((hotel) => hotel.name),
    ["京急 EXイン 京急蒲田駅前", "グランパークホテル パネックス東京"],
  );
  const keikyuExInnKamata = tohoOmoriHotels.find(
    (hotel) => hotel.hotelId === "keikyu-ex-inn-keikyu-kamata-ekimae",
  );
  const grandParkPanexTokyo = tohoOmoriHotels.find(
    (hotel) => hotel.hotelId === "grand-park-hotel-panex-tokyo",
  );
  assert.deepEqual(keikyuExInnKamata?.venueAccess[0]?.modes, ["walk", "rail"]);
  assert.deepEqual(grandParkPanexTokyo?.venueAccess[0]?.modes, ["walk", "bus"]);
  for (const hotel of tohoOmoriHotels) {
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-toho-omori-campus",
    );
    assert.equal(access?.transferCount, 0);
    assert.equal(access?.measurementBasis, "route_only");
    assert.ok(access?.reviewState.includes("verified_with_caveat"));
    assert.ok(hotel.amenities.some((item) => item.key === "wifi"));
    assert.ok(hotel.amenities.some((item) => item.key === "desk"));
    assert.ok(hotel.amenities.some((item) => item.key === "coin_laundry"));
    assert.ok(hotel.amenities.some((item) => item.key === "breakfast"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  const nihonMedicalHotels = dataset.hotels.filter((hotel) =>
    hotel.venueAccess.some(
      (access) => access.venueId === "venue-nihon-medical-school-building",
    ),
  );
  assert.deepEqual(
    nihonMedicalHotels.map((hotel) => hotel.name),
    ["the b 池袋", "ホテルニュースター池袋"],
  );
  const theBIkebukuro = nihonMedicalHotels.find(
    (hotel) => hotel.hotelId === "the-b-ikebukuro",
  );
  const hotelNewStar = nihonMedicalHotels.find(
    (hotel) => hotel.hotelId === "hotel-new-star-ikebukuro",
  );
  assert.deepEqual(theBIkebukuro?.venueAccess[0]?.modes, ["walk", "rail"]);
  assert.deepEqual(hotelNewStar?.venueAccess[0]?.modes, ["walk", "bus"]);
  for (const hotel of nihonMedicalHotels) {
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-nihon-medical-school-building",
    );
    assert.equal(access?.transferCount, 0);
    assert.equal(access?.measurementBasis, "route_only");
    assert.ok(access?.reviewState.includes("verified_with_caveat"));
    assert.ok(hotel.amenities.some((item) => item.key === "wifi"));
    assert.ok(hotel.amenities.some((item) => item.key === "desk"));
    assert.ok(hotel.amenities.some((item) => item.key === "coin_laundry"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  assert.ok(theBIkebukuro?.amenities.some((item) => item.key === "breakfast"));
  assert.equal(hotelNewStar?.amenities.some((item) => item.key === "breakfast"), false);
  const tkpNagoyaVenue = dataset.venues.find(
    (venue) => venue.venueId === "venue-tkp-premium-nagoya-ekimae",
  );
  assert.equal(tkpNagoyaVenue?.reviewState, "monitoring");
  assert.match(tkpNagoyaVenue?.accessNote ?? "", /ルーセントタワー/u);
  const kanazawaEarlyFirst = dataset.assignments.find(
    (assignment) =>
      assignment.assignmentId === "kanazawa-medical--general--general-early--first-venue",
  );
  assert.equal(kanazawaEarlyFirst?.publicationState, "confirmed");
  assert.equal(kanazawaEarlyFirst?.reviewState, "monitoring");
  assert.ok(kanazawaEarlyFirst?.conditions.includes("admission_ticket"));
  assert.match(kanazawaEarlyFirst?.note ?? "", /名古屋ルーセントタワー/u);
  const tkpNagoyaHotels = dataset.hotels.filter((hotel) =>
    hotel.venueAccess.some(
      (access) => access.venueId === "venue-tkp-premium-nagoya-ekimae",
    ),
  );
  assert.deepEqual(
    tkpNagoyaHotels.map((hotel) => hotel.name),
    ["コンフォートホテル名古屋新幹線口", "名鉄イン名古屋桜通"],
  );
  for (const hotel of tkpNagoyaHotels) {
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-tkp-premium-nagoya-ekimae",
    );
    assert.deepEqual(access?.modes, ["walk"]);
    assert.equal(access?.transferCount, 0);
    assert.equal(access?.measurementBasis, "route_only");
    assert.ok(access?.reviewState.includes("verified_with_caveat"));
    assert.match(access?.caution ?? "", /ルーセントタワー/u);
    assert.ok(hotel.amenities.some((item) => item.key === "wifi"));
    assert.ok(hotel.amenities.some((item) => item.key === "coin_laundry"));
    assert.ok(hotel.amenities.some((item) => item.key === "breakfast"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  assert.ok(
    tkpNagoyaHotels
      .find((hotel) => hotel.hotelId === "comfort-hotel-nagoya-shinkansenguchi")
      ?.amenities.some((item) => item.key === "desk"),
  );
  const meitetsuSakuradori = tkpNagoyaHotels.find(
    (hotel) => hotel.hotelId === "meitetsu-inn-nagoya-sakuradori",
  );
  assert.ok(meitetsuSakuradori?.amenities.some((item) => item.key === "desk_lamp"));
  assert.equal(meitetsuSakuradori?.amenities.some((item) => item.key === "desk"), false);
  const tokyoRyutsuCenterVenue = dataset.venues.find(
    (venue) => venue.venueId === "venue-tokyo-ryutsu-center-center-building",
  );
  assert.match(tokyoRyutsuCenterVenue?.accessNote ?? "", /流通センター駅から徒歩1分/u);
  const tokyoRyutsuCenterHotels = dataset.hotels.filter((hotel) =>
    hotel.venueAccess.some(
      (access) => access.venueId === "venue-tokyo-ryutsu-center-center-building",
    ),
  );
  assert.deepEqual(
    tokyoRyutsuCenterHotels.map((hotel) => hotel.name),
    ["リッチモンドホテル東京芝", "相鉄フレッサイン 浜松町大門"],
  );
  for (const hotel of tokyoRyutsuCenterHotels) {
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-tokyo-ryutsu-center-center-building",
    );
    assert.deepEqual(access?.modes, ["walk", "rail"]);
    assert.equal(access?.transferCount, 0);
    assert.equal(access?.measurementBasis, "route_only");
    assert.ok(access?.reviewState.includes("verified_with_caveat"));
    assert.ok(hotel.amenities.some((item) => item.key === "wifi"));
    assert.ok(hotel.amenities.some((item) => item.key === "desk"));
    assert.ok(hotel.amenities.some((item) => item.key === "coin_laundry"));
    assert.ok(hotel.amenities.some((item) => item.key === "breakfast"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  const temmaTrainingCenterVenue = dataset.venues.find(
    (venue) => venue.venueId === "venue-temma-training-center",
  );
  assert.match(temmaTrainingCenterVenue?.accessNote ?? "", /天満駅から徒歩約2分/u);
  const temmaTrainingCenterAssignment = dataset.assignments.find(
    (assignment) =>
      assignment.assignmentId === "kanazawa-medical--general--general-late--first-venue",
  );
  assert.equal(temmaTrainingCenterAssignment?.publicationState, "confirmed");
  assert.ok(temmaTrainingCenterAssignment?.conditions.includes("applicant_preference"));
  const temmaTrainingCenterHotels = dataset.hotels.filter((hotel) =>
    hotel.venueAccess.some((access) => access.venueId === "venue-temma-training-center"),
  );
  assert.deepEqual(
    temmaTrainingCenterHotels.map((hotel) => hotel.name),
    ["SAKURA GARDEN HOTEL", "ホテルビナリオ梅田"],
  );
  for (const hotel of temmaTrainingCenterHotels) {
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-temma-training-center",
    );
    assert.deepEqual(access?.modes, ["walk", "rail"]);
    assert.equal(access?.transferCount, 0);
    assert.equal(access?.measurementBasis, "route_only");
    assert.ok(access?.reviewState.includes("verified_with_caveat"));
    assert.ok(hotel.amenities.some((item) => item.key === "wifi"));
    assert.ok(hotel.amenities.some((item) => item.key === "coin_laundry"));
    assert.ok(hotel.amenities.some((item) => item.key === "breakfast"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  assert.equal(
    temmaTrainingCenterHotels
      .find((hotel) => hotel.hotelId === "sakura-garden-hotel")
      ?.amenities.some((item) => item.key === "desk"),
    false,
  );
  assert.ok(
    temmaTrainingCenterHotels
      .find((hotel) => hotel.hotelId === "hotel-binario-umeda")
      ?.amenities.some((item) => item.key === "desk"),
  );
  assert.ok(
    dataset.hotels
      .find((hotel) => hotel.hotelId === "sakura-garden-hotel")
      ?.venueAccess[0]?.reviewState.includes("verified_with_caveat"),
  );
  const ompuTakatsukiVenue = dataset.venues.find(
    (venue) => venue.venueId === "venue-osaka-med-pharm-takatsuki-campus",
  );
  assert.match(ompuTakatsukiVenue?.accessNote ?? "", /出口1/u);
  assert.match(ompuTakatsukiVenue?.accessNote ?? "", /受験生入口/u);
  const ompuTakatsukiAssignments = dataset.assignments.filter((assignment) =>
    assignment.venueLinks.some(
      (link) => link.venueId === "venue-osaka-med-pharm-takatsuki-campus",
    ),
  );
  assert.equal(ompuTakatsukiAssignments.length, 3);
  assert.ok(ompuTakatsukiAssignments.every((assignment) => assignment.publicationState === "confirmed"));
  assert.ok(ompuTakatsukiAssignments.every((assignment) => assignment.conditions.includes("fixed")));
  const ompuTakatsukiHotels = dataset.hotels.filter((hotel) =>
    hotel.venueAccess.some(
      (access) => access.venueId === "venue-osaka-med-pharm-takatsuki-campus",
    ),
  );
  assert.deepEqual(
    ompuTakatsukiHotels.map((hotel) => hotel.name),
    ["ホテルトレンド高槻", "ワークホテルアネックス 高槻天然温泉 天神の湯"],
  );
  for (const hotel of ompuTakatsukiHotels) {
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-osaka-med-pharm-takatsuki-campus",
    );
    assert.deepEqual(access?.modes, ["walk"]);
    assert.equal(access?.transferCount, 0);
    assert.equal(access?.measurementBasis, "route_only");
    assert.ok(access?.reviewState.includes("verified_with_caveat"));
    assert.ok(hotel.amenities.some((item) => item.key === "wifi"));
    assert.ok(hotel.amenities.some((item) => item.key === "coin_laundry"));
    assert.ok(hotel.amenities.some((item) => item.key === "breakfast"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  assert.ok(
    ompuTakatsukiHotels
      .find((hotel) => hotel.hotelId === "hotel-trend-takatsuki")
      ?.amenities.some((item) => item.key === "desk"),
  );
  assert.equal(
    ompuTakatsukiHotels
      .find((hotel) => hotel.hotelId === "work-hotel-annex-takatsuki")
      ?.amenities.some((item) => item.key === "desk"),
    false,
  );
  const tkpShimbashiVenue = dataset.venues.find(
    (venue) => venue.venueId === "venue-tkp-shimbashi-conference-center",
  );
  assert.match(tkpShimbashiVenue?.accessNote ?? "", /2027年度一般選抜A/u);
  assert.match(tkpShimbashiVenue?.accessNote ?? "", /8:45/u);
  assert.match(tkpShimbashiVenue?.accessNote ?? "", /当日通知/u);
  const tkpShimbashiAssignments = dataset.assignments.filter((assignment) =>
    assignment.venueLinks.some(
      (link) => link.venueId === "venue-tkp-shimbashi-conference-center",
    ),
  );
  assert.equal(tkpShimbashiAssignments.length, 2);
  assert.ok(
    tkpShimbashiAssignments.every(
      (assignment) =>
        assignment.publicationState === "confirmed" &&
        assignment.conditions.includes("applicant_preference") &&
        assignment.conditions.includes("capacity_overflow"),
    ),
  );
  const tkpShimbashiHotels = dataset.hotels.filter((hotel) =>
    hotel.venueAccess.some(
      (access) => access.venueId === "venue-tkp-shimbashi-conference-center",
    ),
  );
  assert.deepEqual(
    tkpShimbashiHotels.map((hotel) => hotel.name),
    ["ホテルチェックイン新橋", "ダイワロイネットホテル新橋"],
  );
  for (const hotel of tkpShimbashiHotels) {
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-tkp-shimbashi-conference-center",
    );
    assert.deepEqual(access?.modes, ["walk"]);
    assert.equal(access?.transferCount, 0);
    assert.equal(access?.measurementBasis, "route_only");
    assert.ok(access?.reviewState.includes("verified_with_caveat"));
    assert.match(access?.caution ?? "", /8:45/u);
    assert.ok(hotel.amenities.some((item) => item.key === "wifi"));
    assert.ok(hotel.amenities.some((item) => item.key === "coin_laundry"));
    assert.ok(hotel.amenities.some((item) => item.key === "breakfast"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  assert.ok(
    tkpShimbashiHotels
      .find((hotel) => hotel.hotelId === "daiwa-roynet-hotel-shimbashi")
      ?.amenities.some((item) => item.key === "desk"),
  );
  assert.equal(
    tkpShimbashiHotels
      .find((hotel) => hotel.hotelId === "hotel-check-in-shimbashi")
      ?.amenities.some((item) => item.key === "desk"),
    false,
  );
  const kawasakiGeneralGymVenue = dataset.venues.find(
    (venue) => venue.venueId === "venue-kawasaki-medical-general-gymnasium",
  );
  assert.match(kawasakiGeneralGymVenue?.name ?? "", /総合体育館等/u);
  assert.match(kawasakiGeneralGymVenue?.accessNote ?? "", /2月1日/u);
  assert.match(kawasakiGeneralGymVenue?.accessNote ?? "", /自家用車・タクシー・バス/u);
  assert.match(kawasakiGeneralGymVenue?.accessNote ?? "", /使用施設/u);
  const kawasakiGeneralGymAssignments = dataset.assignments.filter((assignment) =>
    assignment.venueLinks.some(
      (link) => link.venueId === "venue-kawasaki-medical-general-gymnasium",
    ),
  );
  assert.equal(kawasakiGeneralGymAssignments.length, 1);
  assert.equal(kawasakiGeneralGymAssignments[0]?.publicationState, "confirmed");
  assert.ok(kawasakiGeneralGymAssignments[0]?.conditions.includes("fixed"));
  const kawasakiGeneralGymHotels = dataset.hotels.filter((hotel) =>
    hotel.venueAccess.some(
      (access) => access.venueId === "venue-kawasaki-medical-general-gymnasium",
    ),
  );
  assert.deepEqual(
    kawasakiGeneralGymHotels.map((hotel) => hotel.name),
    ["ベッセルホテル倉敷", "グリーンリッチホテル倉敷駅前"],
  );
  for (const hotel of kawasakiGeneralGymHotels) {
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-kawasaki-medical-general-gymnasium",
    );
    assert.equal(access?.transferCount, 0);
    assert.ok(access?.reviewState.includes("verified_with_caveat"));
    assert.equal(access?.reviewState.includes("venue_pdf_visual_review"), false);
    assert.match(access?.caution ?? "", /総合体育館等/u);
    assert.match(access?.caution ?? "", /乗り入れ/u);
    assert.ok(hotel.amenities.some((item) => item.key === "wifi"));
    assert.ok(hotel.amenities.some((item) => item.key === "coin_laundry"));
    assert.ok(hotel.amenities.some((item) => item.key === "breakfast"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  const vesselKurashiki = kawasakiGeneralGymHotels.find(
    (hotel) => hotel.hotelId === "vessel-hotel-kurashiki",
  );
  assert.deepEqual(vesselKurashiki?.venueAccess[0]?.modes, ["walk"]);
  assert.equal(vesselKurashiki?.venueAccess[0]?.measurementBasis, "map_route_checked");
  assert.ok(vesselKurashiki?.amenities.some((item) => item.key === "desk"));
  const greenRichKurashiki = kawasakiGeneralGymHotels.find(
    (hotel) => hotel.hotelId === "green-rich-hotel-kurashiki-ekimae",
  );
  assert.deepEqual(greenRichKurashiki?.venueAccess[0]?.modes, ["walk", "rail"]);
  assert.equal(greenRichKurashiki?.venueAccess[0]?.measurementBasis, "route_only");
  assert.equal(greenRichKurashiki?.amenities.some((item) => item.key === "desk"), false);
  const kawasakiSchoolBuildingVenue = dataset.venues.find(
    (venue) => venue.venueId === "venue-kawasaki-medical-school-building",
  );
  assert.match(kawasakiSchoolBuildingVenue?.accessNote ?? "", /2月10日・11日/u);
  assert.match(kawasakiSchoolBuildingVenue?.accessNote ?? "", /大学が指定/u);
  assert.match(kawasakiSchoolBuildingVenue?.accessNote ?? "", /附属病院玄関/u);
  const kawasakiSchoolBuildingAssignments = dataset.assignments.filter((assignment) =>
    assignment.venueLinks.some(
      (link) => link.venueId === "venue-kawasaki-medical-school-building",
    ),
  );
  assert.equal(kawasakiSchoolBuildingAssignments.length, 1);
  assert.equal(kawasakiSchoolBuildingAssignments[0]?.publicationState, "confirmed");
  assert.ok(kawasakiSchoolBuildingAssignments[0]?.conditions.includes("fixed"));
  assert.ok(kawasakiSchoolBuildingAssignments[0]?.conditions.includes("university_assigned"));
  const kawasakiSchoolBuildingHotels = dataset.hotels.filter((hotel) =>
    hotel.venueAccess.some(
      (access) => access.venueId === "venue-kawasaki-medical-school-building",
    ),
  );
  assert.deepEqual(
    kawasakiSchoolBuildingHotels.map((hotel) => hotel.name),
    ["ベッセルホテル倉敷", "グリーンリッチホテル倉敷駅前"],
  );
  for (const hotel of kawasakiSchoolBuildingHotels) {
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-kawasaki-medical-school-building",
    );
    assert.equal(access?.transferCount, 0);
    assert.ok(access?.reviewState.includes("verified_with_caveat"));
    assert.equal(access?.reviewState.includes("venue_pdf_visual_review"), false);
    assert.match(access?.caution ?? "", /大学指定/u);
    assert.match(access?.caution ?? "", /附属病院玄関/u);
  }
  assert.equal(
    kawasakiSchoolBuildingHotels
      .find((hotel) => hotel.hotelId === "vessel-hotel-kurashiki")
      ?.venueAccess.find((access) => access.venueId === "venue-kawasaki-medical-school-building")
      ?.measurementBasis,
    "map_route_checked",
  );
  assert.equal(
    kawasakiSchoolBuildingHotels
      .find((hotel) => hotel.hotelId === "green-rich-hotel-kurashiki-ekimae")
      ?.venueAccess.find((access) => access.venueId === "venue-kawasaki-medical-school-building")
      ?.measurementBasis,
    "route_only",
  );
  const jichiHokkaidoWrittenVenue = dataset.venues.find(
    (venue) => venue.venueId === "venue-jichi-first-hokkaido-tkp-sapporo-kita3jo",
  );
  assert.equal(
    jichiHokkaidoWrittenVenue?.officialUrl,
    "https://www.kashikaigishitsu.net/facilitys/cc-sapporo/access/",
  );
  assert.match(jichiHokkaidoWrittenVenue?.address ?? "", /札幌小暮ビル6〜7階/u);
  assert.match(jichiHokkaidoWrittenVenue?.accessNote ?? "", /1月25日/u);
  assert.match(jichiHokkaidoWrittenVenue?.accessNote ?? "", /8:20〜8:40/u);
  assert.match(jichiHokkaidoWrittenVenue?.accessNote ?? "", /かでる2・7/u);
  const jichiHokkaidoWrittenLinks = dataset.assignments.flatMap((assignment) =>
    assignment.venueLinks.filter(
      (link) => link.venueId === "venue-jichi-first-hokkaido-tkp-sapporo-kita3jo",
    ),
  );
  assert.equal(jichiHokkaidoWrittenLinks.length, 1);
  assert.equal(jichiHokkaidoWrittenLinks[0]?.applicantPrefecture, "北海道");
  assert.equal(jichiHokkaidoWrittenLinks[0]?.examPart, "written");
  assert.equal(jichiHokkaidoWrittenLinks[0]?.examDate, "2027-01-25");
  const jichiHokkaidoWrittenHotels = dataset.hotels.filter((hotel) =>
    hotel.venueAccess.some(
      (access) => access.venueId === "venue-jichi-first-hokkaido-tkp-sapporo-kita3jo",
    ),
  );
  assert.deepEqual(
    jichiHokkaidoWrittenHotels.map((hotel) => hotel.name),
    ["ホテル法華クラブ札幌", "リッチモンドホテル札幌駅前"],
  );
  for (const hotel of jichiHokkaidoWrittenHotels) {
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-jichi-first-hokkaido-tkp-sapporo-kita3jo",
    );
    assert.deepEqual(access?.modes, ["walk"]);
    assert.equal(access?.transferCount, 0);
    assert.equal(access?.measurementBasis, "map_route_checked");
    assert.equal(access?.travelTimeLabel, undefined);
    assert.ok(access?.reviewState.includes("verified_with_caveat"));
    assert.equal(access?.reviewState.includes("venue_pdf_visual_review"), false);
    assert.match(access?.caution ?? "", /8:20〜8:40/u);
    assert.match(access?.caution ?? "", /かでる2・7/u);
    assert.match(access?.caution ?? "", /積雪・凍結/u);
    assert.ok(hotel.amenities.some((item) => item.key === "wifi"));
    assert.ok(hotel.amenities.some((item) => item.key === "desk"));
    assert.ok(hotel.amenities.some((item) => item.key === "coin_laundry"));
    assert.ok(hotel.amenities.some((item) => item.key === "breakfast"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  const jichiHokkaidoInterviewVenue = dataset.venues.find(
    (venue) => venue.venueId === "venue-jichi-first-hokkaido-kaderu27",
  );
  assert.equal(
    jichiHokkaidoInterviewVenue?.officialUrl,
    "https://homepage.kaderu27.or.jp/intoro/access/index.html",
  );
  assert.match(jichiHokkaidoInterviewVenue?.address ?? "", /道民活動センタービル/u);
  assert.match(jichiHokkaidoInterviewVenue?.accessNote ?? "", /1月26日/u);
  assert.match(jichiHokkaidoInterviewVenue?.accessNote ?? "", /9:00〜9:20/u);
  assert.match(jichiHokkaidoInterviewVenue?.accessNote ?? "", /個人ごとの時間/u);
  assert.match(jichiHokkaidoInterviewVenue?.accessNote ?? "", /改修休止/u);
  const jichiHokkaidoInterviewLinks = dataset.assignments.flatMap((assignment) =>
    assignment.venueLinks.filter(
      (link) => link.venueId === "venue-jichi-first-hokkaido-kaderu27",
    ),
  );
  assert.equal(jichiHokkaidoInterviewLinks.length, 1);
  assert.equal(jichiHokkaidoInterviewLinks[0]?.applicantPrefecture, "北海道");
  assert.equal(jichiHokkaidoInterviewLinks[0]?.examPart, "interview");
  assert.equal(jichiHokkaidoInterviewLinks[0]?.examDate, "2027-01-26");
  const jichiHokkaidoInterviewHotels = dataset.hotels.filter((hotel) =>
    hotel.venueAccess.some(
      (access) => access.venueId === "venue-jichi-first-hokkaido-kaderu27",
    ),
  );
  assert.deepEqual(
    jichiHokkaidoInterviewHotels.map((hotel) => hotel.name),
    ["ホテル札幌ガーデンパレス", "ホテル法華クラブ札幌"],
  );
  for (const hotel of jichiHokkaidoInterviewHotels) {
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-jichi-first-hokkaido-kaderu27",
    );
    assert.deepEqual(access?.modes, ["walk"]);
    assert.equal(access?.transferCount, 0);
    assert.equal(access?.measurementBasis, "map_route_checked");
    assert.equal(access?.travelTimeLabel, undefined);
    assert.ok(access?.reviewState.includes("verified_with_caveat"));
    assert.equal(access?.reviewState.includes("venue_pdf_visual_review"), false);
    assert.match(access?.caution ?? "", /9:00〜9:20/u);
    assert.match(access?.caution ?? "", /改修休止/u);
    assert.match(access?.caution ?? "", /積雪・凍結/u);
    assert.ok(hotel.amenities.some((item) => item.key === "wifi"));
    assert.ok(hotel.amenities.some((item) => item.key === "coin_laundry"));
    assert.ok(hotel.amenities.some((item) => item.key === "breakfast"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  const gardenPalaceSapporo = jichiHokkaidoInterviewHotels.find(
    (hotel) => hotel.hotelId === "hotel-sapporo-garden-palace",
  );
  assert.equal(gardenPalaceSapporo?.amenities.some((item) => item.key === "desk"), false);
  assert.ok(
    jichiHokkaidoInterviewHotels
      .find((hotel) => hotel.hotelId === "hotel-hokke-club-sapporo")
      ?.amenities.some((item) => item.key === "desk"),
  );
  const jichiAomoriVenue = dataset.venues.find(
    (venue) => venue.venueId === "venue-jichi-first-aomori-toonippo-news",
  );
  assert.equal(
    jichiAomoriVenue?.officialUrl,
    "https://www.atca.info/mice-facility/mice-facility-1505/",
  );
  assert.match(jichiAomoriVenue?.address ?? "", /東奥日報新町ビル3階/u);
  assert.match(jichiAomoriVenue?.accessNote ?? "", /1月25日/u);
  assert.match(jichiAomoriVenue?.accessNote ?? "", /1月26日/u);
  assert.match(jichiAomoriVenue?.accessNote ?? "", /8:20〜8:40/u);
  assert.match(jichiAomoriVenue?.accessNote ?? "", /9:00〜9:20/u);
  assert.match(jichiAomoriVenue?.accessNote ?? "", /ホールA〜E/u);
  const jichiAomoriLinks = dataset.assignments.flatMap((assignment) =>
    assignment.venueLinks.filter(
      (link) => link.venueId === "venue-jichi-first-aomori-toonippo-news",
    ),
  );
  assert.equal(jichiAomoriLinks.length, 2);
  assert.deepEqual(
    jichiAomoriLinks.map((link) => [link.applicantPrefecture, link.examPart, link.examDate]),
    [
      ["青森県", "written", "2027-01-25"],
      ["青森県", "interview", "2027-01-26"],
    ],
  );
  const jichiAomoriHotels = dataset.hotels.filter((hotel) =>
    hotel.venueAccess.some(
      (access) => access.venueId === "venue-jichi-first-aomori-toonippo-news",
    ),
  );
  assert.deepEqual(
    jichiAomoriHotels.map((hotel) => hotel.name),
    ["リッチモンドホテル青森", "ホテルセレクトイン青森"],
  );
  for (const hotel of jichiAomoriHotels) {
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-jichi-first-aomori-toonippo-news",
    );
    assert.deepEqual(access?.modes, ["walk"]);
    assert.equal(access?.transferCount, 0);
    assert.equal(access?.measurementBasis, "map_route_checked");
    assert.equal(access?.travelTimeLabel, undefined);
    assert.ok(access?.reviewState.includes("verified_with_caveat"));
    assert.equal(access?.reviewState.includes("venue_pdf_visual_review"), false);
    assert.match(access?.caution ?? "", /8:20〜8:40/u);
    assert.match(access?.caution ?? "", /9:00〜9:20/u);
    assert.match(access?.caution ?? "", /積雪・凍結/u);
    assert.ok(hotel.amenities.some((item) => item.key === "wifi"));
    assert.ok(hotel.amenities.some((item) => item.key === "coin_laundry"));
    assert.ok(hotel.amenities.some((item) => item.key === "breakfast"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  assert.ok(
    jichiAomoriHotels
      .find((hotel) => hotel.hotelId === "richmond-hotel-aomori")
      ?.amenities.some((item) => item.key === "desk"),
  );
  assert.equal(
    jichiAomoriHotels
      .find((hotel) => hotel.hotelId === "hotel-select-inn-aomori")
      ?.amenities.some((item) => item.key === "desk"),
    false,
  );
  const jichiMiyagiVenue = dataset.venues.find(
    (venue) => venue.venueId === "venue-jichi-first-miyagi-jichikaikan",
  );
  assert.equal(jichiMiyagiVenue?.officialUrl, "https://miyagi-mayors.jp/access/");
  assert.match(jichiMiyagiVenue?.address ?? "", /上杉1丁目2番3号/u);
  assert.match(jichiMiyagiVenue?.accessNote ?? "", /1月25日/u);
  assert.match(jichiMiyagiVenue?.accessNote ?? "", /1月26日/u);
  assert.match(jichiMiyagiVenue?.accessNote ?? "", /8:20〜8:40/u);
  assert.match(jichiMiyagiVenue?.accessNote ?? "", /9:00〜9:20/u);
  assert.match(jichiMiyagiVenue?.accessNote ?? "", /使用.*階.*室|階・室/u);
  const jichiMiyagiLinks = dataset.assignments.flatMap((assignment) =>
    assignment.venueLinks.filter(
      (link) => link.venueId === "venue-jichi-first-miyagi-jichikaikan",
    ),
  );
  assert.equal(jichiMiyagiLinks.length, 2);
  assert.deepEqual(
    jichiMiyagiLinks.map((link) => [link.applicantPrefecture, link.examPart, link.examDate]),
    [
      ["宮城県", "written", "2027-01-25"],
      ["宮城県", "interview", "2027-01-26"],
    ],
  );
  const jichiMiyagiHotels = dataset.hotels.filter((hotel) =>
    hotel.venueAccess.some(
      (access) => access.venueId === "venue-jichi-first-miyagi-jichikaikan",
    ),
  );
  assert.deepEqual(
    jichiMiyagiHotels.map((hotel) => hotel.name),
    ["ホテルグリーンセレク", "三井ガーデンホテル仙台"],
  );
  for (const hotel of jichiMiyagiHotels) {
    const access = hotel.venueAccess.find(
      (entry) => entry.venueId === "venue-jichi-first-miyagi-jichikaikan",
    );
    assert.deepEqual(access?.modes, ["walk"]);
    assert.equal(access?.transferCount, 0);
    assert.equal(access?.measurementBasis, "map_route_checked");
    assert.equal(access?.travelTimeLabel, undefined);
    assert.ok(access?.reviewState.includes("verified_with_caveat"));
    assert.equal(access?.reviewState.includes("venue_pdf_visual_review"), false);
    assert.match(access?.caution ?? "", /8:20〜8:40/u);
    assert.match(access?.caution ?? "", /9:00〜9:20/u);
    assert.match(access?.caution ?? "", /積雪・凍結/u);
    assert.ok(hotel.amenities.some((item) => item.key === "wifi"));
    assert.ok(hotel.amenities.some((item) => item.key === "coin_laundry"));
    assert.ok(hotel.amenities.some((item) => item.key === "breakfast"));
    assert.match(hotel.officialBookingUrl, /^https:\/\//u);
  }
  assert.equal(
    jichiMiyagiHotels
      .find((hotel) => hotel.hotelId === "hotel-green-selec-sendai")
      ?.amenities.some((item) => item.key === "desk"),
    false,
  );
  assert.ok(
    jichiMiyagiHotels
      .find((hotel) => hotel.hotelId === "mitsui-garden-hotel-sendai")
      ?.amenities.some((item) => item.key === "desk"),
  );
  assert.equal(dataset.definitions.reviewStates.verified, "公式情報と照合済み");
  assert.equal(dataset.definitions.examParts.written, "学力試験");
  assert.equal(dataset.definitions.venueLinkRoles.overflow, "定員状況等による代替会場");
  assert.ok("official_direct" in dataset.definitions.hotelAccessReviewStates);

  const fieldDefinitionKeys = dataset.fieldDefinitions.map((field) => field.key);
  assert.equal(fieldDefinitionKeys.includes("sources"), false);
  for (const relationKey of ["announcedPrefectures", "venueLinks", "reviewState"]) {
    assert.ok(fieldDefinitionKeys.includes(relationKey), `${relationKey} の公開項目定義がありません`);
  }
  for (const sourceKey of [
    "officialUrl",
    "officialUrlLabel",
    "operatingStatusEvidenceUrl",
    "officialAdmissionUrl",
    "evidenceUrls",
  ]) {
    assert.ok(fieldDefinitionKeys.includes(sourceKey), `${sourceKey} の公開項目定義がありません`);
  }
  const selectInn = dataset.hotels.find(
    (hotel) => hotel.hotelId === "hotel-select-inn-saitama-moroyama",
  );
  assert.match(selectInn?.operatingStatusEvidenceUrl ?? "", /\/news\/342\//u);
  const publicJichiFirst = dataset.assignments.find(
    (assignment) => assignment.assignmentId === "jichi-medical--general--general--first-venue",
  );
  assert.equal(publicJichiFirst?.announcedPrefectures.length, 47);
  assert.equal(publicJichiFirst?.venueLinks.length, 94);
  assert.ok(
    publicJichiFirst?.venueLinks.every(
      (link) =>
        link.applicantPrefecture && link.examPart && link.examDate && link.officialVenueText,
    ),
  );

  const serialized = JSON.stringify(dataset);
  const serializedPublicRecords = JSON.stringify({
    venues: dataset.venues,
    assignments: dataset.assignments,
    hotels: dataset.hotels,
  });
  const keys = collectKeys(dataset);
  assert.ok(
    dataset.provenance.sourceUrls.every((url) => serializedPublicRecords.includes(url)),
    "非公開レコードだけの出典URLがprovenanceへ混入しています",
  );
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
  assert.doesNotMatch(
    serialized,
    /C:\\|C:\/|\/Users\/|internal_only|project_internal|中央ナレッジDB|factとedge|(?:fact|edge):/u,
  );
});

test("canonical・JSON endpoint・sitemap・llms・配信headerが同じURLを参照する", () => {
  const canonical = new URL(privateMedicalExamVenuesHotels2027Metadata.canonicalUrl);
  const datasetUrl = new URL(privateMedicalExamVenuesHotels2027Metadata.datasetUrl);
  assert.equal(privateMedicalExamVenuesHotels2027Metadata.dateModified, "2026-08-19");
  assert.equal(privateMedicalExamVenuesHotels2027Metadata.version, "2026-08-19");
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
  assert.match(pageSource, /const datasetPath = new URL\(datasetUrl\)\.pathname/u);
  assert.match(pageSource, /href="\/private-medical-school-admissions-schedule-2027\/"/u);
  assert.match(pageSource, /聖マリアンナ医科大学 本学校舎の周辺ホテル2施設を追加/u);
  assert.match(pageSource, /産業医科大学 本学の周辺ホテル2施設を追加/u);
  assert.match(pageSource, /昭和医科大学 旗の台キャンパスの宿泊候補2施設を追加/u);
  assert.match(pageSource, /ベルサール新宿グランドの宿泊候補2施設を追加/u);
  assert.match(pageSource, /東京慈恵会医科大学 西新橋キャンパスの宿泊候補2施設を追加/u);
  assert.match(pageSource, /東京女子医科大学 彌生記念教育棟の宿泊候補2施設を追加/u);
  assert.match(pageSource, /日本大学 医学部校舎の宿泊候補2施設を追加/u);
  assert.match(pageSource, /金沢医科大学 名古屋一次会場の宿泊候補2施設を追加/u);
  assert.match(pageSource, /金沢医科大学 後期東京会場の宿泊候補2施設を追加/u);
  assert.match(pageSource, /金沢医科大学 後期大阪会場の宿泊候補2施設を追加/u);
  assert.match(pageSource, /TKP新橋カンファレンスセンターの宿泊候補2施設を追加/u);
  assert.match(pageSource, /川崎医科大学一次会場の宿泊候補2施設を追加/u);
  assert.match(pageSource, /川崎医科大学二次会場の宿泊候補2施設を追加/u);
  assert.match(pageSource, /自治医科大学 北海道学力試験会場の宿泊候補2施設を追加/u);
  assert.match(pageSource, /自治医科大学 北海道面接会場の宿泊候補2施設を追加/u);
  assert.match(switcherSource, /private-medical-school-exam-venues-hotels-2027/u);
  assert.match(endpointSource, /Content-Disposition/u);
  assert.match(endpointSource, /Access-Control-Allow-Origin/u);
  assert.match(endpointSource, /must-revalidate/u);
  assert.match(endpointSource, /rel="describedby"/u);
  assert.match(seoSource, /privateMedicalExamVenuesHotels2027Metadata/u);
  assert.match(llmsSource, /privateMedicalExamVenuesHotels2027Metadata/u);
  assert.match(headersSource, /\/data\/private-medical-exam-venues-hotels-2027\.json/u);
  assert.match(headersSource, /\/data\/private-medical-exam-venues-hotels-2027\.json[\s\S]*Access-Control-Allow-Origin: \*/u);
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
  assert.match(source, /const searchText = \[venue\.name, venue\.shortName, venue\.address\]/u);
  assert.match(source, /assignmentSearch: \[assignment\.universityName, assignment\.routeName\]/u);
  assert.match(source, /\.\.\.assignment\.announcedPrefectures/u);
  assert.match(source, /const venueOwnQueryMatches =[\s\S]*normalize\(card\.dataset\.search\)\.includes\(query\)/u);
  assert.match(source, /records\.some\(\(record\) => normalize\(record\.assignmentSearch\)\.includes\(query\)\)/u);
  assert.match(source, /const visible = matchingRecords\.length > 0/u);
  assert.match(source, /normalize\("NFKC"\)/u);
  assert.match(source, /privateMedicalExamVenueUniversitySummaries2027\.map/u);
  assert.match(source, /venue-guide-university__venue-disclosure/u);
  assert.match(source, /venueGroups\.map/u);
  assert.match(source, /const venueFilterPrefectures = \[/u);
  assert.match(source, /venueFilterPrefectures\.map/u);
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
  assert.match(cssSource, /#finder,[\s\S]*#venues,[\s\S]*#dataset,[\s\S]*scroll-margin-top:\s*82px;/u);
  assert.match(cssSource, /:where\(a, button, input, select, summary\):focus-visible/u);
  assert.match(cssSource, /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.venue-guide-page \*/u);
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
  const graph = documents.flatMap((document) => document["@graph"] ?? [document]);
  const ids = graph.map((entry) => entry?.["@id"]).filter(Boolean);
  assert.ok(unique(ids), "JSON-LDの@idが重複しています");

  const placeEntries = graph.filter((entry) => entry?.["@type"] === "Place");
  const hotelEntries = graph.filter((entry) => entry?.["@type"] === "Hotel");
  const venueList = graph.find(
    (entry) => entry?.["@id"] === `${privateMedicalExamVenuesHotels2027Metadata.canonicalUrl}#venues`,
  );
  assert.equal(venueList?.numberOfItems, placeEntries.length);
  assert.equal(hotelEntries.length, builtDataset.hotels.length);
  for (const entry of [...placeEntries, ...hotelEntries]) {
    assert.ok(entry.address.streetAddress.length > 0);
    assert.equal(
      entry.address.streetAddress.startsWith(entry.address.addressLocality),
      false,
      `${entry.name}: streetAddressにaddressLocalityが重複しています`,
    );
  }
  const jichiPlaces = placeEntries.filter((entry) =>
    entry["@id"].includes("#place-venue-jichi-first-"),
  );
  assert.equal(jichiPlaces.length, privateMedicalJichiExamVenues2027.length);
  assert.ok(jichiPlaces.every((entry) => !("sameAs" in entry)));
  for (const venue of privateMedicalJichiExamVenues2027) {
    const place = jichiPlaces.find((entry) => entry["@id"].endsWith(`#place-${venue.venueId}`));
    assert.equal(place?.subjectOf?.url, venue.officialUrl);
  }

  const domIds = [...html.matchAll(/\sid="([^"]+)"/gu)].map((match) => match[1]);
  assert.ok(unique(domIds), "HTMLのid属性が重複しています");
  const domIdSet = new Set(domIds);
  for (const match of html.matchAll(/\shref="#([^"]+)"/gu)) {
    assert.ok(domIdSet.has(match[1]), `リンク先 #${match[1]} が存在しません`);
  }
  for (const match of html.matchAll(/\saria-labelledby="([^"]+)"/gu)) {
    for (const id of match[1].split(/\s+/u)) {
      assert.ok(domIdSet.has(id), `aria-labelledbyの参照先 #${id} が存在しません`);
    }
  }
  assert.doesNotMatch(html, /C:\\|C:\/|internal_only|project_internal/u);
});
