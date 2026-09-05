import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { indexFormulaPurposes, loadFormulaPurposes } from "./formula-purpose-library.mjs";

const repoRoot = fileURLToPath(new URL("../../../../", import.meta.url));
const builder = fileURLToPath(new URL("./build-answer-page.mjs", import.meta.url));
const source = JSON.parse(fs.readFileSync(path.join(repoRoot, "frontend/src/data/pastExamAnswerSources/iwate-medical-2025-general-mathematics.json"), "utf8"));

function withBuild(input, verify) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lexus-answer-test-"));
  try {
    const inputPath = path.join(dir, "source.json");
    const outputPath = path.join(dir, "output.json");
    fs.writeFileSync(inputPath, JSON.stringify(input));
    const result = spawnSync(process.execPath, [builder, "--source", inputPath, "--output", outputPath], { encoding: "utf8" });
    verify(result, outputPath, inputPath);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test("every formula resolves a canonical label outside the KaTeX target", () => {
  withBuild(source, (result, outputPath, inputPath) => {
    assert.equal(result.status, 0, result.stderr);
    const first = fs.readFileSync(outputPath, "utf8");
    const output = JSON.parse(first);
    const html = output.document.majorQuestions.map((q) => q.html).join("");
    const formulas = source.document.majorQuestions.flatMap((q) => q.sections.flatMap((s) => s.blocks.filter((b) => b.type === "formula")));
    const purposes = loadFormulaPurposes();
    const rendered = [...html.matchAll(/<div class="formula answer-formula" data-formula-purpose="([^"]+)"><span class="answer-formula__purpose">([^<]+)<\/span><div class="answer-formula__math" data-katex="/g)];
    assert.equal(rendered.length, formulas.length);
    rendered.forEach((match, i) => {
      assert.equal(match[1], formulas[i].purposeId);
      assert.equal(match[2], purposes.get(formulas[i].purposeId).label);
    });
    assert.equal(html.includes('data-katex="f(0)=0"'), false);
    assert.equal((html.match(/class="answer-table__no-value"/g) ?? []).length, 6);
    assert.equal((html.match(/class="answer-trend"/g) ?? []).length, 6);
    assert.equal((html.match(/class="answer-key__slot"/g) ?? []).length, 47);
    assert.equal(html.includes('class="page-kicker"'), false);
    execFileSync(process.execPath, [builder, "--source", inputPath, "--output", outputPath]);
    assert.equal(fs.readFileSync(outputPath, "utf8"), first, "generation is deterministic");
  });
});

for (const scenario of ["missing", "unknown", "free-text"]) {
  test(`reject ${scenario} formula purpose before writing output`, () => {
    const input = structuredClone(source);
    const formula = input.document.majorQuestions[0].sections[0].blocks.find((b) => b.type === "formula");
    if (scenario === "missing") delete formula.purposeId;
    if (scenario === "unknown") formula.purposeId = "not-in-library";
    if (scenario === "free-text") formula.purposeLabel = "別表記";
    withBuild(input, (result, outputPath) => {
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /purposeId|free-text label/);
      assert.equal(fs.existsSync(outputPath), false);
    });
  });
}

test("library rejects duplicate IDs, duplicate labels, and invalid IDs", () => {
  const entry = { id: "differentiate", label: "微分計算", useWhen: "導関数を求める" };
  const library = (purposes) => ({ schemaVersion: "lexus-formula-purposes.v1", purposes });
  assert.throws(() => indexFormulaPurposes(library([entry, { ...entry, label: "別の名前" }])), /Duplicate/);
  assert.throws(() => indexFormulaPurposes(library([entry, { ...entry, id: "differentiate-again" }])), /Duplicate/);
  assert.throws(() => indexFormulaPurposes(library([{ ...entry, id: true }])), /Invalid/);
});

test("formula text is escaped without introducing HTML elements", () => {
  const input = structuredClone(source);
  const formula = input.document.majorQuestions[0].sections[0].blocks.find((b) => b.type === "formula");
  formula.latex = '<script>alert("x")</script>';
  withBuild(input, (result, outputPath) => {
    assert.equal(result.status, 0, result.stderr);
    const html = JSON.parse(fs.readFileSync(outputPath, "utf8")).document.majorQuestions[0].html;
    assert.equal(html.includes("<script>"), false);
    assert.ok(html.includes("&lt;script&gt;"));
  });
});
