// Withdrawal requests must bypass static asset caches, including legacy URLs.
const retiredPaths = new Set([
  "/voice-069",
  "/voice-069/",
  "/voice-069/index.html",
  "/assets/legacy/wp-content/uploads/2024/09/tanaka.jpg",
  "/wp-content/uploads/2024/09/tanaka.jpg",
]);

type RequestContext = {
  request: Request;
  next: () => Promise<Response>;
};

export const onRequest = (context: RequestContext) => {
  const path = new URL(context.request.url).pathname;
  if (!retiredPaths.has(path)) return context.next();

  return new Response(context.request.method === "HEAD" ? null : "このページは削除されました。", {
    status: 410,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      "X-Robots-Tag": "noindex, noarchive",
    },
  });
};
