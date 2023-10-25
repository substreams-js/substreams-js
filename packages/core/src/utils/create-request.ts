import { ModuleGraph, createModuleGraph } from "../manifest/graph/create-module-graph.js";
import { Module, Modules, Package, Request } from "../proto.js";
import { getModuleOrThrow } from "./get-module.js";

export type CreateRequestOptions = {
  /**
   * The substream package to use.
   */
  substreamPackage: Package;
  /**
   * The output module to use.
   */
  outputModule: Module | string;
  /**
   * Whether to use production mode.
   */
  productionMode?: boolean | undefined;
  /**
   * The cursor to start at.
   */
  startCursor?: string | undefined;
  /**
   * Whether to only include final blocks.
   */
  finalBlocksOnly?: boolean | undefined;
  /**
   * The relative or absolute block number to start at.
   *
   * If a relative offset is provided in the form of a negative integer (e.g. -1000 or -1000n), it is
   * subtracted from the latest block number (chain head) at the time of request creation.
   */
  startBlockNum?: number | bigint | undefined;
  /**
   * The relative or absolute block number to stop at.
   *
   * If a relative offset is provided in the form of a `+` prefixed string (e.g. `+5000`), it is added to
   * the start block number.
   *
   * Relative offsets are only supported if the given start block number is a positive integer.
   */
  stopBlockNum?: number | bigint | `+${number}` | undefined;
  /**
   * Available only in developer mode.
   */
  debugInitialStoreSnapshotForModules?: string[] | undefined;
};

export function createRequest({
  substreamPackage,
  outputModule,
  startBlockNum,
  stopBlockNum = BigInt(0),
  productionMode,
  startCursor,
  finalBlocksOnly,
  debugInitialStoreSnapshotForModules,
}: CreateRequestOptions) {
  const resolvedOutputModule = resolveOutputModule(substreamPackage, outputModule);
  const packageModules = substreamPackage.modules;
  if (packageModules === undefined) {
    throw new Error("Substream package does not contain any modules.");
  }

  const moduleGraph = createModuleGraph(packageModules.modules);
  const requestModules = resolveRequestModules(moduleGraph, packageModules, resolvedOutputModule);
  const resolvedStartBlockNum = resolveStartBlockNum(moduleGraph, resolvedOutputModule, startBlockNum);
  const resolvedStopBlockNum = resolveStopBlockNum(resolvedStartBlockNum, stopBlockNum);

  return new Request({
    modules: requestModules,
    startBlockNum: resolvedStartBlockNum,
    stopBlockNum: resolvedStopBlockNum,
    outputModule: resolvedOutputModule.name,
    productionMode: productionMode ?? false,
    finalBlocksOnly: finalBlocksOnly ?? false,
    debugInitialStoreSnapshotForModules: debugInitialStoreSnapshotForModules ?? [],
    ...(startCursor !== undefined ? { startCursor } : undefined),
  });
}

function resolveRequestModules(moduleGraph: ModuleGraph, packageModules: Modules, outputModule: Module) {
  const requestModules = new Modules();
  const requiredModules = [outputModule, ...moduleGraph.ancestorsOf(outputModule)];
  for (const module of requiredModules) {
    const moduleBinary = packageModules.binaries[module.binaryIndex];
    if (moduleBinary === undefined) {
      throw new Error(`Missing ${module.name} module binary at index ${module.binaryIndex}`);
    }

    let binaryIndex = requestModules.binaries.indexOf(moduleBinary);
    if (binaryIndex === -1) {
      binaryIndex = requestModules.binaries.push(moduleBinary) - 1;
    }

    requestModules.modules.push(new Module({ ...module, binaryIndex }));
  }

  return requestModules;
}

function resolveStartBlockNum(moduleGraph: ModuleGraph, outputModule: Module, startBlockNum?: number | bigint) {
  if (startBlockNum === undefined) {
    return moduleGraph.startBlockFor(outputModule);
  }

  const startBlockBi = BigInt(startBlockNum);

  // If the start block is specified & non-relative, make sure it's not before the start block of the output module.
  if (startBlockBi > BigInt(0)) {
    const moduleStartBlock = moduleGraph.startBlockFor(outputModule);
    if (moduleStartBlock > startBlockBi) {
      throw new Error(`Given start block ${startBlockBi} is before the modules initial block (${moduleStartBlock})`);
    }
  }

  return startBlockBi;
}

function resolveOutputModule(substreamPackage: Package, outputModule: Module | string) {
  if (typeof outputModule === "string") {
    if (substreamPackage.modules === undefined) {
      throw new Error("Substream package does not contain any modules.");
    }

    return getModuleOrThrow(substreamPackage.modules?.modules ?? [], outputModule);
  }

  return outputModule;
}

function resolveStopBlockNum(startBlockNum: bigint, stopBlockNum: number | bigint | `+${number}` | `+${bigint}`) {
  if (typeof stopBlockNum === "string" && stopBlockNum.startsWith("+")) {
    if (startBlockNum < BigInt(0)) {
      throw new Error("A relative stop block number is only supported with an absolute start block number.");
    }

    return startBlockNum + BigInt(stopBlockNum.slice(1));
  }

  return BigInt(stopBlockNum);
}
