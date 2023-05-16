import { useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";

export function useKey(...values: unknown[]) {
  const ref = useRef<string>();
  if (ref.current === undefined) {
    ref.current = uuid();
  }

  useEffect(() => {
    ref.current = uuid();
  }, values);

  return ref.current;
}
