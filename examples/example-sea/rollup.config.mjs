import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

/** @type {import('rollup').RollupOptions} */
// biome-ignore lint/style/noDefaultExport: <explanation>
export default {
  input: "src/index.ts",
  output: {
    file: "out/bundle.js",
    format: "cjs",
  },
  plugins: [resolve({ extensions: [".ts"] }), typescript()],
};
