// Regression-check the legacy redirect system after a build:
//  1. public/_redirects stays within Cloudflare Pages' ~100-rule limit.
//  2. Every legacyRedirects.json entry resolves (via first-matching _redirects
//     rule, or via its built stub page) to its intended target.
//  3. Every target is a real built page (dist/<target>/index.html) and not
//     itself a redirect source (no chains).
//  4. Stub pages carry the right meta-refresh URL and canonical.
// Run: node scripts/verify-redirects.mjs   (after `astro build`)
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const dist = path.join(root, "dist");
const redirects = JSON.parse(readFileSync(path.join(root, "src", "data", "legacyRedirects.json"), "utf8"));
const rules = readFileSync(path.join(root, "public", "_redirects"), "utf8")
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("#"))
  .map((line) => {
    const [from, to, status] = line.split(/\s+/);
    return { from, to, status: status || "301" };
  });

const failures = [];
const norm = (p) => (p.endsWith("/") ? p : `${p}/`);

// 1. rule budget
if (rules.length > 100) failures.push(`_redirects has ${rules.length} rules (>100; Cloudflare ignores the rest)`);

// simulate Cloudflare first-match-wins for a path
const matchRule = (pathname) => {
  for (const rule of rules) {
    if (rule.from.endsWith("/*")) {
      const prefix = rule.from.slice(0, -1); // keep trailing slash
      if (pathname.startsWith(prefix)) {
        const splat = pathname.slice(prefix.length);
        return { rule, target: rule.to.replace(":splat", splat) };
      }
    } else if (rule.from.includes(":name")) {
      const [pre, post] = rule.from.split(":name");
      if (pathname.startsWith(pre) && pathname.endsWith(post)) {
        const name = pathname.slice(pre.length, pathname.length - post.length);
        if (name && !name.includes("/")) return { rule, target: rule.to.replace(":name", name) };
      }
    } else if (rule.from === pathname || norm(rule.from) === pathname) {
      return { rule, target: rule.to };
    }
  }
  return null;
};

const builtPage = (p) => existsSync(path.join(dist, decodeURIComponent(norm(p)).replace(/^\//, ""), "index.html"));
const redirectSources = new Set(redirects.map((r) => norm(r.from)));

// 2-4. every JSON entry
let edgeCount = 0;
let stubCount = 0;
for (const entry of redirects) {
  const from = norm(entry.from);
  const to = norm(entry.to);
  const label = `${from} -> ${to}`;

  if (!builtPage(to)) failures.push(`target not built: ${label}`);
  if (redirectSources.has(to)) failures.push(`redirect chain: ${label} (target is itself a redirect source)`);

  const match = matchRule(from);
  if (entry.edge === false) {
    stubCount += 1;
    if (match) failures.push(`edge:false entry unexpectedly matches _redirects rule "${match.rule.from}": ${label}`);
  } else {
    edgeCount += 1;
    if (!match) failures.push(`no _redirects rule matches: ${label}`);
    else if (norm(match.target) !== to) failures.push(`_redirects sends ${from} to ${match.target}, expected ${to}`);
  }

  // Stub content is only load-bearing for edge:false entries (no _redirects
  // rule backs them). Edge entries may legitimately have their stub shadowed
  // by a real fixed/post page at the same route (e.g. /reservation/), which
  // the edge 301 supersedes anyway.
  if (entry.edge === false) {
    const stubPath = path.join(dist, decodeURIComponent(from).replace(/^\//, ""), "index.html");
    if (!existsSync(stubPath)) {
      failures.push(`stub page missing: ${from}`);
    } else {
      const html = readFileSync(stubPath, "utf8");
      if (!html.includes(`url=${entry.to}`)) failures.push(`stub meta-refresh wrong: ${from}`);
      if (!html.includes(`href="https://lexus-ec.com${entry.to}"`)) failures.push(`stub canonical wrong: ${from}`);
      if (!html.includes("noindex,follow")) failures.push(`stub robots wrong: ${from}`);
    }
  }
}

// spot-check the hand-written wildcard rules
const wildcardChecks = [
  ["/category/university/kokuritu/kyoute/", "/top/information-kokuritsu/"],
  ["/category/university/siritu/kannsai-siritu/", "/top/information-shiritsu/"],
  ["/category/university/kuriage/", "/kuriage-information/"],
  ["/wp-content/uploads/2024/08/a.jpg", "/assets/legacy/wp-content/uploads/2024/08/a.jpg"],
];
for (const [from, expected] of wildcardChecks) {
  const match = matchRule(from);
  if (!match) failures.push(`wildcard check: no rule matches ${from}`);
  else if (match.target !== expected && norm(match.target) !== norm(expected))
    failures.push(`wildcard check: ${from} -> ${match.target}, expected ${expected}`);
}

console.log(
  JSON.stringify(
    { rules: rules.length, jsonEntries: redirects.length, edgeEntries: edgeCount, stubOnlyEntries: stubCount, failures: failures.length },
    null,
    2,
  ),
);
if (failures.length) {
  for (const f of failures) console.error("FAIL: " + f);
  process.exit(1);
}
console.log("All redirect checks passed.");
