import { Flex, Title, Card, Badge, List, ListItem, Divider } from "@tremor/react";
import type { StoreModule } from "@fubhy/substreams";

export function StoreModuleCard({ module }: { module: StoreModule }) {
  return (
    <Card decoration="top" decorationColor="red">
      <Flex justifyContent="between" alignItems="center">
        <Title as="h2">{module.name}</Title>
        <Badge size="xl" className="bg-lime-200">
          store
        </Badge>
      </Flex>
      <Divider />
      <List>
        <ListItem>
          <span>Update policy</span>
          <span>{module.kind.value.updatePolicy}</span>
        </ListItem>
        <ListItem>
          <span>Value type</span>
          <span>{module.kind.value.valueType.replace(/^proto:/, "")}</span>
        </ListItem>
      </List>
    </Card>
  );
}
