import { createDescriptorSet } from "@bufbuild/protobuf";
import { expect, test } from "vitest";
import { readLocalProtos } from "./read-local-protos.js";

test("can read local protobufs", async () => {
  await expect(readLocalProtos(__dirname, "./__fixtures__/test.proto")).resolves.not.toThrow();
});

test("can build file descriptor sets from local protobufs", async () => {
  const descriptor = createDescriptorSet(await readLocalProtos(__dirname, "./__fixtures__/test.proto"));
  expect(descriptor.messages.get("test.Test")).not.toBeUndefined();
});
