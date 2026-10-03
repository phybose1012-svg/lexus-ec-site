import { rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

if (process.env.CF_PAGES_BRANCH === "main") {
  const frontendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const dist = path.join(frontendRoot, "dist");
  const stagingOnlyOutputs = [
    path.join(dist, "past-exam-library"),
    path.join(dist, "assets", "past-exams"),
  ];

  for (const target of stagingOnlyOutputs) {
    if (!path.relative(dist, target) || path.relative(dist, target).startsWith("..")) {
      throw new Error(`Refusing to remove an output outside dist: ${target}`);
    }
    await rm(target, { recursive: true, force: true });
  }
  console.log("[build] Past-exam pages and assets omitted from main deployment.");
}
