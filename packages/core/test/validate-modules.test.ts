import { validateModules } from "@substreams/core";
import { createSubstreamFixture } from "@substreams/core/testutils";
import { assert, expect, test } from "vitest";

const { modules } = createSubstreamFixture("uniswap-v3");

test("validateModules doesn't throw on valid modules", async () => {
  assert(modules);
  expect(() => validateModules(modules)).not.toThrow();
});
