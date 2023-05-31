import { validateModules } from "./validateModules.js";
import { createSubstreamFixture } from "@substreams/testutils";
import { assert, expect, test } from "vitest";

const { modules } = createSubstreamFixture("uniswap-v3");

test("validateModules doesn't throw on valid modules", async () => {
  assert(modules);
  expect(() => validateModules(modules)).not.toThrow();
});
