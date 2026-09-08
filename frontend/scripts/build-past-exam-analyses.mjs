import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { analysisAxesFor, difficulties, actions, validateTargetAnalysis } from "./import-past-exam-analysis.mjs";
import { normalizeInequalities } from "../src/lib/mathNotation.mjs";

const defaultTargetPolicies = JSON.parse(fs.readFileSync(new URL("../src/data/pastExamAnalysisTargetPolicies.json", import.meta.url), "utf8"));

function requireText(value) {
  if (typeof value !== "string" || !value.trim()) throw new Error("Missing editorial text");
  // Editorial copy follows the same Japanese inequality convention as the pages.
  return normalizeInequalities(value);
}

const round1 = (n) => Math.round((n + 1e-12) * 10) / 10;
const isPlainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

function validateTargetProfileOverrides(overrides, profileIds = null) {
  if (!Array.isArray(overrides) || overrides.length === 0) throw new Error("Invalid target profile overrides");
  const seen = new Set();
  for (const override of overrides) {
    const allowedKeys = new Set(["id", "reliabilityFactor", "rounding", "reason"]);
    if (!isPlainObject(override)
      || Object.keys(override).some((key) => !allowedKeys.has(key))
      || !["weak", "strong"].includes(override.id)
      || profileIds && !profileIds.has(override.id)
      || seen.has(override.id)
      || !Number.isFinite(override.reliabilityFactor)
      || !(override.reliabilityFactor > 0 && override.reliabilityFactor <= 1)
      || !["none", "floor_to_whole_point"].includes(override.rounding)) throw new Error("Invalid target profile override");
    requireText(override.reason);
    seen.add(override.id);
  }
  return overrides;
}

function applyTargetProfileOverrides(targetAnalysis, overrides, questionIds) {
  if (overrides === undefined) return targetAnalysis;

  const result = structuredClone(targetAnalysis);
  validateTargetProfileOverrides(overrides, new Set(result.profiles.map((profile) => profile.id)));
  for (const override of overrides) {
    const profile = result.profiles.find((candidate) => candidate.id === override.id);
    profile.reliabilityFactor = override.reliabilityFactor;
    profile.rounding = override.rounding;
    const rawTarget = profile.maximum.points * profile.reliabilityFactor;
    profile.targetPoints = profile.rounding === "none" ? rawTarget : Math.floor(rawTarget);
    profile.targetPercent = round1(profile.targetPoints / result.totalPoints * 100);
    profile.policyReason = requireText(override.reason);
  }

  return validateTargetAnalysis(result, questionIds);
}

function resolveTargetProfileOverrides(policies, packageData, editorial) {
  const topKeys = new Set(["schemaVersion", "universities"]);
  if (!isPlainObject(policies)
    || policies.schemaVersion !== "lexus-analysis-target-policies.v1"
    || !isPlainObject(policies.universities)
    || Object.keys(policies).some((key) => !topKeys.has(key))) throw new Error("Invalid analysis target policy registry");

  for (const [universityId, universityPolicy] of Object.entries(policies.universities)) {
    if (!/^[a-z0-9-]+$/.test(universityId)
      || !isPlainObject(universityPolicy)
      || !isPlainObject(universityPolicy.subjects)
      || Object.keys(universityPolicy).some((key) => key !== "subjects")) throw new Error("Invalid analysis target policy registry");
    for (const [subjectId, subjectPolicy] of Object.entries(universityPolicy.subjects)) {
      if (!/^[a-z0-9-]+$/.test(subjectId)
        || !isPlainObject(subjectPolicy)
        || Object.keys(subjectPolicy).some((key) => key !== "targetProfileOverrides")) throw new Error("Invalid analysis target policy registry");
      try {
        validateTargetProfileOverrides(subjectPolicy.targetProfileOverrides);
      } catch {
        throw new Error("Invalid analysis target policy registry");
      }
    }
  }

  const universityPolicy = policies.universities[packageData.university_id];
  const subjectPolicy = universityPolicy?.subjects?.[packageData.subject_id];
  return editorial.targetProfileOverrides ?? subjectPolicy?.targetProfileOverrides;
}

export function buildAnalysis(evidence, editorial, targetPolicies = defaultTargetPolicies) {
  if (evidence.schemaVersion !== "lexus-analysis-evidence.v1" || evidence.package.id !== editorial.packageId) throw new Error("Analysis package mismatch");
  const axes = analysisAxesFor(evidence.package.subject_id);
  if (JSON.stringify(evidence.axes) !== JSON.stringify(axes) || evidence.aggregation !== "provisional_points_weighted_mean") throw new Error("Unsupported assessment axes or aggregation");
  const p = evidence.package;
  const examTotal = editorial.examTotal ?? null;
  if (examTotal && (!Number.isSafeInteger(examTotal.points) || examTotal.points < p.total_points || !Number.isSafeInteger(examTotal.subjectCount) || examTotal.subjectCount < 1)) throw new Error("Invalid whole-exam total");
  for (const id of [p.university_id, p.subject_id]) if (!/^[a-z0-9-]+$/.test(id)) throw new Error("Invalid route identifier");
  if (!/^\d{4}$/.test(String(p.academic_year))) throw new Error("Invalid academic year");
  const root = `/past-exam-library/${p.university_id}/${p.academic_year}/${p.subject_id}/`;
  if (editorial.majorQuestions.length !== evidence.majorQuestions.length) throw new Error("Editorial major question coverage mismatch");
  const used = new Set();
  const majorQuestions = evidence.majorQuestions.map((major, index) => {
    const edited = editorial.majorQuestions.find((q) => q.id === major.id);
    if (!edited || used.has(major.id) || edited.subquestions.length !== major.subquestions.length) throw new Error(`Incomplete editorial mapping ${major.id}`);
    used.add(major.id);
    if (major.requirements.length !== axes.length || major.requirements.some((n) => !Number.isFinite(n) || n < 0 || n > 5)) throw new Error("Invalid requirement score");
    const subquestions = major.subquestions.map((s) => {
      const copy = edited.subquestions.find((q) => q.id === s.id);
      if (!copy || used.has(s.id) || !difficulties.includes(s.difficulty) || !actions.includes(s.weak) || !actions.includes(s.strong)) throw new Error(`Invalid subquestion ${s.id}`);
      used.add(s.id);
      if (!Number.isFinite(s.points) || s.points <= 0) throw new Error(`Invalid provisional points ${s.id}`);
      return { id: s.id, label: s.label, title: requireText(copy.title), note: requireText(copy.note), difficulty: difficulties.indexOf(s.difficulty), weak: actions.indexOf(s.weak), strong: actions.indexOf(s.strong), points: s.points };
    });
    const anchor = `major-question-${String(index + 1).padStart(2, "0")}`;
    return { id: major.id, label: major.label, title: requireText(edited.title), subtitle: requireText(edited.subtitle), summary: requireText(edited.summary), studyAction: requireText(edited.studyAction), requirements: major.requirements, subquestions, questionsPath: `${root}questions/#${anchor}`, answersPath: `${root}answers/#${anchor}` };
  });
  const counts = difficulties.map((_, level) => majorQuestions.flatMap((m) => m.subquestions).filter((s) => s.difficulty === level).length);
  const pointsTotal = majorQuestions.flatMap((m) => m.subquestions).reduce((n, s) => n + s.points, 0);
  if (pointsTotal !== p.total_points) throw new Error("Provisional point total mismatch");
  const questionIds = majorQuestions.flatMap((m) => m.subquestions.map((s) => s.id));
  // Validate the immutable source snapshot before applying an explicitly authored
  // package or university/subject policy. This keeps source evidence auditable
  // without hard-coding route IDs in the builder.
  const sourceTargetAnalysis = validateTargetAnalysis(evidence.targetAnalysis, questionIds);
  const targetProfileOverrides = resolveTargetProfileOverrides(targetPolicies, p, editorial);
  const targetAnalysis = applyTargetProfileOverrides(sourceTargetAnalysis, targetProfileOverrides, questionIds);
  if (editorial.targets?.length !== targetAnalysis.profiles.length) throw new Error("Incomplete target editorial coverage");
  const targets = {
    ...targetAnalysis,
    profiles: targetAnalysis.profiles.map((profile) => {
      const copy = editorial.targets.find((t) => t.id === profile.id);
      if (!copy) throw new Error("Missing target editorial profile");
      // Some subjects require replacing an initial selection, not merely adding to it.
      // Meeting the point target is not sufficient when the selected "now" plan
      // exceeds the subject's time limit. In that case, use the validated
      // maximum plan, which is guaranteed to fit the budget.
      const route = profile.now.points >= profile.targetPoints && profile.now.minutes <= targetAnalysis.timeBudgetMinutes
        ? profile.now
        : profile.maximum;
      if (route.minutes > targetAnalysis.timeBudgetMinutes) throw new Error("Target route exceeds the provisional time budget");
      const replacedIds = profile.now.questionIds.filter((id) => !route.questionIds.includes(id));
      const routeKind = replacedIds.length ? "replacement" : "addition";
      const labelFor = (id) => {
        const major = majorQuestions.find((m) => m.subquestions.some((s) => s.id === id));
        const subquestion = major.subquestions.find((s) => s.id === id);
        const numberedProblem = /^問題\s*\d+(?:\s*[〜～]\s*\d+)?$/.test(major.label)
          && /^問題\s*\d+$/.test(subquestion.label);
        return { id, label: numberedProblem ? subquestion.label : `${major.label} ${subquestion.label}` };
      };
      const additional = route.questionIds.filter((id) => !profile.now.questionIds.includes(id)).map(labelFor);
      return {
        ...profile,
        title: requireText(copy.title),
        summary: requireText(copy.summary),
        focus: requireText(copy.focus),
        ...(copy.advisory === undefined ? {} : { advisory: requireText(copy.advisory) }),
        route,
        additional,
        ...(routeKind === "replacement" ? { routeKind, replaced: replacedIds.map(labelFor) } : {}),
      };
    }),
  };
  return {
    schemaVersion: "lexus-analysis-page.v1", packageId: p.id,
    route: { university: p.university_id, year: String(p.academic_year), subject: p.subject_id, path: `${root}analysis/` },
    university: p.university_name, year: p.academic_year, subject: p.subject_name, examLabel: p.exam_method_name,
    duration: requireText(editorial.durationLabel ?? p.time_limit.note), format: requireText(editorial.format),
    examTotal: examTotal ? { points: examTotal.points, subjectCount: examTotal.subjectCount } : null,
    headline: requireText(editorial.headline), summary: requireText(editorial.summary), requirementsSummary: requireText(editorial.requirementsSummary),
    profiles: editorial.profiles.map((profile) => ({ id: profile.id, title: requireText(profile.title), text: requireText(profile.text) })),
    majorQuestions, difficultyCounts: counts, targets, source: evidence.source, editorialNotes: editorial.editorialNotes,
    ...(editorial.targetReviewNote ? { targetReviewNote: requireText(editorial.targetReviewNote) } : {}),
    links: { questions: `${root}questions/`, answers: `${root}answers/`, university: `/past-exam-library/${p.university_id}/` },
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL("../src/data/", import.meta.url));
  const output = path.join(root, "generated/pastExamAnalyses");
  fs.mkdirSync(output, { recursive: true });
  for (const file of fs.readdirSync(path.join(root, "pastExamAnalysisSources")).filter((n) => n.endsWith(".json")).sort()) {
    const evidence = JSON.parse(fs.readFileSync(path.join(root, "pastExamAnalysisEvidence", file), "utf8"));
    const editorial = JSON.parse(fs.readFileSync(path.join(root, "pastExamAnalysisSources", file), "utf8"));
    fs.writeFileSync(path.join(output, file), `${JSON.stringify(buildAnalysis(evidence, editorial), null, 2)}\n`);
    console.log(`Built analysis: ${editorial.packageId}`);
  }
}
