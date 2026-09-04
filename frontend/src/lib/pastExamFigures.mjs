import fs from "node:fs";
import path from "node:path";

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
    if (!fs.existsSync(path.join(publicRoot, item.src))) throw new Error(`Missing figure asset ${item.src}`);
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
