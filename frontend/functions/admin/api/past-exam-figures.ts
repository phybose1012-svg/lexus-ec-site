import { readSvgSize } from "../../../src/lib/svgSize.mjs";
import { unsafeSvgReason } from "../../../src/lib/svgSafety.mjs";

/**
 * ステージングから図版を直したときの書き戻し口。
 *
 * ローカルには同じ役目の口がある（scripts/admin-local-api.mjs）。あちらは
 * 作業ツリーのファイルを直接書く。こちらは触れるファイルが無いので、
 * **GitHub へ 1 コミットとして送る**。Pages がそれを拾って作り直す。
 *
 * **3 つのファイルは 1 コミットにまとめる。** SVG・manifest・控えのどれかが
 * 欠けた状態が枝に残ると、次のビルドが落ちるか、直した図が黙って消える。
 * Git Data API（blob → tree → commit → ref）なら、まとめて 1 回で入る。
 * Contents API は 1 ファイル 1 コミットなので使えない。
 *
 * **この口は公開された URL に出る。** 認可は合言葉（ADMIN_API_TOKEN の
 * Bearer）だけ。既存の管理 API は Cf-Access-Authenticated-User-Email でも
 * 通すが、この口では使わない。あのヘッダは Cloudflare Access が前段に立って
 * いるときしか意味が無く、名乗るだけで通ってしまう（実測）。Pages は
 * プレビューごとに別のホスト名でも同じ Function と同じ環境変数を配るので、
 * Access を 1 つのホスト名にだけ掛けても守れない。
 *
 * 要る設定（Cloudflare Pages の環境変数。**staging は Preview 側にも要る**）:
 *   FIGURE_GIT_TOKEN   … fine-grained PAT。権限は Contents: Read and write だけ
 *   FIGURE_GIT_REPO    … "owner/repo"
 *   FIGURE_GIT_BRANCH  … 既定 "staging"（main / master は断る）
 *   ADMIN_API_TOKEN    … 合言葉。**未設定なら誰も書けない**
 */

type Env = {
  ADMIN_API_TOKEN?: string;
  FIGURE_GIT_TOKEN?: string;
  FIGURE_GIT_REPO?: string;
  FIGURE_GIT_BRANCH?: string;
};

type FunctionContext = {
  request: Request;
  env: Env;
};

type ManifestItem = {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
};

type Manifest = {
  items?: ManifestItem[];
};

type Config = { token: string; repo: string; branch: string };

const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex",
};

const FIGURE_ID = /^[a-z0-9-]+$/;

/**
 * SVG の上限。ローカルの口（2MB）より小さい。
 *
 * Workers は 1 回の呼び出しで使える CPU が短く（無料枠は 10ms）、base64 化が
 * そこを食う。2MB で 57〜78ms かかった（実測）ので、まず通らない。実際の
 * 図版は 20〜60KB なので、512KB あれば足りる。
 */
const maxSvgBytes = 512 * 1024;
const maxTrioBytes = 512 * 1024;
const maxBodyBytes = 1536 * 1024;
const githubApi = "https://api.github.com";

export const onRequestGet = async ({ request, env }: FunctionContext) => {
  const auth = assertAdminAccess(request, env);
  if (auth) return auth;
  const config = readConfig(env);
  if ("error" in config) return jsonResponse({ error: config.error }, 503);

  const url = new URL(request.url);
  const packageId = url.searchParams.get("package") || "";
  const figureId = url.searchParams.get("figure") || "";
  if (!FIGURE_ID.test(packageId) || !FIGURE_ID.test(figureId)) {
    return jsonResponse({ error: "packageId / figureId の形が不正です。" }, 400);
  }

  try {
    const manifest = await readJsonFile<Manifest>(config, manifestPath(packageId), config.branch);
    if (!manifest) return jsonResponse({ error: `manifest が見つかりません: ${packageId}` }, 404);
    const item = manifest.items?.find((entry) => entry.id === figureId);
    if (!item) return jsonResponse({ error: `manifest に登録されていない図です: ${figureId}` }, 404);

    const svg = await readTextFile(config, svgPath(packageId, figureId), config.branch);
    if (svg === null) return jsonResponse({ error: `SVG がありません: ${figureId}` }, 404);

    const record = await readJsonFile<{ trio?: unknown }>(
      config,
      trioPath(packageId, figureId),
      config.branch,
    );

    return jsonResponse({
      ok: true,
      packageId,
      figureId,
      svg,
      trio: record?.trio ?? null,
      handEdited: record !== null,
      alt: item.alt,
      caption: item.caption,
      repoRoot: `${config.repo}@${config.branch}`,
    });
  } catch (cause) {
    return failure(cause);
  }
};

export const onRequestPost = async ({ request, env }: FunctionContext) => {
  const auth = assertAdminAccess(request, env);
  if (auth) return auth;

  // 書き込みは JSON でだけ受ける。text/plain は CORS の単純リクエストなので
  // preflight が無く、閲覧中の任意のサイトから投げられてしまう。
  const contentType = (request.headers.get("Content-Type") || "").split(";")[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    return jsonResponse({ error: "Content-Type は application/json だけ受け付けます。" }, 415);
  }
  const origin = request.headers.get("Origin");
  if (origin && origin !== new URL(request.url).origin) {
    return jsonResponse({ error: `このオリジンからは書けません: ${origin}` }, 403);
  }

  const config = readConfig(env);
  if ("error" in config) return jsonResponse({ error: config.error }, 503);

  // Content-Length は名乗るだけなので当てにしない（chunked なら付かない）。
  // 実際に読んだ量で見る。
  const body = await request.text();
  if (utf8Length(body) > maxBodyBytes) {
    return jsonResponse({ error: "送られたものが大きすぎます。" }, 413);
  }
  let payload: Record<string, unknown> | null = null;
  try {
    payload = JSON.parse(body) as Record<string, unknown>;
  } catch {
    return jsonResponse({ error: "JSON として受け取れませんでした。" }, 400);
  }

  const packageId = String(payload?.packageId ?? "");
  const figureId = String(payload?.figureId ?? "");
  const svg = typeof payload?.svg === "string" ? payload.svg : "";
  const trio = payload?.trio ?? null;

  if (!FIGURE_ID.test(packageId) || !FIGURE_ID.test(figureId)) {
    return jsonResponse({ error: "packageId / figureId の形が不正です。" }, 400);
  }
  if (!svg.trim().startsWith("<svg") || !svg.includes("</svg>")) {
    return jsonResponse({ error: "SVG として受け取れませんでした。" }, 400);
  }
  if (utf8Length(svg) > maxSvgBytes) {
    return jsonResponse(
      { error: "SVG が大きすぎます（この口の上限は 512KB）。手元の管理 API から保存してください。" },
      413,
    );
  }
  const unsafe = unsafeSvgReason(svg);
  if (unsafe) return jsonResponse({ error: `SVG に置けないものが入っています: ${unsafe}` }, 400);

  const size = readSvgSize(svg);
  if (!size) return jsonResponse({ error: "SVG から寸法を読み取れませんでした。" }, 400);

  let trioRecord: string | null = null;
  if (trio !== null) {
    if (!isTrio(trio)) {
      return jsonResponse({ error: "trio の形が不正です（domain / substance / style が要ります）。" }, 400);
    }
    trioRecord = `${JSON.stringify(
      { schemaVersion: "lexus-past-exam-figure-trio.v1", packageId, figureId, trio },
      null,
      2,
    )}\n`;
    if (utf8Length(trioRecord) > maxTrioBytes) {
      return jsonResponse({ error: "控えが大きすぎます（この口の上限は 512KB）。" }, 413);
    }
  }

  const svgBody = svg.endsWith("\n") ? svg : `${svg}\n`;

  try {
    const result = await commitFigure(config, {
      packageId,
      figureId,
      svg: svgBody,
      trioRecord,
      width: size.width,
      height: size.height,
    });
    if ("error" in result) return jsonResponse({ error: result.error }, result.status);

    return jsonResponse({
      ok: true,
      commit: result.sha,
      url: result.url,
      branch: config.branch,
      file: svgPath(packageId, figureId),
      manifestUpdated: result.manifestUpdated,
      trioFile: trioRecord === null ? null : trioPath(packageId, figureId),
      width: size.width,
      height: size.height,
      repoRoot: `${config.repo}@${config.branch}`,
    });
  } catch (cause) {
    return failure(cause);
  }
};

// ---------------------------------------------------------------------------
// GitHub
// ---------------------------------------------------------------------------

/** 呼び出し側へそのまま出してよい、短い理由を持つ失敗。 */
class GitError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const readConfig = (env: Env): Config | { error: string } => {
  const token = env.FIGURE_GIT_TOKEN;
  const repo = env.FIGURE_GIT_REPO;
  if (!token) return { error: "FIGURE_GIT_TOKEN が設定されていません。" };
  if (!repo || !/^[\w.-]+\/[\w.-]+$/.test(repo)) {
    return { error: "FIGURE_GIT_REPO が設定されていません（owner/repo の形）。" };
  }
  const branch = env.FIGURE_GIT_BRANCH || "staging";
  // **main へは書かない。** 図版を直す口は作業中の枝のためのもので、公開中の
  // サイトを直接書き換える道具ではない。設定を間違えても届かないようにする。
  if (branch === "main" || branch === "master") {
    return { error: "この口から本番の枝へは書けません（FIGURE_GIT_BRANCH）。" };
  }
  return { token, repo, branch };
};

const github = async (config: Config, path: string, init: RequestInit = {}) =>
  fetch(`${githubApi}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      // GitHub は User-Agent が無いと 403 を返す。
      "User-Agent": "lexus-ec-figure-editor",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
  });

/**
 * GitHub の失敗を、原因が分かる短い文にする。
 *
 * **生の応答をそのまま返さない。** リポジトリ名や API の中身が漏れるうえ、
 * 「トークンの権限が足りない」も「枝の名前が違う」も同じ 404 で来るので、
 * そのまま出しても何を直せばよいか分からない。
 */
const gitFail = (response: Response, what: string): GitError => {
  if (response.status === 401) {
    return new GitError("GitHub のトークンが無効です（FIGURE_GIT_TOKEN を作り直してください）。", 502);
  }
  if (response.status === 403) {
    return new GitError("GitHub に断られました（トークンの権限か、回数の上限）。", 502);
  }
  if (response.status === 404) {
    return new GitError(
      `GitHub で ${what} が見つかりません（FIGURE_GIT_REPO / FIGURE_GIT_BRANCH と、トークンの権限を確かめてください）。`,
      502,
    );
  }
  return new GitError(`GitHub が ${response.status} を返しました（${what}）。`, 502);
};

const readTextFile = async (config: Config, path: string, ref: string): Promise<string | null> => {
  const response = await github(
    config,
    `/repos/${config.repo}/contents/${encodeURI(path)}?ref=${encodeURIComponent(ref)}`,
  );
  // 404 は「トークンが見えていない」でも起きるが、ここは登録済みの図しか
  // 触らないので、無いこと自体を呼び出し側の 404 として扱ってよい。
  if (response.status === 404) return null;
  if (!response.ok) throw gitFail(response, path);
  const body = (await response.json()) as { content?: string; encoding?: string; download_url?: string };
  if (body.content && body.encoding === "base64") return decodeUtf8Base64(body.content);
  // 1MB を超えるファイルは content が空で返る。download_url は署名付きなので
  // 認可ヘッダは付けない。
  if (body.download_url) {
    const raw = await fetch(body.download_url);
    if (!raw.ok) throw new GitError(`GitHub から ${path} を取れませんでした。`, 502);
    return await raw.text();
  }
  throw new GitError(`GitHub の応答から ${path} の中身を取れません。`, 502);
};

const readJsonFile = async <T>(config: Config, path: string, ref: string): Promise<T | null> => {
  const text = await readTextFile(config, path, ref);
  if (text === null) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new GitError(`${path} が JSON として読めません。`, 502);
  }
};

type FigureWrite = {
  packageId: string;
  figureId: string;
  svg: string;
  trioRecord: string | null;
  width: number;
  height: number;
};

/**
 * 図版を 1 コミットで入れる。
 *
 * **manifest は毎回、書き込む親コミットの時点のものを読む。** 先に読んで
 * おいたものを使い回すと、その間に入った別の図の変更を丸ごと巻き戻す
 * （manifest はファイルごと差し替えるため）。ref の更新が競合したら、
 * manifest の読み直しからやり直す。
 */
const commitFigure = async (
  config: Config,
  write: FigureWrite,
): Promise<{ sha: string; url: string; manifestUpdated: boolean } | { error: string; status: number }> => {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const refResponse = await github(
      config,
      `/repos/${config.repo}/git/ref/heads/${encodeURIComponent(config.branch)}`,
    );
    if (!refResponse.ok) throw gitFail(refResponse, `枝 ${config.branch}`);
    const ref = (await refResponse.json()) as { object: { sha: string } };
    const parent = ref.object.sha;

    const manifest = await readJsonFile<Manifest>(config, manifestPath(write.packageId), parent);
    if (!manifest) return { error: `manifest が見つかりません: ${write.packageId}`, status: 404 };
    const item = manifest.items?.find((entry) => entry.id === write.figureId);
    if (!item) return { error: `manifest に登録されていない図です: ${write.figureId}`, status: 404 };
    const expected = `/assets/past-exams/${write.packageId}/figures/${write.figureId}.svg`;
    if (item.src !== expected) return { error: `manifest の src が想定と違います: ${item.src}`, status: 409 };

    const manifestUpdated = item.width !== write.width || item.height !== write.height;
    const files: { path: string; content: string }[] = [
      { path: svgPath(write.packageId, write.figureId), content: write.svg },
    ];
    if (manifestUpdated) {
      item.width = write.width;
      item.height = write.height;
      files.push({ path: manifestPath(write.packageId), content: `${JSON.stringify(manifest, null, 2)}\n` });
    }
    if (write.trioRecord !== null) {
      files.push({ path: trioPath(write.packageId, write.figureId), content: write.trioRecord });
    }

    const tree = await Promise.all(
      files.map(async (file) => {
        const response = await github(config, `/repos/${config.repo}/git/blobs`, {
          method: "POST",
          body: JSON.stringify({ content: encodeUtf8Base64(file.content), encoding: "base64" }),
        });
        if (!response.ok) throw gitFail(response, "ファイルの書き込み");
        const body = (await response.json()) as { sha: string };
        return { path: file.path, mode: "100644", type: "blob", sha: body.sha };
      }),
    );

    const parentResponse = await github(config, `/repos/${config.repo}/git/commits/${parent}`);
    if (!parentResponse.ok) throw gitFail(parentResponse, "親コミット");
    const parentCommit = (await parentResponse.json()) as { tree: { sha: string } };

    const treeResponse = await github(config, `/repos/${config.repo}/git/trees`, {
      method: "POST",
      body: JSON.stringify({ base_tree: parentCommit.tree.sha, tree }),
    });
    if (!treeResponse.ok) throw gitFail(treeResponse, "ツリーの作成");
    const treeBody = (await treeResponse.json()) as { sha: string };

    const message = `fix(past-exam): 図版を直す（${write.packageId} / ${write.figureId}）\n\n図形エディタからの書き戻し。`;
    const commitResponse = await github(config, `/repos/${config.repo}/git/commits`, {
      method: "POST",
      body: JSON.stringify({ message, tree: treeBody.sha, parents: [parent] }),
    });
    if (!commitResponse.ok) throw gitFail(commitResponse, "コミットの作成");
    const commit = (await commitResponse.json()) as { sha: string; html_url: string };

    const update = await github(
      config,
      `/repos/${config.repo}/git/refs/heads/${encodeURIComponent(config.branch)}`,
      { method: "PATCH", body: JSON.stringify({ sha: commit.sha, force: false }) },
    );
    if (update.ok) return { sha: commit.sha, url: commit.html_url, manifestUpdated };
    // 間に別のコミットが入った。manifest の読み直しからやり直す。
    if (update.status === 422 || update.status === 409) continue;
    throw gitFail(update, "枝の更新");
  }

  return {
    error: "枝が動き続けていて書き込めませんでした。少し待ってやり直してください。",
    status: 409,
  };
};

// ---------------------------------------------------------------------------
// 細かいもの
// ---------------------------------------------------------------------------

const svgPath = (packageId: string, figureId: string) =>
  `frontend/public/assets/past-exams/${packageId}/figures/${figureId}.svg`;

const manifestPath = (packageId: string) => `frontend/src/data/pastExamFigures/${packageId}.json`;

const trioPath = (packageId: string, figureId: string) =>
  `frontend/src/data/pastExamFigures/${packageId}/${figureId}.trio.json`;

const utf8Length = (value: string) => new TextEncoder().encode(value).length;

/**
 * UTF-8 の文字列を base64 にする。
 *
 * **btoa に直接渡してはいけない。** btoa は Latin-1 しか受けないので、
 * 日本語を含む SVG で例外になる。バイト列にしてから 1 バイトずつ詰める。
 * 一度に渡すと引数の数が多すぎて落ちるので、区切って回す。
 */
const encodeUtf8Base64 = (value: string) => {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  const step = 0x8000;
  for (let index = 0; index < bytes.length; index += step) {
    binary += String.fromCharCode(...bytes.subarray(index, index + step));
  }
  return btoa(binary);
};

const decodeUtf8Base64 = (value: string) => {
  const binary = atob(value.replace(/\s+/g, ""));
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return new TextDecoder().decode(bytes);
};

const isTrio = (value: unknown): boolean =>
  Boolean(
    value &&
      typeof value === "object" &&
      typeof (value as Record<string, unknown>).domain === "string" &&
      typeof (value as Record<string, unknown>).substance === "string" &&
      typeof (value as Record<string, unknown>).style === "string",
  );

const failure = (cause: unknown) => {
  if (cause instanceof GitError) return jsonResponse({ error: cause.message }, cause.status);
  // 何が起きたか分からないものを、そのまま外へ出さない。
  return jsonResponse({ error: "書き戻しに失敗しました。" }, 502);
};

/**
 * 合言葉だけで判定する。
 *
 * 未設定なら誰も書けない（503）。**ローカルだから通す、はしない。**
 * ここでいう「ローカル」はリクエストの URL のホスト名でしかなく、
 * Host ヘッダを名乗るだけで作れてしまう。
 */
const assertAdminAccess = (request: Request, env: Env) => {
  const token = env.ADMIN_API_TOKEN;
  if (!token) {
    return jsonResponse({ error: "ADMIN_API_TOKEN が設定されていないので、この口は使えません。" }, 503);
  }
  const authorization = request.headers.get("Authorization") || "";
  if (authorization === `Bearer ${token}`) return null;
  return jsonResponse({ error: "Admin API is not authorized" }, 401);
};

const jsonResponse = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: jsonHeaders,
  });
