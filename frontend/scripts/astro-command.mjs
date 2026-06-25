import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const astroBin = path.join(root, "node_modules", ".bin", process.platform === "win32" ? "astro.cmd" : "astro");
const args = process.argv.slice(2);
const command = process.platform === "win32" ? process.env.ComSpec || "cmd.exe" : astroBin;
const commandArgs =
  process.platform === "win32"
    ? ["/d", "/c", astroBin, ...args]
    : args;

const child = spawn(command, commandArgs, {
  cwd: root,
  env: {
    ...process.env,
    ASTRO_TELEMETRY_DISABLED: "1",
    npm_config_cache: path.resolve(root, "..", ".npm-cache"),
  },
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  }
  process.exit(code ?? 1);
});
