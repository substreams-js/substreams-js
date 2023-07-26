import { throttle } from "@/lib/throttle";
import { useEffect, useState } from "react";
import type { StoreApi, UseBoundStore } from "zustand";

type CreateStore<TValue> = (() => UseBoundStore<StoreApi<TValue>>) | UseBoundStore<StoreApi<TValue>>;

export function useThrottledStore<TValue>(create: CreateStore<TValue>, delay = 100) {
  const [store] = useState<UseBoundStore<StoreApi<TValue>>>(create);
  const [state, setState] = useState<TValue>(() => store.getState());
  const [wrapper] = useState(() => throttle(setState, delay));

  useEffect(() => {
    const unsubscribe = store.subscribe(wrapper);

    return () => {
      unsubscribe();
      wrapper.cancel();
    };
  }, [store, wrapper]);

  return [store, state] as const;
}
