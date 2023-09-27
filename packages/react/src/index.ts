export {
  useSubstream,
  type UseSubstreamOptions,
} from "./hooks/use-substream.js";
export { useRehydrateMessage } from "./hooks/use-rehydrate-message.js";
export {
  type SerializedMessage,
  type MaybeSerializedMessage,
  serializeMessage,
  deserializeMessage,
} from "./utils/message-serde.js";
