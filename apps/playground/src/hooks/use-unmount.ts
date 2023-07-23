"use client";

import { useEffect, useRef } from "react";

export function useUnmount(fn?: () => void) {
  const ref = useRef(fn);
  ref.current = fn;

  useEffect(() => () => ref.current?.(), []);
}
