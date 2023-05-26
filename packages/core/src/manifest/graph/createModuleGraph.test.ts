import { createSubstreamFixture } from "../../../tests/createSubstreamFixture.js";
import { TEST_MODULES } from "../../../tests/fixtures/modules.js";
import { createModuleGraph } from "./createModuleGraph.js";
import { assert, expect, test } from "vitest";

const uniswap = createSubstreamFixture("uniswap-v3");

test("should create a module graph", () => {
  const graph = createModuleGraph(TEST_MODULES);
  const ancestors = graph.ancestorsOf("G");
  const names = Array.from(ancestors).map((node) => node.name);
  expect(names).toMatchInlineSnapshot(`
    [
      "As",
      "Am",
      "B",
      "C",
      "D",
      "E",
    ]
  `);
});

test("should create a module graph for uniswap v3", () => {
  assert(uniswap.modules);

  const graph = createModuleGraph(uniswap.modules.modules);
  const ancestors = graph.ancestorsOf("graph_out");
  const names = Array.from(ancestors).map((node) => node.name);
  expect(names).toMatchInlineSnapshot(`
    [
      "map_pools_created",
      "store_pools_created",
      "store_tokens",
      "store_pool_count",
      "map_tokens_whitelist_pools",
      "store_tokens_whitelist_pools",
      "map_extract_data_types",
      "store_pool_sqrt_price",
      "store_prices",
      "store_pool_liquidities",
      "store_total_tx_counts",
      "store_swaps_volume",
      "store_native_amounts",
      "store_eth_prices",
      "store_token_tvl",
      "store_derived_tvl",
      "store_derived_factory_tvl",
      "store_ticks_liquidities",
      "store_positions",
      "store_min_windows",
      "store_max_windows",
    ]
  `);
});
