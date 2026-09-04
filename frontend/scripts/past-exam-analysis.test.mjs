import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { extractAnalysis, extractTargetAnalysis, axes } from "./import-past-exam-analysis.mjs";
import { buildAnalysis } from "./build-past-exam-analyses.mjs";
import { buildDifficultyPie } from "../src/lib/pastExamDifficultyPie.mjs";

const root = new URL("../src/data/", import.meta.url);
const read = (p) => JSON.parse(fs.readFileSync(new URL(p, root), "utf8"));
const evidence = read("pastExamAnalysisEvidence/iwate-medical-2025-general-mathematics.json");
const editorial = read("pastExamAnalysisSources/iwate-medical-2025-general-mathematics.json");

test("difficulty pie uses exact counts, not rounded percentages, for its sectors", () => {
  const slices = buildDifficultyPie([3, 4, 4, 1]);
  assert.deepEqual(slices.map((s) => s.percent), [25, 33.3, 33.3, 8.3]);
  assert.deepEqual(slices.map((s) => s.fraction), [3 / 12, 4 / 12, 4 / 12, 1 / 12]);
  assert.ok(Math.abs(slices.reduce((n, s) => n + s.fraction, 0) - 1) < 1e-12);
  assert.match(slices[0].path, /^M 110 110 L 110 6 A 104 104 0 0 1 214 110 Z$/);
  assert.match(slices[3].path, /110 6 Z$/);
  assert.ok(slices.every((s) => Math.abs(Math.hypot(s.labelX - 110, s.labelY - 110) - 72) < 0.001));
});

test("difficulty pie supports zero categories and a full-circle category", () => {
  const slices = buildDifficultyPie([0, 12, 0, 0]);
  assert.equal(slices[0].path, "");
  assert.equal(slices[1].percent, 100);
  assert.equal((slices[1].path.match(/A 104 104/g) ?? []).length, 2);
  assert.ok(!JSON.stringify(slices).includes("NaN"));
  for (const counts of [[], [0, 0, 0, 0], [-1, 2], [NaN], [Infinity]]) assert.throws(() => buildDifficultyPie(counts), /difficulty/);
  assert.deepEqual(buildDifficultyPie([1.5, 0.5]).map((s) => s.fraction), [0.75, 0.25]);
});

const fixtureMetadata = {
  schema_version: "medical-entrance-past-exam-analysis.v6",
  package: { university_name: "試験大学", academic_year: 2025, subject_name: "数学" },
  review: { approved: false },
  major_questions: [{ id: "q1", label: "第1問", subquestions: [{ id: "q1-1", difficulty: "基本レベル", strategy: { weak_subject: "後回し", strong_subject: "今解く！" }, radar: Object.fromEntries(axes.map((a) => [a, 2])), scoring: { points: 5 }, optimization_prerequisites: { weak_subject: [], strong_subject: [] } }] }],
};
const fixtureHtml = `<html data-report-mode="student"><title>試験大学 2025 数学</title><p>編集責任者未承認</p>
<article class="card major-question" id="q1"><h3>微分と極限</h3><svg>${axes.map((a) => `<text>${a} 2.0</text>`).join("")}</svg><div class="subquestion-list">
<section class="subquestion" id="q1-1"><span class="subquestion__label">問1</span><div class="pill-row"><span>基本レベル</span><span>苦手: 後回し</span><span>得意: 今解く！</span></div><h4>レベル判断</h4><p>f&#x27;(x)を求める。</p><h4>解く順番の理由</h4><p>計算量に注意。</p></section></div></article></html>`;

test("HTML extraction preserves ratings, priorities, reasons and review status", () => {
  const result = extractAnalysis(fixtureHtml, fixtureMetadata, "report.html");
  assert.deepEqual(result.majorQuestions[0].requirements, [2, 2, 2, 2, 2]);
  assert.equal(result.majorQuestions[0].subquestions[0].difficultyReason, "f'(x)を求める。");
  assert.equal(result.majorQuestions[0].subquestions[0].points, 5);
  assert.equal(result.majorQuestions[0].subquestions[0].weak, "後回し");
  assert.equal(result.source.approved, false);
  assert.match(result.source.sha256, /^[a-f0-9]{64}$/);
  assert.deepEqual(result, extractAnalysis(fixtureHtml, fixtureMetadata, "report.html"));
});

for (const [name, transform] of [
  ["missing subquestion", (h) => h.replace(/<section class="subquestion"[\s\S]*?<\/section>/, "")],
  ["stale chart score", (h) => h.replace("図形処理 2.0", "図形処理 4.0")],
  ["stale priority", (h) => h.replace("苦手: 後回し", "苦手: 今解く！")],
  ["wrong package", (h) => h.replace("試験大学 2025 数学", "別大学 2025 数学")],
  ["missing reason", (h) => h.replace("<h4>レベル判断</h4>", "<h4>別項目</h4>")],
]) test(`reject ${name}`, () => assert.throws(() => extractAnalysis(transform(fixtureHtml), fixtureMetadata, "report.html")));

test("page covers every question and preserves original chart values", () => {
  const page = buildAnalysis(evidence, editorial);
  assert.deepEqual(page.difficultyCounts, [3, 4, 4, 1]);
  assert.deepEqual(page.majorQuestions.flatMap((m) => m.subquestions).map((s) => s.points), [9, 7, 7, 10, 8, 8, 8, 10, 10, 7, 7, 9]);
  assert.equal(page.majorQuestions.flatMap((m) => m.subquestions).reduce((n, s) => n + s.points, 0), 100);
  const byLevel = [0, 1, 2, 3].map((level) => page.majorQuestions.flatMap((m) => m.subquestions).filter((s) => s.difficulty === level).reduce((n, s) => n + s.points, 0));
  assert.deepEqual(byLevel, [24, 31, 35, 10]);
  assert.deepEqual(buildDifficultyPie(byLevel).map((s) => s.fraction), [0.24, 0.31, 0.35, 0.1]);
  assert.equal(page.majorQuestions.flatMap((m) => m.subquestions).length, 12);
  assert.deepEqual(page.majorQuestions.map((m) => m.requirements), evidence.majorQuestions.map((m) => m.requirements));
  assert.deepEqual(page.majorQuestions.map((m) => m.subquestions.map((s) => s.id)), evidence.majorQuestions.map((m) => m.subquestions.map((s) => s.id)));
  assert.equal(page.source.approved, false);
  assert.equal(page.duration, "英語・数学を合わせて120分");
  assert.equal(page.route.path, "/past-exam-library/iwate-medical/2025/mathematics/analysis/");
  assert.equal(page.majorQuestions[1].questionsPath, "/past-exam-library/iwate-medical/2025/mathematics/questions/#major-question-02");
  assert.equal(JSON.stringify(page).includes("execution_minutes"), false);
  assert.deepEqual(page, buildAnalysis(evidence, editorial));
});

test("reject incomplete or mismatched editorial coverage", () => {
  const missing = structuredClone(editorial);
  missing.majorQuestions[0].subquestions.pop();
  assert.throws(() => buildAnalysis(evidence, missing), /mapping/);
  assert.throws(() => buildAnalysis(evidence, { ...editorial, packageId: "other" }), /mismatch/);
  const blank = structuredClone(editorial);
  blank.majorQuestions[0].subquestions[0].note = "";
  assert.throws(() => buildAnalysis(evidence, blank), /editorial text/);
});

test("reject out-of-scale scores", () => {
  const invalid = structuredClone(evidence);
  invalid.majorQuestions[0].requirements[0] = 6;
  assert.throws(() => buildAnalysis(invalid, editorial), /requirement score/);
  const invalidPoints = structuredClone(evidence);
  invalidPoints.majorQuestions[0].subquestions[0].points += 1;
  assert.throws(() => buildAnalysis(invalidPoints, editorial), /point total/);
});

function targetFixture() {
  const metadata = structuredClone(fixtureMetadata);
  metadata.package.id = "test-package";
  metadata.package.total_points = 5;
  metadata.major_questions[0].subquestions[0].time = { initial_judgment_minutes: 0.5, execution_minutes: 2 };
  metadata.calculation_policy = {
    scoring: { basis: "provisional_editorial" },
    time_budget: { basis: "provisional_editorial", minutes: 10 },
    time_model: { base_profile: "strong_subject", profiles: {
      weak_subject: { initial_judgment_multiplier: 4, execution_multiplier: 1.5 },
      strong_subject: { initial_judgment_multiplier: 1, execution_multiplier: 1 },
    } },
    target_optimization: { candidate_actions: ["今解く！", "後回し"], profiles: {
      weak_subject: { reliability_factor: 1, rounding: "none" },
      strong_subject: { reliability_factor: 0.8, rounding: "floor_to_whole_point" },
    } },
  };
  const derived = { schema_version: "medical-entrance-past-exam-derived.v6", package_id: "test-package", profiles: {} };
  const rows = [], cards = [];
  for (const id of ["weak", "strong"]) {
    const weak = id === "weak";
    const target = weak ? 5 : 4;
    const minutes = weak ? 5 : 2.5;
    const rule = metadata.calculation_policy.target_optimization.profiles[`${id}_subject`];
    const profile = {
      target_percent: target / 5 * 100,
      target_plan: { theoretical_max_points: 5, theoretical_max_percent: 100, target_points: target, target_percent: target / 5 * 100, minutes, subquestion_ids: ["q1-1"], ...rule },
      now: { points: weak ? 0 : 5, minutes: weak ? 2 : 2.5, subquestion_ids: weak ? [] : ["q1-1"] },
      now_plus_later: { points: 5, minutes, subquestion_ids: ["q1-1"] },
    };
    derived.profiles[`${id}_subject`] = profile;
    cards.push(`<div class="target target--${id}">${weak ? "苦手" : "得意"}<strong>${profile.target_percent}%</strong></div>`);
    rows.push(`<tr><th>${weak ? "苦手" : "得意"}科目</th><td>倍率</td><td><strong>${profile.target_percent}%（仮${target}点）</strong><small>理論最大 100%（仮5点）・${minutes}分</small></td>${[profile.now, profile.now_plus_later].map((p) => `<td><strong>${p.points / 5 * 100}%（仮配点 ${p.points}点）</strong><small>${p.minutes}分 / 編集試算</small></td>`).join("")}</tr>`);
  }
  return { metadata, derived, html: `${cards.join("")}<table class="profile-table"><tbody>${rows.join("")}</tbody></table>` };
}

test("extract targets from HTML and validate companion points, time and selections", () => {
  const { html, metadata, derived } = targetFixture();
  const result = extractTargetAnalysis(html, metadata, derived);
  assert.equal(result.basis, "provisional_editorial");
  assert.deepEqual(result.profiles.map((p) => p.targetPoints), [5, 4]);
  assert.deepEqual(result.profiles.map((p) => p.targetPercent), [100, 80]);
  assert.deepEqual(result.profiles.map((p) => p.maximum.minutes), [5, 2.5]);
  assert.deepEqual(result.profiles[0].maximum.questionIds, ["q1-1"]);
  assert.throws(() => extractTargetAnalysis(html, metadata), /derived/);
  assert.throws(() => extractTargetAnalysis(html.replace("<strong>100%", "<strong>99%"), metadata, derived), /target/);
  assert.throws(() => extractTargetAnalysis(html.replace("・5分", "・6分"), metadata, derived), /target/);
  const wrongTime = structuredClone(metadata);
  wrongTime.major_questions[0].subquestions[0].time.execution_minutes = 3;
  assert.throws(() => extractTargetAnalysis(html, wrongTime, derived), /plan time/);
  const missingPrerequisite = structuredClone(metadata);
  missingPrerequisite.major_questions[0].subquestions[0].optimization_prerequisites.weak_subject = ["missing"];
  assert.throws(() => extractTargetAnalysis(html, missingPrerequisite, derived), /prerequisite/);
});

test("preserve target/max distinction and select a concrete route to the goal", () => {
  const { targets } = buildAnalysis(evidence, editorial);
  assert.equal(targets.totalPoints, 100);
  assert.equal(targets.timeBudgetMinutes, 60);
  const [weak, strong] = targets.profiles;
  assert.deepEqual([weak.targetPoints, strong.targetPoints], [48, 80]);
  assert.deepEqual([weak.maximum.points, strong.maximum.points], [48, 100]);
  assert.deepEqual([weak.route.points, weak.route.minutes, weak.route.questionIds.length], [48, 59.1, 6]);
  assert.deepEqual(weak.additional, [{ id: "math-q3-4", label: "第3問 問4" }]);
  assert.equal(weak.route.points - weak.now.points, 9);
  assert.deepEqual([strong.route.points, strong.route.minutes, strong.route.questionIds.length], [80, 45, 10]);
  assert.equal(strong.maximum.minutes, 59.5);
  assert.deepEqual(strong.additional, []);
  assert.ok(weak.nowPlusLater.minutes > targets.timeBudgetMinutes);
  assert.ok(targets.profiles.every((p) => p.route.minutes <= targets.timeBudgetMinutes));
});

test("fail rather than silently omit or corrupt target analysis", () => {
  assert.throws(() => buildAnalysis({ ...evidence, targetAnalysis: null }, editorial), /target/);
  assert.throws(() => buildAnalysis(evidence, { ...editorial, targets: [] }), /target/);
  for (const mutate of [
    (t) => { t.profiles[0].targetPoints = 49; },
    (t) => { t.profiles[1].reliabilityFactor = 0.9; },
    (t) => { t.profiles[0].maximum.minutes = 61; },
    (t) => { t.profiles[1].now.minutes = 61; },
    (t) => { t.timeBudgetMinutes = Infinity; },
    (t) => { t.profiles[0].now.questionIds.push("nonexistent-question"); },
    (t) => { t.profiles[1].maximum.questionIds.push(t.profiles[1].maximum.questionIds[0]); },
  ]) {
    const bad = structuredClone(evidence);
    mutate(bad.targetAnalysis);
    assert.throws(() => buildAnalysis(bad, editorial), /target/i);
  }
});
