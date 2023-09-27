import { type IMessageTypeRegistry, createDescriptorSet, createRegistryFromDescriptors } from "@bufbuild/protobuf";
import type { Package } from "../proto.js";

export function createRegistry(substream: Package): IMessageTypeRegistry {
  return createRegistryFromDescriptors(createDescriptorSet(substream.protoFiles), true);
}
