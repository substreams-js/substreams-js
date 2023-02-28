import { CallOptions, createPromiseClient, Transport } from "@bufbuild/connect";
import {
  createDescriptorSet,
  createRegistryFromDescriptors,
  IMessageTypeRegistry,
} from "@bufbuild/protobuf";
import {
  IEnumTypeRegistry,
  IServiceTypeRegistry,
} from "@bufbuild/protobuf/dist/types/type-registry";
import { ProxyService } from "./generated/enzyme/substreams/v1/enzyme_connect";
import { ProxyRequest } from "./generated/enzyme/substreams/v1/enzyme_pb";
import { Package } from "./generated/sf/substreams/v1/package_pb";
import { Stream } from "./generated/sf/substreams/v1/substreams_connect";
import { Request } from "./generated/sf/substreams/v1/substreams_pb";
import { createProxyRequest, createRequest, RequestOptions } from "./request";

interface StreamBlocksOptions {
  transport: Transport;
  request: Request | ProxyRequest;
  options?: CallOptions;
}

export class Substream {
  public readonly pkg: Package;
  public readonly registry: IMessageTypeRegistry &
    IEnumTypeRegistry &
    IServiceTypeRegistry;

  constructor(bytes: Uint8Array) {
    this.pkg = Package.fromBinary(bytes);
    this.registry = createRegistryFromDescriptors(
      createDescriptorSet(this.pkg.protoFiles)
    );
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
