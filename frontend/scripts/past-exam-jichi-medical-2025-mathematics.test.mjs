import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { parse } from "parse5";
import { loadFigureManifest } from "../src/lib/pastExamFigures.mjs";
import { summarizeQuestionLabels } from "../src/lib/pastExamSeo.mjs";

const root = new URL("../", import.meta.url);
const packageId = "jichi-medical-2025-general-mathematics";
const routeBase = "/past-exam-library/jichi-medical/2025/mathematics";
const read = (path) => fs.readFileSync(new URL(path, root), "utf8");
const builtQuestionPath = new URL(`dist${routeBase}/questions/index.html`, root);
const builtAnswerPath = new URL(`dist${routeBase}/answers/index.html`, root);
const builtAnalysisPath = new URL(`dist${routeBase}/analysis/index.html`, root);
const hasBuiltPages = [builtQuestionPath, builtAnswerPath, builtAnalysisPath].every((path) => fs.existsSync(path));
const questions = JSON.parse(read(`src/data/generated/pastExamQuestions/${packageId}.json`));
const answers = JSON.parse(read(`src/data/pastExamAnswerSources/${packageId}.json`));
const manifest = JSON.parse(read(`src/data/pastExamFigures/${packageId}.json`));
const purposes = JSON.parse(read("src/data/pastExamFormulaPurposes.json"));
const registry = loadFigureManifest(
  fileURLToPath(new URL(`src/data/pastExamFigures/${packageId}.json`, root)),
  fileURLToPath(new URL("public", root)),
  packageId,
);
const allBlocks = answers.document.majorQuestions.flatMap((major) => major.sections.flatMap((section) => section.blocks));
const attrs = (node, name) => node.attrs?.find((item) => item.name === name)?.value;
const nodes = (node) => [node, ...(node.childNodes ?? []).flatMap(nodes)];
const hasClass = (node, name) => (attrs(node, "class") ?? "").split(" ").includes(name);
const textContent = (node) => nodes(node)
  .filter((child) => child.nodeName === "#text")
  .map((child) => child.value)
  .join("")
  .replace(/\s+/g, "");

test("question import preserves all 25 assessment items in 16 reader sections", () => {
  assert.equal(questions.packageId, packageId);
  assert.equal(questions.document.questions.length, 16);
  const summary = summarizeQuestionLabels(questions.document.questions.map((question) => question.label));
  assert.deepEqual(summary, { label: "問題", count: 25, unit: "問", grouping: "問題別", display: "25問", print: "問題25問" });
  const combined = questions.document.questions.map((question) => question.html).join("\n");
  assert.equal((combined.match(/structured-list__label/g) ?? []).length, 250);
  assert.ok(!combined.includes("page-kicker"));
  assert.ok(!questions.document.sharedInstructionsHtml.includes("page-kicker"));
  assert.ok(!/<(?:script|iframe|object|embed|form)\b/i.test(combined));
  assert.match(combined, /data-katex="\\dfrac\{11\}\{5\}"/);
  assert.match(combined, /<h3>問題16<\/h3>/);
  assert.match(combined, /<h3>問題19<\/h3>/);
  assert.match(combined, /<h3>問題22<\/h3>/);
  assert.equal(questions.source.rightsStatus, "review_required");
  assert.equal(questions.source.needsHumanReview, true);
  assert.equal(questions.links.universityInformation, "/information-jichi/");
  assert.equal(questions.links.analysis, "/jichiika-university-entrance-exam-measures2027/#数学");
});

test("independently authored answer source covers 25 keys and every formula has a registered purpose", () => {
  assert.equal(answers.source.contentProvenance, "original_editorial");
  assert.equal(answers.source.restrictedSourceCopied, false);
  assert.equal(answers.document.majorQuestions.length, 16);
  const keys = answers.document.majorQuestions.flatMap((major) => major.answerKey);
  assert.equal(keys.length, 25);
  assert.deepEqual(keys.slice(-5).map((key) => key.entries[0].mark), ["タ", "カ", "マ", "ワ", "ナ"]);
  const purposeIds = new Set(purposes.purposes.map((item) => item.id));
  for (const block of allBlocks.filter((block) => block.type === "formula")) {
    assert.ok(block.purposeId, block.latex);
    assert.ok(purposeIds.has(block.purposeId), block.purposeId);
  }
  const serialized = JSON.stringify(answers);
  assert.ok(!serialized.includes("|1-p+q+6|=5"));
  assert.match(serialized, /問題の絶対値の中は/);
  assert.match(serialized, /\\sqrt\{625\}=25/);
});

test("all seven required visuals are registered original SVGs and replace answer placeholders", () => {
  const expected = [
    "ans-q4-k-range-graph",
    "ans-q7-tetrahedron",
    "ans-q7-cube-model",
    "ans-q11-space-projection",
    "ans-q12-parabola-condition",
    "ans-q14-16-common-tangent",
    "ans-q21-25-quartic-graph",
  ];
  assert.deepEqual(allBlocks.filter((block) => block.type === "figure").map((block) => block.assetId), expected);
  assert.deepEqual(manifest.items.map((item) => item.id), expected);
  assert.equal(manifest.contentProvenance, "original_editorial");
  assert.equal(manifest.restrictedSourceCopied, false);
  assert.equal(registry.byId.size, 7);
  for (const item of manifest.items) {
    const svg = read(`public${item.src}`);
    assert.ok(item.alt.length >= 40, item.id);
    assert.match(svg, /role="img" aria-labelledby="title"/);
    assert.equal((svg.match(/data:font\/woff2;base64/g) ?? []).length, 2, item.id);
    assert.ok(!/<(?:script|image|foreignObject|iframe|object|embed|use)\b/i.test(svg), item.id);
    assert.ok(!/\b(?:href|xlink:href|on[a-z]+)\s*=/i.test(svg), item.id);
    assert.match(svg, /\.math \.mi\{font-family:'KaTeX_Math'/);
  }
  const parabola = manifest.items.find((item) => item.id === "ans-q12-parabola-condition");
  assert.match(parabola.alt, /g\(t\)/);
  assert.ok(!parabola.alt.includes("f(t)"));
  assert.match(read(`public${parabola.src}`), /<tspan class="mi">g<\/tspan>/);
});

test("diagram geometry agrees with the published mathematical conditions", () => {
  const h = (t) => -(t ** 2) / (2 * t + 3);
  assert.equal(h(-1), -1);
  assert.equal(Math.abs(h(0)), 0);
  assert.equal(h(1), -0.2);

  const tetra = [
    [-0.5, 0, 0], [0.5, 0, 0], [0, Math.sqrt(3) / 2, 0], [0, Math.sqrt(3) / 6, Math.sqrt(2 / 3)],
  ];
  const distance = (a, b) => Math.hypot(...a.map((value, index) => value - b[index]));
  for (let i = 0; i < tetra.length; i += 1) {
    for (let j = i + 1; j < tetra.length; j += 1) assert.ok(Math.abs(distance(tetra[i], tetra[j]) - 1) < 1e-12);
  }

  const H = [8 / 21, 16 / 21, 32 / 21];
  const dot = (a, b) => a.reduce((sum, value, index) => sum + value * b[index], 0);
  for (const point of [[8, 0, 0], [0, 4, 0], [0, 0, 2]]) {
    assert.ok(Math.abs(dot(H, point.map((value, index) => value - H[index]))) < 1e-12);
  }

  const lineDistance = ([x, y]) => Math.abs(x - Math.sqrt(3) * y + 2) / 2;
  assert.equal(lineDistance([0, 0]), 1);
  assert.equal(lineDistance([3, 0]), 2.5);

  const q12Roots = [6 - Math.sqrt(31), 6 + Math.sqrt(31)];
  assert.ok(q12Roots[0] > 0 && q12Roots[1] > q12Roots[0]);
  for (const t of q12Roots) assert.ok(Math.abs(t ** 2 - 12 * t + 5) < 1e-10);

  const quartic = (x) => x ** 4 + 4 * x ** 3 - 35 * x ** 2 - 6 * x + 144;
  for (const root of [-8, -2, 3]) assert.equal(quartic(root), 0);

  const tetraSvg = read("public/assets/past-exams/jichi-medical-2025-general-mathematics/figures/ans-q7-tetrahedron.svg");
  assert.match(tetraSvg, /<line x1="207\.20" y1="260\.80" x2="470\.00" y2="260\.80" class="construction"/);
  assert.match(tetraSvg, /<polyline points="456\.00,260\.80 456\.00,274\.80 470\.00,274\.80"/);
  assert.match(tetraSvg, /<text x="482\.00" y="427\.00" class="math"/);
  assert.ok(!tetraSvg.includes('y="503.55"'));

  const tangentSvg = read("public/assets/past-exams/jichi-medical-2025-general-mathematics/figures/ans-q14-16-common-tangent.svg");
  assert.match(tangentSvg, /<path d="M116\.00,270\.00 A35\.00,35\.00 0 0 0 111\.31,252\.50"/);
  assert.match(tangentSvg, /<polyline points="195\.00,218\.04 184\.61,224\.04 178\.61,213\.65"/);
  assert.match(tangentSvg, /<polyline points="357\.00,124\.51 346\.61,130\.51 340\.61,120\.12"/);
});

test("built pages expose the 25-question summary, semantic figures, and conventional variation table", { skip: hasBuiltPages ? false : "requires npm run build" }, () => {
  const questionPage = nodes(parse(read(`dist${routeBase}/questions/index.html`)));
  const answerPage = nodes(parse(read(`dist${routeBase}/answers/index.html`)));
  const analysisPage = nodes(parse(read(`dist${routeBase}/analysis/index.html`)));
  assert.match(questionPage.find((node) => node.tagName === "meta" && attrs(node, "name") === "description")?.attrs.find((item) => item.name === "content")?.value ?? "", /全25問/);
  assert.match(answerPage.find((node) => node.tagName === "meta" && attrs(node, "name") === "description")?.attrs.find((item) => item.name === "content")?.value ?? "", /全25問/);
  assert.match(analysisPage.find((node) => node.tagName === "meta" && attrs(node, "name") === "description")?.attrs.find((item) => item.name === "content")?.value ?? "", /優先して解く問題/);
  for (const page of [questionPage, answerPage]) {
    const info = page.find((node) => hasClass(node, "past-exam-info"));
    assert.ok(info);
    assert.match(textContent(info), /問題25問/);
  }
  assert.match(textContent(analysisPage[0]), /問題・掲載区分25問・16セクション/);
  assert.equal((textContent(analysisPage[0]).match(/58\.8分/g) ?? []).length, 1);
  const renderedFigures = answerPage.filter((node) => hasClass(node, "past-exam-figure"));
  assert.equal(renderedFigures.length, 7);
  assert.equal(answerPage.some((node) => hasClass(node, "answer-figure-placeholder")), false);
  assert.ok(answerPage.some((node) => node.tagName === "table" && hasClass(node, "answer-table--variation")));
});
