import { type IMessageTypeRegistry, createDescriptorSet, createRegistryFromDescriptors } from "@bufbuild/protobuf";
import type { Package } from "../proto.js";

export function createRegistry(substream: Package): IMessageTypeRegistry {
  let reordered = [];
    for (let i = 0; i < substream.protoFiles.length; i++) {
        let file = substream.protoFiles[i];
        if (file.name === "google/protobuf/any.proto") {
            reordered.push(file);
            break;
        }
    }
    for (let i = 0; i < substream.protoFiles.length; i++) {
        let file = substream.protoFiles[i];
        if (file.name === "google/protobuf/any.proto") {
            continue;
        }
        reordered.push(file);
    }

  return createRegistryFromDescriptors(createDescriptorSet(substream.protoFiles), true);
}
