import { afterEach, expect, test, vitest } from "vitest";

afterEach(() => {
  vitest.restoreAllMocks();
  vitest.resetModules();
});

test("can locate the buf binary", async () => {
  const { locateBufBinary } = await import("./locate-buf-binary.js");
  await expect(locateBufBinary()).resolves.toContain("@bufbuild/buf/bin/buf");
});

test("memoizes the buf binary lookup", async () => {
  const { locateBufBinary, nodeRequire } = await import("./locate-buf-binary.js");
  const spy = vitest.spyOn(nodeRequire, "resolve");
  await expect(locateBufBinary()).resolves.toContain("@bufbuild/buf/bin/buf");
  await expect(locateBufBinary()).resolves.toContain("@bufbuild/buf/bin/buf");
  await expect(locateBufBinary()).resolves.toContain("@bufbuild/buf/bin/buf");
  expect(spy).toHaveBeenCalledTimes(1);
});
