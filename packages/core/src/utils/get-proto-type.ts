import type { IMessageTypeRegistry } from "@bufbuild/protobuf";
import { getProtoTypeName } from "./get-proto-type-name.js";

export function getProtoType(typeName: string, registry: IMessageTypeRegistry) {
  const protoTypeName = getProtoTypeName(typeName);
  if (protoTypeName === undefined) {
    return undefined;
  }

  return registry.findMessage(protoTypeName);
}

export function getProtoTypeOrThrow(
  typeName: string,
  registry: IMessageTypeRegistry,
  message = `Type "${typeName}" not found in registry`,
) {
  const type = getProtoType(typeName, registry);
  if (type === undefined) {
    throw new Error(message);
  }

  return type;
}
