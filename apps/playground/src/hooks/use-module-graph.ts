"use client";

import { useMemoStable } from "./use-memo-stable";
import { createModuleGraph } from "@substreams/core";
import { Package } from "@substreams/core/proto";

export function useModuleGraph(pkg: Package) {
  return useMemoStable(() => createModuleGraph(pkg?.modules?.modules ?? []), [pkg]);
}
