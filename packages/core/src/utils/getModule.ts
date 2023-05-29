import type { Module } from "../proto/sf/substreams/v1/modules_pb.js";

export function getModule(modules: Module[], name: string) {
  return modules.find((value) => value.name === name);
}

export function getModuleOrThrow(modules: Module[], name: string, message = `Module "${name}" not found in substream`) {
  const module = getModule(modules, name);
  if (module === undefined) {
    throw new Error(message);
  }

  return module;
}
