import {
  type IMessageTypeRegistry,
  createDescriptorSet,
  createRegistryFromDescriptors,
} from "@bufbuild/protobuf";
import { expect, test } from "vitest";

import { FileDescriptorProto } from "@bufbuild/protobuf";
import type { Package } from "../proto.js";

export function createRegistry(substream: Package): IMessageTypeRegistry {
  substream.protoFiles = topoSort(substream.protoFiles);
  return createRegistryFromDescriptors(
    createDescriptorSet(substream.protoFiles),
    true
  );
}

// createDescriptorSet expects the files to be topologically sorted
function topoSort(protoFiles: FileDescriptorProto[]): FileDescriptorProto[] {
  const graph = new Map<string, Set<string>>();
  const deps = new Map<string, Set<string>>();

  // Build dependency graph
  for (const file of protoFiles) {
    if (!file.name) continue;
    graph.set(file.name, new Set(file.dependency));
    for (const dep of file.dependency) {
      if (!deps.has(dep)) {
        deps.set(dep, new Set());
      }
      deps.get(dep)!.add(file.name);
    }
  }

  // Find initial nodes with no dependencies
  const ordered: FileDescriptorProto[] = [];
  const remaining = new Set(protoFiles);
  const ready = new Set(protoFiles.filter((f) => f.dependency.length === 0));

  while (ready.size > 0) {
    // Take the first ready node
    const current = ready.values().next().value;
    ready.delete(current);
    remaining.delete(current);
    ordered.push(current);

    // Check what nodes are now ready
    if (deps.has(current.name)) {
      for (const dependent of deps.get(current.name)!) {
        const depNode = [...remaining].find((f) => f.name === dependent);
        if (!depNode) continue;

        const depGraph = graph.get(dependent)!;
        depGraph.delete(current.name);

        if (depGraph.size === 0) {
          ready.add(depNode);
        }
      }
    }
  }

  return ordered;
}

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
