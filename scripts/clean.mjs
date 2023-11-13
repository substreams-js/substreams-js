import * as Fs from "node:fs";
import * as Glob from "glob";

Glob.sync(["packages/*/", "examples/*/"]).forEach((pkg) => {
  const files = [".tsbuildinfo", "tsconfig.tsbuildinfo", "build", "dist", "coverage"];

  files.forEach((file) => {
    Fs.rmSync(`${pkg}/${file}`, { recursive: true, force: true }, () => {});
  });
});
