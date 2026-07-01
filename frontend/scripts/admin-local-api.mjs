import { createServer } from "node:http";
import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(frontendRoot, "..");
const overridesModulePath = path.join(frontendRoot, "functions", "generated", "content-overrides.ts");
const targetBranch = process.env.ADMIN_GIT_TARGET_BRANCH || "staging";
const basePort = Number(process.env.ADMIN_LOCAL_API_PORT || 4335);
const maxBodyBytes = 1024 * 1024;

const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex",
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host || "127.0.0.1"}`);
    const corsHeaders = corsFor(request);

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
