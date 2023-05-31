import { readLocalProtos } from "./readLocalProtos.js";
import { createDescriptorSet } from "@bufbuild/protobuf";
import { resolve as pathResolve } from "node:path";
import { expect, test } from "vitest";

test("can read local protobufs", async () => {
  const file = pathResolve(__dirname, "__fixtures__/test.proto");
  await expect(readLocalProtos(file)).resolves.not.toThrow();
});

test("can build file descriptor sets from local protobufs", async () => {
  const file = pathResolve(__dirname, "__fixtures__/test.proto");
  const descriptor = createDescriptorSet(await readLocalProtos(file));
  expect(descriptor.messages.get("test.Test")).not.toBeUndefined();
});
