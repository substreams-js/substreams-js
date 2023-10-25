import { Module } from "../../proto.js";
import { getModuleOrThrow } from "../../utils/get-module.js";
import { assertAcyclic } from "./assert-acyclic.js";
import { shortestPaths } from "./shortest-paths.js";
import { topologicalSort } from "./topological-sort.js";

export const INITIAL_BLOCK_UNSET = BigInt("18446744073709551615");

export class ModuleGraph {
  protected readonly modules: Module[];
  protected readonly nodes: Map<Module, Set<Module>>;

  /**
   * A cache of shortest paths between modules.
   */
  private readonly distances: Map<Module, Map<Module, number>> = new Map();

  /**
   * A cache of topologically sorted modules.
   */
  private readonly sorted: Map<Module, Set<Module>> = new Map();

  constructor(modules: Module[]) {
    this.modules = modules;
    this.nodes = createModuleNodes(modules);
  }

  protected getModule(name: string): Module;
  protected getModule(module: Module): Module;
  protected getModule(nameOrModule: string | Module): Module;
  protected getModule(nameOrModule: string | Module) {
    return typeof nameOrModule === "string" ? getModuleOrThrow(this.modules, nameOrModule) : nameOrModule;
  }

  protected shortesPaths(name: string): Map<Module, number>;
  protected shortesPaths(module: Module): Map<Module, number>;
  protected shortesPaths(nameOrModule: string | Module): Map<Module, number>;
  protected shortesPaths(nameOrModule: string | Module) {
    const module = this.getModule(nameOrModule);
    let distances = this.distances.get(module);

    if (distances === undefined) {
      distances = shortestPaths(this.topologicalSort(module), this.nodes, module);
      this.distances.set(module, distances);
    }

    return distances;
  }

  protected topologicalSort(name?: string): Set<Module>;
  protected topologicalSort(module?: Module): Set<Module>;
  protected topologicalSort(nameOrModule?: string | Module): Set<Module>;
  protected topologicalSort(nameOrModule?: string | Module) {
    if (nameOrModule !== undefined) {
      const node = this.getModule(nameOrModule);
      let sorted = this.sorted.get(node);

      if (sorted === undefined) {
        sorted = topologicalSort(this.nodes, node);
        this.sorted.set(node, sorted);
      }

      return sorted;
    }

    const merged = new Set<Module>();
    for (const single of this.modules.map((module) => topologicalSort(this.nodes, module))) {
      for (const node of single) {
        merged.add(node);
      }
    }

    return merged;
  }

  ancestorsOf(name: string): Module[];
  ancestorsOf(module: Module): Module[];
  ancestorsOf(nameOrModule: string | Module): Module[];
  ancestorsOf(nameOrModule: string | Module) {
    const distances = Array.from(this.shortesPaths(nameOrModule));
    return distances.filter(([, distance]) => distance > 0).map(([node]) => node);
  }

  parentsOf(name: string): Module[];
  parentsOf(module: Module): Module[];
  parentsOf(nameOrModule: string | Module): Module[];
  parentsOf(nameOrModule: string | Module) {
    const distances = Array.from(this.shortesPaths(nameOrModule));
    return distances.filter(([, distance]) => distance === 1).map(([node]) => node);
  }

  childrenOf(name: string): Module[];
  childrenOf(module: Module): Module[];
  childrenOf(nameOrModule: string | Module): Module[];
  childrenOf(nameOrModule: string | Module) {
    const module = typeof nameOrModule === "string" ? getModuleOrThrow(this.modules, nameOrModule) : nameOrModule;
    const sorted = this.sortedByGraphTopology();
    const children = new Set<Module>();
    for (const current of sorted) {
      const distances = this.shortesPaths(current);
      if (distances.get(module) === 1) {
        children.add(current);
      }
    }

    return Array.from(children);
  }

  sortedByGraphTopology() {
    return Array.from(this.topologicalSort());
  }

  // TODO: The go package uses a different algorithm for this but I'm not sure why. This should be fine and much simpler?
  startBlockFor(name: string): bigint;
  startBlockFor(module: Module): bigint;
  startBlockFor(nameOrModule: string | Module): bigint;
  startBlockFor(nameOrModule: string | Module) {
    const module = typeof nameOrModule === "string" ? getModuleOrThrow(this.modules, nameOrModule) : nameOrModule;
    if (module.initialBlock !== INITIAL_BLOCK_UNSET) {
      return module.initialBlock;
    }

    const ancestors = this.ancestorsOf(module);
    const block = ancestors.reduce((carry, current) => {
      if (current.initialBlock !== INITIAL_BLOCK_UNSET && current.initialBlock < carry) {
        return current.initialBlock;
      }

      return carry;
    }, INITIAL_BLOCK_UNSET);

    return block === INITIAL_BLOCK_UNSET ? BigInt(0) : block;
  }
}

export function createModuleNodes(modules: Module[]) {
  const nodes: Map<Module, Set<Module>> = new Map();

  for (const module of modules) {
    const existing = nodes.get(module);
    if (existing !== undefined) {
      throw new Error(`Duplicate module ${module.name}`);
    }

    nodes.set(module, new Set());
  }

  for (const module of modules) {
    // biome-ignore lint/style/noNonNullAssertion: guarenteed at this point.
    const adjacents = nodes.get(module)!;
    for (const input of module.inputs) {
      if (input.input.case === "map" || input.input.case === "store") {
        const incoming = getModuleOrThrow(modules, input.input.value.moduleName);
        adjacents.add(incoming);
      }
    }
  }

  assertAcyclic(nodes);

  return nodes;
}

export function createModuleGraph(modules: Module[]) {
  return new ModuleGraph(modules);
}
