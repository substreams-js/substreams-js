import { createModuleHash } from "./createModuleHash.js";
import { fetchSubstream } from "./fetchSubstream.js";
import { getModuleOrThrow } from "./getModule.js";
import { assert, expect, test } from "vitest";

const substream = await fetchSubstream(
  "https://github.com/pinax-network/subtivity-substreams/releases/download/v0.2.1/subtivity-ethereum-v0.2.1.spkg",
);

test.each([
  {
    name: "map_block_stats",
    expected: "aa5dd16dc1185ca3628dd16ff2ebcad68f08688f",
  },
  // TODO: Make it work with ancestor modules.
  // {
  //   name: "prom_out",
  //   expected: "0003de38e0c5b97cb4fd6f45a5aa784a23275916",
  // },
])("createModuleHash($input) === $expected", async ({ name, expected }) => {
  assert(substream.modules !== undefined);

  const modules = substream.modules;
  const module = getModuleOrThrow(modules, name);
  const hash = await createModuleHash(modules, module);
  expect(hash).toMatch(expected);
});
