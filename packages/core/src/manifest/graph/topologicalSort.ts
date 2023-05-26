import type { ModuleNode } from "./createModuleGraph.js";

export function topologicalSort(node: ModuleNode) {
  const visited = new Set<ModuleNode>();
  const stack = new Set<ModuleNode>();
  topologicalSortHelper(node, visited, stack);

  return stack;
}

function topologicalSortHelper(node: ModuleNode, visited: Set<ModuleNode>, stack: Set<ModuleNode>) {
  if (visited.has(node)) {
    return;
  }

  visited.add(node);

  for (const incoming of node.adjacents.values()) {
    if (!visited.has(incoming)) {
      topologicalSortHelper(incoming, visited, stack);
    }
  }

  stack.add(node);
}
