#!/usr/bin/env node
// Rewrite the hand-authored past-exam sources into Japanese school notation.
//
// The generators already normalize on the way out, so a published page can never
// carry ≤ or ≥. This script keeps the inputs matching the output, so an author
// reading the JSON sees the same symbols the student will see.
//
//   node scripts/normalize-past-exam-notation.mjs           # rewrite in place
//   node scripts/normalize-past-exam-notation.mjs --check   # report only, non-zero on findings
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeInequalities, findForbiddenInequalities } from "../src/lib/mathNotation.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const checkOnly = process.argv.includes("--check");

// Hand-authored inputs are rewritten. Generated output and SVG assets are only
// reported: they must be fixed at their generator, never edited in place.
const AUTHORED = ["src/data/pastExamAnswerSources", "src/data/pastExamAnalysisSources"];
const REPORT_ONLY = [
  "src/data/generated/pastExamQuestions",
  "src/data/generated/pastExamAnswers",
  "src/data/generated/pastExamAnalyses",
  "src/data/pastExamAnalysisEvidence",
  "src/data/pastExamFigures",
  "public/assets/past-exams",
];

const walk = (dir) => {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return [];
  const visit = (p) => (fs.statSync(p).isDirectory() ? fs.readdirSync(p).flatMap((c) => visit(path.join(p, c))) : [p]);
  return visit(full).filter((file) => /\.(json|svg)$/.test(file));
};

const rel = (file) => path.relative(root, file).split(path.sep).join("/");

let rewritten = 0;
let remaining = 0;

for (const dir of AUTHORED) {
  for (const file of walk(dir)) {
    const before = fs.readFileSync(file, "utf8");
    const after = normalizeInequalities(before);
    if (before === after) continue;
    const counts = {};
    for (const hit of findForbiddenInequalities(before)) counts[hit.form] = (counts[hit.form] ?? 0) + 1;
    const summary = Object.entries(counts).map(([form, n]) => `${form}×${n}`).join(" ");
    if (checkOnly) {
      console.error(`needs normalization: ${rel(file)}  ${summary}`);
      remaining += 1;
    } else {
      fs.writeFileSync(file, after, "utf8");
      console.log(`normalized ${rel(file)}  ${summary}`);
      rewritten += 1;
    }
  }
}

for (const dir of REPORT_ONLY) {
  for (const file of walk(dir)) {
    const hits = findForbiddenInequalities(fs.readFileSync(file, "utf8"));
    if (!hits.length) continue;
    const counts = {};
    for (const hit of hits) counts[hit.form] = (counts[hit.form] ?? 0) + 1;
    console.error(
      `generated output still carries forbidden notation: ${rel(file)}  ` +
        `${Object.entries(counts).map(([form, n]) => `${form}×${n}`).join(" ")}  ` +
        "— fix its generator or authored source and regenerate.",
    );
    remaining += 1;
  }
}

if (remaining > 0) {
  console.error(`\n${remaining} file(s) still use ≤ / ≥. Japanese exam pages must use ≦ / ≧ (\\leqq / \\geqq).`);
  process.exitCode = 1;
} else {
  console.log(checkOnly ? "All past-exam sources use ≦ / ≧." : `Done. ${rewritten} file(s) rewritten.`);
}
