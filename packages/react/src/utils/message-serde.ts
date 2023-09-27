import { Message, type MessageType, protoBase64 } from "@bufbuild/protobuf";

export type SerializedMessage<TMessage extends Message<TMessage>> = string & {
  __type: TMessage;
};

export type MaybeSerializedMessage<TMessage extends Message<TMessage>> = TMessage | SerializedMessage<TMessage>;

export function serializeMessage<TMessage extends Message<TMessage>>(message: TMessage) {
  return protoBase64.enc(message.toBinary()) as SerializedMessage<TMessage>;
}

export function deserializeMessage<TMessage extends Message<TMessage>>(
  type: MessageType<TMessage>,
  value: SerializedMessage<TMessage>,
) {
  return type.fromBinary(protoBase64.dec(value));
}
