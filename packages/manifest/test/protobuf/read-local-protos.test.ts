import { createDescriptorSet } from "@bufbuild/protobuf";
import { readLocalProtos } from "@substreams/manifest";
import { expect, test } from "vitest";

test("can read local protobufs", async () => {
  await expect(readLocalProtos(__dirname, "./__fixtures__/test.proto")).resolves.not.toThrow();
});

test("can build file descriptor sets from local protobufs", async () => {
  const descriptor = createDescriptorSet(await readLocalProtos(__dirname, "./__fixtures__/test.proto"));
  expect(descriptor.messages.get("test.Test")).not.toBeUndefined();
});
