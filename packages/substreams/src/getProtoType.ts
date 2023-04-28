import type { IMessageTypeRegistry } from "@bufbuild/protobuf";
import { getProtoTypeName } from "./getProtoTypeName.js";

export function getProtoType(typeName: string, registry: IMessageTypeRegistry) {
  const protoTypeName = getProtoTypeName(typeName);
  if (protoTypeName === undefined) {
    return undefined;
  }

  return registry.findMessage(protoTypeName);
}
