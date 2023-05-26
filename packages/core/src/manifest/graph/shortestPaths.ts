import type { ModuleNode, ModuleNodes } from "./createModuleGraph.js";
import { topologicalSort } from "./topologicalSort.js";

export function shortestPaths(nodes: ModuleNodes, node: ModuleNode) {
  const distances = new Map<ModuleNode, number>(Array.from(nodes.values()).map((node) => [node, -1]));
  distances.set(node, 0);

  const stack = Array.from(topologicalSort(node));
  while (stack.length > 0) {
    // rome-ignore lint/style/noNonNullAssertion: guarenteed at this point.
    const current = stack.pop()!;
    const a = distances.get(current) ?? -1;

    if (a === -1) {
      continue;
    }

    for (const incoming of current.adjacents.values()) {
      const b = distances.get(incoming) ?? -1;

      if (b === -1 || b > a + 1) {
        distances.set(incoming, a + 1);
      }
    }
  }

  return distances;
}
