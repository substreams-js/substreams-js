import type { Package } from "../proto/sf/substreams/v1/package_pb.js";
import {
  type IMessageTypeRegistry,
  createDescriptorSet,
  createRegistry as createMessageRegistry,
  createRegistryFromDescriptors,
} from "@bufbuild/protobuf";

// TODO: Doing this manually shouldn't be necessary. The descriptor set imho should include the full range of protos.
import * as DatabaseSink from "../sinks/database.js";
import * as EntitySink from "../sinks/entity.js";
import * as KeyValueSink from "../sinks/kv.js";

export function createRegistry(substream: Package): IMessageTypeRegistry {
  const packageRegistry = createRegistryFromDescriptors(createDescriptorSet(substream.protoFiles), true);
  const sinkRegistry = createMessageRegistry(
    DatabaseSink.DatabaseChanges,
    DatabaseSink.TableChange,
    DatabaseSink.Field,
    EntitySink.EntityChange,
    EntitySink.EntityChanges,
    EntitySink.Field,
    EntitySink.Value,
    EntitySink.Array,
    KeyValueSink.KVOperations,
    KeyValueSink.KVOperation,
  );

  return {
    findMessage: (typeName) => {
      return packageRegistry.findMessage(typeName) ?? sinkRegistry.findMessage(typeName);
    },
  };
}
