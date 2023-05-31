import type { IMessageTypeRegistry } from "@bufbuild/protobuf";
import { createRegistry } from "@substreams/core";
import type { Package } from "@substreams/core/proto";
import { useRef } from "react";
import { useEffect } from "react";

export function useMessageTypeRegistry(substream: Package) {
  const ref = useRef<IMessageTypeRegistry>();
  if (ref.current === undefined) {
    ref.current = createRegistry(substream);
  }

  useEffect(() => {
    ref.current = createRegistry(substream);
  }, [substream]);

  return ref.current;
}
