import { type Module_Input_Store_Mode, Module_Input_Store_ModeSchema } from "../proto.js";

export function storeModeName(mode: Module_Input_Store_Mode): string {
  const info = Module_Input_Store_ModeSchema.value[mode];
  if (info === undefined) {
    return mode.toString().toLowerCase();
  }

  return info.name.toLowerCase();
}
