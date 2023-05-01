import type { Module } from "./generated/sf/substreams/v1/modules_pb.js";
import { getProtoType } from "./getProtoType.js";
import { isMapModule } from "./isMapModule.js";
import type { IMessageTypeRegistry } from "@bufbuild/protobuf";

export function getOutputType(module: Module, registry: IMessageTypeRegistry) {
  if (!isMapModule(module)) {
    return undefined;
  }

  return getProtoType(module.kind.value.outputType, registry);
}
