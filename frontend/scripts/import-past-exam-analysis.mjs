import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

export const axes = ["図形処理", "数式処理", "計算量", "問題パターン知識", "問題咀嚼"];
export const difficulties = ["基本レベル", "基本＋αレベル", "標準レベル", "発展レベル"];
export const actions = ["今解く！", "後回し", "捨てる！"];
const decode = (s) => s.replace(/&#(x[0-9a-f]+|\d+);/gi, (_, n) => String.fromCodePoint(n[0].toLowerCase() === "x" ? parseInt(n.slice(1), 16) : Number(n)))
  .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const plain = (s) => decode(s.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
function capture(html, pattern, label) {
  const match = html.match(pattern);
  if (!match) throw new Error(`Analysis HTML is missing ${label}`);
  return match[1];
}

// Adapter for the saved student-report HTML. Never execute source scripts or copy its markup.
export function extractAnalysis(html, metadata, sourceRef) {
  if (metadata.schema_version !== "medical-entrance-past-exam-analysis.v6") throw new Error("Unsupported analysis metadata schema");
  if (!html.includes('data-report-mode="student"')) throw new Error("Expected a student analysis report");
  const title = plain(capture(html, /<title>([\s\S]*?)<\/title>/, "title"));
  if (!title.includes(`${metadata.package.university_name} ${metadata.package.academic_year}`) || !title.includes(metadata.package.subject_name)) throw new Error("HTML and package metadata do not match");
  const seen = new Set();
  const majorQuestions = [...html.matchAll(/<article class="card major-question" id="([^"]+)">([\s\S]*?)<\/article>/g)].map((match) => {
    const [, id, body] = match;
    const canonical = metadata.major_questions.find((q) => q.id === id);
    if (!canonical || seen.has(id)) throw new Error(`Unexpected or duplicate major question ${id}`);
    seen.add(id);
    const header = body.slice(0, body.indexOf('<div class="subquestion-list">'));
    const requirements = axes.map((axis) => {
      const score = Number(capture(header, new RegExp(`<text[^>]*>${axis} ([0-9.]+)</text>`), `${id} ${axis}`));
      const total = canonical.subquestions.reduce((n, s) => n + s.scoring.points, 0);
      const expected = Math.round(canonical.subquestions.reduce((n, s) => n + s.radar[axis] * s.scoring.points, 0) / total * 10) / 10;
      if (!Number.isFinite(score) || score < 0 || score > 5 || score !== expected) throw new Error(`Stale or invalid requirement score: ${id} ${axis}`);
      return score;
    });
    const subquestions = [...body.matchAll(/<section class="subquestion" id="([^"]+)">([\s\S]*?)<\/section>/g)].map((sub) => {
      const [, subId, subBody] = sub;
      const original = canonical.subquestions.find((s) => s.id === subId);
      if (!original || seen.has(subId)) throw new Error(`Unexpected or duplicate subquestion ${subId}`);
      seen.add(subId);
      const pills = [...capture(subBody, /<div class="pill-row">([\s\S]*?)<\/div>/, `${subId} labels`).matchAll(/<span[^>]*>([\s\S]*?)<\/span>/g)].map((m) => plain(m[1]));
      const difficulty = pills[0];
      const weak = pills[1]?.replace(/^苦手: /, "");
      const strong = pills[2]?.replace(/^得意: /, "");
      if (!difficulties.includes(difficulty) || !actions.includes(weak) || !actions.includes(strong) || difficulty !== original.difficulty || weak !== original.strategy.weak_subject || strong !== original.strategy.strong_subject) throw new Error(`Stale or invalid assessment: ${subId}`);
      return {
        id: subId,
        label: plain(capture(subBody, /<span class="subquestion__label">([\s\S]*?)<\/span>/, `${subId} label`)),
        difficulty, weak, strong,
        difficultyReason: plain(capture(subBody, /<h4>レベル判断<\/h4><p>([\s\S]*?)<\/p>/, `${subId} difficulty reason`)),
        strategyReason: plain(capture(subBody, /<h4>解く順番の理由<\/h4><p>([\s\S]*?)<\/p>/, `${subId} strategy reason`)),
        prerequisites: original.optimization_prerequisites,
      };
    });
    if (subquestions.length !== canonical.subquestions.length) throw new Error(`Incomplete subquestions: ${id}`);
    return { id, label: canonical.label, sourceTitle: plain(capture(header, /<h3>([\s\S]*?)<\/h3>/, `${id} title`)), requirements, subquestions };
  });
  if (!majorQuestions.length || majorQuestions.length !== metadata.major_questions.length) throw new Error("Incomplete major questions");
  return {
    schemaVersion: "lexus-analysis-evidence.v1", package: metadata.package,
    source: { project: "shidai-igakubu-gokaku-dokuhon", html: sourceRef, sha256: crypto.createHash("sha256").update(html).digest("hex"), approved: metadata.review.approved === true && !html.includes("編集責任者未承認") },
    axes, aggregation: "provisional_points_weighted_mean", majorQuestions,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = Object.fromEntries(Array.from({ length: (process.argv.length - 2) / 2 }, (_, i) => [process.argv[2 + i * 2], process.argv[3 + i * 2]]));
  for (const key of ["--html", "--metadata", "--source-ref", "--output"]) if (!args[key]) throw new Error(`Missing ${key}`);
  const evidence = extractAnalysis(fs.readFileSync(args["--html"], "utf8"), JSON.parse(fs.readFileSync(args["--metadata"], "utf8")), args["--source-ref"]);
  fs.mkdirSync(path.dirname(args["--output"]), { recursive: true });
  fs.writeFileSync(args["--output"], `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(`Extracted ${evidence.majorQuestions.length} major questions from saved analysis HTML`);
}
