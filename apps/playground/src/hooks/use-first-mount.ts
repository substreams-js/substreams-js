import { useRef } from "react";

export function useFirstMount(): boolean {
  const ref = useRef(true);
  if (ref.current) {
    ref.current = false;

    return true;
  }

  return ref.current;
}
