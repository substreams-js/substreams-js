import { nodeResolve } from "@rollup/plugin-node-resolve";

/** @type {import('rollup').RollupOptions} */
export default {
  input: "src/index.ts",
  output: {
    file: "out/bundle.js",
    format: "cjs",
  },
  plugins: [nodeResolve({ extensions: [".ts"] })],
};
