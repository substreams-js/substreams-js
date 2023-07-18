import type { Package } from "../proto.js";
import { type IMessageTypeRegistry, createDescriptorSet, createRegistryFromDescriptors } from "@bufbuild/protobuf";

export function createRegistry(substream: Package): IMessageTypeRegistry {
  return createRegistryFromDescriptors(createDescriptorSet(substream.protoFiles), true);
}
