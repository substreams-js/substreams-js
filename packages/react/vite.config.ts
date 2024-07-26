import { defineConfig, mergeConfig } from "vitest/config";
import sharedConfig from "../../vitest.shared";

// biome-ignore lint/style/noDefaultExport: <explanation>
export default mergeConfig(sharedConfig, defineConfig({}));
