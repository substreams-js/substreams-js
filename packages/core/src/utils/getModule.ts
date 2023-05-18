import type { Modules } from "../proto/sf/substreams/v1/modules_pb.js";

export function getModule(modules: Modules, name: string) {
  return modules.modules.find((value) => value.name === name);
}

export function getModuleOrThrow(modules: Modules, name: string, message = `Module "${name}" not found in substream`) {
  const module = getModule(modules, name);
  if (module === undefined) {
    throw new Error(message);
  }

  return module;
}
