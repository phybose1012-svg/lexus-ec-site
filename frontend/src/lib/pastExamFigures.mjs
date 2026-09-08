import fs from "node:fs";
import path from "node:path";
import { readSvgSize } from "./svgSize.mjs";

const escape = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
export function loadFigureManifest(filename, publicRoot, packageId) {
  const data = JSON.parse(fs.readFileSync(filename, "utf8"));
  if (data.schemaVersion !== "lexus-past-exam-figures.v1" || data.packageId !== packageId || data.contentProvenance !== "original_editorial" || data.restrictedSourceCopied !== false) throw new Error("Invalid original figure manifest");
  const byId = new Map();
  const bySrc = new Map();
  for (const item of data.items) {
    if (!/^[a-z0-9-]+$/.test(item.id) || byId.has(item.id)) throw new Error("Duplicate or invalid figure ID");
    const prefix = `/assets/past-exams/${packageId}/figures/`;
    if (!item.src.startsWith(prefix) || !/^[a-z0-9-]+\.(svg|png|webp|jpg)$/.test(item.src.slice(prefix.length))) throw new Error("Figure asset path must stay in its package");
    if (!item.alt?.trim() || !item.caption?.trim() || !Number.isSafeInteger(item.width) || !Number.isSafeInteger(item.height) || item.width <= 0 || item.height <= 0) throw new Error("Missing figure dimensions or description");
    const assetPath = path.join(publicRoot, item.src);
    if (!fs.existsSync(assetPath)) throw new Error(`Missing figure asset ${item.src}`);
    // manifest の width/height は <img> にそのまま出る。実ファイルとずれると
    // 図が伸び縮みして表示される。図版は手でも直せる（管理 API 経由）ので、
    // 「一致しているはず」ではなく、破れたら鳴るようにしておく。
    if (item.src.endsWith(".svg")) {
      const size = readSvgSize(fs.readFileSync(assetPath, "utf8"));
      if (!size) throw new Error(`Cannot read size of ${item.src}`);
      if (size.width !== item.width || size.height !== item.height) {
        throw new Error(`Figure size mismatch ${item.src}: manifest ${item.width}x${item.height}, file ${size.width}x${size.height}`);
      }
    }
    byId.set(item.id, item);
    bySrc.set(item.src, item);
  }
  return { byId, bySrc };
}

export function renderRegisteredFigure(manifest, id) {
  const item = manifest?.byId.get(id);
  if (!item) throw new Error(`Unregistered figure ${id}`);
  return `<figure class="past-exam-figure" data-figure-id="${escape(id)}"><img src="${escape(item.src)}" alt="${escape(item.alt)}" width="${item.width}" height="${item.height}" loading="eager" decoding="sync"/><figcaption>${escape(item.caption)}</figcaption></figure>`;
}

export function replaceSourceFigures(fragment, manifest) {
  const seen = new Set();
  return fragment.replace(/<figure\b[^>]*\bdata-crop-id="([^"]+)"[^>]*>[\s\S]*?<\/figure>/g, (_, id) => {
    if (seen.has(id)) throw new Error(`Duplicate source figure ${id}`);
    seen.add(id);
    return renderRegisteredFigure(manifest, id);
  });
}
