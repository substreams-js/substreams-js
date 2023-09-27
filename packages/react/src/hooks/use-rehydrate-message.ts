import { Message, type MessageType } from "@bufbuild/protobuf";
import { useMemo } from "react";
import { type MaybeSerializedMessage, type SerializedMessage, deserializeMessage } from "../utils/message-serde.js";

export function useRehydrateMessage<TMessage extends Message<TMessage>>(
  type: MessageType<TMessage>,
  message: MaybeSerializedMessage<TMessage>,
) {
  const rehydrated = useMemo(() => {
    if (message instanceof type) {
      return message;
    }

    return deserializeMessage(type, message as SerializedMessage<TMessage>);
  }, [message, type]);

  return rehydrated;
}
