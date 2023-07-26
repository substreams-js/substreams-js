import type { IMessageTypeRegistry } from "@bufbuild/protobuf";
import { createRegistry } from "@substreams/core";
import type { Package } from "@substreams/core/proto";
import { useMemo } from "react";

export type Registry = IMessageTypeRegistry;

export function useMessageRegistry(substream: Package) {
  const registry = useMemo(() => createRegistry(substream), [substream]);

  return registry;
}
