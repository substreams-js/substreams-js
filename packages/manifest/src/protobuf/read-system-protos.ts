import * as fs from "node:fs";
import * as url from "node:url";
import { fromBinary } from "@bufbuild/protobuf";
import { FileDescriptorSetSchema } from "@bufbuild/protobuf/wkt";

export function readSystemProtos() {
  const path = url.fileURLToPath(new URL("../../system.pb", import.meta.url));
  return fromBinary(FileDescriptorSetSchema, fs.readFileSync(path));
}
