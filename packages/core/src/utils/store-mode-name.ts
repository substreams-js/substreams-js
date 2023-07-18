import { Module_Input_Store_Mode } from "../proto.js";
import { proto3 } from "@bufbuild/protobuf";

export function storeModeName(mode: Module_Input_Store_Mode): string {
  const info = proto3.getEnumType(Module_Input_Store_Mode).findNumber(mode);
  if (info === undefined) {
    throw mode.toString().toLowerCase();
  }

  return info.name.toLowerCase();
}
