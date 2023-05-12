import type { Module } from "../generated/sf/substreams/v1/modules_pb.js";
import type { Package } from "../generated/sf/substreams/v1/package_pb.js";

export type PackageWithModules = Package & { modules: { modules: Module[] } };

export function hasModule(substream: Package, module: Module | string): substream is PackageWithModules {
  const name = typeof module === "string" ? module : module.name;
  const modules = substream.modules?.modules ?? [];

  return modules.some((value) => value.name === name) ?? false;
}
