// Pre-generate optimized WebP thumbnails for the hero "wall of pass"
// marquee photos. The marquee shows small (~170px) images but the legacy
// sources are larger, poorly-compressed JP/PNG; WebP roughly halves them.
//
// Usage: node scripts/gen-marquee-thumbs.mjs <srcListFile>
// where <srcListFile> has one decoded public src per line, e.g.
//   /assets/legacy/wp-content/uploads/2024/09/sekiya.jpg
// Outputs public/assets/marquee-thumb/<djb2(src)>.webp — the same hashing
// as src/lib/marqueeThumb.ts, so the paths line up at runtime.
import sharp from "sharp";
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const djb2 = (str) => {
  let hash = 5381;
  for (let i = 0; i < str.length; i += 1) hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0;
  return hash.toString(36);
};

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = path.join(root, "public");
const outDir = path.join(pub, "assets", "marquee-thumb");
mkdirSync(outDir, { recursive: true });

const listFile = process.argv[2];
if (!listFile) {
  console.error("usage: node scripts/gen-marquee-thumbs.mjs <srcListFile>");
  process.exit(1);
}
const srcs = readFileSync(listFile, "utf8").split(/\r?\n/).map((s) => s.trim()).filter(Boolean);

let ok = 0;
let miss = 0;
for (const src of srcs) {
  const file = path.join(pub, src);
  if (!existsSync(file)) {
    miss += 1;
    console.warn("MISS", src);
    continue;
  }
  const out = path.join(outDir, `${djb2(src)}.webp`);
  // Cap width at 220px (source photos are ~195px, so this rarely resizes —
  // withoutEnlargement keeps quality); the win is the WebP re-encode.
  await sharp(file).resize({ width: 220, withoutEnlargement: true }).webp({ quality: 72 }).toFile(out);
  ok += 1;
}
console.log(`generated ${ok} thumbnails, ${miss} missing → ${outDir}`);
