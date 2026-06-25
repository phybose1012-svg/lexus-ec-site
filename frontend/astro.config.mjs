import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://lexus-ec.com",
  output: "static",
  devToolbar: {
    enabled: false,
  },
  vite: {
    cacheDir: "../.vite-cache/frontend",
  },
});
