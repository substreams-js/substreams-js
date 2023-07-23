import { useLatest } from "./use-latest";
import { useUnmount } from "./use-unmount";
import { Code, ConnectError, Transport } from "@bufbuild/connect";
import { StatefulResponse, streamBlocks } from "@substreams/core";
import { Request } from "@substreams/core/proto";
import { useState } from "react";

export type UseSubstreamIterable = {
  // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  abort: (reason?: any) => void;
  stream: AsyncIterable<StatefulResponse>;
};

export function useSubstreamIterable({
  request,
  transport,
}: {
  request: Request;
  transport: Transport;
}): UseSubstreamIterable {
  // Create the stream and handle output.
  const [stream] = useState(() => {
    const controller = new AbortController();
    const stream = streamBlocks(transport, request, {
      signal: controller.signal,
    });

    return {
      abort: (reason?: string) => {
        if (!controller.signal.aborted) {
          controller.abort(reason);
        }
      },
      stream,
    };
  });

  // Abort the stream when the component unmounts.
  useUnmount(() => stream.abort("Unmounted"));

  return stream;
}

export type UseSubstream = () => void;

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
}): UseSubstream {
  const stream = useSubstreamIterable({ request, transport });
  const handlers = useLatest(handlerz);

  useState(() => {
    (async () => {
      try {
        for await (const response of stream.stream) {
          handlers.current.onResponse?.(response);
        }

        handlers.current.onFinished?.();
      } catch (error) {
        // rome-ignore lint/suspicious/noExplicitAny: <explanation>
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
  });

  return stream.abort;
}
