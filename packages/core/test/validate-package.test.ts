import { validatePackage } from "@substreams/core";
import { createSubstreamFixture } from "@substreams/core/testutils";
import { expect, test } from "vitest";

const substream = createSubstreamFixture("uniswap-v3");

test("validatePackage doesn't throw on valid package", async () => {
  expect(() => validatePackage(substream)).not.toThrow();
});
