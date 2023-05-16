import { Request } from "../proto/sf/substreams/rpc/v2/service_pb.js";
import type { Module } from "../proto/sf/substreams/v1/modules_pb.js";
import { Package } from "../proto/sf/substreams/v1/package_pb.js";
import { getModuleOrThrow } from "./getModule.js";

export interface CreateRequestOptions {
  substreamPackage: Package;
  outputModule: Module | string;
  startBlockNum?: bigint | undefined;
  stopBlockNum?: bigint | undefined;
  productionMode?: boolean | undefined;
  startCursor?: string | undefined;
  finalBlocksOnly?: boolean | undefined;
}

export function createRequest({
  substreamPackage,
  outputModule,
  startBlockNum,
  stopBlockNum,
  productionMode,
  startCursor,
  finalBlocksOnly,
}: CreateRequestOptions) {
  const resolvedOutputModule =
    typeof outputModule === "string" ? getModuleOrThrow(substreamPackage, outputModule) : outputModule;
  const resolvedStartBlockNum = startBlockNum ?? resolvedOutputModule.initialBlock;
  const resolvedStopBlockNum = stopBlockNum ?? resolvedStartBlockNum + 1000n;

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
