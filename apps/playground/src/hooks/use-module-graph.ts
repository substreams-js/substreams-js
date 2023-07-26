import { createModuleGraph } from "@substreams/core";
import { Package } from "@substreams/core/proto";
import { useMemo } from "react";

export function useModuleGraph(pkg: Package) {
  const graph = useMemo(() => createModuleGraph(pkg?.modules?.modules ?? []), [pkg]);

  return graph;
}
