import { ProxyRequest } from "./generated/enzyme/substreams/v1/enzyme_pb.js";
import { Package } from "./generated/sf/substreams/v1/package_pb.js";
import {
  ForkStep,
  Request,
} from "./generated/sf/substreams/v1/substreams_pb.js";

export interface RequestOptions {
  startBlockNum?: bigint;
  stopBlockNum?: string | bigint;
  productionMode?: boolean;
  startCursor?: string;
  forkSteps?: ForkStep[];
}

export function createProxyRequest(
  pkg: Package,
  module: string,
  options?: RequestOptions
) {
  const modules = pkg.modules;
  if (modules === undefined) {
    throw new Error("Package doesn't contain any modules");
  }

  const mod = modules.modules.find((item) => item.name === module);
  if (mod === undefined) {
    throw new Error(`Module ${module} doesn't exist`);
  }

  const startBlockNum = options?.startBlockNum ?? mod.initialBlock;
  const stopBlockNum = deriveStopBlockNum(options?.stopBlockNum, startBlockNum);

  return new ProxyRequest({
    package: pkg,
    startBlockNum,
    stopBlockNum,
    productionMode: options?.productionMode ?? false,
    forkSteps: options?.forkSteps ?? [ForkStep.STEP_IRREVERSIBLE],
    outputModule: module,
    ...(options?.startCursor !== undefined
      ? {
          startCursor: options.startCursor,
        }
      : undefined),
  });
}

export function createRequest(
  pkg: Package,
  module: string,
  options?: RequestOptions
) {
  const modules = pkg.modules;
  if (modules === undefined) {
    throw new Error("Package doesn't contain any modules");
  }

  const mod = modules.modules.find((item) => item.name === module);
  if (mod === undefined) {
    throw new Error(`Module ${module} doesn't exist`);
  }

  const startBlockNum = options?.startBlockNum ?? mod.initialBlock;
  const stopBlockNum = deriveStopBlockNum(options?.stopBlockNum, startBlockNum);

  return new Request({
    modules,
    startBlockNum,
    stopBlockNum,
    productionMode: options?.productionMode ?? false,
    forkSteps: options?.forkSteps ?? [ForkStep.STEP_IRREVERSIBLE],
    outputModule: module,
    ...(options?.startCursor !== undefined
      ? {
          startCursor: options.startCursor,
        }
      : undefined),
  });
}

function deriveStopBlockNum(
  stopBlockNum: bigint | string | undefined,
  startBlockNum: bigint
) {
  if (stopBlockNum === undefined) {
    return startBlockNum + 10n;
  }

  if (typeof stopBlockNum === "string") {
    if (/^\+[0-9]+$/.test(stopBlockNum)) {
      return startBlockNum + BigInt(stopBlockNum.slice(1));
    } else {
      throw new Error(
        "Invalid stopBlockNum. Expected number or relative offset (+12345)"
      );
    }
  }

  return stopBlockNum;
}
