import { createServer } from "node:http";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readSvgSize } from "../src/lib/svgSize.mjs";
import { unsafeSvgReason } from "../src/lib/svgSafety.mjs";
import { figureSvgPath, handEditedTrioPath } from "./lib/past-exam-figure-handoff.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(frontendRoot, "..");
const overridesModulePath = path.join(frontendRoot, "functions", "generated", "content-overrides.ts");
const targetBranch = process.env.ADMIN_GIT_TARGET_BRANCH || "staging";
const basePort = Number(process.env.ADMIN_LOCAL_API_PORT || 4335);
// route 側の上限（図版 SVG 2MB・控え 8MB）より大きくしておく。小さいと
// readBody が先に切ってしまい、宣言した 413 が永久に返らず、クライアントには
// 理由の分からない `Failed to fetch` だけが出る（実測）。
const maxBodyBytes = 12 * 1024 * 1024;

const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex",
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host || "127.0.0.1"}`);
    const corsHeaders = corsFor(request);

    // 書き込みは「JSON で」「ローカルから」だけ受ける。
    //
    // **これが無いと、閲覧中の任意のサイトから図版を書き換えられる。**
    // text/plain は CORS の単純リクエストなので preflight が無く、ブラウザは
    // そのまま送ってしまう。応答は読めない（ローカル以外に ACAO を付けない）
    // が、書き込みだけは通る。実際に別オリジンのページから公開アセットへ
    // <script> 入りの SVG を書けることを確かめた。
    // application/json を必須にすると preflight が要り、その preflight は
    // ローカル以外に許可を返さないのでブラウザが止める。
    if (request.method === "POST") {
      const failure = assertWritable(request);
      if (failure) {
        sendJson(response, failure.status, { error: failure.error }, corsHeaders);
        return;
      }
    }

    if (request.method === "OPTIONS") {
      sendJson(response, 204, null, corsHeaders);
      return;
    }

    if (!isLocalRequest(url.hostname)) {
      sendJson(response, 403, { error: "Local admin API only accepts localhost requests." }, corsHeaders);
      return;
    }

    if (url.pathname === "/api/local-admin/health" && request.method === "GET") {
      sendJson(response, 200, { ok: true, repoRoot, frontendRoot, targetBranch }, corsHeaders);
      return;
    }

    if (url.pathname === "/api/content-overrides" && request.method === "GET") {
      const overrides = await readOverrides();
      const overridePath = normalizePath(url.searchParams.get("path") || "");
      sendJson(response, 200, {
        configured: true,
        storage: "git-file",
        file: path.relative(repoRoot, overridesModulePath),
        override: overridePath ? overrides[overridePath] || null : null,
        overrides,
      }, corsHeaders);
      return;
    }

    if (url.pathname === "/api/content-overrides" && request.method === "POST") {
      const payload = await readJsonBody(request);
      const override = sanitizeOverride(payload);
      if (!override) {
        sendJson(response, 400, { error: "Invalid content override payload." }, corsHeaders);
        return;
      }
      const overrides = await readOverrides();
      overrides[override.path] = override;
      await writeOverrides(overrides);
      sendJson(response, 200, {
        configured: true,
        storage: "git-file",
        file: path.relative(repoRoot, overridesModulePath),
        override,
        git: await gitStatus(),
      }, corsHeaders);
      return;
    }

    if (url.pathname === "/api/past-exam-figures" && request.method === "GET") {
      const result = await readPastExamFigure(
        url.searchParams.get("package") || "",
        url.searchParams.get("figure") || ""
      );
      sendJson(response, result.status, result.body, corsHeaders);
      return;
    }

    if (url.pathname === "/api/past-exam-figures" && request.method === "POST") {
      const payload = await readJsonBody(request);
      const result = await writePastExamFigure(payload);
      sendJson(response, result.status, result.body, corsHeaders);
      return;
    }

    if (url.pathname === "/api/past-exam-figures/publish" && request.method === "POST") {
      const payload = await readJsonBody(request);
      const result = await publishPastExamFigure(payload);
      sendJson(response, result.status, result.body, corsHeaders);
      return;
    }

    if (url.pathname === "/api/git/status" && request.method === "GET") {
      sendJson(response, 200, await gitStatus(), corsHeaders);
      return;
    }

    if (url.pathname === "/api/git/fetch-staging" && request.method === "POST") {
      const output = await git(["fetch", "origin", targetBranch]);
      sendJson(response, 200, { ok: true, output, status: await gitStatus() }, corsHeaders);
      return;
    }

    if (url.pathname === "/api/git/pull-staging" && request.method === "POST") {
      const status = await gitStatus();
      const branchGuard = assertOnTargetBranch(status);
      if (branchGuard) {
        sendJson(response, 409, branchGuard, corsHeaders);
        return;
      }
      if (status.dirty) {
        sendJson(response, 409, {
          error: "Working tree has uncommitted changes. Commit or stash them before pulling staging.",
          status,
        }, corsHeaders);
        return;
      }
      const fetchOutput = await git(["fetch", "origin", targetBranch]);
      const pullOutput = await git(["pull", "--ff-only", "origin", targetBranch]);
      sendJson(response, 200, { ok: true, output: `${fetchOutput}\n${pullOutput}`.trim(), status: await gitStatus() }, corsHeaders);
      return;
    }

    if (url.pathname === "/api/git/commit-overrides" && request.method === "POST") {
      const body = await readOptionalJsonBody(request);
      const message = normalizeCommitMessage(body?.message);
      const relativeOverridePath = path.relative(repoRoot, overridesModulePath);
      await git(["add", "--", relativeOverridePath]);
      const staged = await git(["diff", "--cached", "--name-only", "--", relativeOverridePath]);
      if (!staged.trim()) {
        sendJson(response, 409, { error: "No admin content override changes are staged.", status: await gitStatus() }, corsHeaders);
        return;
      }
      const output = await git(["commit", "-m", message]);
      sendJson(response, 200, { ok: true, output, status: await gitStatus() }, corsHeaders);
      return;
    }

    if (url.pathname === "/api/git/push-staging" && request.method === "POST") {
      const status = await gitStatus();
      const branchGuard = assertOnTargetBranch(status);
      if (branchGuard) {
        sendJson(response, 409, branchGuard, corsHeaders);
        return;
      }
      const output = await git(["push", "origin", targetBranch]);
      sendJson(response, 200, { ok: true, output, status: await gitStatus() }, corsHeaders);
      return;
    }

    sendJson(response, 404, { error: "Not found" }, corsHeaders);
  } catch (error) {
    sendJson(response, 500, { error: error instanceof Error ? error.message : String(error) }, corsFor(request));
  }
});

/**
 * 図版エディタとのやり取り。
 *
 * **SVG と manifest の寸法は必ず一緒に書く。** manifest の width / height は
 * ページの <img> にそのまま出るので、実ファイルとずれると図が伸び縮みして
 * 表示される。src/lib/pastExamFigures.mjs の loadFigureManifest がこの一致を
 * 検査していて、破れているとビルドが止まる。片方だけ書ける口を開けると、
 * 必ずいつか片方だけ書かれる。
 *
 * **trio の控えも一緒に置く。** 図版 SVG は build-*-figures.mjs の出力でも
 * ある。控え（src/data/pastExamFigures/<packageId>/<figureId>.trio.json）が
 * あると、生成スクリプトはその図を上書きしなくなる。控えは次に開いたときの
 * 復元にも使う（SVG から読み直すと、編集の履歴＝レイヤ順やグループが失われる）。
 *
 * 受け取ったものはリポジトリの中の決まった場所にしか置かない。ID の形を
 * 先に検査し、パスは組み立てるだけで、渡された文字列を経路に混ぜない。
 */
/** 書き込みを受けてよい要求か。理由があれば返す。 */
const assertWritable = (request) => {
  const contentType = String(request.headers["content-type"] || "")
    .split(";")[0]
    .trim()
    .toLowerCase();
  if (contentType !== "application/json") {
    return { status: 415, error: "Content-Type は application/json だけ受け付けます。" };
  }
  const origin = request.headers.origin;
  if (origin && !isLocalOrigin(origin)) {
    return { status: 403, error: `このオリジンからは書けません: ${origin}` };
  }
  return null;
};

const FIGURE_ID = /^[a-z0-9-]+$/;
const MAX_SVG_BYTES = 2 * 1024 * 1024;
// ステージングの口（functions/admin/api/past-exam-figures.ts）と同じ値。
// 片方だけ通ると「手元では保存できたのに公開できない」が起きる。
const MAX_TRIO_BYTES = 2 * 1024 * 1024;

const figureManifestPath = (packageId) =>
  path.join(frontendRoot, "src", "data", "pastExamFigures", `${packageId}.json`);

/** manifest を読み、その図が登録されているか確かめる。 */
const loadFigureEntry = async (packageId, figureId) => {
  const manifestPath = figureManifestPath(packageId);
  let manifest;
  try {
    manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  } catch {
    return { error: { status: 404, body: { error: `manifest が見つかりません: ${packageId}` } } };
  }
  const item = manifest.items?.find((entry) => entry.id === figureId);
  if (!item) {
    return { error: { status: 404, body: { error: `manifest に登録されていない図です: ${figureId}` } } };
  }
  const expected = `/assets/past-exams/${packageId}/figures/${figureId}.svg`;
  if (item.src !== expected) {
    return { error: { status: 409, body: { error: `manifest の src が想定と違います: ${item.src}` } } };
  }
  return { manifestPath, manifest, item };
};

/**
 * 編集する図を渡す。控えがあればそれを返す。
 *
 * 控えを優先するのは、SVG から読み直すと編集の履歴が失われるから。取り込みは
 * 形を復元できるが、レイヤ順・グループ・非表示は SVG に書かれていない。
 */
const readPastExamFigure = async (packageId, figureId) => {
  if (!FIGURE_ID.test(packageId) || !FIGURE_ID.test(figureId)) {
    return { status: 400, body: { error: "packageId / figureId の形が不正です。" } };
  }
  const entry = await loadFigureEntry(packageId, figureId);
  if (entry.error) return entry.error;

  let svg;
  try {
    svg = await readFile(figureSvgPath(frontendRoot, packageId, figureId), "utf8");
  } catch {
    return { status: 404, body: { error: `SVG がありません: ${figureId}` } };
  }

  let trio = null;
  try {
    trio = JSON.parse(await readFile(handEditedTrioPath(frontendRoot, packageId, figureId), "utf8"));
  } catch {
    /* 控えが無い（まだ手で直していない）。SVG から取り込めばよい。 */
  }

  return {
    status: 200,
    body: {
      ok: true,
      packageId,
      figureId,
      svg,
      trio: trio?.trio ?? null,
      handEdited: trio !== null,
      repoRoot,
      alt: entry.item.alt,
      caption: entry.item.caption,
    },
  };
};

const writePastExamFigure = async (payload) => {
  const packageId = String(payload?.packageId ?? "");
  const figureId = String(payload?.figureId ?? "");
  const svg = typeof payload?.svg === "string" ? payload.svg : "";
  const trio = payload?.trio ?? null;

  if (!FIGURE_ID.test(packageId) || !FIGURE_ID.test(figureId)) {
    return { status: 400, body: { error: "packageId / figureId の形が不正です。" } };
  }
  if (!svg.trim().startsWith("<svg") || !svg.includes("</svg>")) {
    return { status: 400, body: { error: "SVG として受け取れませんでした。" } };
  }
  if (Buffer.byteLength(svg, "utf8") > MAX_SVG_BYTES) {
    return { status: 413, body: { error: "SVG が大きすぎます（上限 2MB）。" } };
  }
  const size = readSvgSize(svg);
  if (!size) {
    return { status: 400, body: { error: "SVG から寸法を読み取れませんでした。" } };
  }
  // 書いた先は公開ディレクトリで、.svg を直接開けばサイトのオリジンで動く。
  // 落とすのではなく断る（落とすと、直したはずの図が黙って変わる）。
  const unsafe = unsafeSvgReason(svg);
  if (unsafe) {
    return { status: 400, body: { error: `SVG に置けないものが入っています: ${unsafe}` } };
  }
  // 控えは「編集を続けられる形」でなければ意味がない。形だけ先に見る。
  if (trio !== null) {
    if (
      typeof trio !== "object" ||
      typeof trio.domain !== "string" ||
      typeof trio.substance !== "string" ||
      typeof trio.style !== "string"
    ) {
      return { status: 400, body: { error: "trio の形が不正です（domain / substance / style が要ります）。" } };
    }
  }

  const entry = await loadFigureEntry(packageId, figureId);
  if (entry.error) return entry.error;
  const { manifestPath, manifest, item } = entry;

  // **控えを先に書く。** 3 つ（控え・SVG・manifest）を続けて書くので、途中で
  // 落ちたときにどちらへ倒れるかを選べる。
  //
  // 控えを最後にすると「公開ファイルは差し替わったのに、手が正本という印だけ
  // 無い」で終わる。次に生成スクリプトを流すと警告ひとつ無く元へ戻り、直した
  // ものが黙って消える（実測）。
  // 先に書けば、最悪でも「印はあるが SVG は古い」で終わる。直した trio は
  // 残っているので次に開けば続きから編集でき、生成スクリプトはその図の名前を
  // 出して手を出さない。失敗したことも画面に出る。
  let trioPath = null;
  if (trio !== null) {
    const record = `${JSON.stringify({ schemaVersion: "lexus-past-exam-figure-trio.v1", packageId, figureId, trio }, null, 2)}\n`;
    if (Buffer.byteLength(record, "utf8") > MAX_TRIO_BYTES) {
      return { status: 413, body: { error: "trio が大きすぎます（上限 2MB）。" } };
    }
    trioPath = handEditedTrioPath(frontendRoot, packageId, figureId);
    await mkdir(path.dirname(trioPath), { recursive: true });
    await writeFile(trioPath, record, "utf8");
  }

  const svgPath = figureSvgPath(frontendRoot, packageId, figureId);
  await mkdir(path.dirname(svgPath), { recursive: true });
  await writeFile(svgPath, svg.endsWith("\n") ? svg : `${svg}\n`, "utf8");

  const manifestUpdated = item.width !== size.width || item.height !== size.height;
  if (manifestUpdated) {
    item.width = size.width;
    item.height = size.height;
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  }

  return {
    status: 200,
    body: {
      ok: true,
      file: path.relative(repoRoot, svgPath).replaceAll("\\", "/"),
      manifest: path.relative(repoRoot, manifestPath).replaceAll("\\", "/"),
      manifestUpdated,
      trioFile: trioPath ? path.relative(repoRoot, trioPath).replaceAll("\\", "/") : null,
      repoRoot,
      width: size.width,
      height: size.height,
      git: await gitStatus(),
    },
  };
};

/**
 * 直した図を staging へ送る（commit して push する）。
 *
 * **保存しただけでは、どこにも公開されない。** 手元の口は作業ツリーの
 * ファイルを書き換えるだけなので、誰かが commit して push しないと
 * ステージングにも本番にも出ない。そこを人手に頼ると必ず抜ける。
 *
 * 送るのはその図の 3 つだけ（SVG・manifest・控え）。**作業ツリーごと
 * まとめて送らない。** 他の人が触りかけのものを巻き込むと、直した図と
 * 関係のない変更が一緒に公開される。
 */
const publishPastExamFigure = async (payload) => {
  const packageId = String(payload?.packageId ?? "");
  const figureId = String(payload?.figureId ?? "");
  if (!FIGURE_ID.test(packageId) || !FIGURE_ID.test(figureId)) {
    return { status: 400, body: { error: "packageId / figureId の形が不正です。" } };
  }

  const status = await gitStatus();
  if (!status.ok) {
    return { status: 500, body: { error: "git の様子が読めませんでした。", status } };
  }
  const branchGuard = assertOnTargetBranch(status);
  if (branchGuard) {
    return {
      status: 409,
      body: {
        error: `いまいる枝は ${status.branch || "（不明）"} です。${targetBranch} に移ってから送ってください。`,
        status,
      },
    };
  }

  // この図に属するものだけを staging へ載せる。
  const paths = [
    path.relative(repoRoot, figureSvgPath(frontendRoot, packageId, figureId)),
    path.relative(repoRoot, figureManifestPath(packageId)),
    path.relative(repoRoot, handEditedTrioPath(frontendRoot, packageId, figureId)),
  ].map((value) => value.replaceAll("\\", "/"));

  // **まだ無いものを git add へ渡さない。** 控えは初回の保存で作られるので、
  // 保存する前に送ろうとすると pathspec が合わずに git ごと落ちる（実測で 500）。
  const present = paths.filter((value) => existsSync(path.join(repoRoot, value)));
  if (present.length === 0) {
    return {
      status: 409,
      body: { error: "送るものがありません（この図はまだ保存されていません）。", status },
    };
  }

  await git(["add", "--", ...present]);
  const staged = await git(["diff", "--cached", "--name-only", "--", ...present]);
  if (!staged.trim()) {
    return {
      status: 409,
      body: { error: "送るものがありません（この図は変わっていません）。", status: await gitStatus() },
    };
  }

  const message = `fix(past-exam): 図版を直す（${packageId} / ${figureId}）`;
  const commitOutput = await git(["commit", "-m", message]);
  let pushOutput;
  try {
    pushOutput = await git(["push", "origin", targetBranch]);
  } catch (error) {
    // commit は済んでいる。押し戻せなかったことだけを伝える（取り消さない。
    // 消すと、直した内容ごと失われる）。
    return {
      status: 502,
      body: {
        error: `commit はできましたが、送れませんでした: ${error instanceof Error ? error.message : String(error)}`,
        committed: true,
        files: staged.trim().split("\n"),
        status: await gitStatus(),
      },
    };
  }

  return {
    status: 200,
    body: {
      ok: true,
      branch: targetBranch,
      files: staged.trim().split("\n"),
      output: `${commitOutput}\n${pushOutput}`.trim(),
      status: await gitStatus(),
    },
  };
};

const readOverrides = async () => {
  const source = await readFile(overridesModulePath, "utf8").catch(() => "");
  const match = source.match(/export const repoContentOverrides = ([\s\S]*?) as const;/);
  if (!match) return {};
  try {
    const parsed = JSON.parse(match[1]);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
};

const writeOverrides = async (overrides) => {
  await mkdir(path.dirname(overridesModulePath), { recursive: true });
  const json = JSON.stringify(sortObjectByKey(overrides), null, 2).replace(/</g, "\\u003c");
  await writeFile(
    overridesModulePath,
    `/* Auto-generated by the local admin API. Keep this file committed. */\nexport const repoContentOverrides = ${json} as const;\n`,
    "utf8",
  );
};

const gitStatus = async () => {
  const [branch, shortStatus, lastCommit, remoteUrl] = await Promise.all([
    git(["branch", "--show-current"]).then((value) => value.trim()).catch(() => ""),
    git(["status", "--porcelain=v1", "-b"]).catch((error) => error.message),
    git(["log", "-1", "--format=%h %s"]).then((value) => value.trim()).catch(() => ""),
    git(["remote", "get-url", "origin"]).then((value) => value.trim()).catch(() => ""),
  ]);
  const dirtyFiles = shortStatus
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("## "))
    .map((line) => line.trim());
  const upstream = await git(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"])
    .then((value) => value.trim())
    .catch(() => "");
  const [ahead, behind] = await git(["rev-list", "--left-right", "--count", "HEAD...@{u}"])
    .then((value) => value.trim().split(/\s+/).map(Number))
    .catch(() => [0, 0]);

  return {
    ok: true,
    branch,
    targetBranch,
    onTargetBranch: branch === targetBranch,
    upstream,
    ahead,
    behind,
    dirty: dirtyFiles.length > 0,
    dirtyFiles,
    lastCommit,
    remoteUrl,
    repoRoot,
  };
};

const git = (args) =>
  new Promise((resolve, reject) => {
    execFile("git", args, { cwd: repoRoot, timeout: 60000, windowsHide: true }, (error, stdout, stderr) => {
      const output = `${stdout || ""}${stderr || ""}`.trim();
      if (error) {
        reject(new Error(output || error.message));
        return;
      }
      resolve(output);
    });
  });

const assertOnTargetBranch = (status) => {
  if (status.branch === targetBranch) return null;
  return {
    error: `Current branch is ${status.branch || "(unknown)"}. Switch to ${targetBranch} before pulling or pushing staging.`,
    status,
  };
};

const sanitizeOverride = (payload) => {
  if (!payload || typeof payload !== "object" || typeof payload.path !== "string") return null;
  const pathValue = normalizePath(payload.path);
  return {
    id: sanitizeString(payload.id || pathValue, 120),
    label: sanitizeString(payload.label || pathValue, 200),
    kind: payload.kind === "post" ? "post" : "fixed-page",
    path: pathValue,
    fields: sanitizeStringRecord(payload.fields, 8000),
    images: sanitizeImageMap(payload.images),
    styles: sanitizeStyleMap(payload.styles),
    selectors: sanitizeStringRecord(payload.selectors, 1000),
    status: sanitizeString(payload.status || "published", 40),
    updatedAt: new Date().toISOString(),
  };
};

const sanitizeStringRecord = (value, maxLength) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key, item]) => typeof key === "string" && key.length <= 160 && typeof item === "string")
      .map(([key, item]) => [key, item.slice(0, maxLength)]),
  );
};

const sanitizeImageMap = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key, image]) => key.length <= 160 && image && typeof image === "object" && !Array.isArray(image))
      .map(([key, image]) => {
        const clean = {};
        if (typeof image.src === "string") clean.src = image.src.slice(0, 2000);
        if (typeof image.alt === "string") clean.alt = image.alt.slice(0, 300);
        if (typeof image.width === "string") clean.width = image.width.slice(0, 40);
        if (image.hidden === true) clean.hidden = true;
        return [key, clean];
      })
      .filter(([, image]) => Object.keys(image).length > 0),
  );
};

const sanitizeStyleMap = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key, styles]) => key.length <= 160 && styles && typeof styles === "object" && !Array.isArray(styles))
      .map(([key, styles]) => [key, sanitizeStringRecord(styles, 80)])
      .filter(([, styles]) => Object.keys(styles).length > 0),
  );
};

const normalizePath = (value) => {
  const pathValue = String(value || "/").trim();
  if (!pathValue || pathValue === "/") return "/";
  return `/${pathValue.replace(/^\/+|\/+$/g, "")}/`;
};

const normalizeCommitMessage = (value) => {
  const message = typeof value === "string" ? value.trim() : "";
  return message ? message.slice(0, 160) : "Update admin content overrides";
};

const sanitizeString = (value, maxLength) => String(value || "").trim().slice(0, maxLength);

const sortObjectByKey = (value) =>
  Object.fromEntries(Object.entries(value || {}).sort(([left], [right]) => left.localeCompare(right)));

const readJsonBody = async (request) => {
  const text = await readBody(request);
  if (!text) return null;
  return JSON.parse(text);
};

const readOptionalJsonBody = async (request) => {
  const text = await readBody(request);
  if (!text) return {};
  return JSON.parse(text);
};

const readBody = (request) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    request.on("data", (chunk) => {
      total += chunk.length;
      if (total > maxBodyBytes) {
        reject(new Error("Request body is too large."));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    request.on("error", reject);
  });

const corsFor = (request) => {
  const origin = request.headers.origin || "";
  const headers = {
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "600",
  };
  if (isLocalOrigin(origin)) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
};

const isLocalOrigin = (origin) => {
  if (!origin) return false;
  try {
    const url = new URL(origin);
    return isLocalRequest(url.hostname);
  } catch {
    return false;
  }
};

const isLocalRequest = (hostname) => ["127.0.0.1", "localhost", "::1", "[::1]"].includes(hostname);

const sendJson = (response, status, payload, headers = {}) => {
  response.writeHead(status, { ...jsonHeaders, ...headers });
  response.end(payload == null ? "" : JSON.stringify(payload, null, 2));
};

const listen = async () => {
  for (let port = basePort; port <= basePort + 10; port += 1) {
    try {
      await new Promise((resolve, reject) => {
        const onError = (error) => {
          server.off("listening", onListening);
          reject(error);
        };
        const onListening = () => {
          server.off("error", onError);
          resolve();
        };
        server.once("error", onError);
        server.once("listening", onListening);
        server.listen(port, "127.0.0.1");
      });
      console.log(`[admin-local-api] listening on http://127.0.0.1:${port}`);
      console.log(`[admin-local-api] target branch: ${targetBranch}`);
      return;
    } catch (error) {
      if (error?.code !== "EADDRINUSE") throw error;
    }
  }
  throw new Error(`No available admin local API port in ${basePort}-${basePort + 10}.`);
};

listen().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
