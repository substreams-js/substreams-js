import { type CallOptions, createPromiseClient, type Transport } from "@bufbuild/connect";
import { createDescriptorSet, createRegistryFromDescriptors, type IMessageTypeRegistry } from "@bufbuild/protobuf";
import { ProxyService } from "./generated/fubhy/substreams/proxy/v1/proxy_connect.js";
import { ProxyRequest } from "./generated/fubhy/substreams/proxy/v1/proxy_pb.js";
import { Package } from "./generated/sf/substreams/v1/package_pb.js";
import { Stream } from "./generated/sf/substreams/v1/substreams_connect.js";
import { Request } from "./generated/sf/substreams/v1/substreams_pb.js";
import { createProxyRequest, createRequest, type RequestOptions } from "./request.js";

interface StreamBlocksOptions {
  transport: Transport;
  request: Request | ProxyRequest;
  options?: CallOptions;
}

export class Substream {
  public readonly pkg: Package;
  public readonly registry: IMessageTypeRegistry;

  constructor(bytes: Uint8Array) {
    this.pkg = Package.fromBinary(bytes);
    this.registry = createRegistryFromDescriptors(createDescriptorSet(this.pkg.protoFiles));
  }

  public createRequest(module: string, options?: RequestOptions) {
    return createRequest(this.pkg, module, options);
  }

  public createProxyRequest(module: string, options?: RequestOptions) {
    return createProxyRequest(this.pkg, module, options);
  }

  public streamBlocks(options: StreamBlocksOptions) {
    if (options.request instanceof ProxyRequest) {
      const client = createPromiseClient(ProxyService, options.transport);
      return client.proxy(options.request, options.options);
    } else {
      const client = createPromiseClient(Stream, options.transport);
      return client.blocks(options.request, options.options);
    }
  }
}
