// Mathematical, publication-gate, and SVG tests for 慶應義塾大学 2025 一般選抜 数学.
//
// Important source boundary:
// The 2026-09-10 repaired candidate restores II, III and IV(2). Verify those
// conditions explicitly, retaining human/rights gates. Expected answers below
// are independently recomputed rather than trusted from the remediation report.
import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { parse } from "parse5";
import { loadFigureManifest } from "../src/lib/pastExamFigures.mjs";
import { SITE_ORIGIN } from "../src/lib/pastExamSeo.mjs";
import { unsafeSvgReason } from "../src/lib/svgSafety.mjs";

const root = new URL("../", import.meta.url);
const packageId = "keio-2025-general-mathematics";
const routeBase = "/past-exam-library/keio/2025/mathematics";
const read = (path) => fs.readFileSync(new URL(path, root), "utf8");
const readJson = (path) => JSON.parse(read(path));

const questions = readJson(`src/data/generated/pastExamQuestions/${packageId}.json`);
const answers = readJson(`src/data/pastExamAnswerSources/${packageId}.json`);
const generatedAnswers = readJson(`src/data/generated/pastExamAnswers/${packageId}.json`);
const analysis = readJson(`src/data/generated/pastExamAnalyses/${packageId}.json`);
const evidence = readJson(`src/data/pastExamAnalysisEvidence/${packageId}.json`);
const manifest = readJson(`src/data/pastExamFigures/${packageId}.json`);
const purposes = readJson("src/data/pastExamFormulaPurposes.json");
const registry = loadFigureManifest(
  fileURLToPath(new URL(`src/data/pastExamFigures/${packageId}.json`, root)),
  fileURLToPath(new URL("public", root)),
  packageId,
);

const sections = answers.document.majorQuestions.flatMap((major) => major.sections);
const blocks = sections.flatMap((section) => section.blocks);
const close = (actual, expected, epsilon = 1e-9) => Math.abs(actual - expected) <= epsilon;
const valuesOf = (majorId, label) => {
  const major = answers.document.majorQuestions.find((item) => item.id === majorId);
  assert.ok(major, majorId);
  const group = major.answerKey.find((item) => item.label === label);
  assert.ok(group, `${majorId}: ${label}`);
  return Object.fromEntries(group.entries.map((entry) => [entry.mark, entry.value]));
};
const attr = (node, name) => node.attrs?.find((item) => item.name === name)?.value;
const nodes = (node) => [node, ...(node.childNodes ?? []).flatMap(nodes)];
const hasClass = (node, name) => (attr(node, "class") ?? "").split(/\s+/).includes(name);
const textContent = (node) => nodes(node)
  .filter((child) => child.nodeName === "#text")
  .map((child) => child.value)
  .join("")
  .replace(/\s+/g, "");

test("the repaired package restores the full conditions while retaining human/rights gates", () => {
  assert.equal(questions.packageId, packageId);
  assert.equal(questions.route.path, `${routeBase}/questions/`);
  assert.deepEqual(questions.document.questions.map(({ id, label }) => ({ id, label })), [
    { id: "major-question-01", label: "I" },
    { id: "major-question-02", label: "II" },
    { id: "major-question-03", label: "III" },
    { id: "major-question-04", label: "IV" },
  ]);
  assert.equal(questions.source.rightsStatus, "review_required");
  assert.equal(questions.source.needsHumanReview, true);

  assert.equal(answers.source.contentProvenance, "original_editorial");
  assert.equal(answers.source.restrictedSourceCopied, false);
  assert.equal(answers.source.needsHumanReview, true);
  assert.equal(generatedAnswers.source.needsHumanReview, true);
  assert.equal(evidence.source.approved, false);

  const q4 = questions.document.questions.find((item) => item.id === "major-question-04");
  assert.doesNotMatch(q4.html, /問題文記載の等角条件|IV（続き）|p_3,q_3/);
  assert.match(q4.html, /定める平面と直交し/);
  assert.match(q4.html, /この2つの面が共有する線分/);
  assert.match(q4.html, /Q_3\(a,b,0\)/);
  assert.match(q4.html, /a_2=\\boxed\{\\text\{か\}\}/);
  const q3 = questions.document.questions[2].html;
  const q3Math = nodes(parse(q3)).map(n => attr(n, "data-katex")).filter(Boolean);
  assert.ok(q3Math.includes("g(h(x))-\\left(\\{h(x)\\}^3+b\\{g(x)\\}^2+ch(x)+d\\right)=0"));
  assert.ok(q3Math.includes("F(a)=\\int_0^a\\left\\{g(x)-\\boxed{\\text{さ}}x-\\boxed{\\text{し}}-2(x-a)\\right\\}e^{-\\frac{(x-a)^2}{2}}\\,dx"));
  assert.doesNotMatch(q3, /R_a|Phi_a|III（続き）/);
  const iv2 = answers.document.majorQuestions
    .find((item) => item.id === "major-question-04")
    .sections.find((section) => section.title.startsWith("（2）（ii）"));
  assert.doesNotMatch(JSON.stringify(iv2), /修復後に|確認待ち/);
  assert.match(JSON.stringify(iv2), /必要十分/);
  assert.match(JSON.stringify(iv2), /Q_4=\(1,0,1\)/);
});

test("answer and analysis models cover all 15 independently identified subquestions", () => {
  assert.equal(answers.document.majorQuestions.length, 4);
  assert.deepEqual(answers.document.majorQuestions.map((major) => major.sections.length), [5, 2, 5, 3]);
  assert.equal(sections.length, 15);

  const analysisItems = analysis.majorQuestions.flatMap((major) => major.subquestions);
  assert.equal(analysis.majorQuestions.length, 4);
  assert.equal(analysisItems.length, 15);
  assert.equal(new Set(analysisItems.map((item) => item.id)).size, 15);
  assert.equal(analysisItems.reduce((sum, item) => sum + item.points, 0), 150);
  assert.deepEqual(
    [0, 1, 2, 3].map((level) => analysisItems.filter((item) => item.difficulty === level).length),
    [2, 5, 5, 3],
  );
  assert.equal(analysis.format, "空所補充・記述式併用");
  assert.equal(analysis.duration, "数学 100分（問題冊子記載）");

  assert.equal(evidence.targetAnalysis.totalPoints, 150);
  assert.equal(evidence.targetAnalysis.timeBudgetMinutes, 100);
  const weak = evidence.targetAnalysis.profiles.find((profile) => profile.id === "weak");
  const strong = evidence.targetAnalysis.profiles.find((profile) => profile.id === "strong");
  assert.deepEqual([weak.targetPoints, weak.targetPercent, weak.maximum.minutes], [58, 38.7, 99.4]);
  assert.deepEqual([strong.targetPoints, strong.targetPercent, strong.reliabilityFactor], [108, 72, 0.8]);
  assert.deepEqual([strong.maximum.points, strong.maximum.minutes], [136, 95.6]);
  assert.deepEqual(analysis.majorQuestions.map(m => m.subquestions.map(q => q.points)), [[8,6,6,8,12],[18,12],[6,10,12,10,12],[10,6,14]]);
  assert.ok(weak.now.questionIds.includes("math-q1-3"));
  assert.ok(!weak.maximum.questionIds.includes("math-q1-3"));
  assert.deepEqual(weak.maximum.questionIds, ["math-q1-1","math-q1-2","math-q1-4","math-q1-5","math-q2-2","math-q3-1i","math-q4-2i"]);
  const weakView = analysis.targets.profiles.find(p => p.id === "weak");
  assert.equal(weakView.routeKind, "replacement");
  assert.deepEqual(weakView.replaced.map(q => q.id), ["math-q1-3"]);
});

test("III restores both variation tables and both substitution-bound tables", () => {
  const iii = answers.document.majorQuestions[2].sections;
  const extremaTable = iii[3].blocks.find(b => b.variant === "variation");
  assert.deepEqual(extremaTable.rows[0], ["\\(g'(x)\\)", "", "+", "0", "−", "0", "+", ""]);
  const integralTables = iii[4].blocks.filter(b => b.type === "table");
  assert.equal(integralTables.length, 3);
  assert.deepEqual(integralTables[1].rows, [["\\(t\\)", "\\(-a\\)", "\\(0\\)"], ["\\(u\\)", "\\(-a^2/2\\)", "\\(0\\)"]]);
  assert.deepEqual(integralTables[2].rows[0], ["\\(F'(a)\\)", "", "+", "0", "−", "0", "+", "0", "−", ""]);
});

test("answer-key fractions use the opt-in KaTeX target without visible raw TeX", () => {
  assert.equal(answers.document.answerKeyValueRendering, "math");
  const answerHtml = generatedAnswers.document.majorQuestions.map((major) => major.html).join("");
  const answerNodes = nodes(parse(answerHtml));
  const keyValues = answerNodes.filter((node) => hasClass(node, "answer-key__value"));
  assert.ok(keyValues.length >= 30);
  assert.ok(keyValues.every((node) => attr(node, "data-display-mode") === "false"));
  assert.ok(keyValues.every((node) => (attr(node, "data-katex") ?? "").length > 0));
  assert.ok(keyValues.some((node) => (attr(node, "data-katex") ?? "").includes("\\frac")));
  assert.equal(keyValues.map(textContent).join(""), "");
});

test("I(1)-(5): statistics, density, Riemann sum, roots, and integer solutions agree with independent calculations", () => {
  const normal = valuesOf("major-question-01", "（1）");
  const intervalProbability = 0.3413 + 0.4938;
  assert.equal(Math.round(intervalProbability * 100), 84);
  assert.equal(0.5 - 0.4772 <= 0.025, true); // 148 cm: z=-2.00
  assert.equal(0.5 - 0.4641 > 0.025, true); // 149 cm: z=-1.80
  assert.deepEqual(normal, { あ: "84", い: "148" });

  // ∫_1^e x log(x) dx = (e²+1)/4, hence r is its reciprocal.
  const densityIntegral = (Math.E ** 2 + 1) / 4;
  assert.ok(close((4 / (Math.E ** 2 + 1)) * densityIntegral, 1));
  assert.equal(valuesOf("major-question-01", "（2）").う, "\\frac{4}{e^2+1}");

  // The limit is (2/π)∫_0^{π/2} sin³x dx = (2/π)(2/3).
  const simpson = (fn, start, end, count = 2000) => {
    const n = count % 2 === 0 ? count : count + 1;
    const h = (end - start) / n;
    let sum = fn(start) + fn(end);
    for (let i = 1; i < n; i += 1) sum += (i % 2 === 0 ? 2 : 4) * fn(start + i * h);
    return (sum * h) / 3;
  };
  const integral = simpson((x) => Math.sin(x) ** 3, 0, Math.PI / 2);
  assert.ok(close(integral, 2 / 3, 1e-10));
  assert.equal(valuesOf("major-question-01", "（3）").え, "\\frac{4}{3\\pi}");

  // The three cube roots lie 120° apart on radius cubert(24).
  const radius = Math.cbrt(24);
  const side = Math.sqrt(3) * radius;
  const area = (Math.sqrt(3) / 4) * side ** 2;
  assert.ok(close(Math.log(area) / Math.log(3), 13 / 6));
  assert.equal(valuesOf("major-question-01", "（4）").お, "\\frac{13}{6}");

  // Irrationality of sqrt(2) gives a=2d and b=4c, then d²+2c²=9.
  const integerSolutions = [];
  for (let c = 0; c <= 2; c += 1) {
    for (let d = 0; d <= 3; d += 1) {
      if (d ** 2 + 2 * c ** 2 === 9) integerSolutions.push([2 * d, 4 * c, c, d]);
    }
  }
  assert.deepEqual(integerSolutions, [[6, 0, 0, 3], [2, 8, 2, 1]]);
  assert.equal(valuesOf("major-question-01", "（5）").答, "(6,0,0,3),\\ (2,8,2,1)");
});

test("II(1): the three-state recurrence and every closed form satisfy the urn process", () => {
  const recurrence = valuesOf("major-question-02", "（1）漸化式");
  assert.deepEqual(recurrence, {
    あ: "\\frac12",
    い: "\\frac12",
    う: "\\frac35",
    え: "\\frac25",
    お: "\\frac34",
  });
  const closed = valuesOf("major-question-02", "（1）一般項");
  assert.deepEqual(closed, {
    か: "(\\frac12)^n",
    き: "5",
    く: "\\frac35",
    け: "\\frac12",
    こ: "4",
    さ: "\\frac34",
    し: "-2",
    す: "\\frac35",
    せ: "\\frac12",
  });

  const a = (n) => (1 / 2) ** n;
  const b = (n) => 5 * ((3 / 5) ** n - (1 / 2) ** n);
  const c = (n) => 4 * ((3 / 4) ** (n - 1) - 2 * (3 / 5) ** (n - 1) + (1 / 2) ** (n - 1));
  assert.ok(close(a(1), 1 / 2));
  assert.ok(close(b(1), 1 / 2));
  assert.ok(close(c(1), 0));
  for (let n = 1; n <= 12; n += 1) {
    assert.ok(close(a(n + 1), (1 / 2) * a(n)));
    assert.ok(close(b(n + 1), (1 / 2) * a(n) + (3 / 5) * b(n)));
    assert.ok(close(c(n + 1), (2 / 5) * b(n) + (3 / 4) * c(n)));
  }
});

test("II(2): the truncated geometric score gives the published expectation and variance", () => {
  const key = valuesOf("major-question-02", "（2）");
  assert.deepEqual(key, {
    そ: "\\frac12n+1",
    た: "3",
    ち: "-\\frac14",
    つ: "-1",
    て: "-\\frac32",
  });

  for (let n = 1; n <= 12; n += 1) {
    const distribution = Array.from({ length: n + 1 }, (_, k) => ({
      x: k,
      probability: k < n ? (1 / 2) ** (k + 1) : (1 / 2) ** n,
    }));
    assert.ok(close(distribution.reduce((sum, item) => sum + item.probability, 0), 1));
    const first = distribution.reduce((sum, item) => sum + 2 ** item.x * item.probability, 0);
    const second = distribution.reduce((sum, item) => sum + 4 ** item.x * item.probability, 0);
    const variance = second - first ** 2;
    assert.ok(close(first, n / 2 + 1));
    assert.ok(close(variance, 3 * 2 ** (n - 1) - n ** 2 / 4 - n - 3 / 2));
  }
});

test("III(1): composition coefficients and the distinct-roots proof agree with the intended route", () => {
  const P = (x) => 3 * x ** 3 - 9 * x ** 2 + 7 * x;
  const Q = (x) => 2 * x ** 2 + 1;
  const composed = (x) => 24 * x ** 6 - 4 * x ** 2 + 1;
  for (const x of [-3, -1.25, 0, 0.6, 2]) assert.ok(close(P(Q(x)), composed(x), 1e-8));
  assert.equal(valuesOf("major-question-03", "（1）（i）").あ, "24x^6-4x^2+1");

  // For nonzero leading coefficients a_k and b_n, the composition has the
  // nonzero leading coefficient a_k*b_n^k and degree k*n.
  for (const [aK, bN, k, n] of [[2, 3, 4, 2], [-5, 0.25, 3, 7], [1, -2, 1, 5]]) {
    assert.notEqual(aK * bN ** k, 0);
    assert.ok(k * n >= 1);
  }
  assert.equal(valuesOf("major-question-03", "（1）（ii）").結論, "a_m=\\cdots=a_0=0");
  const proof = JSON.stringify(sections.find((section) => section.title.startsWith("（1）（ii）")));
  assert.match(proof, /異なる零点を高々/);
  assert.match(proof, /m\+1/);
  assert.match(proof, /連続/);
});

test("III(2)(i)-(ii): coefficient conditions, extrema, and the third intersection are identities", () => {
  assert.deepEqual(valuesOf("major-question-03", "（2）（i）"), {
    い: "a",
    う: "3",
    え: "-3a",
    お: "-6a^2+4a-1",
    か: "3a^3",
  });
  assert.deepEqual(valuesOf("major-question-03", "（2）（ii）"), {
    き: "\\frac13",
    く: "1",
    け: "\\frac{3a-\\sqrt{9a^2-12a+3}}{3}",
    こ: "\\frac{3a+2\\sqrt{9a^2-12a+3}}{3}",
  });

  for (const a of [-2, -0.2, 0.2, 1.2, 3]) {
    const b = -3 * a;
    const c = -6 * a ** 2 + 4 * a - 1;
    const d = 3 * a ** 3;
    assert.ok(close(a ** 2 * b + d, 0));
    assert.ok(close(1 + b * (a - 1) ** 2 + c + d, a));
    assert.ok(close(3 - 2 * b * (a - 1) + c, 2 * (1 - a)));
  }

  const g = (a, x) => x ** 3 - 3 * a * x ** 2 + (4 * a - 1) * x;
  const derivative = (a, x) => 3 * x ** 2 - 6 * a * x + 4 * a - 1;
  for (const a of [-1, 0, 1.5, 3]) {
    const discriminantQuarter = 9 * a ** 2 - 12 * a + 3;
    assert.ok(discriminantQuarter > 0);
    const root = Math.sqrt(discriminantQuarter);
    const alpha = (3 * a - root) / 3;
    const beta = (3 * a + root) / 3;
    const gamma = (3 * a + 2 * root) / 3;
    assert.ok(close(derivative(a, alpha), 0));
    assert.ok(close(derivative(a, beta), 0));
    assert.ok(close(g(a, gamma), g(a, alpha), 1e-8));
    assert.ok(close(2 * alpha + gamma, 3 * a));
  }
  for (const a of [1 / 3, 0.5, 1]) assert.equal(3 * (3 * a - 1) * (a - 1) > 0, false);
});

test("III(2)(iii): tangent subtraction, integral, and global maximum agree", () => {
  assert.deepEqual(valuesOf("major-question-03", "（2）（iii）"), {
    さ: "-3a^2+4a-1",
    し: "a^3",
    す: "a^2e^{-a^2/2}",
    せ: "\\frac2e",
  });
  const g = (a, x) => x ** 3 - 3 * a * x ** 2 + (4 * a - 1) * x;
  const slope = (a) => -3 * a ** 2 + 4 * a - 1;
  for (const a of [-2, -0.4, 0, 1.3, 3]) {
    const tangent = (x) => slope(a) * x + a ** 3;
    for (const x of [-1.1, 0, a, 2.4]) assert.ok(close(g(a, x) - tangent(x), (x - a) ** 3));
    const integrand = (x) => ((x - a) ** 3 - 2 * (x - a)) * Math.exp(-((x - a) ** 2) / 2);
    const steps = 4000;
    const start = Math.min(0, a);
    const end = Math.max(0, a);
    const signedIntegral = Math.sign(a || 1) * (() => {
      const h = (end - start) / steps;
      let sum = integrand(start) + integrand(end);
      for (let i = 1; i < steps; i += 1) sum += (i % 2 === 0 ? 2 : 4) * integrand(start + i * h);
      return (sum * h) / 3;
    })();
    assert.ok(close(signedIntegral, a ** 2 * Math.exp(-(a ** 2) / 2), 1e-8));
  }
  const F = (a) => a ** 2 * Math.exp(-(a ** 2) / 2);
  assert.ok(close(F(Math.sqrt(2)), 2 / Math.E));
  assert.ok(close(F(-Math.sqrt(2)), 2 / Math.E));
  for (const a of [-8, -3, -1, 0, 1, 3, 8]) assert.ok(F(a) <= 2 / Math.E + 1e-12);
});

const reflectHorizontal = ([x, y], boundary) => [x, 2 * boundary - y];
const reflectVertical = ([x, y], boundary) => [2 * boundary - x, y];
const deriveSquarePath = (p) => {
  const p1 = (2 - p) / 2;
  const q2 = (2 - 2 * p) / (2 - p);
  const firstBoundary = p <= 2 / 3 ? "x=2" : "y=3";
  const p4 = firstBoundary === "x=2" ? 0 : (3 * p - 2) / 2;
  const q4 = firstBoundary === "x=2" ? 2 * p / (2 - p) : 1;
  const folded = [[0, 0], [p1, 1], [1, q2], [p, 0], [p4, q4]];
  const unfolded = [
    folded[0],
    folded[1],
    reflectHorizontal(folded[2], 1),
    reflectVertical(reflectHorizontal(folded[3], 1), 1),
    reflectHorizontal(reflectVertical(reflectHorizontal(folded[4], 1), 1), 2),
  ];
  return { p1, q2, p4, q4, folded, unfolded, firstBoundary };
};

test("IV(1): planar reflections produce the two exact cases and the 2/3 boundary", () => {
  assert.deepEqual(valuesOf("major-question-04", "（1）"), {
    あ: "\\frac{2-p}{2}",
    い: "\\frac{2-2p}{2-p}",
    う: "\\frac23",
    え: "\\frac{2p}{2-p}",
    お: "\\frac{3p-2}{2}",
  });

  for (const p of [0.1, 0.5, 2 / 3, 0.8, 0.99]) {
    const path = deriveSquarePath(p);
    const slope = 2 / (2 - p);
    for (const [x, y] of path.unfolded) assert.ok(close(y, slope * x));
    assert.ok(path.unfolded.every(([x], index, points) => index === 0 || x > points[index - 1][0]));
    const yAtX2 = 4 / (2 - p);
    const xAtY3 = (3 * (2 - p)) / 2;
    assert.equal(path.firstBoundary, yAtX2 <= 3 ? "x=2" : "y=3");
    assert.equal(path.firstBoundary, xAtY3 >= 2 ? "x=2" : "y=3");
  }
});

test("IV(2): the full original equal-angle condition independently unfolds to the listed coordinates", () => {
  assert.equal(valuesOf("major-question-04", "（2）（i）").か, "\\frac{a_1}{b_1}");
  assert.deepEqual(valuesOf("major-question-04", "（2）（ii）"), {
    き: "\\frac a2",
    く: "\\frac{2-b}{2}",
    け: "\\frac{a}{2-b}",
    こ: "\\frac{2-2b}{2-b}",
    さ: "\\frac23",
    し: "2-2a",
    す: "\\frac{2-2a}{a}",
    せ: "\\frac{3a}{2}",
    そ: "\\frac{3b-2}{2}",
  });

  // Reflecting successively at z=1, y=1 and z=0 turns Q0..Q3 into
  // the straight line t(a, 2-b, 2).  Its first two face intersections
  // determine Q1 and Q2 without relying on the defective public HTML.
  for (const [a, b] of [[0.2, 0.3], [0.55, 0.8], [0.9, 0.25]]) {
    const atZ1 = 1 / 2;
    const a1 = a * atZ1;
    const b1 = (2 - b) * atZ1;
    const atY1 = 1 / (2 - b);
    const a2 = a * atY1;
    const c2 = 2 - 2 * atY1;
    assert.ok(close(a1, a / 2));
    assert.ok(close(b1, (2 - b) / 2));
    assert.ok(close(a2, a / (2 - b)));
    assert.ok(close(c2, (2 - 2 * b) / (2 - b)));
    assert.ok(close(a2, a1 / b1));
  }

  // Q4=(1,0,c4) occurs when the unfolded ray meets x=1 and y=2
  // simultaneously: b=2-2a.  z=3 is not earlier iff a>=2/3.
  for (const a of [2 / 3, 0.75, 0.95]) {
    const b = 2 - 2 * a;
    const t = 1 / a;
    assert.ok(close(a * t, 1));
    assert.ok(close((2 - b) * t, 2));
    assert.ok(2 * t <= 3 + 1e-12);
    assert.ok(close(2 * t - 2, (2 - 2 * a) / a));
  }

  // If 0<a<=2/3 and 2/3<=b<1, z=3 is the next face.  Folding the
  // t=3/2 point back gives (3a/2,(3b-2)/2,1).
  for (const [a, b] of [[0.2, 0.7], [0.5, 0.8], [2 / 3, 0.9]]) {
    const t = 3 / 2;
    const x = a * t;
    const foldedY = 2 - (2 - b) * t;
    assert.ok(x <= 1 + 1e-12);
    assert.ok((2 - b) * t <= 2 + 1e-12);
    assert.ok(close(x, 3 * a / 2));
    assert.ok(close(foldedY, (3 * b - 2) / 2));
  }
});

test("every display formula has a registered reusable purpose", () => {
  const registered = new Map(purposes.purposes.map((purpose) => [purpose.id, purpose]));
  const formulaBlocks = blocks.filter((block) => block.type === "formula");
  assert.ok(formulaBlocks.length >= 20);
  for (const block of formulaBlocks) {
    assert.ok(block.purposeId, block.latex);
    const purpose = registered.get(block.purposeId);
    assert.ok(purpose, block.purposeId);
    assert.ok(purpose.label.length >= 4, block.purposeId);
    assert.ok(purpose.useWhen.length >= 10, block.purposeId);
  }
});

const pointsOf = (svg, className) => {
  const match = svg.match(new RegExp(`<polyline points="([^"]+)" class="${className}"`));
  assert.ok(match, className);
  return match[1].split(/\s+/).map((pair) => pair.split(",").map(Number));
};

test("the IV SVGs are original, safe, and geometrically faithful", () => {
  const figureCss = read("src/styles/past-exam-figures.css");
  assert.ok(figureCss.includes('.past-exam-figure img[src="/assets/past-exams/keio-2025-general-mathematics/figures/iv2-cube-unfolding.svg"] { max-height: none; height: auto; }'));
  assert.ok(figureCss.includes('body.is-printing-past-exam-document .past-exam-figure img[src="/assets/past-exams/keio-2025-general-mathematics/figures/iv2-cube-unfolding.svg"] { max-height: 200mm; max-width: 150mm; width: auto; }'));
  const expectedIds = ["a13-square-reflection-case1", "a13-square-reflection-case2", "iv2-cube-unfolding"];
  assert.equal(manifest.packageId, packageId);
  assert.equal(manifest.contentProvenance, "original_editorial");
  assert.equal(manifest.restrictedSourceCopied, false);
  assert.equal(manifest.review.needsHumanReview, true);
  assert.deepEqual(manifest.items.map((item) => item.id), expectedIds);
  assert.equal(registry.byId.size, 3);

  const figureBlocks = blocks.filter((block) => block.type === "figure");
  assert.deepEqual(figureBlocks.map((block) => block.assetId), expectedIds);
  const iv2 = answers.document.majorQuestions
    .find((major) => major.id === "major-question-04")
    .sections.find((section) => section.title.startsWith("（2）（ii）"));
  assert.equal(iv2.blocks.some((block) => block.assetId === "iv2-cube-unfolding"), true);
  assert.match(manifest.review.notes, /直交平面・共有線分・等角条件/);

  for (const item of manifest.items) {
    assert.ok(item.alt.length >= 100, item.id);
    const svg = read(`public${item.src}`);
    assert.equal(unsafeSvgReason(svg), null, item.id);
    assert.match(svg, /^<svg[^>]+role="img" aria-labelledby="title"/);
    assert.equal((svg.match(/data:font\/woff2;base64/g) ?? []).length, 2, item.id);
    assert.doesNotMatch(svg, /<(?:script|image|foreignObject|iframe|object|embed|use)\b/i);
    assert.doesNotMatch(svg, /\b(?:href|xlink:href|on[a-z]+)\s*=/i);
    assert.doesNotMatch(svg, /data:image\//i);
    assert.match(svg, /\.math \.mi\{font-family:'KaTeX_Math'/);

    if (item.id === "iv2-cube-unfolding") {
      assert.equal(item.width, 460);
      assert.equal(item.height, 890);
      assert.match(svg, /data-reflection-planes="z=1,y=1,z=2"/);
      const cubePath = pointsOf(svg, "straight");
      const sampleTimes = [0, 1/2, 1/1.2, 1, 1.5];
      cubePath.forEach(([x,y], i) => {
        const t = sampleTimes[i];
        assert.ok(close(x, 190+180*0.5*t-66*1.2*t, 0.01));
        assert.ok(close(y, 425+34*0.5*t+26*1.2*t-106*2*t, 0.01));
      });
      continue;
    }
    assert.equal(item.width, 920);
    assert.equal(item.height, 455);

    const p = Number(svg.match(/data-representative-p="([^"]+)"/)?.[1]);
    const boundary = svg.match(/data-first-boundary="([^"]+)"/)?.[1];
    assert.ok(Number.isFinite(p));
    const expected = deriveSquarePath(p);
    assert.equal(boundary, expected.firstBoundary);

    const folded = pointsOf(svg, "ray").map(([x, y]) => [(x - 48) / 250, (405 - y) / 250]);
    const unfolded = pointsOf(svg, "straight").map(([x, y]) => [(x - 430) / 94, (405 - y) / 94]);
    assert.equal(folded.length, 5);
    assert.equal(unfolded.length, 5);
    for (let i = 0; i < 5; i += 1) {
      assert.ok(close(folded[i][0], expected.folded[i][0], 1e-4), `${item.id}: folded x${i}`);
      assert.ok(close(folded[i][1], expected.folded[i][1], 1e-4), `${item.id}: folded y${i}`);
      assert.ok(close(unfolded[i][0], expected.unfolded[i][0], 1e-4), `${item.id}: unfolded x${i}`);
      assert.ok(close(unfolded[i][1], expected.unfolded[i][1], 1e-4), `${item.id}: unfolded y${i}`);
    }
    const [origin, end] = unfolded;
    const last = unfolded.at(-1);
    for (const point of unfolded.slice(1, -1)) {
      assert.ok(close((point[0] - origin[0]) * (last[1] - origin[1]), (point[1] - origin[1]) * (last[0] - origin[0]), 2e-4));
    }
    assert.ok(end[0] > origin[0]);
  }
});

const built = Object.fromEntries(["questions", "answers", "analysis"].map((mode) => [
  mode,
  new URL(`dist${routeBase}/${mode}/index.html`, root),
]));
const hasBuiltPages = Object.values(built).every((path) => fs.existsSync(path));

test("built question, answer, and analysis pages retain noindex SEO and semantic structure", { skip: hasBuiltPages ? false : "requires npm run build" }, () => {
  const expectedCurrent = { questions: "問題", answers: "解答・解説", analysis: "分析" };
  for (const [mode, path] of Object.entries(built)) {
    const page = nodes(parse(fs.readFileSync(path, "utf8")));
    const head = nodes(page.find((node) => node.tagName === "head"));
    const meta = (name) => head.find((node) => node.tagName === "meta" && attr(node, "name") === name);
    const title = textContent(head.find((node) => node.tagName === "title"));
    const route = `${routeBase}/${mode}/`;
    assert.match(title, /慶應義塾大学医学部/);
    assert.match(title, /2025年度/);
    assert.match(title, /数学/);
    assert.ok((attr(meta("description"), "content") ?? "").length >= 40);
    assert.match(attr(meta("robots"), "content") ?? "", /noindex/);
    const canonical = head.find((node) => node.tagName === "link" && attr(node, "rel") === "canonical");
    assert.equal(attr(canonical, "href"), `${SITE_ORIGIN}${route}`);

    const jsonLd = head.filter((node) => node.tagName === "script" && attr(node, "type") === "application/ld+json");
    assert.equal(jsonLd.length, 1);
    const graph = JSON.parse(textContent(jsonLd[0]))["@graph"];
    assert.ok(graph.some((item) => item["@type"] === "WebPage"));
    assert.ok(graph.some((item) => item["@type"] === "BreadcrumbList"));
    assert.ok(graph.some((item) => item["@type"] === "LearningResource"));

    const mains = page.filter((node) => node.tagName === "main");
    assert.equal(mains.length, 1);
    assert.equal(page.filter((node) => node.tagName === "h1").length, 1);
    const ids = page.map((node) => attr(node, "id")).filter(Boolean);
    assert.equal(new Set(ids).size, ids.length, `${mode}: duplicate id`);

    const tabs = page.filter((node) => hasClass(node, "past-exam-document-tab"));
    assert.equal(tabs.length, 3);
    const current = tabs.find((node) => attr(node, "aria-current") === "page");
    assert.equal(textContent(current), `${expectedCurrent[mode]}表示中`);
    assert.equal(page.filter((node) => hasClass(node, "past-exam-contents")).length, 1);
  }

  const questionPage = nodes(parse(fs.readFileSync(built.questions, "utf8")));
  const answerPage = nodes(parse(fs.readFileSync(built.answers, "utf8")));
  const analysisPage = nodes(parse(fs.readFileSync(built.analysis, "utf8")));
  assert.equal(questionPage.filter((node) => hasClass(node, "major-question-card")).length, 4);
  assert.equal(answerPage.filter((node) => hasClass(node, "answer-major-card")).length, 4);
  assert.equal(answerPage.filter((node) => hasClass(node, "past-exam-figure")).length, 3);
  assert.equal(answerPage.some((node) => hasClass(node, "answer-figure-placeholder")), false);
  assert.equal(analysisPage.filter((node) => hasClass(node, "analysis-major-detail")).length, 4);
  assert.match(textContent(analysisPage[0]), /小問合計15問/);
});
