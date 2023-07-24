"use client";

import { MermaidGraph } from "@/components/mermaid-graph";
import { MaybeSerializedMessage, useRehydrateMessage } from "@/hooks/use-rehydrate-message";
import { generateMermaidGraph } from "@substreams/core";
import { Package } from "@substreams/core/proto";

export function ModuleGraph({
  pkg: ppkg,
}: {
  pkg: MaybeSerializedMessage<Package>;
}) {
  const pkg = useRehydrateMessage(Package, ppkg);
  const modules = pkg.modules?.modules;
  if (modules === undefined || modules.length === 0) {
    return null;
  }

  return (
    <div>
      <MermaidGraph graph={generateMermaidGraph(modules)} />
    </div>
  );
}
