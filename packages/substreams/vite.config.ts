import { defineConfig } from "vitest/config";

export default defineConfig({
  envDir: "../../",
  test: {
    testTimeout: 30000,
    // TODO: Cheeky... Let's remove this asap, heh.
    passWithNoTests: true,
  },
});
