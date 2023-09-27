import { createSubstreamFixture } from "@substreams/testutils";
import { assert, expect, test } from "vitest";
import { getModuleOrThrow } from "../../utils/get-module.js";
import { toHex } from "../../utils/to-hex.js";
import { createModuleHash } from "./create-module-hash.js";

const substream = createSubstreamFixture("uniswap-v3");

test.each([
  {
    name: "map_pools_created",
    expected: "e63ed7d37c7b6c7f8abfb514ed5abe3e8a9b3798",
  },
  {
    name: "store_pools_created",
    expected: "e45bdf960ee9e42e5ae2ed7806e9900b955fea4e",
  },
  {
    name: "store_tokens",
    expected: "b0a8392c63b7f7ed549b328e6979045e23fd5ac0",
  },
  {
    name: "store_pool_count",
    expected: "06877689651a0642766edff09767d3d2aa3bee9d",
  },
  {
    name: "map_tokens_whitelist_pools",
    expected: "8cb9d63eda38fb2356b3bb4102a5be26feb004a3",
  },
  {
    name: "store_tokens_whitelist_pools",
    expected: "89448438167e9f7230725624000e9458c5e921fb",
  },
  {
    name: "map_extract_data_types",
    expected: "51cc36e75d0264c887413f9391fb249be7f71804",
  },
  {
    name: "store_pool_sqrt_price",
    expected: "7139f8205f5f132c14cc76ea1a5962b1b1eeb567",
  },
  {
    name: "store_prices",
    expected: "2d526e554e9666465a216dac6b349247062c0da8",
  },
  {
    name: "store_pool_liquidities",
    expected: "f49ef329521ab3619b7dd193d6c8664358a2431f",
  },
  {
    name: "store_total_tx_counts",
    expected: "dec9f7546a39e203a4fd1df40db7c6dfff97854d",
  },
  {
    name: "store_swaps_volume",
    expected: "926dc115c9e955d27cf2304f4c30bf98659267a4",
  },
  {
    name: "store_native_amounts",
    expected: "c1aee8561d1a3052d95cc91e9906ba29ffb17cce",
  },
  {
    name: "store_eth_prices",
    expected: "e0983dfece37ebc21f11af4dfe848c918a283e01",
  },
  {
    name: "store_token_tvl",
    expected: "ca7ed2258f21a5a34b92a9a5a6e12191b7955f54",
  },
  {
    name: "store_derived_tvl",
    expected: "35fd43aee441e226e39b908a471181c55b7fc6bc",
  },
  {
    name: "store_derived_factory_tvl",
    expected: "a4e3d1946bf994ef4e4a61fadc6cde1a1b9251a4",
  },
  {
    name: "store_ticks_liquidities",
    expected: "4258621266007bb98e860ff6794d2e7ff79c1dd3",
  },
  {
    name: "store_positions",
    expected: "30484b2341b50d5e7f0c94b4b8928f74f21f7de5",
  },
  {
    name: "store_min_windows",
    expected: "e90da0cbfbfb7348f16bc5d8f19ad549a3f2a744",
  },
  {
    name: "store_max_windows",
    expected: "ffa90b084c81f0a1a0e77df9659c0a148a7b12d4",
  },
  {
    name: "graph_out",
    expected: "e15e370119c7454f24437c6c15d13f27103aa8e0",
  },
])("createModuleHash(modules, $name) === $expected", async ({ name, expected }) => {
  assert(substream.modules);

  const module = getModuleOrThrow(substream.modules.modules, name);
  const hash = await createModuleHash(substream.modules, module);
  expect(toHex(hash)).toMatch(expected);
});
