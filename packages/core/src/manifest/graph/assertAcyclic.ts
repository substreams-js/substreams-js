import type { ModuleNode } from "./createModuleGraph.js";

export function assertAcyclic(node: ModuleNode): string[] | undefined {
  const visited = new Set<ModuleNode>();
  const stack = new Set<ModuleNode>();

  for (const adjacent of node.adjacents) {
    if (isCyclic(adjacent, visited, stack)) {
      const path = Array.from(stack).map((node) => node.value.name);
      throw new Error(`Cyclic dependency ${path.join(" -> ")}`);
    }
  }

  return undefined;
}

function isCyclic(node: ModuleNode, visited: Set<ModuleNode>, stack: Set<ModuleNode>) {
  if (stack.has(node)) {
    return true;
  }

  if (visited.has(node)) {
    return false;
  }

  visited.add(node);
  stack.add(node);

  for (const adjacent of node.adjacents) {
    if (isCyclic(adjacent, visited, stack)) {
      return true;
    }
  }

  stack.delete(node);

  return false;
}
