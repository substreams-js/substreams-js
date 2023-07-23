"use client";

import { useUpdateEffect } from "./use-update-effect";
import { DependencyList, useRef } from "react";

export function useMemoStable<TValue>(create: () => TValue, deps?: DependencyList) {
  const ref = useRef<TValue>();
  if (ref.current === undefined) {
    ref.current = create();
  }

  useUpdateEffect(() => {
    ref.current = create();
  }, deps);

  return ref.current;
}
