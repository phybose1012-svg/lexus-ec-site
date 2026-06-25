import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const candidates = [
  path.join(root, "baseline", "pages", "manifest.json"),
  path.join(root, "..", "baseline", "pages", "manifest.json"),
];

const manifest = candidates.find((candidate) => existsSync(candidate));

if (!manifest) {
  console.error("[build-inputs] Missing baseline pages manifest.");
  console.error("[build-inputs] Checked:");
  for (const candidate of candidates) {
    console.error(`- ${candidate}`);
  }
  process.exit(1);
}

console.log(`[build-inputs] Baseline manifest found: ${path.relative(root, manifest).replaceAll("\\", "/")}`);
