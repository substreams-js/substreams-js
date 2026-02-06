import { fromBinary } from "@bufbuild/protobuf";
import { type Package, PackageSchema } from "../proto.js";

export function createSubstream(value: Uint8Array | ArrayBuffer): Package {
  if (value instanceof ArrayBuffer) {
    return fromBinary(PackageSchema, new Uint8Array(value));
  }

  return fromBinary(PackageSchema, value);
}
