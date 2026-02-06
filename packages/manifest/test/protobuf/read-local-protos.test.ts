import { createFileRegistry } from "@bufbuild/protobuf";
import { readLocalProtos } from "@substreams/manifest";
import { expect, test } from "vitest";

test("can read local protobufs", async () => {
  await expect(readLocalProtos(__dirname, "./__fixtures__/test.proto")).resolves.not.toThrow();
});

test("can build file registry from local protobufs", async () => {
  const registry = createFileRegistry(await readLocalProtos(__dirname, "./__fixtures__/test.proto"));
  expect(registry.getMessage("test.Test")).not.toBeUndefined();
});
