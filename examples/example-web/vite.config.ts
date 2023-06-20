import { defineConfig } from "vite";
import aliases from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [aliases()],
  envPrefix: "SUBSTREAMS_",
  server: {
    proxy: {
      "/proxy": {
        // We are proxying requests to github to circumvent CORS.
        target: "https://github.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy/, ""),
        followRedirects: true,
      },
    },
  },
});
