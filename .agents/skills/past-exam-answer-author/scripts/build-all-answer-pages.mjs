import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const repoRoot = fileURLToPath(new URL("../../../../", import.meta.url));
const sourceDir = path.join(repoRoot, "frontend/src/data/pastExamAnswerSources");
const outputDir = path.join(repoRoot, "frontend/src/data/generated/pastExamAnswers");
const builder = fileURLToPath(new URL("./build-answer-page.mjs", import.meta.url));
for (const name of fs.readdirSync(sourceDir).filter((name) => name.endsWith(".json")).sort()) {
  execFileSync(process.execPath, [builder, "--source", path.join(sourceDir, name), "--output", path.join(outputDir, name)], {
    cwd: repoRoot,
    stdio: "inherit",
  });
}
