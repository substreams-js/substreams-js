"use client";

import { useMemoStable } from "@/hooks/use-memo-stable";
import { MaybeSerializedMessage, SerializedMessage, deserializeMessage } from "@/lib/utils/message-serde";
import { Message, MessageType } from "@bufbuild/protobuf";

export type { SerializedMessage, MaybeSerializedMessage } from "@/lib/utils/message-serde";

export function useRehydrateMessage<TMessage extends Message<TMessage>>(
  type: MessageType<TMessage>,
  message: MaybeSerializedMessage<TMessage>,
) {
  return useMemoStable(() => {
    if (message instanceof type) {
      return message;
    }

    return deserializeMessage(type, message as SerializedMessage<TMessage>);
  }, [message, type]);
}
