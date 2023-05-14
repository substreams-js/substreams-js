import { ProxyRequest } from "../proto/fubhy/substreams/proxy/v1/proxy_pb.js";
import { type CreateRequestOptions, Module, type Package } from "@fubhy/substreams";

export type CreateProxyRequestOptions = CreateRequestOptions;

export function createProxyRequest(pkg: Package, module: Module, options?: CreateProxyRequestOptions) {
  const startBlockNum = options?.startBlockNum ?? module.initialBlock;
  const stopBlockNum = options?.stopBlockNum ?? startBlockNum + 1000n;

  return new ProxyRequest({
    package: pkg,
    startBlockNum,
    stopBlockNum,
    productionMode: options?.productionMode ?? false,
    outputModule: module.name,
    ...(options?.startCursor !== undefined
      ? {
          startCursor: options.startCursor,
        }
      : undefined),
  });
}
