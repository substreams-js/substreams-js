import type { DescMessage, Message } from "@bufbuild/protobuf";
import { useMemo } from "react";
import { type MaybeSerializedMessage, type SerializedMessage, deserializeMessage } from "../utils/message-serde.js";

export function useRehydrateMessage<T extends DescMessage>(
  schema: T,
  message: MaybeSerializedMessage<T["typeName"]>,
): Message<T["typeName"]> {
  const rehydrated = useMemo(() => {
    // Check if it's already a message (has $typeName property)
    if (typeof message === "object" && message !== null && "$typeName" in message) {
      return message as Message<T["typeName"]>;
    }

    return deserializeMessage(schema, message as SerializedMessage);
  }, [message, schema]);

  return rehydrated;
}
