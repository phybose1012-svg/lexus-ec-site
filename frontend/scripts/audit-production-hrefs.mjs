import fs from "node:fs";
import path from "node:path";

const distRoot = path.resolve("dist");
const publicOnly = process.argv.includes("--public-only");
const targetOriginPattern = /^https?:\/\/(?:www\.)?lexus-ec\.com/i;
const anchorHrefPattern = /<a\b[^>]*\bhref\s*=\s*(["'])(https?:\/\/(?:www\.)?lexus-ec\.com[^"']*)\1/gi;

const walkHtmlFiles = (directory, files = []) => {
  if (!fs.existsSync(directory)) return files;

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walkHtmlFiles(filePath, files);
    } else if (entry.isFile() && filePath.endsWith(".html")) {
      files.push(filePath);
    }
  }

  return files;
};

const htmlFiles = walkHtmlFiles(distRoot).filter((file) => {
  if (!publicOnly) return true;
  return !path.relative(distRoot, file).replace(/\\/g, "/").startsWith("admin/");
});

const rows = [];

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  let match;
  while ((match = anchorHrefPattern.exec(html))) {
    rows.push({
      file: path.relative(distRoot, file).replace(/\\/g, "/"),
      href: match[2],
    });
  }
}

const byPath = new Map();
const byFile = new Map();

for (const row of rows) {
  const url = new URL(row.href);
  if (!targetOriginPattern.test(url.origin)) continue;
  byPath.set(url.pathname, (byPath.get(url.pathname) || 0) + 1);
  byFile.set(row.file, (byFile.get(row.file) || 0) + 1);
}

const sortEntries = (entries) => [...entries].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ja"));

console.log(JSON.stringify({
  mode: publicOnly ? "public-only" : "all",
  htmlFiles: htmlFiles.length,
  productionAnchors: rows.length,
  uniqueProductionPaths: byPath.size,
}, null, 2));

if (rows.length) {
  console.log("\nTop production href paths:");
  for (const [pathname, count] of sortEntries(byPath).slice(0, 80)) {
    console.log(`${String(count).padStart(4, " ")}  ${pathname}`);
  }

  console.log("\nTop files:");
  for (const [file, count] of sortEntries(byFile).slice(0, 40)) {
    console.log(`${String(count).padStart(4, " ")}  ${file}`);
  }

  console.log("\nSamples:");
  for (const row of rows.slice(0, 40)) {
    console.log(`${row.file}\t${row.href}`);
  }
}
