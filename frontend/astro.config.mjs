import fs from "node:fs";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

/**
 * 図版エディタ（FIBONA）を載せるかどうか。門は 2 つある。
 *
 * **(1) 配布物があるか。** vendor/figure-editor/ はビルド成果物なので履歴に
 * 入れていない（frontend/.gitignore）。無いままビルドへ進むと
 * `Cannot find module '@phybose1012-svg/figure-editor'` でサイト全体が落ちる
 * （クリーンな clone で実測）。Cloudflare Pages は git の中身しか持たないので、
 * そこでは必ずこの状態になる。置き場は npm run figure-editor:sync で用意する。
 *
 * **(2) 本番ブランチでないか。** ページ側の CF_PAGES_BRANCH の見張りだけでは
 * 足りない。あれは HTML をリダイレクトに変えるだけで、client:only の島は資産
 * として dist に残る（配布物のある機械で main をビルドすると、どこからも
 * 参照されない 7.3MB が出た＝実測）。経路ごと作らなければ、束ねられない。
 *
 * react() も同じ条件で括る。これを外に出すと、島が無くても React ランタイム
 * 194,807 byte がどこからも参照されないまま dist に出る（実測）。
 */
const isProductionBranch = (process.env.CF_PAGES_BRANCH || "") === "main";
const hasFigureEditor = fs.existsSync(
  new URL("./vendor/figure-editor/package.json", import.meta.url)
);
const withFigureEditor = hasFigureEditor && !isProductionBranch;

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
  integrations: withFigureEditor ? [react(), figureEditorRoute()] : [],
  devToolbar: {
    enabled: false,
  },
  vite: {
    cacheDir: "../.vite-cache/frontend",
    define: {
      // 「直す」ボタンを出すかの判定を、ここ 1 箇所から配る。
      //
      // コンポーネント側で fs を見ようとすると、ビルド時の import.meta.url が
      // ソースの場所を指さず、判定が黙って false になる（実測：staging の
      // ビルドでボタンが 0 件になった）。行き先の経路を作るかどうかと同じ値を
      // 使わなければ、押した先が 404 になる組み合わせが生まれる。
      "import.meta.env.LEXUS_FIGURE_EDITOR": JSON.stringify(withFigureEditor),
    },
  },
});
