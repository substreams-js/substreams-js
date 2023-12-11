import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "out",
  clean: true,
  publicDir: true,
  noExternal: [/(@substreams\/|@effect\/cli|effect\/|effect|@connectrpc\/|@bufbuild\/)/],
});
