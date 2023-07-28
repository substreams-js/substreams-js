import { parseManifestJson } from "./manifest-schema.js";
import * as fs from "node:fs";
import * as path from "node:path";
import * as url from "node:url";
import { expect, test } from "vitest";
import { parse as parseYaml } from "yaml";

function readManifest(name: string): unknown {
  const file = url.fileURLToPath(new URL(`./__fixtures__/${name}.yaml`, import.meta.url));
  const contents = fs.readFileSync(file, "utf-8");
  return Object.assign(parseYaml(contents), {
    workDir: path.dirname(file),
  });
}

test("can validate the uniswap v3 manifest", () => {
  const manifest = readManifest("uniswap-v3");
  expect(parseManifestJson(manifest)).toMatchSnapshot();
});

test("can validate the ethereum block metadata manifest", () => {
  const manifest = readManifest("eth-block-metadata");
  expect(parseManifestJson(manifest)).toMatchSnapshot();
});
