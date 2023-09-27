import type { IMessageTypeRegistry } from "@bufbuild/protobuf";
import type { Module } from "../proto.js";
import { getProtoType } from "./get-proto-type.js";
import { isMapModule } from "./is-map-module.js";

export function getOutputType(module: Module, registry: IMessageTypeRegistry) {
  if (!isMapModule(module)) {
    return undefined;
  }

  return getProtoType(module.kind.value.outputType, registry);
}
