import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname as pathDirname, resolve as pathResolve } from "node:path";

export const nodeRequire = createRequire(import.meta.url);
async function resolve(path: string) {
  return nodeRequire.resolve(path);
}

export const locateBufBinary = memoize(async function locateBufBinary() {
  try {
    // Check if buf is installed as a dependency.
    const buf = await resolve("@bufbuild/buf/package.json");
    const json = JSON.parse(readFileSync(buf, "utf-8"));
    return pathResolve(pathDirname(buf), json.bin.buf);
  } catch {}

  try {
    // Check if buf is available on the path.
    execSync("buf --version");
    return "buf";
  } catch {}

  return undefined;
});

function memoize<TResult>(fn: () => TResult) {
  const unused = Symbol("UNUSED");
  let memoized: TResult | typeof unused = unused;

  return (): TResult => {
    if (memoized === unused) {
      memoized = fn();
    }

    return memoized;
  };
}
