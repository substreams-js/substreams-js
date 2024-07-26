import * as path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["./test/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@substreams/core": path.join(__dirname, "packages/core/src"),
      "@substreams/manifest": path.join(__dirname, "packages/manifest/src"),
      "@substreams/sink": path.join(__dirname, "packages/sink/src"),
      "@substreams/mermaid": path.join(__dirname, "packages/mermaid/src"),
      "@substreams/react": path.join(__dirname, "packages/react/src"),
    },
  },
});
