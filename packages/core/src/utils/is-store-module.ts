import type { Module } from "../proto.js";

export type StoreModule = Module & { kind: { case: "kindStore" } };

export function isStoreModule(module: Module): module is StoreModule {
  return module.kind.case === "kindStore";
}
