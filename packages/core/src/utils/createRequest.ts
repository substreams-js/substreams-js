import { Request } from "../proto/sf/substreams/rpc/v2/service_pb.js";
import type { Module } from "../proto/sf/substreams/v1/modules_pb.js";
import { Package } from "../proto/sf/substreams/v1/package_pb.js";
import { getModuleOrThrow } from "./getModule.js";

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
  startBlockNum?: number | bigint | `-${number}` | `-${bigint}` | undefined;
  /**
   * The relative or absolute block number to stop at.
   *
   * If a relative offset is provided in the form of a `+` prefixed string (e.g. `+5000`), it is added to
   * the start block number.
   *
   * Relative offsets are only supported if the given start block number is a positive integer.
   */
  stopBlockNum: number | bigint | `+${number}` | `+${bigint}`;
};

export function createRequest({
  substreamPackage,
  outputModule,
  startBlockNum,
  stopBlockNum,
  productionMode,
  startCursor,
  finalBlocksOnly,
}: CreateRequestOptions) {
  const resolvedOutputModule = resolveOutputModule(substreamPackage, outputModule);
  const resolvedStartBlockNum = resolveStartBlockNum(resolvedOutputModule, startBlockNum);
  const resolvedStopBlockNum = resolveStopBlockNum(resolvedStartBlockNum, stopBlockNum);

  return new Request({
    startBlockNum: resolvedStartBlockNum,
    stopBlockNum: resolvedStopBlockNum,
    outputModule: resolvedOutputModule.name,
    productionMode: productionMode ?? false,
    finalBlocksOnly: finalBlocksOnly ?? false,
    ...(substreamPackage.modules !== undefined ? { modules: substreamPackage.modules } : undefined),
    ...(startCursor !== undefined ? { startCursor } : undefined),
  });
}

export function resolveOutputModule(substreamPackage: Package, outputModule: Module | string) {
  return typeof outputModule === "string" ? getModuleOrThrow(substreamPackage, outputModule) : outputModule;
}

export function resolveStartBlockNum(
  outputModule: Module,
  startBlockNum?: number | bigint | `-${number}` | `-${bigint}`,
) {
  if (startBlockNum === undefined) {
    return outputModule.initialBlock;
  }

  return BigInt(startBlockNum);
}

export function resolveStopBlockNum(
  startBlockNum: bigint,
  stopBlockNum: number | bigint | `+${number}` | `+${bigint}`,
) {
  if (typeof stopBlockNum === "string" && stopBlockNum.startsWith("+")) {
    if (startBlockNum < 0n) {
      throw new Error("A relative stop block number is only supported with an absolute start block number.");
    }

    return startBlockNum + BigInt(stopBlockNum.slice(1));
  }

  return BigInt(stopBlockNum);
}
