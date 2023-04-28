import type { Package, MapModule } from "@fubhy/substreams";
import { useMemo } from "react";
import { getModules } from "../../../../../packages/substreams/src/getModules.js";
import { MapModuleCard } from "./MapModuleCard.js";
import { StoreModuleCard } from "./StoreModuleCard.js";

export function ModuleCards({
  pkg,
  select,
}: {
  pkg: Package;
  select: (module: MapModule) => void;
}) {
  const [map, store] = useMemo(() => {
    return [getModules(pkg, "map"), getModules(pkg, "store")] as const;
  }, [pkg]);

  return (
    <>
      {map.map((module) => (
        <MapModuleCard key={module.name} module={module} select={() => select(module)} />
      ))}
      {store.map((module) => (
        <StoreModuleCard key={module.name} module={module} />
      ))}
    </>
  );
}
