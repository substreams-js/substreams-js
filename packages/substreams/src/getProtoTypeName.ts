export function getProtoTypeName(typeName: string) {
  if (typeName.startsWith("proto:")) {
    return typeName.replace(/^proto:/, "");
  }

  return undefined;
}
