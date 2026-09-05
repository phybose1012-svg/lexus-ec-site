// Run after npm run build. Verify generated HTML/CSS without browser automation.
import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { parse, parseFragment } from "parse5";
import postcss from "postcss";

const project = new URL("../", import.meta.url);
const read = (path) => fs.readFileSync(new URL(path, project), "utf8");
const packageId = "iwate-medical-2025-general-mathematics";
const route = "past-exam-library/iwate-medical/2025/mathematics/";
const modes = ["questions", "answers", "analysis"];
const attr = (node, key) => node.attrs?.find((a) => a.name === key)?.value;
const hasClass = (node, name) => (attr(node, "class") ?? "").split(" ").includes(name);
const text = (node) => node.nodeName === "#text" ? node.value.trim() : (node.childNodes ?? []).map(text).join("");
function descendants(node) {
  return [node, ...(node.childNodes ?? []).flatMap(descendants)];
}
const pages = Object.fromEntries(modes.map((mode) => [mode, descendants(parse(read(`dist/${route}${mode}/index.html`)))]));
const findClass = (nodes, name) => nodes.filter((node) => hasClass(node, name));

for (const mode of modes) {
  test(`${mode}: information, page tabs and local contents have distinct, ordered regions`, () => {
    const nodes = pages[mode];
    const [info] = findClass(nodes, "past-exam-info");
    const [tabs] = findClass(nodes, "past-exam-document-tabs");
    const [contents] = findClass(nodes, "past-exam-contents");
    assert.ok(info && tabs && contents);
    assert.equal(findClass(nodes, "past-exam-info").length, 1);
    assert.equal(descendants(info).filter((n) => n.tagName === "dt").length, 6);
    assert.ok(nodes.indexOf(info) < nodes.indexOf(tabs));
    assert.ok(nodes.indexOf(tabs) < nodes.indexOf(contents));
    const tabItems = findClass(descendants(tabs), "past-exam-document-tab");
    assert.equal(tabItems.length, 3);
    assert.deepEqual(tabItems.map((n) => descendants(n).find((c) => c.tagName === "strong")).map(text), ["問題", "解答・解説", "分析"]);
    assert.deepEqual(tabItems.map((n) => attr(n, "aria-current") === "page"), modes.map((m) => m === mode));
    for (const link of tabItems.filter((n) => n.tagName === "a")) {
      assert.ok(fs.existsSync(new URL(`dist${attr(link, "href")}index.html`, project)));
    }
    const localLinks = descendants(contents).filter((n) => n.tagName === "a");
    assert.equal(localLinks.length, mode === "analysis" ? 5 : 3);
    for (const link of localLinks) {
      const href = attr(link, "href");
      assert.ok(href.startsWith("#"));
      assert.notEqual(href, "#instructions");
      assert.ok(nodes.some((n) => attr(n, "id") === href.slice(1)), href);
      assert.equal(text(link).includes("↓"), false);
    }
  });

  test(`${mode}: logo separators and both characters are decorative, local and outside exam content`, () => {
    const bands = findClass(pages[mode], "past-exam-brand-divider");
    assert.equal(bands.length, mode === "analysis" ? 4 : 3);
    const characters = bands.flatMap((n) => findClass(descendants(n), "past-exam-brand-divider__character"));
    assert.deepEqual(characters.map((n) => attr(n, "src")), ["/illustrations/characters/lexus-kun-exp.png", "/illustrations/characters/yuki-sensei-default.png"]);
    for (const band of bands) {
      assert.equal(attr(band, "aria-hidden"), "true");
      for (const img of descendants(band).filter((n) => n.tagName === "img")) {
        assert.equal(attr(img, "alt"), "");
        assert.ok(Number(attr(img, "width")) > 0 && Number(attr(img, "height")) > 0);
        assert.ok(fs.existsSync(new URL(`public${attr(img, "src")}`, project)));
      }
      let ancestor = band.parentNode;
      while (ancestor) {
        assert.ok(!hasClass(ancestor, "source-page-card"));
        ancestor = ancestor.parentNode;
      }
    }
  });
}

test("question and answer cards do not repeat their headings in eyebrow labels", () => {
  for (const mode of ["questions", "answers"]) {
    const cards = findClass(pages[mode], "major-question-card");
    assert.equal(cards.length, 3);
    for (const card of cards) assert.equal(findClass(descendants(card), "page-kicker").length, 0);
  }
});

// Keep all mathematical markup and attributes intact, not just visible text.
function signature(node) {
  if (node.nodeName === "#comment") return null;
  if (node.nodeName === "#text") return node.value.trim() || null;
  return {
    tag: node.tagName,
    attrs: (node.attrs ?? []).map(({ name, value }) => [name, value]).sort((a, b) => a[0].localeCompare(b[0])),
    children: (node.childNodes ?? []).map(signature).filter((n) => n !== null),
  };
}
for (const [mode, folder, key] of [["questions", "pastExamQuestions", "questions"], ["answers", "pastExamAnswers", "majorQuestions"]]) {
  test(`${mode}: authored question/answer markup is unchanged`, () => {
    const data = JSON.parse(read(`src/data/generated/${folder}/${packageId}.json`));
    for (const major of data.document[key]) {
      const original = descendants(parseFragment(major.html)).find((n) => attr(n, "id") === major.id);
      const rendered = pages[mode].find((n) => attr(n, "id") === major.id);
      assert.ok(original && rendered, major.id);
      assert.deepEqual(signature(rendered), signature(original), major.id);
    }
    if (mode === "questions") {
      const instructions = pages[mode].find((n) => attr(n, "id") === "instructions");
      assert.equal(instructions.tagName, "details");
      const body = findClass(descendants(instructions), "past-exam-question-instructions__body")[0];
      assert.equal(text(body), text(parseFragment(data.document.sharedInstructionsHtml)));
    }
  });
}

test("analysis keeps section order, alternating backgrounds, points and question coverage", () => {
  const nodes = pages.analysis;
  assert.deepEqual(findClass(nodes, "analysis-section-heading").map(text), ["01目標点", "02大問ごとの特徴", "03解く順番の目安", "04復習はこの3点"]);
  assert.deepEqual(findClass(nodes, "analysis-section").map((n) => hasClass(n, "analysis-section--muted")), [true, false, true, false]);
  assert.equal(findClass(nodes, "analysis-subquestion-name").length, 12);
  const pie = findClass(nodes, "analysis-difficulty-pie")[0];
  assert.deepEqual(descendants(pie).filter((n) => n.tagName === "text").map(text), ["24点", "31点", "35点", "10点"]);
});

test("screen-only UI stays out of print and separators preserve question spacing/page breaks", () => {
  const ui = postcss.parse(read("src/styles/past-exam-ui.css"));
  const hidden = new Set();
  ui.walkRules((rule) => {
    if (rule.parent.params === "print" && rule.nodes.some((n) => n.prop === "display" && n.value === "none" && n.important)) {
      rule.selectors.forEach((s) => hidden.add(s));
    }
  });
  for (const selector of [".past-exam-info", ".past-exam-document-tabs", ".past-exam-contents", ".past-exam-brand-divider"]) assert.ok(hidden.has(selector));
  for (const [path, selector, property, value] of [
    ["past-exam-question.css", "body.is-printing-past-exam-document .major-question-card ~ .major-question-card", "margin-top", "7mm"],
    ["past-exam-answer.css", "body.is-printing-past-exam-document .past-exam-answer-page .answer-major-card ~ .answer-major-card", "break-before", "page"],
  ]) {
    let found = false;
    postcss.parse(read(`src/styles/${path}`)).walkRules((rule) => {
      if (rule.selector === selector && rule.parent.params === "print") found = rule.nodes.some((n) => n.prop === property && n.value === value);
    });
    assert.ok(found, selector);
  }
  for (const mode of ["questions", "answers"]) {
    const branding = findClass(pages[mode], "past-exam-print-branding")[0];
    assert.equal(descendants(branding).filter((n) => n.tagName === "img").length, 3);
  }
});
