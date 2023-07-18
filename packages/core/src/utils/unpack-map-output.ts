import type { Response } from "../proto.js";
import type { IMessageTypeRegistry } from "@bufbuild/protobuf";

export function unpackMapOutput(response: Response, registry: IMessageTypeRegistry) {
  if (response.message.case === "blockScopedData") {
    const output = response.message.value.output?.mapOutput;

    if (output !== undefined) {
      const message = output.unpack(registry);
      if (message === undefined) {
        throw new Error(`Failed to unpack output of type ${output.typeUrl}`);
      }

      return message;
    }
  }

  return undefined;
}
