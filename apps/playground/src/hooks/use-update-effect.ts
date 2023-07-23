"use client";

import { useFirstMount } from "./use-first-mount";
import { DependencyList, useEffect } from "react";

export function useUpdateEffect(effect: () => void, deps?: DependencyList) {
  const first = useFirstMount();

  // rome-ignore lint/nursery/useExhaustiveDependencies: this is fine.
  useEffect(() => {
    if (!first) {
      return effect();
    }
  }, deps);
}
