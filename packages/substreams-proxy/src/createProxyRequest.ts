import { type CreateRequestOptions, ForkStep, Module, type Package, ProxyRequest } from "@fubhy/substreams";

export type CreateProxyRequestOptions = CreateRequestOptions;

export function createProxyRequest(pkg: Package, module: Module, options?: CreateProxyRequestOptions) {
  const startBlockNum = options?.startBlockNum ?? module.initialBlock;
  const stopBlockNum = options?.stopBlockNum ?? startBlockNum + 1000n;

  return new ProxyRequest({
    package: pkg,
    startBlockNum,
    stopBlockNum,
    productionMode: options?.productionMode ?? false,
    forkSteps: options?.forkSteps ?? [ForkStep.STEP_IRREVERSIBLE],
    outputModule: module.name,
    ...(options?.startCursor !== undefined
      ? {
          startCursor: options.startCursor,
        }
      : undefined),
  });
}
