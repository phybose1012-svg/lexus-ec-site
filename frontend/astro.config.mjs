import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://lexus-ec.com",
  output: "static",
  // 図版エディタ（FIBONA）を React のアイランドとして載せるため。
  // 使うのは管理ページ 1 枚だけで、公開ページには読み込まれない。
  integrations: [react()],
  devToolbar: {
    enabled: false,
  },
  vite: {
    cacheDir: "../.vite-cache/frontend",
  },
});
