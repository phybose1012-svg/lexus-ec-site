import {BACKEND_ORIGIN} from "../../proofreading-target.js";

const ORIGIN = "https://lexus-ec.pages.dev";
const PREFIX = "/kosei";

function unavailable(status, message) {
  return new Response(message, {status, headers: {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer"
  }});
}

export function proxyTo(backendOrigin, fetchBackend = fetch) {
  return async function ({request}) {
  const url = new URL(request.url);
  if (url.origin !== ORIGIN) return unavailable(404, "Not found");
  if (url.pathname !== PREFIX && !url.pathname.startsWith(PREFIX + "/")) {
    return unavailable(404, "Not found");
  }
  if (!/^https:\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)*\.run\.app$/.test(backendOrigin)) {
    return unavailable(503, "校正室の接続を準備中です。");
  }
  try {
    // Forward only the headers used by the app. Other website sessions and bearer tokens stay here.
    const headers = new Headers();
    for (const name of ["accept", "accept-language", "content-type", "origin", "x-review-token",
                        "range", "if-range", "if-none-match", "if-modified-since"]) {
      if (request.headers.has(name)) headers.set(name, request.headers.get(name));
    }
    const cookies = (request.headers.get("cookie") || "").split(";").map(value => value.trim());
    const session = cookies.filter(value => value.startsWith("proofreading_session="));
    if (session.length === 1) headers.set("cookie", session[0]);
    const target = new URL(backendOrigin);
    target.pathname = url.pathname;
    target.search = url.search;
    const options = {method: request.method, headers, redirect: "manual"};
    if (!["GET", "HEAD"].includes(request.method)) {
      options.body = request.body;
      options.duplex = "half";
    }
    const upstream = await fetchBackend(new Request(target, options));
    const response = new Response(upstream.body, upstream);
    // Never cache private sources, redirects, errors, or session cookies on Pages.
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  } catch {
    return unavailable(502, "校正室に接続できません。しばらくしてからお試しください。");
  }
  };
}

export const onRequest = proxyTo(BACKEND_ORIGIN);
