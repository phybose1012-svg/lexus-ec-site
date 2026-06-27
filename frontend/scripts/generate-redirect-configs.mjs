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
  ...new Map(redirects.map((redirect) => [normalize(redirect.from), { from: normalize(redirect.from), to: normalize(redirect.to) }])).values(),
].sort((a, b) => a.from.localeCompare(b.from));

await mkdir(publicDir, { recursive: true });

const cloudflareLines = [
  "# Generated from src/data/legacyRedirects.json",
  ...uniqueRedirects.map((redirect) => `${redirect.from} ${redirect.to} 301`),
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

console.log(
  JSON.stringify(
    {
      redirects: uniqueRedirects.length,
      cloudflare: path.join(publicDir, "_redirects"),
      htaccess: path.join(publicDir, ".htaccess"),
    },
    null,
    2,
  ),
);
