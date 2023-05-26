import type { Module } from "../../proto/sf/substreams/v1/modules_pb.js";
import { assertAcyclic } from "./assertAcyclic.js";
import { shortestPaths } from "./shortestPaths.js";

export type ModuleNodes = Map<string, ModuleNode>;
export type ModuleNode = {
  value: Module;
  adjacents: Set<ModuleNode>;
};

export class ModuleGraph {
  protected readonly nodes: ModuleNodes;

  constructor(nodes: ModuleNodes) {
    this.nodes = nodes;
  }

  protected shortesPaths(name: string) {
    const node = this.nodes.get(name);
    if (node === undefined) {
      throw new Error(`Unknown module ${name}`);
    }

    return shortestPaths(this.nodes, node).entries();
  }

  *ancestorsOf(name: string): IterableIterator<Module> {
    for (const [node, distance] of this.shortesPaths(name)) {
      if (distance > 0) {
        yield node.value;
      }
    }
  }
}

export function createModuleNodes(modules: Module[]) {
  const nodes: ModuleNodes = new Map();

  for (const module of modules) {
    const existing = nodes.get(module.name);
    if (existing !== undefined) {
      if (existing.value !== module) {
        throw new Error(`Duplicate module ${module.name}`);
      }

      continue;
    }

    nodes.set(module.name, {
      value: module,
      adjacents: new Set(),
    });
  }

  for (const module of modules) {
    // rome-ignore lint/style/noNonNullAssertion: guarenteed at this point.
    const current = nodes.get(module.name)!;
    for (const input of module.inputs) {
      if (input.input.case === "map" || input.input.case === "store") {
        const incoming = nodes.get(input.input.value.moduleName);
        if (incoming === undefined) {
          throw new Error(`Unknown module ${input.input.value.moduleName}`);
        }

        current.adjacents.add(incoming);
      }
    }
  }

  return nodes;
}

export function createModuleGraph(modules: Module[]) {
  const nodes = createModuleNodes(modules);
  for (const node of nodes.values()) {
    assertAcyclic(node);
  }

  return new ModuleGraph(nodes);
}
