import { Module } from "../../proto.js";

export function topologicalSort(
  nodes: Map<Module, Set<Module>>,
  node: Module,
  visited = new Set<Module>(),
  stack = new Set<Module>(),
) {
  if (visited.has(node)) {
    return stack;
  }

  visited.add(node);

  const adjacents = nodes.get(node);
  if (adjacents === undefined) {
    throw new Error(`Module ${node.name} not found in graph`);
  }

  for (const incoming of adjacents.values()) {
    if (!visited.has(incoming)) {
      topologicalSort(nodes, incoming, visited, stack);
    }
  }

  stack.add(node);

  return stack;
}
