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
import { Package } from "./generated/sf/substreams/v1/package_pb";
import { Stream } from "./generated/sf/substreams/v1/substreams_connect";
import { Request } from "./generated/sf/substreams/v1/substreams_pb";
import { createRequest, RequestOptions } from "./request";

interface StreamBlocksOptions {
  transport: Transport;
  request: Request;
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

  public streamBlocks(options: StreamBlocksOptions) {
    const client = createPromiseClient(Stream, options.transport);
    return client.blocks(options.request, options.options);
  }
}
