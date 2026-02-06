import type { Registry } from "@bufbuild/protobuf";
import { getProtoTypeName } from "./get-proto-type-name.js";

export function getProtoType(typeName: string, registry: Registry) {
  const protoTypeName = getProtoTypeName(typeName);
  if (protoTypeName === undefined) {
    return undefined;
  }

  return registry.getMessage(protoTypeName);
}

export function getProtoTypeOrThrow(
  typeName: string,
  registry: Registry,
  message = `Type "${typeName}" not found in registry`,
) {
  const type = getProtoType(typeName, registry);
  if (type === undefined) {
    throw new Error(message);
  }

  return type;
}
