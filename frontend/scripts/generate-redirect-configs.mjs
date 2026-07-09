import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const redirectsPath = path.join(root, "src", "data", "legacyRedirects.json");
const publicDir = path.join(root, "public");
const redirects = JSON.parse(await readFile(redirectsPath, "utf8"));

const normalize = (value) => {
  const pathOnly = value.split(/[?#]/)[0] || "/";
  return pathOnly.endsWith("/") ? pathOnly : `${pathOnly}/`;
};

const uniqueRedirects = [
  ...new Map(
    redirects.map((redirect) => [
      normalize(redirect.from),
      { from: normalize(redirect.from), to: normalize(redirect.to), edge: redirect.edge !== false },
    ]),
  ).values(),
].sort((a, b) => a.from.localeCompare(b.from));

// Cloudflare Pages only applies roughly the first ~100 lines of `_redirects`;
// rules past that limit are silently ignored. To stay under the cap we collapse
// families of identically-shaped redirects (`/PREFIX/:name/` -> `/DEST:name/`)
// into a single placeholder rule for `_redirects`. Entries whose name differs
// between source and destination stay as explicit rules and, because they are
// emitted before the placeholder, take precedence over it.
const collapsibleGroups = [
  { prefix: "/top/information-kokuritsu/", dest: "/information-" },
];

const collapsibleGroupFor = (redirect) => {
  for (const group of collapsibleGroups) {
    if (!redirect.from.startsWith(group.prefix)) continue;
    const name = redirect.from.slice(group.prefix.length).replace(/\/$/, "");
    if (name && !name.includes("/") && redirect.to === `${group.dest}${name}/`) {
      return group;
    }
  }
  return null;
};

// Exact placeholder rules replace the collapsible entries in `_redirects` only.
const placeholderRules = collapsibleGroups.map((group) => `${group.prefix}:name/ ${group.dest}:name/ 301`);
// Entries with `edge: false` are long-tail redirects served only by the static
// stub pages ([...slug].astro meta-refresh + canonical) so they cost no
// `_redirects` lines — Cloudflare Pages only honours ~100 of them.
const cloudflareExactRedirects = uniqueRedirects.filter(
  (redirect) => redirect.edge && !collapsibleGroupFor(redirect),
);

// Exact single-path rules that only exist for Cloudflare (not in the source JSON).
const cloudflareExactExtra = [
  { from: "/reservation", to: "/top/reservation/" },
  // Old WP taxonomy: the 繰り上げ category maps to the kuriage data page.
  { from: "/category/university/kuriage/", to: "/kuriage-information/" },
];
// Wildcard/splat rules must come last so more specific exact rules win first.
const cloudflareWildcardRules = [
  // Old WP taxonomy hubs (kokuritu/siritu trees) -> the new per-type info hubs.
  "/category/university/kokuritu/* /top/information-kokuritsu/ 301",
  "/category/university/siritu/* /top/information-shiritsu/ 301",
  "/wp-content/uploads/* /assets/legacy/wp-content/uploads/:splat 301",
];

await mkdir(publicDir, { recursive: true });

const cloudflareLines = [
  "# Generated from src/data/legacyRedirects.json",
  ...cloudflareExactExtra.map((redirect) => `${redirect.from} ${redirect.to} 301`),
  ...cloudflareExactRedirects.map((redirect) => `${redirect.from} ${redirect.to} 301`),
  ...placeholderRules,
  ...cloudflareWildcardRules,
  "",
];

const htaccessLines = [
  "# Generated from src/data/legacyRedirects.json",
  "# BEGIN legacy redirects",
  ...uniqueRedirects.map((redirect) => `Redirect 301 ${redirect.from} ${redirect.to}`),
  "# END legacy redirects",
  "",
];

await writeFile(path.join(publicDir, "_redirects"), cloudflareLines.join("\n"), "utf8");
await writeFile(path.join(publicDir, ".htaccess"), htaccessLines.join("\n"), "utf8");

const cloudflareRuleCount =
  cloudflareExactExtra.length + cloudflareExactRedirects.length + placeholderRules.length + cloudflareWildcardRules.length;

console.log(
  JSON.stringify(
    {
      sourceRedirects: uniqueRedirects.length,
      cloudflareRules: cloudflareRuleCount,
      collapsedIntoPlaceholders: uniqueRedirects.length - cloudflareExactRedirects.length,
      cloudflare: path.join(publicDir, "_redirects"),
      htaccess: path.join(publicDir, ".htaccess"),
    },
    null,
    2,
  ),
);
