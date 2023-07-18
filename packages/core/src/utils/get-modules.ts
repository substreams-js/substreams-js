import type { Package } from "../proto.js";
import { type MapModule, isMapModule } from "./is-map-module.js";
import { type StoreModule, isStoreModule } from "./is-store-module.js";

export type ModuleKind = "map" | "store";
export type ModuleKindOrBoth = ModuleKind | "both";

export type GetModulesReturnType<TKind extends ModuleKindOrBoth = "both"> = TKind extends "map"
  ? MapModule[]
  : TKind extends "store"
  ? StoreModule[]
  : TKind extends "both"
  ? (StoreModule | MapModule)[]
  : never;

export function getModules<TKind extends ModuleKindOrBoth = "both">(substream: Package, kind: TKind = "both" as TKind) {
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
