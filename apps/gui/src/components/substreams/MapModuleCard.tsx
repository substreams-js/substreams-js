import { Flex, Title, Card, Badge, List, ListItem, Button, Divider } from "@tremor/react";
import type { MapModule } from "@fubhy/substreams";

export function MapModuleCard({
  select,
  module,
}: {
  select: () => void;
  module: MapModule;
}) {
  return (
    <Card decoration="top" decorationColor="indigo">
      <Flex justifyContent="between" alignItems="center">
        <Title as="h2">{module.name}</Title>
        <Badge size="xl">map</Badge>
      </Flex>
      <Divider />
      <List>
        <ListItem>
          <span>Initial block</span>
          <span>{module.initialBlock.toString()}</span>
        </ListItem>
        <ListItem>
          <span>Output type</span>
          <span>{module.kind.value.outputType.replace(/^proto:/, "")}</span>
        </ListItem>
      </List>
      <Flex justifyContent="end" className="space-x-2 mt-10">
        <Button size="xl" variant="primary" onClick={select}>
          Start streaming
        </Button>
      </Flex>
    </Card>
  );
}
