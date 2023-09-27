import { STANDARD_TEST_MODULES, createSubstreamFixture } from "@substreams/testutils";
import { assert, expect, test } from "vitest";
import { createModuleGraph } from "./create-module-graph.js";

const uniswap = createSubstreamFixture("uniswap-v3");

test("should create a module graph", () => {
  const graph = createModuleGraph(STANDARD_TEST_MODULES);
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

test("should find ancestors of a module in a graph", () => {
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

test("should find children of a module in a graph", () => {
  assert(uniswap.modules);

  const graph = createModuleGraph(uniswap.modules.modules);
  const children = graph.childrenOf("map_pools_created");
  const names = Array.from(children).map((node) => node.name);
  expect(names).toMatchInlineSnapshot(`
    [
      "store_pools_created",
      "store_tokens",
      "store_pool_count",
      "map_tokens_whitelist_pools",
      "graph_out",
    ]
  `);
});

test("should sort modules by graph topology", () => {
  assert(uniswap.modules);

  const graph = createModuleGraph(uniswap.modules.modules);
  const children = graph.sortedByGraphTopology();
  const names = Array.from(children).map((node) => node.name);
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
      "store_native_amounts",
      "store_eth_prices",
      "store_swaps_volume",
      "store_token_tvl",
      "store_derived_tvl",
      "store_derived_factory_tvl",
      "store_ticks_liquidities",
      "store_positions",
      "store_min_windows",
      "store_max_windows",
      "graph_out",
    ]
  `);
});
