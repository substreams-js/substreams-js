import type { AnyMessage } from "@bufbuild/protobuf";

export function isEmptyMessage(message: AnyMessage) {
  // Check if all fields are repeated which is a typical pattern for pluralizing map output.
  const fields = message.getType().fields.list();
  const wrapper = fields.every((field) => field.repeated);

  // If this is just a wrapper type and it's not wrapping anything, then it's an empty message.
  if (wrapper && message.toBinary().byteLength === 0) {
    return true;
  }

  return false;
}
