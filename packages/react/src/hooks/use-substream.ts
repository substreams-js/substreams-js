"use client";

import { Code, ConnectError, type Transport } from "@bufbuild/connect";
import { type StatefulResponse, streamBlocks } from "@substreams/core";
import { Request } from "@substreams/core/proto";
import { useEffect, useRef } from "react";

export type SubstreamIterable = AsyncIterable<StatefulResponse> & {
  abort: (reason?: any) => void;
};

function makeSubstreamIterable(request: Request, transport: Transport): SubstreamIterable {
  const controller = new AbortController();
  const stream = streamBlocks(transport, request, {
    signal: controller.signal,
  }) as SubstreamIterable;

  stream.abort = (reason?: string) => {
    if (!controller.signal.aborted) {
      controller.abort(reason);
    }
  };

  return stream;
}

export function useSubstreamIterable({
  request,
  transport,
}: {
  request: Request;
  transport: Transport;
}): SubstreamIterable {
  const ref = useRef<SubstreamIterable>();
  if (ref.current === undefined) {
    ref.current = makeSubstreamIterable(request, transport);
  }

  useEffect(() => {
    if (ref.current !== undefined) {
      ref.current.abort();
    }

    ref.current = makeSubstreamIterable(request, transport);
    return ref.current.abort;
  }, [request, transport]);

  return ref.current as SubstreamIterable;
}

export function useSubstream({
  request,
  transport,
  handlers: handlerz,
}: {
  request: Request;
  transport: Transport;
  handlers: {
    onError?: (cause: unknown) => void;
    onResponse?: (response: StatefulResponse) => void;
    onAborted?: (cause: ConnectError) => void;
    onFinished?: () => void;
  };
}): () => void {
  const stream = useSubstreamIterable({ request, transport });
  const handlers = useRef(handlerz);
  handlers.current = handlerz;

  useEffect(() => {
    (async () => {
      try {
        for await (const response of stream) {
          handlers.current.onResponse?.(response);
        }

        handlers.current.onFinished?.();
      } catch (error) {
        if ((error as any)?.name === "ConnectError") {
          const cerror = error as ConnectError;
          if (cerror.code === Code.Aborted) {
            handlers.current.onAborted?.(cerror);
            return;
          }
        }

        handlers.current?.onError?.(error);
      }
    })();
  }, [stream]);

  return stream.abort;
}
