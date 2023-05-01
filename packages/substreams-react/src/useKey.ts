import { v4 as uuid } from "uuid";
import { useEffect, useRef } from "react";

export function useKey(...values: unknown[]) {
  const ref = useRef<string>();
  if (ref.current === undefined) {
    ref.current = values.length > 0 ? uuid() : undefined;
  }

  // rome-ignore lint/nursery/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    ref.current = values.length > 0 ? uuid() : undefined;
  }, values);

  return ref.current;
}
