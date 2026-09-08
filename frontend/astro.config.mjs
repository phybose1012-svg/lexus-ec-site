import fs from "node:fs";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

/**
 * 図版エディタ（FIBONA）は vendor/figure-editor/ に置いた配布物から読む。
 * これはビルド成果物なので履歴に入れていない（frontend/.gitignore）。
 *
 * **置いていない環境ではページごと作らない。** 依存が解決できないまま
 * ビルドへ進むと `Cannot find module '@phybose1012-svg/figure-editor'` で
 * サイト全体が落ちる（クリーンな clone で実測）。Cloudflare Pages は
 * git の中身しか持たないので、そこでは必ずこの状態になる。
 * 置き場は npm run figure-editor:sync で用意する。
 */
const hasFigureEditor = fs.existsSync(
  new URL("./vendor/figure-editor/package.json", import.meta.url)
);

const figureEditorRoute = () => ({
  name: "lexus:figure-editor-route",
  hooks: {
    "astro:config:setup": ({ injectRoute }) => {
      injectRoute({
        pattern: "/admin/figures/edit",
        entrypoint: "./src/local-tools/figure-editor/edit.astro",
      });
    },
  },
});

export default defineConfig({
  site: "https://lexus-ec.com",
  output: "static",
  integrations: [react(), ...(hasFigureEditor ? [figureEditorRoute()] : [])],
  devToolbar: {
    enabled: false,
  },
  vite: {
    cacheDir: "../.vite-cache/frontend",
  },
});
