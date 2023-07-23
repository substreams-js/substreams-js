"use client";

import { Card } from "@/components/ui/card";
import { SerializedMessage, useRehydrateMessage } from "@/hooks/use-rehydrate-message";
import { type MapModule, type StoreModule, getModules } from "@substreams/core";
import { Package } from "@substreams/core/proto";
import { useMemo } from "react";

export function ModuleList({
  pkg: ppkg,
}: {
  pkg: SerializedMessage<Package>;
}) {
  const pkg = useRehydrateMessage(Package, ppkg);
  const [maps, stores] = useMemo(() => {
    const modules = getModules(pkg, "both");
    const maps = modules.filter((module) => module.kind.case === "kindMap") as MapModule[];
    const stores = modules.filter((module) => module.kind.case === "kindStore") as StoreModule[];

    return [maps, stores] as const;
  }, [pkg]);

  return (
    <Card>
      {maps.map((item) => (
        <ModuleListMapItem key={item.name} module={item} />
      ))}

      {stores.map((item) => (
        <ModuleListStoreItem key={item.name} module={item} />
      ))}
    </Card>
  );
}

export function ModuleListStoreItem({
  module,
}: {
  module: StoreModule;
}) {
  return <div>{module.name}</div>;
}

export function ModuleListMapItem({
  module,
}: {
  module: MapModule;
}) {
  return <div>{module.name}</div>;
}
