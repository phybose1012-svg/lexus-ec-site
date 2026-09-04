import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { axes, difficulties, actions, validateTargetAnalysis } from "./import-past-exam-analysis.mjs";

function requireText(value) {
  if (typeof value !== "string" || !value.trim()) throw new Error("Missing editorial text");
  return value;
}

export function buildAnalysis(evidence, editorial) {
  if (evidence.schemaVersion !== "lexus-analysis-evidence.v1" || evidence.package.id !== editorial.packageId) throw new Error("Analysis package mismatch");
  if (JSON.stringify(evidence.axes) !== JSON.stringify(axes) || evidence.aggregation !== "provisional_points_weighted_mean") throw new Error("Unsupported assessment axes or aggregation");
  const p = evidence.package;
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
  const targetAnalysis = validateTargetAnalysis(evidence.targetAnalysis, majorQuestions.flatMap((m) => m.subquestions.map((s) => s.id)));
  if (editorial.targets?.length !== targetAnalysis.profiles.length) throw new Error("Incomplete target editorial coverage");
  const targets = {
    ...targetAnalysis,
    profiles: targetAnalysis.profiles.map((profile) => {
      const copy = editorial.targets.find((t) => t.id === profile.id);
      if (!copy) throw new Error("Missing target editorial profile");
      // A compact additional-question route is valid only if it extends the initial selection.
      const route = profile.now.points >= profile.targetPoints ? profile.now : profile.maximum;
      if (route.minutes > targetAnalysis.timeBudgetMinutes) throw new Error("Target route exceeds the provisional time budget");
      if (profile.now.questionIds.some((id) => !route.questionIds.includes(id))) throw new Error("Target route replaces initial questions; provide a dedicated comparison");
      const additional = route.questionIds.filter((id) => !profile.now.questionIds.includes(id)).map((id) => {
        const major = majorQuestions.find((m) => m.subquestions.some((s) => s.id === id));
        return { id, label: `${major.label} ${major.subquestions.find((s) => s.id === id).label}` };
      });
      return { ...profile, title: requireText(copy.title), summary: requireText(copy.summary), focus: requireText(copy.focus), route, additional };
    }),
  };
  return {
    schemaVersion: "lexus-analysis-page.v1", packageId: p.id,
    route: { university: p.university_id, year: String(p.academic_year), subject: p.subject_id, path: `${root}analysis/` },
    university: p.university_name, year: p.academic_year, subject: p.subject_name, examLabel: p.exam_method_name,
    duration: requireText(p.time_limit.note), format: requireText(editorial.format),
    headline: requireText(editorial.headline), summary: requireText(editorial.summary), requirementsSummary: requireText(editorial.requirementsSummary),
    profiles: editorial.profiles.map((profile) => ({ id: profile.id, title: requireText(profile.title), text: requireText(profile.text) })),
    majorQuestions, difficultyCounts: counts, targets, source: evidence.source, editorialNotes: editorial.editorialNotes,
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
