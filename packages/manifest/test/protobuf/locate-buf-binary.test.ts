import { afterEach, expect, test, vitest } from "vitest";

afterEach(() => {
  vitest.restoreAllMocks();
  vitest.resetModules();
});

test("can locate the buf binary", async () => {
  const { locateBufBinary } = await import("@substreams/manifest/protobuf/locate-buf-binary");
  await expect(locateBufBinary()).resolves.toContain("@bufbuild/buf/bin/buf");
});

test("memoizes the buf binary lookup", async () => {
  const { locateBufBinary, nodeRequire } = await import("@substreams/manifest/protobuf/locate-buf-binary");
  const spy = vitest.spyOn(nodeRequire, "resolve");
  await expect(locateBufBinary()).resolves.toContain("@bufbuild/buf/bin/buf");
  await expect(locateBufBinary()).resolves.toContain("@bufbuild/buf/bin/buf");
  await expect(locateBufBinary()).resolves.toContain("@bufbuild/buf/bin/buf");
  expect(spy).toHaveBeenCalledTimes(1);
});
