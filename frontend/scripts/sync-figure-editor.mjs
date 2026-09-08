#!/usr/bin/env node
/**
 * FIBONA（図形エディタ）の配布物を vendor/ へ写す。
 *
 * ビルド成果物なのでこのリポジトリの履歴には入れない（.gitignore 参照）。
 * 代わりに、必要になったときこれで取り直す。
 *
 *   npm run figure-editor:sync
 *   FIBONA_REPO=C:/path/to/math npm run figure-editor:sync
 *
 * 写す前に古い中身を消す。**残すと消えたファイルが生き続ける**：写すのは
 * 上書きだけなので、FIBONA 側で消えたチャンクがこちらに残り、古い import が
 * 解決できてしまって、直したはずの不具合が再現しなくなる。
 */
import { cp, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const frontendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fibonaRoot = path.resolve(process.env.FIBONA_REPO ?? "C:/dev/math");
const source = path.join(fibonaRoot, "frontend", "dist-lib");
const destination = path.join(frontendRoot, "vendor", "figure-editor");

const exists = async (target) => {
  try {
    await stat(target);
    return true;
  } catch {
    return false;
  }
};

const fail = (message) => {
  console.error(`図形エディタを写せませんでした。\n${message}`);
  process.exit(1);
};

if (!(await exists(source))) {
  fail(
    `FIBONA の配布物がありません: ${source}\n` +
      `FIBONA 側で 'npm run build:lib'（frontend/）を実行してください。\n` +
      `場所が違うときは FIBONA_REPO で渡せます。`
  );
}

// 中途半端な配布物を写しても、失敗するのは実行時になってしまう。先に見る。
for (const required of ["package.json", "index.js", "index.d.ts", "style.css"]) {
  if (!(await exists(path.join(source, required)))) {
    fail(`配布物に ${required} がありません（${source}）。'npm run build:lib' をやり直してください。`);
  }
}

await rm(destination, { recursive: true, force: true });
await mkdir(path.dirname(destination), { recursive: true });
await cp(source, destination, { recursive: true });

const { name, version } = JSON.parse(
  await (await import("node:fs/promises")).readFile(path.join(destination, "package.json"), "utf8")
);
console.log(`${name}@${version} を写しました。`);
console.log(`  ${source}\n→ ${path.relative(frontendRoot, destination).replaceAll("\\", "/")}`);
