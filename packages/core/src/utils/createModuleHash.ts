import type { Module } from "../proto/sf/substreams/v1/modules_pb.js";
import type { Package } from "../proto/sf/substreams/v1/package_pb.js";
import { createHash } from "node:crypto";

export function createModuleHash(module: Module | Package) {
  return createBinaryHash(module.toBinary());
}

export function createBinaryHash(array: Uint8Array) {
  return createHash("sha-256").update(array).digest("hex");
}
