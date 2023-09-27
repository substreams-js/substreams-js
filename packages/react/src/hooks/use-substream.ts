"use client";

import { Code, ConnectError, type Transport } from "@connectrpc/connect";
import { streamBlocks } from "@substreams/core";
import { Request, Response } from "@substreams/core/proto";
import { useEffect, useRef } from "react";

export interface UseSubstreamOptions {
  /**
   * The `sf.substreams.rpc.v2.Request` request to send.
   */
  request: Request;
  /**
   * The transport to use.
   */
  transport: Transport;
  handlers: {
    /**
     * Called when an error occurs.
     */
    onError?: (cause: unknown) => void;
    /**
     * Called when a new response is received.
     */
    onResponse?: (response: Response) => void;
    /**
     * Called when the stream is aborted.
     */
    onAbort?: (cause: ConnectError) => void;
    /**
     * Called when the stream is closed after it's finished.
     */
    onFinish?: () => void;
    /**
     * Called when the stream is closed after it's finished, failed or aborted.
     */
    onClose?: () => void;
  };
}

export function useSubstream({ request, transport, handlers }: UseSubstreamOptions) {
  const abortRef = useRef<(reason?: any) => void>(() => {});
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const controller = new AbortController();
    const stream = streamBlocks(transport, request, {
      signal: controller.signal,
    });

    abortRef.current = (reason) => controller.abort(reason);

    (async () => {
      try {
        for await (const response of stream) {
          handlersRef.current.onResponse?.(response);
        }

        handlersRef.current.onFinish?.();
      } catch (error) {
        if ((error as any)?.name === "ConnectError") {
          const cerror = error as ConnectError;
          if (cerror.code === Code.Aborted) {
            handlersRef.current.onAbort?.(cerror);
            return;
          }
        }

        handlersRef.current?.onError?.(error);
      }

      handlersRef.current.onClose?.();
    })();

    return abortRef.current;
  }, [request, transport]);

  return () => abortRef.current();
}
