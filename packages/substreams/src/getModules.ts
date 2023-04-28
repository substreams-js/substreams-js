import type { Package } from "./generated/sf/substreams/v1/package_pb.js";
import { isMapModule, type MapModule } from "./isMapModule.js";
import { isStoreModule, type StoreModule } from "./isStoreModule.js";

export type ModuleKind = "map" | "store";
export type ModuleKindOrBoth = ModuleKind | "both";

export type GetModulesReturnType<TKind extends ModuleKindOrBoth = "both"> = TKind extends "map"
  ? MapModule[]
  : TKind extends "store"
  ? StoreModule[]
  : TKind extends "both"
  ? (StoreModule | MapModule)[]
  : never;

export function getModules<TKind extends ModuleKindOrBoth = "both">(substream: Package, kind: TKind) {
  const modules = substream.modules?.modules ?? [];
  if (kind === "both") {
    return modules.filter((module) => isMapModule(module) || isStoreModule(module)) as GetModulesReturnType<TKind>;
  }

  if (kind === "map") {
    return modules.filter((module) => isMapModule(module)) as GetModulesReturnType<TKind>;
  }

  if (kind === "store") {
    return modules.filter((module) => isStoreModule(module)) as GetModulesReturnType<TKind>;
  }

  throw new Error(`Invalid module kind ${kind}`);
}
