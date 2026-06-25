import fs from "node:fs";
import path from "node:path";

const workspace = path.resolve(process.cwd(), "..");
const sourceRoot = path.resolve(process.cwd(), "src");
const baselineRoot = path.resolve(workspace, "baseline", "pages");
const publicRoot = path.resolve(process.cwd(), "public");
const assetRoot = path.join(publicRoot, "assets", "legacy");
const reportDir = path.join(workspace, "reports");
const rewrite = process.argv.includes("--rewrite-source");

const sourceExtensions = new Set([".astro", ".ts", ".tsx", ".js", ".mjs", ".css", ".json"]);
const baselineExtensions = new Set([".html", ".json"]);
const imageExtensions = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"]);

const walk = (dir, extensions) => {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(file, extensions));
    else if (entry.isFile() && extensions.has(path.extname(entry.name).toLowerCase())) files.push(file);
  }
  return files;
};

const decodePathname = (pathname) => {
  try {
    return decodeURI(pathname);
  } catch {
    return pathname;
  }
};

const localUrlFor = (remoteUrl) => {
  const url = new URL(remoteUrl);
  const decodedPath = decodePathname(url.pathname);
  return `/assets/legacy${decodedPath}`;
};

const filePathFor = (remoteUrl) => {
  const url = new URL(remoteUrl);
  const decodedPath = decodePathname(url.pathname).replace(/^\/+/, "");
  return path.join(assetRoot, decodedPath);
};

const isImageUrl = (remoteUrl) => {
  try {
    const url = new URL(remoteUrl);
    return url.hostname === "lexus-ec.com" && url.pathname.startsWith("/wp-content/uploads/") && imageExtensions.has(path.extname(url.pathname).toLowerCase());
  } catch {
    return false;
  }
};

const collectUrls = (files) => {
  const urls = new Set();
  const pattern = /https:\/\/lexus-ec\.com\/wp-content\/uploads\/[^"'<>\r\n]+/g;
  const localPattern = /\/assets\/legacy\/wp-content\/uploads\/[^"'<>\\\s)]+/g;
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    for (const match of text.matchAll(pattern)) {
      const remoteUrl = match[0].trim().replace(/[),]+$/g, "");
      if (isImageUrl(remoteUrl)) urls.add(remoteUrl);
    }
    for (const match of text.matchAll(localPattern)) {
      const localUrl = match[0].trim().replace(/[),]+$/g, "");
      try {
        const remoteUrl = new URL(localUrl.replace(/^\/assets\/legacy/, ""), "https://lexus-ec.com").href;
        if (isImageUrl(remoteUrl)) urls.add(remoteUrl);
      } catch {
        // Ignore malformed generated paths.
      }
    }
  }
  return [...urls].sort((a, b) => a.localeCompare(b));
};

const download = async (remoteUrl) => {
  const target = filePathFor(remoteUrl);
  if (fs.existsSync(target) && fs.statSync(target).size > 0) {
    return { remoteUrl, localUrl: localUrlFor(remoteUrl), file: target, status: "cached", bytes: fs.statSync(target).size };
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  const response = await fetch(remoteUrl, {
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; LexusStaticAssetLocalizer/1.0)",
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(target, buffer);
  return { remoteUrl, localUrl: localUrlFor(remoteUrl), file: target, status: "downloaded", bytes: buffer.byteLength };
};

const rewriteSourceFiles = (files, successfulUrls) => {
  let changedFiles = 0;
  let replacements = 0;
  for (const file of files) {
    const before = fs.readFileSync(file, "utf8");
    let after = before;
    for (const remoteUrl of successfulUrls) {
      const localUrl = localUrlFor(remoteUrl);
      const escaped = remoteUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      after = after.replace(new RegExp(escaped, "g"), localUrl);
    }
    if (after !== before) {
      changedFiles += 1;
      replacements += [...before.matchAll(/https:\/\/lexus-ec\.com\/wp-content\/uploads\//g)].length - [...after.matchAll(/https:\/\/lexus-ec\.com\/wp-content\/uploads\//g)].length;
      fs.writeFileSync(file, after, "utf8");
    }
  }
  return { changedFiles, replacements };
};

const sourceFiles = walk(sourceRoot, sourceExtensions);
const baselineFiles = walk(baselineRoot, baselineExtensions);
const urls = collectUrls([...sourceFiles, ...baselineFiles]);

const downloaded = [];
const failed = [];
for (const remoteUrl of urls) {
  try {
    downloaded.push(await download(remoteUrl));
  } catch (error) {
    failed.push({ remoteUrl, error: error instanceof Error ? error.message : String(error) });
  }
}

const successfulUrls = downloaded.map((item) => item.remoteUrl);
const rewriteResult = rewrite ? rewriteSourceFiles(sourceFiles, successfulUrls) : { changedFiles: 0, replacements: 0 };

fs.mkdirSync(reportDir, { recursive: true });
const report = {
  measuredAt: new Date().toISOString(),
  collected: urls.length,
  downloaded: downloaded.filter((item) => item.status === "downloaded").length,
  cached: downloaded.filter((item) => item.status === "cached").length,
  failed,
  rewrite: rewriteResult,
};
fs.writeFileSync(path.join(reportDir, "legacy-asset-localization.json"), JSON.stringify({ ...report, assets: downloaded }, null, 2));

console.log(JSON.stringify(report, null, 2));
