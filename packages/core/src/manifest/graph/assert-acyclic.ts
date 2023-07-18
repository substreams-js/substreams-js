import type { Module } from "../../proto.js";

export function assertAcyclic(nodes: Map<Module, Set<Module>>) {
  for (const [node, adjacents] of nodes) {
    const visited = new Set<Module>([node]);
    const stack = new Set<Module>([node]);

    for (const adjacent of adjacents) {
      if (isCyclic(nodes, adjacent, visited, stack)) {
        const path = Array.from(stack).map((node) => node.name);
        throw new Error(`Cyclic dependency ${path.join(" -> ")}`);
      }
    }
  }
}

function isCyclic(nodes: Map<Module, Set<Module>>, node: Module, visited: Set<Module>, stack: Set<Module>) {
  if (stack.has(node)) {
    return true;
  }

  if (visited.has(node)) {
    return false;
  }

  visited.add(node);
  stack.add(node);

  const adjacents = nodes.get(node);
  if (adjacents === undefined) {
    throw new Error(`Module ${node.name} not found in graph`);
  }

  for (const adjacent of adjacents) {
    if (isCyclic(nodes, adjacent, visited, stack)) {
      return true;
    }
  }

  stack.delete(node);

  return false;
}
