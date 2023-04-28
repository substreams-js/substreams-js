import { createConnectTransport } from "@bufbuild/connect-web";
import { createCallbackClient } from "@bufbuild/connect";
import type { AnyMessage, IMessageTypeRegistry } from "@bufbuild/protobuf";
import {
  ProxyService,
  createRegistry,
  createAuthInterceptor,
  unwrapResponse,
  type Package,
  type Response,
  type CreateRequestOptions,
  type ModulesProgress,
  type BlockScopedData,
  type MapModule,
} from "@fubhy/substreams";
import { createProxyRequest } from "@fubhy/substreams-proxy/client";
import { useCallback, useEffect, useRef, useState } from "react";

export type SubstreamContext = {
  substream: Package;
  module: MapModule;
  registry: IMessageTypeRegistry;
};

export type UseSubstreamOptions = {
  substream: Package;
  module: MapModule;
  token: string;
  endpoint: string;
  handlers: {
    onProgress?: (progress: ModulesProgress, ctx: SubstreamContext) => void;
    onError?: (error: Error, ctx: SubstreamContext) => void;
    onClose?: (ctx: SubstreamContext) => void;
    onData?: (data: BlockScopedData, messages: AnyMessage[], ctx: SubstreamContext) => void;
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
    (opts: CreateRequestOptions): (() => void) => {
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
        interceptors: [createAuthInterceptor(options.token)],
        useBinaryFormat: true,
        jsonOptions: {
          typeRegistry: registry,
        },
      });

      const connect = createCallbackClient(ProxyService, transport);
      const request = createProxyRequest(substream, module, opts);

      const context = {
        registry,
        substream,
        module,
      } as const;

      function handleResponse(response: Response) {
        const unwrapped = unwrapResponse(response, registry);

        switch (unwrapped.type) {
          case "progress": {
            handlers.current.onProgress?.(unwrapped.data, context);
            break;
          }
          case "data": {
            handlers.current.onData?.(unwrapped.data, unwrapped.messages, context);
            break;
          }
        }
      }

      function handleClose(error?: Error) {
        if (error) {
          handlers.current.onError?.(error, context);
        } else {
          handlers.current.onClose?.(context);
        }
      }

      connect.proxy(request, handleResponse, handleClose, {
        signal,
      });

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
