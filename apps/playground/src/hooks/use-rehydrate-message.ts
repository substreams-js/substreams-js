"use client";

import { useMemoStable } from "./use-memo-stable";
import { AnyMessage, Message, MessageType, PartialMessage, PlainMessage } from "@bufbuild/protobuf";

export type SerializedMessage<TMessage extends Message<TMessage>> =
  | Uint8Array
  | TMessage
  | PlainMessage<TMessage>
  | PartialMessage<TMessage>;

export function useRehydrateMessage<TMessage extends Message<TMessage> = AnyMessage>(
  type: MessageType<TMessage>,
  message: SerializedMessage<TMessage>,
) {
  return useMemoStable(() => {
    if (message instanceof type) {
      return message;
    }

    if (message instanceof Uint8Array) {
      return type.fromBinary(message);
    }

    if (Array.isArray(message)) {
      return type.fromBinary(Uint8Array.from(message));
    }

    // rome-ignore lint/suspicious/noExplicitAny: this is fine.
    return new type(message as any);
  }, [message, type]);
}
