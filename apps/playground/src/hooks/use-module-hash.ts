import { useMessageKey } from "@/hooks/use-message-key";
import { invariant } from "@/lib/utils";
import { ModuleGraph, createModuleHashHex } from "@substreams/core";
import { Module, Package } from "@substreams/core/proto";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export function useModuleHash(pkg: Package, module: string | Module, graph?: ModuleGraph): UseQueryResult<string> {
  const key = useMessageKey(pkg);
  return useQuery({
    queryKey: ["module-hash", typeof module === "string" ? module : module.name, key],
    queryFn: () => {
      invariant(pkg.modules !== undefined, "Expected modules in the package.");
      return createModuleHashHex(pkg.modules, module, graph);
    },
  });
}
