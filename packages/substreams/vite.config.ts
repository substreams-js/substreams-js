import { defineConfig } from "vitest/config";

export default defineConfig({
  envDir: "../../",
  test: {
    testTimeout: 30000,
  },
});
