import { type IMessageTypeRegistry, createDescriptorSet, createRegistryFromDescriptors } from "@bufbuild/protobuf";

import type { FileDescriptorProto } from "@bufbuild/protobuf";
import type { Package } from "../proto.js";

export function createRegistry(substream: Package): IMessageTypeRegistry {
  substream.protoFiles = topoSort(substream.protoFiles);
  return createRegistryFromDescriptors(createDescriptorSet(substream.protoFiles), true);
}

// createDescriptorSet expects the files to be topologically sorted
function topoSort(protoFiles: FileDescriptorProto[]): FileDescriptorProto[] {
  const graph = new Map<string, Set<string>>();
  const deps = new Map<string, Set<string>>();

  // Build dependency graph
  for (const file of protoFiles) {
    if (!file.name) {
      continue;
    }
    graph.set(file.name, new Set(file.dependency));
    for (const dep of file.dependency) {
      if (!deps.has(dep)) {
        deps.set(dep, new Set());
      }
      deps.get(dep)?.add(file.name);
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
      const current_deps = deps.get(current.name);
      if (!current_deps) {
        throw new Error(`Missing dependency for ${current.name}`);
      }
      for (const dependent of current_deps) {
        const depNode = [...remaining].find((f) => f.name === dependent);
        if (!depNode) {
          continue;
        }

        const depGraph = graph.get(dependent);
        if (!depGraph) {
          throw new Error(`Missing graph for ${dependent}`);
        }
        depGraph.delete(current.name);

        if (depGraph.size === 0) {
          ready.add(depNode);
        }
      }
    }
  }

  return ordered;
}

if (process.env.NODE_ENV === "test") {
  module.exports.topoSort = topoSort;
}
