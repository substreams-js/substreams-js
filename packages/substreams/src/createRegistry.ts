import { createDescriptorSet, createRegistryFromDescriptors, type IMessageTypeRegistry } from "@bufbuild/protobuf";
import type { Package } from "./generated/sf/substreams/v1/package_pb.js";

export function createRegistry(substream: Package): IMessageTypeRegistry {
  return createRegistryFromDescriptors(createDescriptorSet(substream.protoFiles));
}
