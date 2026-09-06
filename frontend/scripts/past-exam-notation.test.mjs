// Japanese school mathematics uses ≦ and ≧. The international ≤ / ≥ forms, which
// shorten the equals sign to a single rule, are never used up to university
// entrance level, so no past-exam source, generated file, figure or built page
// may contain them. These tests are the permanent guard behind that rule.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  normalizeInequalities,
  normalizeInequalitiesDeep,
  findForbiddenInequalities,
} from "../src/lib/mathNotation.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const walk = (dir) => {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return [];
  const visit = (p) => (fs.statSync(p).isDirectory() ? fs.readdirSync(p).flatMap((c) => visit(path.join(p, c))) : [p]);
  return visit(full);
};
const rel = (file) => path.relative(root, file).split(path.sep).join("/");

test("every inequality spelling normalizes to the Japanese form", () => {
  for (const [input, expected] of [
    ["0 \\le s \\le 1", "0 \\leqq s \\leqq 1"],
    ["n \\geq 1", "n \\geqq 1"],
    ["x \\leqslant y", "x \\leqq y"],
    ["x \\geqslant y", "x \\geqq y"],
    ["0 ≤ x ≤ 1", "0 ≦ x ≦ 1"],
    ["x ≥ 0", "x ≧ 0"],
  ]) {
    assert.equal(normalizeInequalities(input), expected);
  }
  // Already correct input is left exactly as it is, not doubled into \leqqq.
  for (const stable of ["0 \\leqq s \\leqq 1", "n \\geqq 1", "0 ≦ x ≦ 1", "x ≧ 0"]) {
    assert.equal(normalizeInequalities(stable), stable);
    assert.equal(normalizeInequalities(normalizeInequalities(stable)), stable);
  }
});

test("commands that merely start with le or ge are never touched", () => {
  // \left, \leftarrow and \gets share a prefix with \le and \ge.
  for (const safe of [
    "\\left(\\frac12\\right)",
    "a \\leftarrow b",
    "x \\gets y",
    "\\lefteqn{x}",
    "\\genfrac{}{}{0pt}{}{a}{b}",
    "\\lg x",
  ]) {
    assert.equal(normalizeInequalities(safe), safe);
    assert.deepEqual(findForbiddenInequalities(safe), []);
  }
  // The real thing inside the same string is still caught.
  assert.equal(normalizeInequalities("\\left( 0 \\le x \\right)"), "\\left( 0 \\leqq x \\right)");
});

test("deep normalization walks nested authoring structures and leaves non-strings alone", () => {
  const source = {
    blocks: [{ type: "formula", latex: "0 \\le s \\le 1", order: 3, ok: true, nothing: null }],
    note: { text: "範囲は \\(0 \\ge t\\) です" },
  };
  assert.deepEqual(normalizeInequalitiesDeep(source), {
    blocks: [{ type: "formula", latex: "0 \\leqq s \\leqq 1", order: 3, ok: true, nothing: null }],
    note: { text: "範囲は \\(0 \\geqq t\\) です" },
  });
});

test("findForbiddenInequalities reports each offending form with its position", () => {
  const found = findForbiddenInequalities("0 \\le x, y \\geq 2, z ≤ 3");
  assert.deepEqual(found.map((hit) => hit.form), ["\\le", "\\geq", "≤"]);
  assert.ok(found.every((hit) => Number.isInteger(hit.index)));
  assert.deepEqual(findForbiddenInequalities("0 \\leqq x ≦ 1"), []);
});

test("no past-exam source, generated file or figure carries ≤ or ≥", () => {
  const dirs = [
    "src/data/pastExamAnswerSources",
    "src/data/pastExamAnalysisSources",
    "src/data/pastExamAnalysisEvidence",
    "src/data/pastExamFigures",
    "src/data/generated/pastExamQuestions",
    "src/data/generated/pastExamAnswers",
    "src/data/generated/pastExamAnalyses",
    "public/assets/past-exams",
  ];
  const offenders = [];
  let scanned = 0;
  for (const dir of dirs) {
    for (const file of walk(dir).filter((f) => /\.(json|svg)$/.test(f))) {
      scanned += 1;
      const hits = findForbiddenInequalities(fs.readFileSync(file, "utf8"));
      if (hits.length) offenders.push(`${rel(file)} (${hits.map((h) => h.form).join(", ")})`);
    }
  }
  assert.ok(scanned > 0, "found no past-exam files to scan");
  assert.deepEqual(offenders, []);
});

test("built past-exam pages publish \\leqq, and never ≤", () => {
  const pages = walk("dist/past-exam-library").filter((file) => file.endsWith(".html"));
  if (pages.length === 0) return; // `npm run build` has not run in this checkout yet.
  const offenders = [];
  for (const page of pages) {
    const hits = findForbiddenInequalities(fs.readFileSync(page, "utf8"));
    if (hits.length) offenders.push(`${rel(page)} (${hits.map((h) => h.form).join(", ")})`);
  }
  assert.deepEqual(offenders, []);

  // Guard against the opposite failure: normalization must not have deleted the
  // inequalities. Juntendo Ⅰ(2) states 0 ≦ s ≦ 1 and 0 ≦ t ≦ 1.
  const questions = path.join(root, "dist/past-exam-library/juntendo/2025/mathematics/questions/index.html");
  if (fs.existsSync(questions)) {
    const html = fs.readFileSync(questions, "utf8");
    assert.ok(html.includes("leqq"), "the question page should still carry its inequalities");
  }
});
