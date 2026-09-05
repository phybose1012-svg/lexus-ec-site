// Static artifact/contract tests; no browser or print rendering is performed.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { parse, parseFragment } from "parse5";
import { analysisAxesFor, profileMinutes } from "./import-past-exam-analysis.mjs";
import { buildAnalysis } from "./build-past-exam-analyses.mjs";
import { loadFigureManifest, renderRegisteredFigure, replaceSourceFigures } from "../src/lib/pastExamFigures.mjs";

const root = new URL("../", import.meta.url);
const id = "iwate-medical-2025-general-physics";
const route = "/past-exam-library/iwate-medical/2025/physics/";
const read = (p) => fs.readFileSync(new URL(p, root), "utf8");
const json = (p) => JSON.parse(read("src/data/" + p + "/" + id + ".json"));
const question = json("generated/pastExamQuestions");
const authored = json("pastExamAnswerSources");
const evidence = json("pastExamAnalysisEvidence");
const analysis = buildAnalysis(evidence, json("pastExamAnalysisSources"));
const manifest = json("pastExamFigures");
const registry = loadFigureManifest(fileURLToPath(new URL("src/data/pastExamFigures/" + id + ".json", root)), fileURLToPath(new URL("public", root)), id);
const attr = (n, k) => n.attrs?.find((a) => a.name === k)?.value;
const nodes = (n) => [n, ...(n.childNodes ?? []).flatMap(nodes)];
const text = (n) => n.nodeName === "#text" ? n.value : (n.childNodes ?? []).map(text).join("");
const cls = (n, c) => (attr(n, "class") ?? "").split(" ").includes(c);
const pages = Object.fromEntries(["questions", "answers", "analysis"].map((mode) => [mode, nodes(parse(read("dist" + route + mode + "/index.html")))]));

test("all 24 physics subquestions and key slots are covered", () => {
  assert.equal(question.document.questions.length, 3);
  assert.deepEqual(question.document.questions.map((q) => nodes(parseFragment(q.html)).filter((n) => n.tagName === "h3").map(text)), Array(3).fill(Array.from({ length: 8 }, (_, i) => "問" + (i + 1))));
  const keys = authored.document.majorQuestions.flatMap((m) => m.answerKey.flatMap((k) => k.entries));
  assert.deepEqual(keys.map((k) => k.mark), Array.from({ length: 24 }, (_, i) => String(i + 1)));
  assert.deepEqual(keys.map((k) => k.value), ["⑤","③","⑤","⑥","②","⑤","⑥","①","①","②","④","④","④","④","①","①","②","①","②","④","③","⑥","③","③"]);
  assert.deepEqual(authored.document.majorQuestions.map((m) => m.sections.length), [8, 8, 8]);
  assert.equal(pages.answers.filter((n) => cls(n, "answer-key__slot")).length, 24);
});

test("exam-specific time, points and print notes do not inherit mathematics assumptions", () => {
  assert.equal(question.exam.duration, "理科2科目 合計120分");
  assert.equal(analysis.targets.totalPoints, 75);
  assert.deepEqual(analysis.examTotal, { points: 350, subjectCount: 4 });
  assert.deepEqual(analysis.difficultyCounts, [5, 5, 11, 3]);
  const items = analysis.majorQuestions.flatMap((m) => m.subquestions);
  assert.equal(items.reduce((sum, q) => sum + q.points, 0), 75);
  assert.deepEqual([0,1,2,3].map((level) => items.filter((q) => q.difficulty === level).reduce((sum, q) => sum + q.points, 0)), [15,15,34,11]);
  assert.ok(question.document.printNotes.every((s) => !/数学|英語/.test(s)));
  assert.equal(analysis.source.approved, false);
  assert.equal(authored.source.needsHumanReview, true);
});

test("original figures completely replace source crops and explanation placeholders", () => {
  assert.equal(manifest.items.length, 10);
  for (const [mode, count] of [["questions", 9], ["answers", 3]]) {
    const figures = pages[mode].filter((n) => cls(n, "past-exam-figure"));
    assert.equal(figures.length, count);
    for (const figure of figures) {
      const image = nodes(figure).find((n) => n.tagName === "img");
      const item = registry.bySrc.get(attr(image, "src"));
      assert.ok(item);
      assert.equal(attr(image, "alt"), item.alt);
      assert.equal(attr(image, "width"), String(item.width));
      assert.equal(attr(image, "height"), String(item.height));
      assert.equal(attr(image, "loading"), "eager");
      assert.ok(nodes(figure).some((n) => n.tagName === "figcaption"));
    }
    assert.ok(!pages[mode].some((n) => cls(n, "answer-figure-placeholder")));
  }
  for (const item of manifest.items) {
    const svg = read("public" + item.src);
    assert.match(svg, /<svg/);
    assert.ok(!/<script|<image|<foreignObject|(?:href|onload)\s*=/i.test(svg), item.id);
    assert.ok(fs.existsSync(new URL("dist" + item.src, root)));
  }
});

test("scientific labels use embedded KaTeX typography while Japanese labels stay readable", () => {
  const textPattern = /<text([^>]*)>([\s\S]*?)<\/text>/g;
  let mathLabelCount = 0;
  let subscriptCount = 0;
  for (const item of manifest.items) {
    const svg = read(`public${item.src}`);
    const labels = [...svg.matchAll(textPattern)];
    const mathLabels = labels.filter((match) => /[A-Za-zφϕ0-9−=]/.test(match[2].replace(/<[^>]+>/g, "")));
    mathLabelCount += mathLabels.length;
    subscriptCount += (svg.match(/class="sub /g) ?? []).length;
    for (const match of mathLabels) assert.match(match[1], /class="math/);
    assert.equal(svg.includes("@font-face{font-family:'KaTeX_Main'"), mathLabels.length > 0, item.id);
    if (mathLabels.length > 0) {
      assert.equal((svg.match(/data:font\/woff2;base64/g) ?? []).length, 2, item.id);
      assert.match(svg, /\.math \.mi\{font-family:'KaTeX_Math'/);
    }
  }
  assert.ok(mathLabelCount > 30);
  assert.ok(subscriptCount > 15);
});

test("the iron-core flux label matches the glyph rendered by TeX phi", () => {
  const context = {};
  vm.runInNewContext(read("public/assets/vendor/katex/katex.min.js"), context);
  const renderedPhi = context.katex.renderToString("\\phi");
  const svg = read("public/assets/past-exams/iwate-medical-2025-general-physics/figures/q2-core-circuit-source.svg");

  assert.match(renderedPhi, /mathnormal">ϕ<\/span>/);
  assert.match(svg, /<tspan class="mi">ϕ<\/tspan>/);
  assert.doesNotMatch(svg, /<tspan class="mi">φ<\/tspan>/);
});

test("figure registry fails closed on unregistered, duplicated and cross-package assets", () => {
  assert.throws(() => renderRegisteredFigure(registry, "missing"), /Unregistered/);
  assert.throws(() => replaceSourceFigures('<figure data-crop-id="missing"></figure>', registry), /Unregistered/);
  const figure = '<figure data-crop-id="q1-orbit-circle"></figure>';
  assert.throws(() => replaceSourceFigures(figure + figure, registry), /Duplicate/);
  assert.match(replaceSourceFigures(figure, registry), /data-figure-id="q1-orbit-circle"/);
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "lexus-physics-figures-test-"));
  try {
    for (const mutate of [
      (m) => { m.items[0].src = "/assets/past-exams/other/figures/test.svg"; },
      (m) => { m.items[0].src = "/assets/past-exams/" + id + "/figures/../test.svg"; },
      (m) => { m.items[0].alt = ""; },
      (m) => { m.items.push(m.items[0]); },
      (m) => { m.restrictedSourceCopied = true; },
    ]) {
      const bad = structuredClone(manifest); mutate(bad);
      const file = path.join(temp, "manifest.json");
      fs.writeFileSync(file, JSON.stringify(bad));
      assert.throws(() => loadFigureManifest(file, fileURLToPath(new URL("public", root)), id));
    }
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
});

test("physics axes, per-item time rounding and replacement route remain reproducible", () => {
  assert.deepEqual(analysisAxesFor("physics"), evidence.axes);
  assert.throws(() => analysisAxesFor("unknown"), /Unsupported/);
  assert.equal(profileMinutes([{ time: { execution_minutes: 0.5 } }, { time: { execution_minutes: 0.5 } }], "execution_minutes", 1.5), 1.6);
  const [weak, strong] = analysis.targets.profiles;
  assert.equal(weak.scanMinutes, 48.4);
  assert.deepEqual([weak.targetPoints, weak.route.points, weak.route.minutes], [27, 27, 59.1]);
  assert.equal(weak.routeKind, "replacement");
  assert.deepEqual(weak.replaced.map((q) => q.id), ["phys-q1-1"]);
  assert.deepEqual(weak.additional.map((q) => q.id), ["phys-q3-1", "phys-q3-4"]);
  assert.deepEqual([strong.targetPoints, strong.route.points, strong.route.minutes], [60, 72, 45.6]);
  for (const p of [weak, strong]) {
    assert.ok(p.route.minutes <= 60);
    const selected = evidence.majorQuestions.flatMap((m) => m.subquestions).filter((q) => p.route.questionIds.includes(q.id));
    assert.equal(selected.reduce((sum, q) => sum + q.points, 0), p.route.points);
    for (const q of selected) assert.ok(q.prerequisites[p.id + "_subject"].every((id) => p.route.questionIds.includes(id)));
  }
});

test("all question and answer TeX parses with the shipped KaTeX runtime", () => {
  const context = {};
  vm.runInNewContext(read("public/assets/vendor/katex/katex.min.js"), context);
  let count = 0;
  for (const mode of ["questions", "answers"]) {
    for (const n of pages[mode].filter((n) => attr(n, "data-katex") !== undefined)) {
      const latex = attr(n, "data-katex");
      assert.doesNotThrow(() => context.katex.renderToString(latex, { throwOnError: true, strict: "error", displayMode: attr(n, "data-display-mode") === "true" }), latex);
      count++;
    }
  }
  assert.ok(count > 250);
});

test("orbit, flux and lens numerical invariants agree with the independently derived answers", () => {
  const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-10, a + " != " + b);
  const GM = 1, R = 1, u = Math.sqrt(GM / (2 * R)), vp = Math.sqrt(7 * GM / (9 * R)), va = 2 * vp / 7;
  close(vp * 2 * R, va * 7 * R);
  close(0.5 * vp ** 2 - GM / (2 * R), 0.5 * va ** 2 - GM / (7 * R));
  close(4 * u - 3 * vp, (4 - Math.sqrt(14)) * u);
  assert.ok(4 * u - 3 * vp > 0);
  close((4.5 / 2) ** 1.5, 27 / 8);
  const r = 2, i0 = 3, T = 5, N2 = 10;
  const deltaFlux = (i, duration) => -r * i * duration / N2;
  close(deltaFlux(-i0, T) + deltaFlux(0, 2 * T) + deltaFlux(i0, T), 0);
  const R1 = 12, wavelength = 4.8e-7, radius = 8e-3;
  const R2 = radius ** 2 * R1 / (radius ** 2 + 4.5 * R1 * wavelength);
  assert.equal(R2.toFixed(1), "8.5");
  close(Math.sqrt(4.5 * R1 * R2 * wavelength / (R1 - R2)), radius);
});

test("all three pages retain distinct navigation, branding, and physics-only links", () => {
  for (const [mode, page] of Object.entries(pages)) {
    const tabs = page.filter((n) => cls(n, "past-exam-document-tab"));
    assert.equal(tabs.length, 3);
    assert.equal(tabs.filter((n) => attr(n, "aria-current") === "page").length, 1);
    for (const tab of tabs.filter((n) => n.tagName === "a")) assert.ok(attr(tab, "href").startsWith(route));
    for (const c of ["past-exam-info", "past-exam-contents"]) assert.equal(page.filter((n) => cls(n, c)).length, 1);
    assert.equal(page.filter((n) => cls(n, "past-exam-brand-divider")).length, mode === "analysis" ? 4 : 3);
  }
});
