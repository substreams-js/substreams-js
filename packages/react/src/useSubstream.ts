import { createConnectTransport } from "@bufbuild/connect-web";
import type { IMessageTypeRegistry } from "@bufbuild/protobuf";
import type { StatefulResponse } from "@substreams/core";
import { type CreateRequestOptions, type MapModule, createAuthInterceptor, createRegistry } from "@substreams/core";
import type { Package } from "@substreams/core/proto";
import { createRequest, streamBlocks } from "@substreams/proxy/client";
import { useCallback, useEffect, useRef, useState } from "react";

export type SubstreamContext = {
  options: UseSubstreamStartOptions;
  substream: Package;
  module: MapModule;
  registry: IMessageTypeRegistry;
};

export type UseSubstreamStartOptions = Omit<CreateRequestOptions, "substreamPackage" | "outputModule">;
export type UseSubstreamOptions = {
  substream: Package;
  module: MapModule;
  endpoint: string;
  token?: string | undefined;
  handlers: {
    onStart?: (ctx: SubstreamContext) => void;
    onFinished?: (ctx: SubstreamContext) => void;
    onError?: (error: Error, ctx: SubstreamContext) => void;
    onResponse?: (response: StatefulResponse, ctx: SubstreamContext) => void;
  };
};

export function useSubstream(options: UseSubstreamOptions) {
  // Handlers are allowed to change during the lifetime of the hook. But because we use
  // them in the `start` function, we need to keep a reference to them that doesn't
  // change, so we always call the latest handlers.
  const handlers = useRef(options.handlers);

  // Set up immutable references for the given hook options. We don't want to deal with
  // re-rendering the hook when the options change, this helps greatly.
  const [registry] = useState(() => createRegistry(options.substream));
  const immutable = useRef<{
    substream: Package;
    module: MapModule;
    mounted: boolean;
    registry: IMessageTypeRegistry;
  }>({
    substream: options.substream,
    module: options.module,
    mounted: true,
    registry,
  });

  useEffect(() => {
    // Update the handlers reference.
    handlers.current = options.handlers;

    if (options.substream !== immutable.current.substream) {
      console.warn("Cannot change the substream");
    }

    if (options.module !== immutable.current.module) {
      console.warn("Cannot change the module");
    }
  }, [options.substream, options.module, options.handlers]);

  const controller = useRef<AbortController | undefined>(undefined);
  useEffect(() => () => {
    // Abort the pending stream on unmount (if any).
    if (controller.current !== undefined) {
      if (!controller.current.signal.aborted) {
        controller.current.abort();
      }
    }
  });

  const start = useCallback(
    (opts: UseSubstreamStartOptions): (() => void) => {
      const {
        current: { registry, substream, module },
      } = immutable;

      // Abort the pending stream (if any).
      if (controller.current !== undefined) {
        if (!controller.current.signal.aborted) {
          controller.current.abort();
        }
      }

      // Assign a new controller to the reference.
      controller.current = new AbortController();
      const { signal, abort } = controller.current;

      const transport = createConnectTransport({
        baseUrl: options.endpoint,
        interceptors: options.token ? [createAuthInterceptor(options.token)] : [],
        useBinaryFormat: true,
        jsonOptions: {
          typeRegistry: registry,
        },
      });

      const request = createRequest({
        substreamPackage: substream,
        outputModule: module,
        ...opts,
      });

      const context = {
        options: opts,
        registry,
        substream,
        module,
      } as const;

      (async () => {
        try {
          for await (const item of streamBlocks(transport, request, { signal })) {
            handlers.current.onResponse?.(item, context);
          }

          handlers.current.onFinished?.(context);
        } catch (error) {
          handlers.current.onError?.(error as Error, context);
        }
      })();

      handlers.current.onStart?.(context);

      return () => abort();
    },
    [options.token, options.endpoint],
  );

  return {
    registry: immutable.current.registry,
    substream: immutable.current.substream,
    module: immutable.current.module,
    abort: controller.current?.abort ?? (() => {}),
    start,
  } as const;
}
