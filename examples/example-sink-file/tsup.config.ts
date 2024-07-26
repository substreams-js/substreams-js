import { defineConfig } from "tsup";

// biome-ignore lint/style/noDefaultExport: <explanation>
export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "out",
  clean: true,
  publicDir: true,
  noExternal: [/(@substreams\/|@effect\/cli|effect\/|effect|@connectrpc\/|@bufbuild\/)/],
});
