import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://lexus-ec.com",
  output: "static",
  devToolbar: {
    enabled: false,
  },
  vite: {
    cacheDir: process.env.LEXUS_VITE_CACHE_DIR || "../.vite-cache/frontend",
  },
});
