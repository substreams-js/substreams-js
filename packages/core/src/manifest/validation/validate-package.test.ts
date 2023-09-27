import { createSubstreamFixture } from "@substreams/testutils";
import { expect, test } from "vitest";
import { validatePackage } from "./validate-package.js";

const substream = createSubstreamFixture("uniswap-v3");

test("validatePackage doesn't throw on valid package", async () => {
  expect(() => validatePackage(substream)).not.toThrow();
});
