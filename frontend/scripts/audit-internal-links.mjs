import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd(), "dist");
const workspace = path.resolve(process.cwd(), "..");
const reportDir = path.join(workspace, "reports");
fs.mkdirSync(reportDir, { recursive: true });

const walk = (dir, files = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file, files);
    else if (entry.isFile()) files.push(file);
  }
  return files;
};

const htmlFiles = walk(root).filter((file) => path.basename(file) === "index.html");
const assetFiles = new Set(walk(root).map((file) => `/${path.relative(root, file).replace(/\\/g, "/")}`));

const routeFor = (file) => {
  const route = `/${path.relative(root, file).replace(/\\/g, "/").replace(/index\.html$/, "")}`;
  return route === "/" ? "/" : route;
};

const routes = htmlFiles.map(routeFor).sort((a, b) => a.localeCompare(b));
const routeSet = new Set(routes);

const decodeSafe = (value) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const normalizeRoute = (pathname) => {
  const decoded = decodeSafe(pathname.split(/[?#]/)[0]);
  if (decoded === "") return "/";
  return decoded.endsWith("/") ? decoded : `${decoded}/`;
};

const routeExists = (pathname) => routeSet.has(normalizeRoute(pathname));
const assetExists = (pathname) => {
  const decoded = decodeSafe(pathname.split(/[?#]/)[0]);
  return assetFiles.has(decoded.startsWith("/") ? decoded : `/${decoded}`);
};

const isSkippedScheme = (href) => /^(mailto:|tel:|javascript:|data:|sms:|line:)/i.test(href);
const isFileLike = (pathname) => /\.[a-z0-9]{2,5}$/i.test(pathname);

const extractAttrs = (html, tag, attr) =>
  [...html.matchAll(new RegExp(`<${tag}\\b[^>]*\\s${attr}=["']([^"']+)["'][^>]*>`, "gi"))].map((match) => match[1]);

const brokenLinks = [];
const redirectRisks = [];
const brokenAssets = [];
const brokenAnchors = [];
const externalInternalLinks = [];

for (const file of htmlFiles) {
  const route = routeFor(file);
  const html = fs.readFileSync(file, "utf8");
  const ids = new Set([...html.matchAll(/\sid=["']([^"']+)["']/gi)].map((match) => match[1]));
  const hrefs = extractAttrs(html, "a", "href");
  const srcs = [...extractAttrs(html, "img", "src"), ...extractAttrs(html, "script", "src"), ...extractAttrs(html, "source", "src")];
  const stylesheetHrefs = [...html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)].map((match) => match[1]);

  for (const href of hrefs) {
    if (!href || href === "#" || isSkippedScheme(href)) continue;
    let url;
    try {
      url = new URL(href, "https://lexus-ec.com");
    } catch {
      brokenLinks.push({ route, href, reason: "invalid-url" });
      continue;
    }
    if (url.origin !== "https://lexus-ec.com") continue;
    if (/^https:\/\/lexus-ec\.com/i.test(href)) externalInternalLinks.push({ route, href });

    const pathname = decodeSafe(url.pathname);
    if (url.hash && normalizeRoute(pathname) === route && !ids.has(decodeSafe(url.hash.slice(1)))) {
      brokenAnchors.push({ route, href, missingId: decodeSafe(url.hash.slice(1)) });
    }
    if (isFileLike(pathname)) {
      if (!assetExists(pathname)) brokenAssets.push({ route, src: href, reason: "missing-linked-file" });
      continue;
    }
    if (!routeExists(pathname)) brokenLinks.push({ route, href, normalized: normalizeRoute(pathname), reason: "missing-route" });
    else if (!pathname.endsWith("/") && pathname !== "/") redirectRisks.push({ route, href, normalized: normalizeRoute(pathname), reason: "trailing-slash" });
  }

  for (const src of [...srcs, ...stylesheetHrefs]) {
    if (!src || isSkippedScheme(src) || /^https?:\/\//i.test(src) || src.startsWith("//")) continue;
    let url;
    try {
      url = new URL(src, "https://lexus-ec.com");
    } catch {
      brokenAssets.push({ route, src, reason: "invalid-src" });
      continue;
    }
    if (!assetExists(url.pathname)) brokenAssets.push({ route, src, reason: "missing-asset" });
  }
}

const unique = (rows, keys) => [...new Map(rows.map((row) => [keys.map((key) => row[key]).join("::"), row])).values()];

const report = {
  auditedAt: new Date().toISOString(),
  pages: routes.length,
  routes: routes.length,
  brokenLinks: unique(brokenLinks, ["route", "href", "reason"]),
  redirectRisks: unique(redirectRisks, ["route", "href"]),
  brokenAssets: unique(brokenAssets, ["route", "src", "reason"]),
  brokenAnchors: unique(brokenAnchors, ["route", "href"]),
  externalInternalLinks: unique(externalInternalLinks, ["route", "href"]),
};

fs.writeFileSync(path.join(reportDir, "internal-link-audit.json"), JSON.stringify(report, null, 2));

const escapeCell = (value = "") => String(value).replace(/\|/g, " / ").replace(/\n/g, " ");
const table = (rows, columns) => [
  `| ${columns.map((col) => col.label).join(" | ")} |`,
  `| ${columns.map(() => "---").join(" | ")} |`,
  ...rows.slice(0, 200).map((row) => `| ${columns.map((col) => escapeCell(row[col.key])).join(" | ")} |`),
];

const md = [
  "# Internal Link / 404 / Redirect Audit",
  "",
  `Audited: ${report.auditedAt}`,
  "",
  `- Pages: ${report.pages}`,
  `- Broken internal links: ${report.brokenLinks.length}`,
  `- Redirect risks: ${report.redirectRisks.length}`,
  `- Broken assets: ${report.brokenAssets.length}`,
  `- Broken anchors: ${report.brokenAnchors.length}`,
  `- Absolute internal links: ${report.externalInternalLinks.length}`,
  "",
  "## Broken Internal Links",
  "",
  ...table(report.brokenLinks, [
    { key: "route", label: "Route" },
    { key: "href", label: "Href" },
    { key: "reason", label: "Reason" },
  ]),
  "",
  "## Redirect Risks",
  "",
  ...table(report.redirectRisks, [
    { key: "route", label: "Route" },
    { key: "href", label: "Href" },
    { key: "normalized", label: "Should be" },
  ]),
  "",
  "## Broken Assets",
  "",
  ...table(report.brokenAssets, [
    { key: "route", label: "Route" },
    { key: "src", label: "Src" },
    { key: "reason", label: "Reason" },
  ]),
  "",
  "## Broken Anchors",
  "",
  ...table(report.brokenAnchors, [
    { key: "route", label: "Route" },
    { key: "href", label: "Href" },
    { key: "missingId", label: "Missing ID" },
  ]),
  "",
];

fs.writeFileSync(path.join(reportDir, "internal-link-audit.md"), `${md.join("\n")}\n`);

console.log(
  JSON.stringify(
    {
      pages: report.pages,
      brokenLinks: report.brokenLinks.length,
      redirectRisks: report.redirectRisks.length,
      brokenAssets: report.brokenAssets.length,
      brokenAnchors: report.brokenAnchors.length,
      externalInternalLinks: report.externalInternalLinks.length,
      sampleBrokenLinks: report.brokenLinks.slice(0, 20),
    },
    null,
    2,
  ),
);
