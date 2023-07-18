import aliases from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [aliases()],
  test: {
    testTimeout: 30000,
    coverage: {
      reporter: process.env.CI ? ["lcov"] : ["text", "json", "html"],
      exclude: ["**/dist/**", "**/tests/**", "**/*.test.ts"],
    },
  },
});
