"use client";

import { Badge } from "@/components/ui/badge";
import { type Registry, useMessageRegistry } from "@/hooks/use-message-registry";
import { useModuleGraph } from "@/hooks/use-module-graph";
import { useModuleHash } from "@/hooks/use-module-hash";
import {
  type MapModule,
  ModuleGraph,
  type StoreModule,
  getModules,
  getOutputType,
  isMapModule,
  isStoreModule,
} from "@substreams/core";
import { Package } from "@substreams/core/proto";
import { type MaybeSerializedMessage, useRehydrateMessage } from "@substreams/react";
import { useMemo } from "react";

export function ModuleList({
  pkg: ppkg,
}: {
  pkg: MaybeSerializedMessage<Package>;
}) {
  const pkg = useRehydrateMessage(Package, ppkg);
  const graph = useModuleGraph(pkg);
  const registry = useMessageRegistry(pkg);

  const [maps, stores, modules] = useMemo(() => {
    const modules = getModules(pkg, "both");
    const maps = modules.filter(isMapModule);
    const stores = modules.filter(isStoreModule);

    return [maps, stores, modules] as const;
  }, [pkg]);

  return (
    <div className="space-y-2">
      {modules.length === 0 ? <p>This package doesn't contain any modules.</p> : null}

      {maps.map((item) => (
        <ModuleListMapItem key={item.name} module={item} pkg={pkg} graph={graph} registry={registry} />
      ))}

      {stores.map((item) => (
        <ModuleListStoreItem key={item.name} module={item} pkg={pkg} graph={graph} />
      ))}
    </div>
  );
}

function ModuleListStoreItem({
  module,
  graph,
  pkg,
}: {
  module: StoreModule;
  graph: ModuleGraph;
  pkg: Package;
}) {
  const hash = useModuleHash(pkg, module, graph);

  return (
    <div className="flex items-center space-x-4 border rounded-lg p-2">
      <Badge variant="outline" className="bg-pink-600">
        Store
      </Badge>
      <div className="space-y-1">
        <p className="text-xs font-bold">{module.name}</p>
        <p className="text-xs text-muted-foreground leading-none">Hash: {hash.data ?? "Loading ..."}</p>
      </div>
    </div>
  );
}

function ModuleListMapItem({
  registry,
  module,
  graph,
  pkg,
}: {
  registry: Registry;
  module: MapModule;
  graph: ModuleGraph;
  pkg: Package;
}) {
  const hash = useModuleHash(pkg, module, graph);
  const block = useMemo(() => graph.startBlockFor(module).toString(), [module, graph]);

  return (
    <div className="flex items-center space-x-4 border rounded-lg p-2">
      <Badge variant="outline" className="bg-indigo-600">
        Map
      </Badge>
      <div className="space-y-1">
        <p className="text-xs font-bold">{module.name}</p>
        <p className="text-xs text-muted-foreground leading-none">Hash: {hash.data ?? "Loading ..."}</p>
        <p className="text-xs text-muted-foreground leading-none">
          Output: {getOutputType(module, registry)?.typeName ?? undefined}
        </p>
        <p className="text-xs text-muted-foreground leading-none">Start: {block}</p>
      </div>
    </div>
  );
}
