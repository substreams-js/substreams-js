"use client";

import { useMessageKey } from "./use-message-key";
import { invariant } from "@/lib/utils";
import { ModuleGraph, createModuleHashHex } from "@substreams/core";
import { Package } from "@substreams/core/proto";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

export function useModuleHash(pkg: Package, module: string, graph?: ModuleGraph): UseQueryResult<string> {
  const key = useMessageKey(pkg);
  return useQuery({
    queryKey: ["module-hash", module, key],
    queryFn: () => {
      invariant(pkg.modules !== undefined, "Expected modules in the package.");
      return createModuleHashHex(pkg.modules, module, graph);
    },
  });
}
