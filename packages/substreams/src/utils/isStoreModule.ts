import type { Module } from "../generated/sf/substreams/v1/modules_pb.js";

export type StoreModule = Module & { kind: { case: "kindStore" } };

export function isStoreModule(module: Module): module is StoreModule {
  return module.kind.case === "kindStore";
}
