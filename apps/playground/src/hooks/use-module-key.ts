"use client";

import { useMessageKey } from "./use-message-key";
import { Package } from "@substreams/core/proto";

export function useModuleKey(pkg: Package, module?: string) {
  const key = useMessageKey(pkg);
  return module === undefined ? key : `${key}:${module}`;
}
