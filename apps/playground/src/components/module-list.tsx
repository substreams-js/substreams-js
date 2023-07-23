"use client";

import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMessageRegistry } from "@/hooks/use-message-registry";
import { useModuleGraph } from "@/hooks/use-module-graph";
import { useModuleHash } from "@/hooks/use-module-hash";
import { SerializedMessage, useRehydrateMessage } from "@/hooks/use-rehydrate-message";
import { IMessageTypeRegistry } from "@bufbuild/protobuf";
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
import { useMemo } from "react";

export function ModuleList({
  pkg: ppkg,
}: {
  pkg: SerializedMessage<Package>;
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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Modules</CardTitle>
        <CardDescription>Choose a map module to stream from.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-1">
        {modules.length === 0 ? <p>This package doesn't contain any modules.</p> : null}

        {maps.map((item) => (
          <ModuleListMapItem key={item.name} module={item} pkg={pkg} graph={graph} registry={registry} />
        ))}

        {stores.map((item) => (
          <ModuleListStoreItem key={item.name} module={item} pkg={pkg} graph={graph} />
        ))}
      </CardContent>
    </Card>
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
    <div className="-mx-4 flex items-start space-x-4 p-4">
      <Badge className="bg-violet-500 mt-px">Store</Badge>
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">{module.name}</p>
        <p className="text-sm text-muted-foreground">Hash: {hash.data ?? "Loading ..."}</p>
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
  registry: IMessageTypeRegistry;
  module: MapModule;
  graph: ModuleGraph;
  pkg: Package;
}) {
  const hash = useModuleHash(pkg, module, graph);
  const block = useMemo(() => graph.startBlockFor(module).toString(), [module, graph]);

  return (
    <div className="-mx-4 flex items-start space-x-4 rounded-md p-4 transition-all cursor-pointer hover:bg-accent hover:text-accent-foreground">
      <Badge className="bg-pink-500 mt-px">Map</Badge>
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">{module.name}</p>
        <p className="text-sm text-muted-foreground">Hash: {hash.data ?? "Loading ..."}</p>
        <p className="text-sm text-muted-foreground">
          Output: {getOutputType(module, registry)?.typeName ?? undefined}
        </p>
        <p className="text-sm text-muted-foreground">Start: {block}</p>
      </div>
    </div>
  );
}
