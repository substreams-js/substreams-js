import type { AnyMessage } from "@bufbuild/protobuf";
import md5 from "md5";
import { useMemo } from "react";

export function useMessageKey(message?: AnyMessage) {
  return useMemo(() => (message === undefined ? undefined : md5(message.toBinary())), [message]);
}
