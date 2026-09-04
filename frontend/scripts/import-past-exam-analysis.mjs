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

const round1 = (n) => Math.round(n * 10) / 10;
function sameNumber(actual, expected, label) {
  if (!Number.isFinite(actual) || actual !== expected) throw new Error(`Stale or invalid target ${label}`);
}

export function validateTargetAnalysis(targets, questionIds) {
  if (!targets || targets.basis !== "provisional_editorial" || !Number.isFinite(targets.totalPoints) || !(targets.totalPoints > 0) || !Number.isFinite(targets.timeBudgetMinutes) || !(targets.timeBudgetMinutes > 0)) throw new Error("Missing or unsupported target assumptions");
  if (targets.profiles?.length !== 2 || targets.profiles.map((p) => p.id).join() !== "weak,strong") throw new Error("Incomplete target profiles");
  for (const p of targets.profiles) {
    if (!(p.reliabilityFactor > 0 && p.reliabilityFactor <= 1) || !["none", "floor_to_whole_point"].includes(p.rounding) || !Number.isFinite(p.judgmentMultiplier) || !(p.judgmentMultiplier > 0) || !Number.isFinite(p.executionMultiplier) || !(p.executionMultiplier > 0)) throw new Error("Invalid target profile rule");
    for (const plan of [p.maximum, p.now, p.nowPlusLater]) {
      if (!plan || !Number.isFinite(plan.points) || plan.points < 0 || plan.points > targets.totalPoints || !Number.isFinite(plan.minutes) || plan.minutes < 0 || !Array.isArray(plan.questionIds) || new Set(plan.questionIds).size !== plan.questionIds.length || plan.questionIds.some((id) => !questionIds.includes(id))) throw new Error("Invalid target plan");
    }
    const raw = p.maximum.points * p.reliabilityFactor;
    sameNumber(p.targetPoints, p.rounding === "none" ? raw : Math.floor(raw), "points");
    sameNumber(p.targetPercent, round1(p.targetPoints / targets.totalPoints * 100), "percent");
    if (p.maximum.minutes > targets.timeBudgetMinutes || [...p.now.questionIds, ...p.maximum.questionIds].some((id) => !p.nowPlusLater.questionIds.includes(id))) throw new Error("Invalid target candidate or time budget");
  }
  return targets;
}

// The report displays the result; its derived companion supplies the selected question IDs.
// Cross-check both against the canonical points/time model before publishing the snapshot.
export function extractTargetAnalysis(html, metadata, derived) {
  const policy = metadata.calculation_policy;
  if (!policy?.target_optimization && !html.includes('class="target target--')) return null;
  if (derived?.schema_version !== "medical-entrance-past-exam-derived.v6" || derived.package_id !== metadata.package.id) throw new Error("Missing or mismatched target derived data");
  if (policy.scoring.basis !== "provisional_editorial" || policy.time_budget.basis !== "provisional_editorial" || policy.time_model.base_profile !== "strong_subject") throw new Error("Unsupported target calculation policy");
  const questions = metadata.major_questions.flatMap((m) => m.subquestions);
  sameNumber(questions.reduce((n, q) => n + q.scoring.points, 0), metadata.package.total_points, "total points");
  const table = capture(html, /<table class="profile-table">([\s\S]*?)<\/table>/, "target strategy table");
  const profiles = ["weak", "strong"].map((id) => {
    const key = `${id}_subject`;
    const profile = derived.profiles[key];
    const rule = policy.target_optimization.profiles[key];
    const time = policy.time_model.profiles[key];
    const row = capture(table, new RegExp(`<tr><th>${id === "weak" ? "苦手" : "得意"}科目</th>([\\s\\S]*?)</tr>`), `${id} target row`);
    const cells = [...row.matchAll(/<td>([\s\S]*?)<\/td>/g)].map((m) => plain(m[1]));
    const target = cells[1]?.match(/^([\d.]+)%（仮([\d.]+)点） 理論最大 ([\d.]+)%（仮([\d.]+)点）・([\d.]+)分/);
    if (!target) throw new Error(`Unsupported target result row ${id}`);
    const percent = Number(capture(html, new RegExp(`<div class="target target--${id}">[^<]*<strong>([0-9.]+)%</strong>`), `${id} target headline`));
    sameNumber(percent, profile.target_percent, `${id} headline`);
    const plan = profile.target_plan;
    [plan.target_percent, plan.target_points, plan.theoretical_max_percent, plan.theoretical_max_points, plan.minutes].forEach((n, i) => sameNumber(Number(target[i + 1]), n, `${id} result`));
    sameNumber(plan.reliability_factor, rule.reliability_factor, `${id} reliability factor`);
    if (plan.rounding !== rule.rounding) throw new Error("Stale target rounding");
    const readPlan = (sourcePlan, isMaximum = false) => {
      const ids = sourcePlan.subquestion_ids;
      if (!Array.isArray(ids) || new Set(ids).size !== ids.length) throw new Error("Invalid target question selection");
      const selected = ids.map((qid) => questions.find((q) => q.id === qid));
      if (selected.some((q) => !q || !policy.target_optimization.candidate_actions.includes(q.strategy[key]) || q.optimization_prerequisites[key].some((qid) => !ids.includes(qid)))) throw new Error("Invalid target prerequisite or candidate");
      const points = sourcePlan[isMaximum ? "theoretical_max_points" : "points"];
      sameNumber(points, selected.reduce((n, q) => n + q.scoring.points, 0), `${id} plan points`);
      const judgment = questions.reduce((n, q) => n + q.time.initial_judgment_minutes, 0) * time.initial_judgment_multiplier;
      const execution = selected.reduce((n, q) => n + q.time.execution_minutes, 0) * time.execution_multiplier;
      sameNumber(sourcePlan.minutes, round1(judgment + execution), `${id} plan time`);
      return { points, minutes: sourcePlan.minutes, questionIds: ids };
    };
    const maximum = readPlan(plan, true);
    const now = readPlan(profile.now);
    const nowPlusLater = readPlan(profile.now_plus_later);
    for (const [i, value] of [now, nowPlusLater].entries()) {
      const displayed = cells[i + 2]?.match(/^[\d.]+%（仮配点 ([\d.]+)点） ([\d.]+)分/);
      if (!displayed) throw new Error(`Missing target strategy values ${id}`);
      sameNumber(Number(displayed[1]), value.points, `${id} strategy points`);
      sameNumber(Number(displayed[2]), value.minutes, `${id} strategy time`);
    }
    const nowIds = questions.filter((q) => q.strategy[key] === "今解く！").map((q) => q.id).sort();
    if (JSON.stringify([...now.questionIds].sort()) !== JSON.stringify(nowIds)) throw new Error("Stale target priority selection");
    return { id, targetPoints: Number(target[2]), targetPercent: percent, reliabilityFactor: rule.reliability_factor, rounding: rule.rounding, judgmentMultiplier: time.initial_judgment_multiplier, executionMultiplier: time.execution_multiplier, maximum, now, nowPlusLater };
  });
  return validateTargetAnalysis({ basis: "provisional_editorial", totalPoints: metadata.package.total_points, timeBudgetMinutes: policy.time_budget.minutes, profiles }, questions.map((q) => q.id));
}

// Adapter for the saved student-report HTML. Never execute source scripts or copy its markup.
export function extractAnalysis(html, metadata, sourceRef, derived) {
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
      const points = original.scoring.points;
      if (!Number.isFinite(points) || points <= 0) throw new Error(`Invalid provisional points: ${subId}`);
      return {
        id: subId,
        label: plain(capture(subBody, /<span class="subquestion__label">([\s\S]*?)<\/span>/, `${subId} label`)),
        difficulty, weak, strong, points,
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
    targetAnalysis: extractTargetAnalysis(html, metadata, derived),
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = Object.fromEntries(Array.from({ length: (process.argv.length - 2) / 2 }, (_, i) => [process.argv[2 + i * 2], process.argv[3 + i * 2]]));
  for (const key of ["--html", "--metadata", "--source-ref", "--output"]) if (!args[key]) throw new Error(`Missing ${key}`);
  const evidence = extractAnalysis(fs.readFileSync(args["--html"], "utf8"), JSON.parse(fs.readFileSync(args["--metadata"], "utf8")), args["--source-ref"], args["--derived"] ? JSON.parse(fs.readFileSync(args["--derived"], "utf8")) : undefined);
  fs.mkdirSync(path.dirname(args["--output"]), { recursive: true });
  fs.writeFileSync(args["--output"], `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(`Extracted ${evidence.majorQuestions.length} major questions from saved analysis HTML`);
}
