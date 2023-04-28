import type { Module } from "./generated/sf/substreams/v1/modules_pb.js";

export type MapModule = Module & { kind: { case: "kindMap" } };

export function isMapModule(module: Module): module is MapModule {
  return module.kind.case === "kindMap";
}
