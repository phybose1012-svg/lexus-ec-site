// Generate optimized (AVIF/WebP, resized) variants of the TOP-page images into
// public/assets/optimized/. One-off tool: run `node scripts/optimize-top-images.mjs`
// after changing any of the source images below, then commit the outputs.
//
// The hero washi image gets the CSS filter that used to sit on .premium-hero__bg
// (saturate/contrast/brightness/blur) baked into the pixels so the CSS filter —
// which forced non-composited animation and ~1.5s of Style & Layout work on
// mobile — can be removed without changing the rendered look.
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = path.join(root, "public");
const outDir = path.join(pub, "assets", "optimized");

const LEGACY = "assets/legacy/wp-content/uploads";

// CSS filter equivalents (desktop blur(0.8px) saturate(82%) contrast(88%)
// brightness(1.08) vs mobile blur(0.65px) saturate(80%) brightness(1.1) —
// split the difference; the image renders at ~66% opacity under white veils,
// so ±1% is invisible). CSS contrast(c) = (x-0.5)*c+0.5; blur sigma scales
// with output width so the softening matches at display size.
const bakeHeroFilter = (img, widthRatio) =>
  img
    .modulate({ saturation: 0.81, brightness: 1.09 })
    .linear(0.88, 255 * 0.5 * (1 - 0.88))
    .blur(Math.max(0.3, 0.75 * widthRatio));

const jobs = [
  {
    src: `${LEGACY}/2026/01/鬼-和紙01.jpg`, // 1440x734 hero washi (LCP element)
    name: "hero-washi",
    widths: [480, 768, 1080, 1440],
    formats: [
      { ext: "avif", options: { quality: 45 } },
      { ext: "webp", options: { quality: 62 } },
      { ext: "jpg", options: { quality: 70, mozjpeg: true }, widths: [1440] },
    ],
    bake: bakeHeroFilter,
  },
  {
    src: `${LEGACY}/2024/08/社名ロゴ-1.jpg`, // 1181x380 header logo, displayed ≤446px wide
    name: "header-logo",
    widths: [512, 900],
    formats: [{ ext: "webp", options: { quality: 82 } }],
  },
  {
    src: `${LEGACY}/2024/11/背景ロゴ-縦長.png`, // mobile body watermark (CSS background)
    name: "watermark-mobile",
    widths: [860],
    formats: [{ ext: "webp", options: { quality: 75 } }],
  },
  {
    src: "assets/site/header-background-desktop.jpg", // desktop body background
    name: "header-background-desktop",
    widths: [1920],
    formats: [{ ext: "webp", options: { quality: 72 } }],
  },
  {
    src: `${LEGACY}/2024/11/背景ロゴだらけメニュー透明3-1024x74.png`, // jewel strip (used 7x)
    name: "jewel-strip",
    widths: [800],
    formats: [{ ext: "webp", options: { quality: 80 } }],
  },
  {
    src: `${LEGACY}/2024/08/レクサス社名ロゴ.jpg`, // 1503x593 footer logo
    name: "footer-logo",
    widths: [760],
    formats: [{ ext: "webp", options: { quality: 80 } }],
  },
  {
    src: "illustrations/characters/yuki-sensei-default.png", // pillar card, displayed 234x260
    name: "yuki-sensei-default",
    widths: [480],
    formats: [{ ext: "webp", options: { quality: 80 } }],
  },
  {
    src: "illustrations/characters/yuki-sensei-cheer.png",
    name: "yuki-sensei-cheer",
    widths: [480],
    formats: [{ ext: "webp", options: { quality: 80 } }],
  },
  // Header shortcut icons (displayed at ~96px wide, sources are ~386px JPGs).
  {
    src: `${LEGACY}/2024/08/アイコン-09.jpg`,
    name: "icon-access",
    widths: [192],
    formats: [{ ext: "webp", options: { quality: 80 } }],
  },
  {
    src: `${LEGACY}/2025/05/アイコン-08.jpg`,
    name: "icon-consult",
    widths: [192],
    formats: [{ ext: "webp", options: { quality: 80 } }],
  },
  {
    src: `${LEGACY}/2024/08/アイコン-07.jpg`,
    name: "icon-contact",
    widths: [192],
    formats: [{ ext: "webp", options: { quality: 80 } }],
  },
  {
    src: `${LEGACY}/2025/05/アイコン-06.jpg`,
    name: "icon-request",
    widths: [192],
    formats: [{ ext: "webp", options: { quality: 80 } }],
  },
  {
    src: `${LEGACY}/2026/04/レクサス教育センター-医学部合格者-順天堂大学2026合格.jpg`,
    name: "success-juntendo-2026",
    widths: [768],
    formats: [{ ext: "webp", options: { quality: 74 } }],
  },
  {
    src: `${LEGACY}/2026/04/レクサス教育センター-医学部合格者-千葉大学2026合格.jpg`,
    name: "success-chiba-2026",
    widths: [768],
    formats: [{ ext: "webp", options: { quality: 74 } }],
  },
  {
    src: `${LEGACY}/2026/04/レクサス教育センター-医学部合格者-北里大学2026合格.jpg`,
    name: "success-kitasato-2026",
    widths: [768],
    formats: [{ ext: "webp", options: { quality: 74 } }],
  },
];

const kb = (bytes) => `${(bytes / 1024).toFixed(1)}KB`;

await mkdir(outDir, { recursive: true });

for (const job of jobs) {
  const srcPath = path.join(pub, job.src);
  const meta = await sharp(srcPath).metadata();
  const srcBytes = (await stat(srcPath)).size;
  console.log(`\n${job.src}  ${meta.width}x${meta.height}  ${kb(srcBytes)}`);

  for (const format of job.formats) {
    for (const width of format.widths ?? job.widths) {
      const targetWidth = Math.min(width, meta.width);
      let img = sharp(srcPath).resize({ width: targetWidth, withoutEnlargement: true });
      if (job.bake) img = job.bake(img, targetWidth / meta.width);
      const outName = `${job.name}-${width}.${format.ext}`;
      const outPath = path.join(outDir, outName);
      const info = await img
        .toFormat(format.ext === "jpg" ? "jpeg" : format.ext, format.options)
        .toFile(outPath);
      console.log(`  -> ${outName}  ${info.width}x${info.height}  ${kb(info.size)}`);
    }
  }
}

console.log("\nDone. Outputs in public/assets/optimized/");
