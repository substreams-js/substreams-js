import { type DescMessage, type Message, fromBinary, toBinary } from "@bufbuild/protobuf";

export type SerializedMessage<TName extends string = string> = string & {
  __type: TName;
};

export type MaybeSerializedMessage<TName extends string = string> = Message<TName> | SerializedMessage<TName>;

export function serializeMessage<TName extends string>(
  schema: DescMessage,
  message: Message<TName>,
): SerializedMessage<TName> {
  const binary = toBinary(schema, message);
  return btoa(String.fromCharCode(...binary)) as SerializedMessage<TName>;
}

export function deserializeMessage<T extends DescMessage>(schema: T, value: SerializedMessage): Message<T["typeName"]> {
  const binary = Uint8Array.from(atob(value), (c) => c.charCodeAt(0));
  return fromBinary(schema, binary);
}
