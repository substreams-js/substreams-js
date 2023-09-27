import { createSubstreamFixture } from "@substreams/testutils";
import { assert, expect, test } from "vitest";
import { validateModules } from "./validate-modules.js";

const { modules } = createSubstreamFixture("uniswap-v3");

test("validateModules doesn't throw on valid modules", async () => {
  assert(modules);
  expect(() => validateModules(modules)).not.toThrow();
});
