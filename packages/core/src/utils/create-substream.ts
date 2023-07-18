import { Package } from "../proto.js";

export function createSubstream(value: Uint8Array | ArrayBuffer) {
  if (value instanceof ArrayBuffer) {
    return Package.fromBinary(new Uint8Array(value));
  }

  return Package.fromBinary(value);
}
