// Run after build. PAST_EXAM_VERIFY_ORIGIN optionally checks deployed HTML too.
import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { parse } from "parse5";
import { buildExamDocumentSeo, canonicalFor, serializeJsonLd, SITE_ORIGIN } from "../src/lib/pastExamSeo.mjs";
import { robotsForPage } from "../src/lib/robotsPolicy.mjs";

const root = new URL("../", import.meta.url);
const library = "/past-exam-library/";
const university = `${library}iwate-medical/`;
const exam = `${university}2025/mathematics/`;
const physicsExam = `${university}2025/physics/`;
const modes = ["questions", "answers", "analysis"];
const routes = [library, university, ...[exam, physicsExam].flatMap((base) => modes.map((mode) => `${base}${mode}/`))];
const origin = process.env.PAST_EXAM_VERIFY_ORIGIN;
const attr = (node, key) => node.attrs?.find((a) => a.name === key)?.value;
const text = (node) => node.nodeName === "#text" ? node.value : (node.childNodes ?? []).map(text).join("");
const nodesOf = (node) => [node, ...(node.childNodes ?? []).flatMap(nodesOf)];
const hasClass = (node, name) => (attr(node, "class") ?? "").split(" ").includes(name);
const pages = await Promise.all(routes.map(async (route) => {
  let html;
  if (origin) {
    const response = await fetch(new URL(route, origin), { signal: AbortSignal.timeout(30000) });
    assert.equal(response.status, 200, route);
    assert.equal(response.redirected, false, route);
    assert.match(response.headers.get("content-type") ?? "", /text\/html/);
    if (new URL(origin).hostname.endsWith(".pages.dev")) assert.match(response.headers.get("x-robots-tag") ?? "", /noindex/);
    html = await response.text();
  } else html = fs.readFileSync(new URL(`dist${route}index.html`, root), "utf8");
  return { route, nodes: nodesOf(parse(html)) };
}));

test("canonical URLs preserve established slugs and remove tracking/fragment variants", () => {
  assert.equal(canonicalFor(`${exam}answers?v=123#major-question-02`), `${SITE_ORIGIN}${exam}answers/`);
  assert.throws(() => canonicalFor("https://unrelated.example/questions/"));
});

test("JSON-LD cannot terminate its script element", () => {
  const payload = { name: "</script><img src=x>\u2028\u2029" };
  const serialized = serializeJsonLd(payload);
  assert.ok(!serialized.includes("<"));
  assert.deepEqual(JSON.parse(serialized), payload);
});

test("preview noindex overrides approval; production and local defaults stay unchanged", () => {
  for (const deploymentBranch of ["staging", "codex/example"]) {
    for (const noindex of [false, true]) assert.equal(robotsForPage({ deploymentBranch, productionBranch: "main", noindex }), "noindex,nofollow,max-image-preview:large");
  }
  for (const deploymentBranch of ["", "main"]) {
    assert.equal(robotsForPage({ deploymentBranch, productionBranch: "main" }), "max-image-preview:large");
    assert.equal(robotsForPage({ deploymentBranch, productionBranch: "main", noindex: true }), "noindex,follow,max-image-preview:large");
  }
  assert.match(robotsForPage({ deploymentBranch: "main", productionBranch: "release" }), /noindex/);
});

test("the reusable factory derives university/year/subject metadata from inputs", () => {
  const seo = buildExamDocumentSeo({ mode: "questions", university: "テスト大学", year: 2026, subject: "化学", examLabel: "一般選抜", majorCount: 4, path: `${library}test/2026/chemistry/questions/`, universityPath: `${library}test/` });
  assert.match(seo.title, /テスト大学医学部 2026年度 化学/);
  assert.match(seo.description, /全4題/);
  assert.ok(!seo.description.includes("数学"));
});

const titles = new Set();
const descriptions = new Set();
for (const { route, nodes } of pages) {
  const head = nodesOf(nodes.find((n) => n.tagName === "head"));
  const meta = (key, value) => head.filter((n) => n.tagName === "meta" && attr(n, key) === value);
  const singleMeta = (key, value) => {
    const matches = meta(key, value);
    assert.equal(matches.length, 1, `${route}: ${value}`);
    return attr(matches[0], "content");
  };

  test(`${route}: unique metadata, canonical, sharing image alt and one robots policy`, () => {
    const titleNodes = head.filter((n) => n.tagName === "title");
    assert.equal(titleNodes.length, 1);
    const title = text(titleNodes[0]);
    const description = singleMeta("name", "description");
    assert.ok(title.includes("過去問") && title.includes("レクサス教育センター"));
    assert.ok(description.length > 30);
    assert.ok(!titles.has(title)); titles.add(title);
    assert.ok(!descriptions.has(description)); descriptions.add(description);
    const canonicals = head.filter((n) => n.tagName === "link" && attr(n, "rel") === "canonical");
    assert.equal(canonicals.length, 1);
    assert.equal(attr(canonicals[0], "href"), `${SITE_ORIGIN}${route}`);
    assert.equal(singleMeta("property", "og:url"), `${SITE_ORIGIN}${route}`);
    for (const [key, prefix] of [["property", "og"], ["name", "twitter"]]) {
      assert.equal(singleMeta(key, `${prefix}:title`), title);
      assert.equal(singleMeta(key, `${prefix}:description`), description);
      const image = new URL(singleMeta(key, `${prefix}:image`));
      assert.equal(image.origin, SITE_ORIGIN);
      assert.ok(fs.existsSync(new URL(`public${decodeURIComponent(image.pathname)}`, root)));
      assert.match(singleMeta(key, `${prefix}:image:alt`), /レクサス/);
    }
    const robots = singleMeta("name", "robots");
    if (route !== library || (origin && new URL(origin).hostname.endsWith(".pages.dev"))) assert.match(robots, /noindex/);
  });

  test(`${route}: JSON-LD describes visible breadcrumbs and the correct page type`, () => {
    const scripts = head.filter((n) => n.tagName === "script" && attr(n, "type") === "application/ld+json");
    assert.equal(scripts.length, 1);
    const data = JSON.parse(text(scripts[0]));
    assert.equal(data["@context"], "https://schema.org");
    const graph = data["@graph"];
    const graphIds = graph.map((n) => n["@id"]);
    assert.equal(new Set(graphIds).size, graph.length);
    const page = graph.find((n) => ["WebPage", "CollectionPage"].includes(n["@type"]));
    assert.equal(page.url, `${SITE_ORIGIN}${route}`);
    assert.equal(page["@type"], route === library || route === university ? "CollectionPage" : "WebPage");
    const breadcrumb = graph.find((n) => n["@type"] === "BreadcrumbList");
    assert.equal(page.breadcrumb["@id"], breadcrumb["@id"]);
    const visible = nodes.find((n) => hasClass(n, "exam-library-breadcrumb"));
    assert.equal(nodesOf(visible).filter((n) => n.tagName === "ol").length, 1);
    const items = nodesOf(visible).filter((n) => n.tagName === "li").map((li) => nodesOf(li).find((n) => n.tagName === "a" || attr(n, "aria-current") === "page"));
    assert.equal(breadcrumb.itemListElement.length, items.length);
    breadcrumb.itemListElement.forEach((item, index) => {
      assert.equal(item.position, index + 1);
      assert.equal(item.name, text(items[index]));
      assert.equal(item.item, canonicalFor(attr(items[index], "href") ?? route));
      assert.ok(fs.existsSync(new URL(`dist${new URL(item.item).pathname}index.html`, root)));
    });
    const resource = graph.find((n) => n["@type"] === "LearningResource");
    if ([exam, physicsExam].some((base) => route.startsWith(base))) {
      assert.ok(resource);
      assert.equal(page.mainEntity["@id"], resource["@id"]);
      assert.equal(resource.mainEntityOfPage["@id"], page["@id"]);
      assert.equal(resource.breadcrumb, undefined);
      assert.equal(resource.author, undefined); // The university did not author Lexus's explanations.
    } else assert.equal(resource, undefined);
    for (const entry of graph) {
      assert.ok(!["FAQPage", "QAPage", "Review", "AggregateRating"].includes(entry["@type"]));
      assert.equal(entry.datePublished, undefined);
      for (const key of ["mainEntity", "mainEntityOfPage", "breadcrumb", "publisher", "provider"]) {
        if (entry[key]) assert.ok(graphIds.includes(entry[key]["@id"]));
      }
    }
  });

  test(`${route}: main landmark, heading order, IDs and meaningful/decorative image alternatives`, () => {
    assert.equal(attr(nodes.find((n) => n.tagName === "html"), "lang"), "ja");
    const mains = nodes.filter((n) => n.tagName === "main");
    assert.equal(mains.length, 1);
    const content = nodesOf(mains[0]);
    const headings = content.filter((n) => /^h[1-6]$/.test(n.tagName ?? ""));
    assert.equal(nodes.filter((n) => n.tagName === "h1").length, 1);
    assert.equal(headings[0].tagName, "h1");
    let previous = 0;
    for (const heading of headings) {
      const level = Number(heading.tagName.slice(1));
      assert.ok(level <= previous + 1, text(heading)); previous = level;
    }
    const ids = nodes.map((n) => attr(n, "id")).filter(Boolean);
    assert.equal(new Set(ids).size, ids.length, "duplicate IDs");
    const skip = nodes.find((n) => hasClass(n, "skip-link"));
    assert.equal(attr(skip, "href"), `#${attr(mains[0], "id")}`);
    for (const img of nodes.filter((n) => n.tagName === "img")) assert.notEqual(attr(img, "alt"), undefined, attr(img, "src"));
    for (const band of content.filter((n) => hasClass(n, "past-exam-brand-divider"))) {
      assert.equal(attr(band, "aria-hidden"), "true");
      for (const img of nodesOf(band).filter((n) => n.tagName === "img")) assert.equal(attr(img, "alt"), "");
    }
    for (const table of content.filter((n) => n.tagName === "table")) assert.ok(nodesOf(table).some((n) => n.tagName === "th"), "data table needs headers");
  });
}

test("review-only university and exam pages remain out of the production sitemap", () => {
  const sitemap = fs.readFileSync(new URL("dist/sitemap.xml", root), "utf8");
  for (const route of routes.filter((route) => route !== library)) assert.ok(!sitemap.includes(`${SITE_ORIGIN}${route}`));
});
