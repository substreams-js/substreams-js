import type { IMessageTypeRegistry } from "@bufbuild/protobuf";
import type { Module } from "./generated/sf/substreams/v1/modules_pb.js";
import { isMapModule } from "./isMapModule.js";

export function getOutputType(module: Module, registry: IMessageTypeRegistry) {
  if (!isMapModule(module)) {
    return undefined;
  }

  const outputType = module.kind.value.outputType;
  if (!outputType.startsWith("proto:")) {
    return undefined;
  }

  const typeName = outputType.replace(/^proto:/, "");
  return registry.findMessage(typeName);
}
