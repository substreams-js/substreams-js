import type { Module } from "../../proto/sf/substreams/v1/modules_pb.js";

export function shortestPaths(stack: Set<Module>, nodes: Map<Module, Set<Module>>, node: Module) {
  const distances = new Map<Module, number>(Array.from(nodes.keys()).map((node) => [node, -1]));
  distances.set(node, 0);

  const array = Array.from(stack);
  while (array.length > 0) {
    // biome-ignore lint/style/noNonNullAssertion: guarenteed at this point.
    const current = array.pop()!;
    const a = distances.get(current) ?? -1;

    if (a === -1) {
      continue;
    }

    const adjacents = nodes.get(current);
    if (adjacents === undefined) {
      throw new Error(`Module ${current.name} not found in graph`);
    }

    for (const incoming of adjacents.values()) {
      const b = distances.get(incoming) ?? -1;

      if (b === -1 || b > a + 1) {
        distances.set(incoming, a + 1);
      }
    }
  }

  return distances;
}
