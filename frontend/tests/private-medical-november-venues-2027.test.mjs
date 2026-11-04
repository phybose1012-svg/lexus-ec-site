import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { novemberVenues2027, novemberGuidelines2027, novemberVenueVerifiedAt2027, novemberAssignmentUpdates2027 } from "../src/data/privateMedicalVenueNovember2027.ts";
import { privateMedicalExamVenueAssignments2027 as assignments } from "../src/data/privateMedicalExamVenues2027.ts";
import { privateMedicalVenueHotels2027 as hotels } from "../src/data/privateMedicalVenueHotels2027.ts";
import { getPrivateMedicalExamVenuesHotels2027Dataset } from "../src/data/privateMedicalExamVenuesHotels2027Dataset.ts";

const assignment = (routeId, examStage) => {
  const found = assignments.find((entry) => entry.routeId === routeId && entry.examStage === examStage);
  assert.ok(found, `${routeId}/${examStage}`);
  return found;
};
const ids = (routeId, stage) => assignment(routeId, stage).venueLinks.map((link) => link.venueId);

test("11月更新の37正式会場は各2ホテルに結合し、未計測の合計時間を公開しない", () => {
  const dataset = getPrivateMedicalExamVenuesHotels2027Dataset();
  for (const patch of novemberAssignmentUpdates2027) {
    for (const routeId of patch.routeIds) assignment(routeId, patch.stage);
  }
  assert.equal(novemberVenues2027.length, 37);
  assert.equal(new Set(novemberVenues2027.map((v) => v.venueId)).size, 37);
  assert.equal(hotels.filter((hotel) => hotel.verifiedAt === novemberVenueVerifiedAt2027).length, 21);
  assert.equal(dataset.hotels.length, 234);
  for (const venue of novemberVenues2027) {
    assert.equal(venue.reviewState, "verified");
    assert.ok(venue.address.startsWith(venue.prefecture));
    assert.ok(Object.values(novemberGuidelines2027).includes(venue.officialUrl));
    const linked = dataset.hotels.flatMap((hotel) => hotel.venueAccess.filter((access) => access.venueId === venue.venueId));
    assert.equal(linked.length, 2, venue.venueId);
    for (const access of linked) {
      assert.equal(access.measurementBasis, "route_only");
      assert.equal(access.travelTimeLabel, undefined);
      assert.ok(access.evidenceUrls.includes(venue.officialUrl));
      assert.ok(access.reviewState.includes("venue_pdf_visual_review"));
      assert.equal(access.verifiedAt, novemberVenueVerifiedAt2027);
    }
  }
  assert.ok(!dataset.hotels.some((hotel) => /fresa.*fujisawa/.test(hotel.hotelId)), "閉館した藤沢の候補を採用しない");
  assert.doesNotMatch(JSON.stringify(dataset), /sotetsotelscg|sotetsuhotel\.sbs/u, "類似ドメインを正規サイトとして採用しない");
  assert.doesNotMatch(hotels.find((hotel) => hotel.hotelId === "hotel-cuore-nagasaki-ekimae").note, /試験朝は公共交通に乗らず/u);
  assert.doesNotMatch(hotels.find((hotel) => hotel.hotelId === "daiwa-roynet-hotel-chiba-chuo").note, /試験会場へは鉄道を使わず/u);
  assert.doesNotMatch(hotels.find((hotel) => hotel.hotelId === "hotel-mielparque-hiroshima").note, /試験会場と同じ建物/u);
  const pageSource = readFileSync(new URL("../src/pages/private-medical-school-exam-venues-hotels-2027/index.astro", import.meta.url), "utf8");
  assert.match(pageSource, /<details class="venue-guide-hotel__notes">/u);
  assert.match(pageSource, /hotel\.note && <p>\{hotel\.note\}<\/p>/u, "JSONだけでなく画面でも未確認事項を読める");
});

test("岩手・東海・近大・日本大学は学部・期・段階・予備会場を分離する", () => {
  assert.equal(ids("iwate-medical--general--general", "first").length, 7);
  assert.deepEqual(ids("iwate-medical--general--general", "second"), ["venue-iwate-medical-yahaba-campus", "venue-bellesalle-kanda", "venue-osaka-garden-palace"]);
  const tokai = assignment("tokai--general--general", "first");
  assert.equal(tokai.venueLinks.length, 6);
  assert.deepEqual(tokai.venueLinks.filter((v) => v.role === "overflow"), [{venueId:"venue-tokai-shonan",role:"overflow"}]);
  assert.deepEqual(ids("tokai--general--general", "second"), ["venue-tokai-isehara"]);
  assert.deepEqual(ids("kindai--general--general-early", "first"), ["venue-kindai-higashiosaka", "venue-tkp-shinshiodome", "venue-tkp-nagoya-ekimae-cc", "venue-hiroshima-ja-building", "venue-kitayobi-hakata"]);
  assert.deepEqual(ids("kindai--general--general-regional-quota-c5d34-385a3-3f44f-early", "first"), ["venue-kindai-higashiosaka", "venue-tkp-shinshiodome"]);
  assert.deepEqual(ids("kindai--general--general-late", "first"), ["venue-kindai-higashiosaka", "venue-yozemi-honbu"]);
  assert.ok(!ids("kindai--general--general-early", "first").includes("venue-vision-center-tokyo-kyobashi"), "推薦用の京橋を一般に混ぜない");
  assert.deepEqual(ids("nihon--general--unified-phase-2", "first"), ["venue-nihon-koriyama", "venue-nihon-tsudanuma", "venue-nihon-commerce", "venue-nihon-shonan"]);
  assert.ok(ids("nihon--general--unified-phase-1", "first").includes("venue-nihon-bunri"));
  assert.ok(!ids("nihon--general--unified-phase-1", "first").includes("venue-nihon-commerce"));
  assert.deepEqual(assignment("kitasato--common--common-test-late", "second").conditions, ["fixed", "admission_ticket"]);
  assert.deepEqual(ids("nihon--general--unified-phase-1", "second"), ["venue-nihon-medical-school-building"]);
});

test("最新要項の集合時刻と希望指定条件を別方式へ転用しない", () => {
  const tokai = assignment("tokai--general--general", "second");
  assert.match(tokai.note, /9:30.*9:10/u);
  assert.doesNotMatch(tokai.note, /9:40/u);
  assert.match(assignment("toho--general--general", "first").note, /7:30.*8:35/u);
  assert.match(assignment("toho--general--unified", "first").note, /8:00.*9:05/u);
  assert.deepEqual(ids("toho--general--unified", "first"), ["venue-toc-gotanda"]);
  assert.match(assignment("jikei--general--general", "first").note, /9:20/u);
  assert.match(assignment("jikei--general--general", "second").note, /都合のつかない日.*1日.*大学1号館.*30分前/u);
  assert.match(assignment("toho--general--general", "second").examDateLabel, /希望日を選択し大学が指定/u);
  for (const [suffix, venue, time] of [["method-a", "mii", "10:00"], ["method-b", "asahimachi", "9:00"]]) {
    const item = assignment(`kurume--common--common-test-${suffix}`, "second");
    assert.deepEqual(item.venueLinks, [{venueId:`venue-kurume-${venue}-campus`,role:"fixed"}]);
    assert.ok(item.note.includes(time));
  }
  const showa = assignment("showa-medical--general--general-phase-1-phase-2", "first");
  assert.equal(showa.reviewState, "needs_review");
  assert.deepEqual(showa.venueLinks, [{venueId:"venue-toc-gotanda",role:"fixed"}]);
  assert.match(showa.note, /方式別表.*出願注意.*大学へ確認/u);
  assert.doesNotMatch(showa.note, /HTML化待ち/u);
  const changed = assignments.filter((entry) => entry.verifiedAt === novemberVenueVerifiedAt2027);
  assert.doesNotMatch(JSON.stringify(changed), /指定方法未公表|学生募集要項は作成中|10月中旬公開予定|venue-[a-z-]+・/u);
});
