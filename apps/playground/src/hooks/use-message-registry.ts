"use client";

import { useMemoStable } from "./use-memo-stable";
import { createRegistry } from "@substreams/core";
import type { Package } from "@substreams/core/proto";

export function useMessageRegistry(substream: Package) {
  return useMemoStable(() => createRegistry(substream), [substream]);
}
