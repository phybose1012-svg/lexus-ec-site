import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  applicationDeadlineEntries2027,
  examCalendar2027,
  fullScheduleCalendar2027,
  privateMedicalUniversities2027,
} from "../src/data/privateMedicalAdmissions2027.ts";

const updatedIds = ["tohoku-med-pharm", "dokkyo-medical", "fujita", "osaka-med-pharm", "uoeh"];
const university = (id) => privateMedicalUniversities2027.find((entry) => entry.id === id);
const calendarEntries = (date, column, name) =>
  fullScheduleCalendar2027.find((day) => day.dateTime === date)?.events[column]
    .filter((entry) => entry.university === name) ?? [];

test("完成版HTML・原本で照合した5大学12方式の根拠と公表区分を一覧間で揃える", () => {
  assert.equal(updatedIds.flatMap((id) => university(id).routes).length, 12);
  for (const id of updatedIds) {
    const current = university(id);
    assert.ok(current.routes.every((route) => route.status === "official"));
    assert.ok(current.routes.every((route) => /\.pdf$/.test(route.sourceUrl)));
    for (const deadline of applicationDeadlineEntries2027.filter((entry) => entry.university === current.name)) {
      assert.ok(current.routes.some((route) => route.sourceUrl === deadline.sourceUrl));
      assert.doesNotMatch(JSON.stringify(deadline), /要項公開待ち|10月上旬公開予定/u);
    }
  }
  const dates = applicationDeadlineEntries2027.map((entry) => entry.dateTime ?? "9999");
  assert.deepEqual(dates, [...dates].sort());
});

test("獨協のWeb登録は書類必着日の前日12時で、両方を全日程カレンダーに保持", () => {
  const entries = applicationDeadlineEntries2027.filter((entry) => entry.university === "獨協医科大学");
  assert.deepEqual(entries.map((entry) => [entry.dateTime, entry.webDeadline, entry.documentDeadline]), [
    ["2027-01-31", "1/31 12:00", "2/1 17:00 必着"],
    ["2027-02-28", "2/28 12:00", "3/1 17:00 必着"],
  ]);
  for (const date of ["2027-01-31", "2027-02-28"]) {
    assert.match(calendarEntries(date, "applicationDeadline", "獨協医科大学")[0].detail, /Web登録.*12:00/);
  }
  for (const date of ["2027-02-01", "2027-03-01"]) {
    assert.match(calendarEntries(date, "applicationDeadline", "獨協医科大学")[0].detail, /書類.*17:00.*必着/u);
  }
});

test("大阪医科薬科の後期締切は2月22日、登録13時・検定料15時・郵送消印を区別", () => {
  const late = university("osaka-med-pharm").routes.find((route) => route.name.includes("後期"));
  assert.match(late.application, /2\/22 13:00.*15:00.*消印有効/u);
  assert.doesNotMatch(late.application, /2\/26/);
  const deadline = applicationDeadlineEntries2027.find((entry) => entry.university === "大阪医科薬科大学" && entry.routes === "一般後期");
  assert.equal(deadline.dateTime, "2027-02-22");
  assert.match(calendarEntries("2027-02-22", "applicationDeadline", "大阪医科薬科大学")[0].detail, /13:00.*15:00.*消印有効/u);
  assert.equal(calendarEntries("2027-02-26", "applicationDeadline", "大阪医科薬科大学").length, 0);
});

test("川崎の9月30日改訂版の地域枠申請状況を各一覧へ反映", () => {
  const current = university("kawasaki-medical");
  assert.match(current.routes[0].name, /静岡県・長崎県は認可申請中/u);
  assert.match(current.routes[0].sourceUrl, /7806900-2-15/);
  const deadline = applicationDeadlineEntries2027.find((entry) => entry.university === current.name);
  assert.match(deadline.routes, /認可申請中/u);
  assert.equal(deadline.sourceUrl, current.routes[0].sourceUrl);
  for (const date of ["2/1", "2/10", "2/11"]) {
    const day = examCalendar2027.find((entry) => entry.date === date);
    const labels = [...day.first, ...day.second].filter((entry) => entry.includes("川崎医科"));
    assert.ok(labels.length > 0);
    assert.ok(labels.every((entry) => entry.includes("認可申請中") && !entry.includes("設置協議中")));
  }
});

test("藤田の二段階手続期限と、産業医科の来学受付終了時刻を保持", () => {
  for (const [date, label] of [["2027-02-24", "1次"], ["2027-03-10", "2次"]]) {
    const entries = calendarEntries(date, "procedureDeadline", "藤田医科大学");
    assert.equal(entries.length, 2);
    assert.ok(entries.every((entry) => entry.detail.includes(label) && entry.detail.includes("23:59")));
  }
  const uoeh = calendarEntries("2027-03-25", "procedureDeadline", "産業医科大学");
  assert.equal(uoeh.flatMap((entry) => entry.routes).length, 3);
  assert.ok(uoeh.every((entry) => /14:30.*本人来学.*11:30〜13:00/.test(entry.detail)));
});

test("合格発表の時刻・頃・予定を全日程カレンダーでも省略しない", () => {
  for (const [date, column, name, time] of [
    ["2027-02-12", "firstResult", "東北医科薬科大学", "16:00予定"],
    ["2027-02-25", "finalResult", "東北医科薬科大学", "16:00予定"],
    ["2027-02-09", "firstResult", "藤田医科大学", "9:00頃"],
    ["2027-02-18", "finalResult", "藤田医科大学", "9:00頃"],
    ["2027-03-19", "finalResult", "産業医科大学", "16:00頃"],
    ["2027-02-20", "finalResult", "大阪医科薬科大学", "13:00"],
  ]) {
    const entries = calendarEntries(date, column, name);
    assert.ok(entries.length > 0);
    assert.ok(entries.every((entry) => entry.detail.includes(time)), `${name} ${column} ${time}`);
  }
});

test("更新した面接希望条件を試験日順・全日程・公開plannerに反映し、両日必須と誤認しない", () => {
  for (const [shortDate, date, name, abbreviation, pattern] of [
    ["2/14", "2027-02-14", "藤田医科大学", "藤田医科", /希望順位.*出願日時順/u],
    ["2/19", "2027-02-19", "獨協医科大学", "獨協医科", /希望.*受付順/u],
  ]) {
    assert.match(examCalendar2027.find((day) => day.date === shortDate).second.find((text) => text.includes(abbreviation)), pattern);
    assert.ok(calendarEntries(date, "secondExam", name).every((entry) => pattern.test(entry.detail)));
  }
  const built = JSON.parse(readFileSync(new URL("../dist/data/private-medical-admissions-2027.json", import.meta.url), "utf8"));
  assert.equal(built.metadata.dateModified, "2026-10-05", "最新ソースでビルドしてから検証してください");
  assert.deepEqual(built.applicationDeadlines, applicationDeadlineEntries2027);
  assert.deepEqual(built.fullScheduleCalendar, JSON.parse(JSON.stringify(fullScheduleCalendar2027)));
  for (const route of built.admissionPlanning.routes.filter((route) => route.universityId === "fujita" || (route.universityId === "dokkyo-medical" && route.routeName.includes("前期")))) {
    const second = route.examGroups.find((group) => group.stage === "second_exam");
    assert.equal(second.assignment, "candidate_preference");
    assert.equal(second.attendance, "exactly_one");
  }
});
