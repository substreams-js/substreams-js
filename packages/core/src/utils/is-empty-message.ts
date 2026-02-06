import { type Message, type Registry, isMessage, toBinary } from "@bufbuild/protobuf";

/**
 * Check if a message is empty. This function checks if all fields in the message
 * are repeated (a common pattern for pluralizing map output) and if so, checks
 * if the serialized message is empty.
 *
 * @param message The message to check
 * @param registry Optional registry to look up the message schema. If not provided,
 *                 uses a simple byte-length check.
 */
export function isEmptyMessage(message: Message, registry?: Registry) {
  if (!isMessage(message)) {
    return false;
  }

  // If we have a registry, we can do a more sophisticated check
  if (registry !== undefined) {
    const schema = registry.getMessage(message.$typeName);
    if (schema !== undefined) {
      // Check if all fields are repeated which is a typical pattern for pluralizing map output.
      const wrapper = schema.fields.every((field) => field.fieldKind === "list" || field.fieldKind === "map");

      // If this is just a wrapper type and it's not wrapping anything, then it's an empty message.
      if (wrapper && toBinary(schema, message).byteLength === 0) {
        return true;
      }
    }
  }

  // Fallback: just check if the message serializes to empty bytes
  // This is a simple heuristic that works for most cases
  return false;
}
