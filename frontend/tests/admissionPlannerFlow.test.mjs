import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { restorePlannerFlow, movePlannerFlow, invalidatePlannerFlow } from "../src/lib/admissionPlannerFlow.ts";

test("空のプランは最初の選択から。方式未選択では先に進めない", () => {
  const flow = restorePlannerFlow(undefined, false);
  assert.deepEqual(flow, { step: 1, unlocked: 1 });
  for (const step of [2, 3, 4, 0, 5, NaN]) assert.equal(movePlannerFlow(flow, step, false, true), flow);
});

test("順に確認を経て、明示的な作成操作でのみカレンダーに進む", () => {
  let flow = restorePlannerFlow(undefined, true);
  assert.equal(movePlannerFlow(flow, 3, true), flow);
  assert.equal(movePlannerFlow(flow, 4, true, true), flow);
  flow = movePlannerFlow(flow, 2, true);
  assert.deepEqual(flow, { step: 2, unlocked: 2 });
  flow = movePlannerFlow(flow, 3, true);
  assert.equal(movePlannerFlow(flow, 4, true), flow);
  flow = movePlannerFlow(flow, 4, true, true);
  assert.deepEqual(flow, { step: 4, unlocked: 4 });
});

test("戻る操作では設定も結果も維持。編集したときだけ後続ステップを無効化", () => {
  let flow = { step: 4, unlocked: 4 };
  flow = movePlannerFlow(flow, 1, true);
  assert.equal(movePlannerFlow(flow, 4, true).step, 4);
  flow = invalidatePlannerFlow(flow, true);
  assert.deepEqual(flow, { step: 1, unlocked: 1 });
  assert.equal(movePlannerFlow(flow, 4, true), flow);
  assert.deepEqual(invalidatePlannerFlow({ step: 2, unlocked: 4 }, true), { step: 2, unlocked: 2 });
  assert.deepEqual(invalidatePlannerFlow({ step: 3, unlocked: 4 }, false), { step: 1, unlocked: 1 });
});

test("過去バージョンと途中保存を復元。保存済みカレンダーは最新日程での再作成前に確認", () => {
  assert.equal(restorePlannerFlow(undefined, true).step, 1);
  assert.equal(restorePlannerFlow(2, true).step, 2);
  assert.equal(restorePlannerFlow(3, true).step, 3);
  assert.equal(restorePlannerFlow(4, true).step, 3);
  for (const value of [-1, 8, null, "invalid", {}, []]) assert.equal(restorePlannerFlow(value, true).step, 1);
  assert.equal(restorePlannerFlow(4, false).step, 1);
});

test("独立した4パネルと操作導線を持ち、通常の再描画ではカレンダーを計算しない", () => {
  const source = readFileSync(new URL("../src/components/admissions/AdmissionPlanner.astro", import.meta.url), "utf8");
  assert.deepEqual([...source.matchAll(/data-planner-panel="(\d)"/gu)].map((match) => match[1]), ["1", "2", "3", "4"]);
  for (const step of [2, 3, 4]) assert.match(source, new RegExp(`data-planner-panel="${step}"[^>]*hidden`));
  assert.match(source, /data-planner-generate/);
  assert.match(source, /aria-current/);
  assert.match(source, /const generateCalendar = \(\) => \{[\s\S]*planAdmissionRoutes/);
  assert.doesNotMatch(source.split("const render = () => {")[1].split("const navigate =")[0], /planAdmissionRoutes|renderCalendar/);
  assert.match(source.split("const markChanged =")[1].split("const generateCalendar =")[0], /calendar.innerHTML = ""/);
  const css = readFileSync(new URL("../src/styles/admission-planner-2027.css", import.meta.url), "utf8");
  assert.match(css, /\[hidden\] \{ display: none !important; \}/);
});
