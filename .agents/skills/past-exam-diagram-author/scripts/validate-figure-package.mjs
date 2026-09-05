#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadFigureManifest } from "../../../../frontend/src/lib/pastExamFigures.mjs";

const skillRoot = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(skillRoot, "../../../..");

function usage(message) {
  if (message) console.error(message);
  console.error("Usage: node validate-figure-package.mjs --manifest <file> --public-root <dir> [--qa-dir <dir>]");
  process.exit(message ? 1 : 0);
}

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (key === "--help" || key === "-h") usage();
    if (!["--manifest", "--public-root", "--qa-dir"].includes(key)) usage(`Unknown option: ${key}`);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) usage(`Missing value for ${key}`);
    result[key.slice(2)] = value;
    index += 1;
  }
  if (!result.manifest || !result["public-root"]) usage("--manifest and --public-root are required");
  return result;
}

const escapeXml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function validateSvg(svg, item) {
  const problems = [];
  const opening = svg.match(/<svg\b([^>]*)>/)?.[1] ?? "";
  const requiredAttributes = [
    [`width="${item.width}"`, "intrinsic width"],
    [`height="${item.height}"`, "intrinsic height"],
    [`viewBox="0 0 ${item.width} ${item.height}"`, "matching viewBox"],
    ['role="img"', "image role"],
    ['aria-labelledby="title"', "title association"],
  ];
  for (const [needle, label] of requiredAttributes) if (!opening.includes(needle)) problems.push(`missing ${label}`);
  if (!/<title\s+id="title">[^<]+<\/title>/.test(svg)) problems.push("missing nonempty title");
  if (/<(?:script|image|foreignObject|iframe|object|embed|use)\b/i.test(svg)) problems.push("contains a forbidden element");
  if (/\b(?:href|xlink:href|on[a-z]+)\s*=/i.test(svg)) problems.push("contains a forbidden link or event attribute");
  if (/url\(\s*["']?https?:\/\/|data:image\//i.test(svg)) problems.push("contains an external or raster image resource");

  const hasMath = /class="math(?:\s|\")/.test(svg);
  if (hasMath) {
    if (!svg.includes("@font-face{font-family:'KaTeX_Main'")) problems.push("missing embedded KaTeX Main face");
    if (!svg.includes("@font-face{font-family:'KaTeX_Math'")) problems.push("missing embedded KaTeX Math face");
    if ((svg.match(/data:font\/woff2;base64/g) ?? []).length !== 2) problems.push("must embed exactly two KaTeX WOFF2 faces");
    if (!/\.math \.mi\{font-family:'KaTeX_Math'/.test(svg)) problems.push("missing KaTeX variable style");
    if (!/<text\b[^>]*class="math[^>]*>[\s\S]*?<tspan\b/.test(svg)) problems.push("mathematical labels must use typed tspans");
  }
  return problems;
}

async function renderQa(items, publicRoot, qaDir) {
  const requireFromFrontend = createRequire(pathToFileURL(path.join(repositoryRoot, "frontend/package.json")));
  const sharp = requireFromFrontend("sharp");
  fs.mkdirSync(qaDir, { recursive: true });
  const tileWidth = 420;
  const imageHeight = 285;
  const tileHeight = 330;
  const columns = 2;
  const composites = [];

  for (const [index, item] of items.entries()) {
    const source = path.join(publicRoot, item.src);
    const buffer = await sharp(source)
      .resize({ width: tileWidth - 30, height: imageHeight - 20, fit: "inside", withoutEnlargement: true })
      .png()
      .toBuffer();
    const metadata = await sharp(buffer).metadata();
    await sharp(source).png().toFile(path.join(qaDir, `${item.id}.png`));
    const column = index % columns;
    const row = Math.floor(index / columns);
    composites.push({
      input: buffer,
      left: column * tileWidth + Math.round((tileWidth - metadata.width) / 2),
      top: row * tileHeight + 36 + Math.round((imageHeight - metadata.height) / 2),
    });
    const label = Buffer.from(`<svg width="${tileWidth}" height="36" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#eef2f5"/><text x="14" y="24" font-family="Arial, sans-serif" font-size="16" fill="#18334c">${escapeXml(item.id)}</text></svg>`);
    composites.push({ input: label, left: column * tileWidth, top: row * tileHeight });
  }

  const rows = Math.ceil(items.length / columns);
  await sharp({ create: { width: tileWidth * columns, height: tileHeight * rows, channels: 4, background: "white" } })
    .composite(composites)
    .png()
    .toFile(path.join(qaDir, "_contact-sheet.png"));
}

const args = parseArgs(process.argv.slice(2));
const manifestFile = path.resolve(args.manifest);
const publicRoot = path.resolve(args["public-root"]);
const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
loadFigureManifest(manifestFile, publicRoot, manifest.packageId);

const failures = [];
let svgCount = 0;
for (const item of manifest.items) {
  if (!item.src.endsWith(".svg")) continue;
  svgCount += 1;
  const asset = path.join(publicRoot, item.src);
  const svg = fs.readFileSync(asset, "utf8");
  for (const problem of validateSvg(svg, item)) failures.push(`${item.id}: ${problem}`);
}

if (failures.length) {
  for (const failure of failures) console.error(failure);
  process.exit(1);
}

if (args["qa-dir"]) await renderQa(manifest.items, publicRoot, path.resolve(args["qa-dir"]));
console.log(`Validated ${manifest.items.length} figures (${svgCount} SVG) for ${manifest.packageId}${args["qa-dir"] ? " and rendered QA PNGs" : ""}`);
