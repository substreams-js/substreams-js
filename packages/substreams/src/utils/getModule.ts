import type { Package } from "../proto/sf/substreams/v1/package_pb.js";

export function getModule(substream: Package, name: string) {
  return substream.modules?.modules.find((value) => value.name === name);
}

export function getModuleOrThrow(
  substream: Package,
  name: string,
  message = `Module "${name}" not found in substream`,
) {
  const module = getModule(substream, name);
  if (module === undefined) {
    throw new Error(message);
  }

  return module;
}
