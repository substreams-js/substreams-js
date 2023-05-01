import { getProtoTypeName } from "./getProtoTypeName.js";
import type { IMessageTypeRegistry } from "@bufbuild/protobuf";

export function getProtoType(typeName: string, registry: IMessageTypeRegistry) {
  const protoTypeName = getProtoTypeName(typeName);
  if (protoTypeName === undefined) {
    return undefined;
  }

  return registry.findMessage(protoTypeName);
}
