import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/substreams/": {
        target: "http://localhost:8080",
        rewrite: (path) => path.slice(12),
      },
    },
  },
});
