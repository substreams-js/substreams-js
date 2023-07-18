import { validatePackage } from "./validate-package.js";
import { createSubstreamFixture } from "@substreams/testutils";
import { expect, test } from "vitest";

const substream = createSubstreamFixture("uniswap-v3");

test("validatePackage doesn't throw on valid package", async () => {
  expect(() => validatePackage(substream)).not.toThrow();
});
