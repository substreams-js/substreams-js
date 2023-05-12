import type { Package } from "../generated/sf/substreams/v1/package_pb.js";

export function getModule(substream: Package, name: string) {
  return substream.modules?.modules.find((value) => value.name === name);
}
