import { FileDescriptorSet } from "@bufbuild/protobuf";
import * as fs from "node:fs";
import * as url from "node:url";

export function readSystemProtos() {
  const path = url.fileURLToPath(new URL("../../system.pb", import.meta.url));
  return FileDescriptorSet.fromBinary(fs.readFileSync(path));
}
