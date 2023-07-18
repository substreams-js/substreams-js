import { CircleStackIcon, MapIcon, SparklesIcon, ViewfinderCircleIcon } from "@heroicons/react/20/solid";
import { type MapModule, type ModuleKindOrBoth, type StoreModule, getModules } from "@substreams/core";
import type { Package } from "@substreams/core/proto";
import { Badge, Button, Card, Divider, Flex, List, ListItem, Text, Toggle, ToggleItem } from "@tremor/react";
import { useMemo, useState } from "react";

export function ModuleList({ pkg, select }: { pkg: Package; select: (module: MapModule) => void }) {
  const [filter, setFilter] = useState<ModuleKindOrBoth>("both");
  const [maps, stores] = useMemo(() => {
    const modules = getModules(pkg, "both");
    const maps = modules.filter((module) => module.kind.case === "kindMap") as MapModule[];
    const stores = modules.filter((module) => module.kind.case === "kindStore") as StoreModule[];

    return [maps, stores] as const;
  }, [pkg]);

  return (
    <Card>
      <Toggle color="zinc" defaultValue="both" onValueChange={setFilter}>
        <ToggleItem value="both" text="Both" icon={SparklesIcon} />
        <ToggleItem value="map" text="Map" icon={MapIcon} />
        <ToggleItem value="store" text="Store" icon={CircleStackIcon} />
      </Toggle>
      <Divider />
      <List>
        {filter !== "store"
          ? maps.map((item) => {
              return <ModuleListItem key={item.name} module={item} select={() => select(item)} />;
            })
          : null}

        {filter !== "map"
          ? stores.map((item) => {
              return <ModuleListItem key={item.name} module={item} />;
            })
          : null}
      </List>
    </Card>
  );
}

function ModuleListItem({
  module,
  select,
}:
  | {
      module: MapModule;
      select: () => void;
    }
  | {
      module: StoreModule;
      select?: never;
    }) {
  const kind = module.kind.case === "kindMap" ? "map" : "store";
  const color = module.kind.case === "kindMap" ? "indigo" : "lime";
  const output = module.kind.case === "kindMap" ? module.kind.value.outputType : module.kind.value.valueType;

  return (
    <ListItem key={module.name} title={module.name}>
      <Flex justifyContent="start" className="mr-3 line-clamp-1">
        <Badge color={color} icon={MapIcon} className="mr-3">
          {kind}
        </Badge>
        <span className="overflow-hidden text-ellipsis ">
          <Text color={color} className="mr-3">
            {module.name}
          </Text>
          {output.replace(/^proto:/, "")}
        </span>
      </Flex>
      {module.kind.case === "kindMap" ? (
        <Button size="xs" icon={ViewfinderCircleIcon} className="ml-3" onClick={select}>
          select
        </Button>
      ) : null}
    </ListItem>
  );
}
