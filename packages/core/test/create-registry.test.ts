import { FileDescriptorProto } from "@bufbuild/protobuf";
import { expect, test } from "vitest";
import { topoSort } from "../src/utils/create-registry.js";

const mockProtoFile1 = new FileDescriptorProto({
  name: "file1.proto",
  dependency: [],
});

const mockProtoFile2 = new FileDescriptorProto({
  name: "file2.proto",
  dependency: ["file1.proto"],
});

const mockProtoFile3 = new FileDescriptorProto({
  name: "file3.proto",
  dependency: ["file2.proto", "file1.proto"],
});

test("topoSort orders files by dependencies", () => {
  const files = [mockProtoFile3, mockProtoFile1, mockProtoFile2];
  const sorted = topoSort(files);

  expect(sorted[0]).toBe(mockProtoFile1);
  expect(sorted[1]).toBe(mockProtoFile2);
  expect(sorted[2]).toBe(mockProtoFile3);
});
