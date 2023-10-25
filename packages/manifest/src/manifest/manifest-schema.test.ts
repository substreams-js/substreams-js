import * as fs from "node:fs";
import * as path from "node:path";
import * as url from "node:url";
import * as Schema from "@effect/schema/Schema";
import { Option } from "effect";
import { expect, test } from "vitest";
import { parse as parseYaml } from "yaml";
import { InitialBlockSchema, parseManifestJson } from "./manifest-schema.js";

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

test("allows different initial block formats", () => {
  const parse = Schema.parseOption(InitialBlockSchema);
  expect(parse("123")).toMatchObject(Option.some(123n));
  expect(parse(461246n)).toMatchObject(Option.some(461246n));
  expect(parse(0)).toMatchObject(Option.some(0n));
});

test("does not allow negative initial block values", () => {
  const parse = Schema.parseOption(InitialBlockSchema);
  expect(parse("-12345")).toMatchObject(Option.none());
  expect(parse(-12345n)).toMatchObject(Option.none());
  expect(parse(-12345)).toMatchObject(Option.none());
});
