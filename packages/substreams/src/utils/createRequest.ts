import { Request } from "../proto/sf/substreams/rpc/v2/service_pb.js";
import type { Module } from "../proto/sf/substreams/v1/modules_pb.js";
import { Package } from "../proto/sf/substreams/v1/package_pb.js";

export interface CreateRequestOptions {
  startBlockNum?: bigint | undefined;
  stopBlockNum?: bigint | undefined;
  productionMode?: boolean | undefined;
  startCursor?: string | undefined;
  finalBlocksOnly?: boolean | undefined;
}

export function createRequest(pkg: Package, module: Module, options?: CreateRequestOptions) {
  if (pkg.modules === undefined) {
    throw new Error("Package doesn't contain any modules");
  }

  const startBlockNum = options?.startBlockNum ?? module.initialBlock;
  const stopBlockNum = options?.stopBlockNum ?? startBlockNum + 1000n;

  return new Request({
    modules: pkg.modules,
    startBlockNum,
    stopBlockNum,
    productionMode: options?.productionMode ?? false,
    finalBlocksOnly: options?.finalBlocksOnly ?? false,
    outputModule: module.name,
    ...(options?.startCursor !== undefined
      ? {
          startCursor: options.startCursor,
        }
      : undefined),
  });
}
