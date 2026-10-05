import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { planAdmissionRoutes } from "../src/lib/admissionPlannerEngine.ts";
import { privateMedicalSpecialAdmissionsUniversities2027 } from "../src/data/privateMedicalSpecialAdmissions2027.ts";

const path = "private-medical-school-admission-planner-2027";
const html = readFileSync(new URL(`../dist/${path}/index.html`, import.meta.url), "utf8");
const payload = JSON.parse(html.match(/<script[^>]*id="admission-planner-data"[^>]*>([\s\S]*?)<\/script>/u)[1]);
const routes = payload.routes;
const special = (university, id) => routes.find((route) => route.id === `special--${university}--${id}`);
const selection = (...items) => items.map((route, index) => ({ routeId: route.id, priority: index === 0 ? 1 : 3 }));
const plan = (...items) => planAdmissionRoutes(routes, selection(...items));

test("独立ページだけにプランUIを配置し、日程ページから専用ページへ遷移できる", () => {
  assert.match(html, /data-admission-planner/u);
  assert.match(html, /canonical[^>]*private-medical-school-admission-planner-2027/u);
  assert.equal(payload.universities.length, 31);
  assert.match(readFileSync(new URL("../dist/sitemap.xml", import.meta.url), "utf8"), new RegExp(path));
  for (const page of ["private-medical-school-admissions-schedule-2027", "private-medical-school-special-admissions-schedule-2027"]) {
    const schedule = readFileSync(new URL(`../dist/${page}/index.html`, import.meta.url), "utf8");
    assert.doesNotMatch(schedule, /data-admission-planner|id="admission-planner-data"/u);
    assert.match(schedule, new RegExp(`href="/${path}/"`, "u"));
  }
});

test("一般83方式のデータとIDを変えず、掲載対象の特別選抜全方式を追加", () => {
  const original = JSON.parse(readFileSync(new URL("../dist/data/private-medical-admissions-2027.json", import.meta.url), "utf8"));
  assert.deepEqual(routes.filter((route) => !route.id.startsWith("special--")), original.admissionPlanning.routes);
  const specialRoutes = privateMedicalSpecialAdmissionsUniversities2027.filter((u) => u.scopeStatus !== "not-offered").flatMap((u) => u.routes.filter((r) => r.publicationStatus !== "not-offered").map((r) => ({ u, r })));
  assert.equal(routes.length, original.admissionPlanning.routes.length + specialRoutes.length);
  assert.equal(new Set(routes.map((route) => route.id)).size, routes.length);
  for (const { u, r } of specialRoutes) {
    const actual = special(u.id, r.id);
    assert.ok(actual);
    assert.equal(actual.category, r.category);
    assert.equal(actual.requirements.exclusive, r.exclusive);
    assert.equal(actual.calendarEvents.length, r.events.filter((event) => !/-exam$/.test(event.stage)).length);
    for (const event of r.events.filter((event) => /-exam$/.test(event.stage))) {
      assert.ok(actual.examGroups.some((group) => group.dates.includes(event.date)), `${u.name}/${r.id}/${event.date}`);
    }
  }
});

test("総合型・一般・共テを同じプランに保存でき、2026年秋から2027年春の予定を一括生成", () => {
  const s = special("fujita", "fujita-future");
  const g = routes.find((r) => r.universityId === "fujita" && r.category === "general");
  const c = routes.find((r) => r.universityId === "fujita" && r.category === "common");
  const result = plan(s, g, c);
  assert.equal(result.selectedRoutes.length, 3);
  assert.ok(result.calendar.some((event) => event.date === "2026-11-08"));
  assert.ok(result.calendar.some((event) => event.date === "2027-03-10"));
  assert.ok(result.calendar.some((event) => /23:59/u.test(event.detail)));
  assert.equal(result.conflicts.length, 0, "一般・共テで面接を1回共有する場合は二重に数えない");
});

test("単独試験は一次・二次に偽装せず、同日重複を検出", () => {
  const a = special("saitama-medical", "recommendation-public");
  const b = special("fujita", "fujita-future");
  const result = plan(a, b);
  assert.ok(result.calendar.some((event) => event.type === "singleExam" && event.date === "2026-11-22"));
  assert.ok(result.conflicts.some((event) => event.date === "2026-11-22"));
});

test("共通テストを評価に使う総合型と共テ利用は共通の1イベントへ統合", () => {
  const a = special("uoeh", "ramazzini");
  const b = routes.find((r) => r.category === "common" && r.examGroups.some((g) => g.stage === "common_test"));
  const result = plan(a, b);
  assert.equal(a.category, "comprehensive");
  assert.equal(result.assignments.filter((g) => g.stage === "common_test").length, 1);
  assert.equal(result.calendar.filter((event) => event.type === "commonTest").length, 2);
  const single = { ...a, id: "fixture-single", universityId: "fixture", universityName: "別大学", examGroups: [{ id: "fixture-exam", stage: "single_exam", dates: ["2027-01-16"], attendance: "all", assignment: "fixed", raw: "試験日" }] };
  const conflict = planAdmissionRoutes([a, single], selection(a, single));
  assert.equal(conflict.status, "conflict", "共通テストと個別試験の重なりは無視しない");
});

test("段階選考と複数日必須を保持し、必須日を自動で間引かない", () => {
  const a = special("tohoku-med-pharm", "comprehensive-tohoku-retention");
  const result = plan(a);
  assert.deepEqual(result.assignments[0].dates, ["2026-10-24", "2026-10-25"]);
  assert.equal(result.assignments[0].stage, "second_exam");
  const womens = plan(special("tokyo-womens-medical", "school-recommendation"));
  assert.deepEqual(womens.assignments[0].dates, ["2026-11-21", "2026-11-22"]);
});

test("大学と調整する期間を初日に固定せず、全候補と注意を表示", () => {
  const result = plan(special("tokyo-womens-medical", "foreign-healthcare-human-resources"));
  const group = result.assignments[0];
  assert.equal(group.assignment, "university_assignment");
  assert.equal(group.availableDates.length, 10);
  assert.equal(group.availableDates.at(-1), "2026-11-04");
  assert.equal(group.dates.length, 1);
  assert.equal(result.calendar.filter((event) => event.type === "singleExam").length, 10);
  assert.ok(result.calendar.some((event) => event.state === "conditional"));
});

test("順天堂帰国生のEJUまたは共通テストは択一で、両方を必須にしない", () => {
  const a = special("juntendo", "returnee");
  const eju = planAdmissionRoutes(routes, [{ routeId: a.id, priority: 1, examOptionId: "eju" }]);
  const common = planAdmissionRoutes(routes, [{ routeId: a.id, priority: 1, examOptionId: "common" }]);
  assert.equal(eju.calendar.filter((event) => event.type === "commonTest").length, 0);
  assert.equal(common.calendar.filter((event) => event.type === "commonTest").length, 2);
  assert.equal(common.assignments.some((group) => /日本留学試験/u.test(group.raw)), false);
  assert.equal(eju.assignments.find((group) => /日本留学試験/u.test(group.raw)).dates.length, 1);
  assert.equal(eju.calendar.some((event) => /共通テスト成績請求/u.test(event.detail)), false);
  assert.equal(common.calendar.some((event) => /EJU第2回受験票/u.test(event.detail)), false);
  assert.ok(common.calendar.some((event) => /免除者/u.test(event.detail) && event.state === "conditional"));
});

test("同じ日程をまとめても選択した全方式の名前を残す", () => {
  const a = special("saitama-medical", "recommendation-public");
  const b = special("saitama-medical", "returnee");
  const result = plan(a, b);
  const deadline = result.calendar.find((event) => event.type === "applicationDeadline" && event.date === "2026-11-13");
  assert.ok(deadline.routeNames.includes(a.routeName));
  assert.ok(deadline.routeNames.includes(b.routeName));
});

test("未公表方式を選べても問題なし判定はしない。除外方式は再追加しない", () => {
  assert.equal(plan(special("kanazawa-medical", "research-doctor")).status, "incomplete");
  assert.equal(plan(special("kitasato", "regional-designated")).status, "incomplete");
  assert.equal(routes.some((route) => route.id.startsWith("special--kyorin--")), false);
  assert.equal(special("showa-medical", "graduate-recommendation").category, "special");
  assert.match(html, /専願条件/u);
  const component = readFileSync(new URL("../src/components/admissions/AdmissionPlanner.astro", import.meta.url), "utf8");
  assert.match(component, /lexus-admission-plan-2027-v2/u);
  assert.match(component, /\[2, 3, 4, 5\]/u);
  assert.doesNotMatch(component, /組み合わせ可能/u);
});
