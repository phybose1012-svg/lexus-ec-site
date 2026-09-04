import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { extractAnalysis, axes } from "./import-past-exam-analysis.mjs";
import { buildAnalysis } from "./build-past-exam-analyses.mjs";

const root = new URL("../src/data/", import.meta.url);
const read = (p) => JSON.parse(fs.readFileSync(new URL(p, root), "utf8"));
const evidence = read("pastExamAnalysisEvidence/iwate-medical-2025-general-mathematics.json");
const editorial = read("pastExamAnalysisSources/iwate-medical-2025-general-mathematics.json");

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
});
