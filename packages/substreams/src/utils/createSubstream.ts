import { Package } from "../proto/sf/substreams/v1/package_pb.js";

export function createSubstream(value: Uint8Array | ArrayBuffer) {
  if (value instanceof ArrayBuffer) {
    return Package.fromBinary(new Uint8Array(value));
  }

  return Package.fromBinary(value);
}
