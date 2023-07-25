"use client";

import { useMemoStable } from "@/hooks/use-memo-stable";
import { IMessageTypeRegistry } from "@bufbuild/protobuf";
import { createRegistry } from "@substreams/core";
import type { Package } from "@substreams/core/proto";

export type Registry = IMessageTypeRegistry;

export function useMessageRegistry(substream: Package) {
  return useMemoStable(() => createRegistry(substream), [substream]);
}
