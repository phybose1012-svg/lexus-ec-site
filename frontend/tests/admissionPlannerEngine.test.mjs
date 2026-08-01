import assert from "node:assert/strict";
import test from "node:test";
import { planAdmissionRoutes } from "../src/lib/admissionPlannerEngine.ts";

const route = (
  id,
  stage,
  dates,
  assignment = "fixed",
  sharedEventGroupId,
) => ({
  id,
  universityId: id,
  universityName: `${id}大学`,
  region: "関東",
  prefecture: "東京都",
  routeName: "一般選抜",
  category: "general",
  status: "official",
  sourceUrl: "https://example.com/",
  calendarEvents: [],
  examGroups: [
    {
      id: `${id}--group`,
      stage,
      dates,
      attendance: assignment === "fixed" && dates.length > 1 ? "all" : "exactly_one",
      assignment,
      raw: dates.join("・"),
      sharedEventGroupId,
    },
  ],
});

const selected = (...routeIds) =>
  routeIds.map((routeId, index) => ({ routeId, priority: index + 1 }));

test("固定された一次試験が同日ならハードコンフリクトになる", () => {
  const routes = [
    route("a", "first_exam", ["2027-02-01"]),
    route("b", "first_exam", ["2027-02-01"]),
  ];
  const result = planAdmissionRoutes(routes, selected("a", "b"));

  assert.equal(result.status, "conflict");
  assert.equal(result.conflicts[0]?.kind, "first_first");
  assert.equal(result.conflicts[0]?.severity, "hard");
});

test("受験者が選べる一次試験日は重複しない日を自動選択する", () => {
  const routes = [
    route("a", "first_exam", ["2027-02-01"]),
    route("b", "first_exam", ["2027-02-01", "2027-02-02"], "candidate_choice"),
  ];
  const result = planAdmissionRoutes(routes, selected("a", "b"));
  const flexible = result.assignments.find((assignment) => assignment.groupId === "b--group");

  assert.equal(result.status, "ready");
  assert.deepEqual(flexible?.dates, ["2027-02-02"]);
});

test("受験者が選んだ複数の一次試験日をプランへ反映する", () => {
  const routes = [
    route(
      "a",
      "first_exam",
      ["2027-01-21", "2027-01-22", "2027-01-23"],
      "candidate_choice",
    ),
  ];
  const result = planAdmissionRoutes(routes, selected("a"), "priority", {
    "a--group": ["2027-01-21", "2027-01-23"],
  });

  assert.deepEqual(result.assignments[0]?.dates, ["2027-01-21", "2027-01-23"]);
  assert.deepEqual(
    result.calendar.filter((event) => event.type === "firstExam").map((event) => event.date),
    ["2027-01-21", "2027-01-23"],
  );
});

test("複数の二次試験日は全候補を表示し推奨日だけを識別する", () => {
  const routes = [
    route(
      "a",
      "second_exam",
      ["2027-02-14", "2027-02-15", "2027-02-16"],
      "candidate_choice",
    ),
  ];
  const result = planAdmissionRoutes(routes, selected("a"));
  const secondEvents = result.calendar.filter((event) => event.type === "secondExam");

  assert.equal(secondEvents.length, 3);
  assert.equal(secondEvents.filter((event) => event.recommended).length, 1);
  assert.equal(secondEvents.filter((event) => event.state === "alternative").length, 2);
});

test("二次試験同士の固定日重複は一次合格後の要判断として扱う", () => {
  const routes = [
    route("a", "second_exam", ["2027-02-14"]),
    route("b", "second_exam", ["2027-02-14"]),
  ];
  const result = planAdmissionRoutes(routes, selected("a", "b"));

  assert.equal(result.status, "needs_decision");
  assert.equal(result.conflicts[0]?.kind, "second_second");
  assert.equal(result.conflicts[0]?.severity, "decision");
});

test("一次試験と別大学の二次試験が重なる場合も判断対象にする", () => {
  const routes = [
    route("a", "first_exam", ["2027-02-14"]),
    route("b", "second_exam", ["2027-02-14"]),
  ];
  const result = planAdmissionRoutes(routes, selected("a", "b"));

  assert.equal(result.status, "needs_decision");
  assert.equal(result.conflicts[0]?.kind, "first_second");
  assert.equal(result.conflicts[0]?.severity, "decision");
});

test("希望日方式は回避案があっても条件付きリスクを残す", () => {
  const routes = [
    route("a", "first_exam", ["2027-02-14"]),
    route(
      "b",
      "second_exam",
      ["2027-02-14", "2027-02-15"],
      "candidate_preference",
    ),
  ];
  const result = planAdmissionRoutes(routes, selected("a", "b"));

  assert.equal(result.status, "needs_decision");
  assert.ok(result.conflicts.some((conflict) => conflict.severity === "conditional"));
});

test("共通試験グループは複数方式で共有され重複扱いしない", () => {
  const routes = [
    route("a", "common_test", ["2027-01-16", "2027-01-17"], "fixed", "common-test"),
    route("b", "common_test", ["2027-01-16", "2027-01-17"], "fixed", "common-test"),
  ];
  const result = planAdmissionRoutes(routes, selected("a", "b"));

  assert.equal(result.status, "ready");
  assert.equal(result.assignments.length, 1);
  assert.equal(result.conflicts.length, 0);
});

test("同じ大学の同日試験は受験不可と断定せず併願条件の確認にする", () => {
  const first = route("a", "first_exam", ["2027-02-03"]);
  const second = route("b", "first_exam", ["2027-02-03"]);
  second.universityId = first.universityId;
  second.universityName = first.universityName;
  const result = planAdmissionRoutes([first, second], selected("a", "b"));

  assert.equal(result.status, "needs_decision");
  assert.equal(result.conflicts[0]?.kind, "same_university");
  assert.equal(result.conflicts[0]?.severity, "conditional");
});
