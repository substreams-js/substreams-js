import type { Registry } from "@bufbuild/protobuf";
import { anyUnpack } from "@bufbuild/protobuf/wkt";
import type { Response } from "../proto.js";

export function unpackMapOutput(response: Response, registry: Registry) {
  if (response.message.case === "blockScopedData") {
    const output = response.message.value.output?.mapOutput;

    if (output !== undefined) {
      const message = anyUnpack(output, registry);
      if (message === undefined) {
        throw new Error(`Failed to unpack output of type ${output.typeUrl}`);
      }

      return message;
    }
  }

  return undefined;
}
