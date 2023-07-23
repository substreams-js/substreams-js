import { MutableRefObject, useRef } from "react";

export function useLatest<TValue>(value: TValue): Readonly<MutableRefObject<TValue>> {
  const ref = useRef(value);
  ref.current = value;

  return ref;
}
