import { expect, test } from "vitest";
import { readSystemProtos } from "./read-system-protos.js";

test("can read system protobufs", () => {
  expect(() => readSystemProtos()).not.toThrow();
});

test("system protobufs are valid", () => {
  const protobufs = readSystemProtos();
  const messages = protobufs.file.map((proto) => proto.name);

  expect(messages).toMatchInlineSnapshot(`
    [
      "sf/substreams/v1/modules.proto",
      "google/protobuf/descriptor.proto",
      "google/protobuf/any.proto",
      "sf/substreams/v1/package.proto",
      "google/protobuf/timestamp.proto",
      "sf/substreams/v1/clock.proto",
      "sf/substreams/rpc/v2/service.proto",
    ]
  `);
});
