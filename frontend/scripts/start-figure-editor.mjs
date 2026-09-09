#!/usr/bin/env node
/**
 * 図版を直すのに要るものを、まとめて立ち上げる。
 *
 *   npm run figure-editor:start
 *   （または、リポジトリ直下の「図版を直す.cmd」をダブルクリック）
 *
 * やること:
 *   1. 足りないものを入れる（node_modules）
 *   2. 書き戻し口（admin:api）を上げる
 *   3. 開発サーバを上げる
 *   4. 過去問ライブラリをブラウザで開く
 *
 * **手順書ではなく、これ 1 つで済むようにしてある。** 手順が 3 つ以上あると、
 * どこで止まったのか分からないまま「動きません」になる。ここで全部の面倒を
 * 見て、止まったら何をすればよいかを日本語で出す。
 *
 * 閉じるときはこの黒い画面を閉じるか Ctrl+C。両方のサーバも一緒に止まる。
 */
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const frontendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(frontendRoot, "..");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const children = [];

const say = (message = "") => console.log(message);
const step = (message) => console.log(`\n▶ ${message}`);

const stop = () => {
  for (const child of children) {
    if (!child.killed) child.kill();
  }
};

const die = (message, hint) => {
  say("");
  say("─".repeat(60));
  say(`止まりました: ${message}`);
  if (hint) say(hint);
  say("─".repeat(60));
  stop();
  process.exitCode = 1;
};

/** 誰も使っていないポートを探す。開発サーバは決め打ちにしない。 */
const findFreePort = (from) =>
  new Promise((resolve) => {
    const server = createServer();
    server.on("error", () => resolve(findFreePort(from + 1)));
    server.listen(from, "127.0.0.1", () => {
      server.close(() => resolve(from));
    });
  });

const run = (command, args, options = {}) =>
  new Promise((resolve) => {
    const child = spawn(command, args, { cwd: frontendRoot, stdio: "inherit", ...options });
    child.on("close", (code) => resolve(code ?? 1));
    child.on("error", () => resolve(1));
  });

const capture = (command, args) =>
  new Promise((resolve) => {
    const child = spawn(command, args, { cwd: repoRoot });
    let out = "";
    child.stdout.on("data", (chunk) => (out += chunk));
    child.on("close", () => resolve(out.trim()));
    child.on("error", () => resolve(""));
  });

/** 応答するまで待つ。上がりきる前に開くと、真っ白なページを見せてしまう。 */
const waitFor = async (url, seconds = 90) => {
  for (let index = 0; index < seconds * 2; index += 1) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (response.status < 500) return true;
    } catch {
      /* まだ */
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return false;
};

const openBrowser = (url) => {
  if (process.platform === "win32") spawn("cmd", ["/c", "start", "", url], { detached: true });
  else if (process.platform === "darwin") spawn("open", [url], { detached: true });
  else spawn("xdg-open", [url], { detached: true });
};

process.on("SIGINT", () => {
  say("\n終わります。");
  stop();
  process.exit(0);
});

// ---------------------------------------------------------------------------

say("════════════════════════════════════════════════════════════");
say("  過去問の図版を直す");
say("════════════════════════════════════════════════════════════");

// --- 1. 足りないものを入れる ---
if (!existsSync(path.join(frontendRoot, "node_modules"))) {
  step("初回だけ、必要なものを入れます（5 分ほどかかります）");
  const code = await run(npm, [existsSync(path.join(frontendRoot, "package-lock.json")) ? "ci" : "install"]);
  if (code !== 0) {
    die(
      "必要なものを入れられませんでした。",
      "インターネットにつながっているか確かめて、もう一度やってみてください。",
    );
    process.exit(1);
  }
}

if (!existsSync(path.join(frontendRoot, "vendor", "figure-editor", "package.json"))) {
  die(
    "図形エディタの本体がありません。",
    "リポジトリを取り直すか、npm run figure-editor:sync を実行してください。",
  );
  process.exit(1);
}

// --- 2. どの枝にいるか見せる ---
const branch = await capture("git", ["branch", "--show-current"]);
if (branch) {
  say(`\n今いる枝: ${branch}`);
  if (branch === "main") {
    say("  ⚠ main は公開中のサイトの枝です。直す前に staging へ移ってください。");
    say("    移り方が分からないときは、直さずに担当者へ連絡してください。");
  }
}

// --- 3. 書き戻し口 ---
step("保存先を用意しています");

/**
 * 先に動いているものが無いか見る。
 *
 * **画面は「最初に応答したポート」へ書く。** 別のフォルダの保存先が先に
 * 動いていると、そちらへ書き込んでしまい、直したはずの図がこちらに現れない。
 * 見つけたら、こちらのものなら使い回し、別のものなら止まって知らせる。
 */
let apiPort = null;
for (let port = 4335; port <= 4345; port += 1) {
  let health = null;
  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/local-admin/health`, { cache: "no-store" });
    if (response.ok) health = await response.json();
  } catch {
    continue;
  }
  if (!health) continue;
  const running = String(health.repoRoot || "").replaceAll("\\", "/").toLowerCase();
  if (running === repoRoot.replaceAll("\\", "/").toLowerCase()) {
    apiPort = port;
    say(`  すでに動いていました（127.0.0.1:${port}）`);
    break;
  }
  die(
    `別のフォルダの保存先が動いています（127.0.0.1:${port}）。`,
    `  動いている場所: ${health.repoRoot}\n` +
      `  ここ　　　　　: ${repoRoot}\n` +
      "そのままだと、直した図がそちらへ書き込まれてしまいます。\n" +
      "先にそちらの黒い画面を閉じてから、もう一度開いてください。",
  );
  process.exit(1);
}

if (apiPort === null) {
  const api = spawn("node", [path.join("scripts", "admin-local-api.mjs")], { cwd: frontendRoot });
  children.push(api);
  apiPort = await new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), 20000);
    api.stdout.on("data", (chunk) => {
      const found = String(chunk).match(/listening on http:\/\/127\.0\.0\.1:(\d+)/);
      if (found) {
        clearTimeout(timer);
        resolve(Number(found[1]));
      }
    });
  });
  api.stderr.on("data", (chunk) => process.stderr.write(chunk));
  if (!apiPort) {
    die("保存先を用意できませんでした。", "この画面を閉じて、もう一度やってみてください。");
    process.exit(1);
  }
  say(`  用意できました（127.0.0.1:${apiPort}）`);
}

// --- 4. 開発サーバ ---
step("ページを組み立てています（初回は 1 分ほどかかります）");
const devPort = await findFreePort(4321);
const dev = spawn(
  "node",
  [path.join("scripts", "astro-command.mjs"), "dev", "--host", "127.0.0.1", "--port", String(devPort), "--strictPort"],
  { cwd: frontendRoot },
);
children.push(dev);
dev.stdout.on("data", (chunk) => {
  const text = String(chunk);
  if (/error|Error/.test(text)) process.stdout.write(text);
});
dev.stderr.on("data", (chunk) => process.stderr.write(chunk));

const site = `http://127.0.0.1:${devPort}`;
if (!(await waitFor(`${site}/past-exam-library/`))) {
  die("ページを組み立てられませんでした。", "この画面を閉じて、もう一度やってみてください。");
  process.exit(1);
}

// --- 5. 開く ---
step("ブラウザで開きます");
openBrowser(`${site}/past-exam-library/`);

say("");
say("════════════════════════════════════════════════════════════");
say("  用意ができました");
say("");
say(`  ${site}/past-exam-library/`);
say("");
say("  1. 大学 → 年度 → 科目 → 解答・解説 の順に進む");
say("  2. 図の下の「✏️ 直す」を押す");
say("  3. 直したら ファイル ▸ SVG画像として保存");
say("");
say("  終わるときは、この黒い画面を閉じてください。");
say("════════════════════════════════════════════════════════════");

// 子が落ちたら、こちらも終わる（片方だけ生きている状態を作らない）。
for (const child of children) {
  child.on("close", (code) => {
    if (code !== 0 && code !== null) {
      say(`\nサーバが止まりました（コード ${code}）。この画面を閉じてやり直してください。`);
    }
    stop();
  });
}
