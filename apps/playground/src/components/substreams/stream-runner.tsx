import { StreamStats } from "@/components/substreams/stream-stats";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Registry } from "@/hooks/use-message-registry";
import { useThrottledStore } from "@/hooks/use-throttled-store";
import { transport } from "@/lib/transport";
import { Any } from "@bufbuild/protobuf";
import { Request } from "@substreams/core/proto";
import { useSubstream } from "@substreams/react";
import { JsonViewer } from "@textea/json-viewer";
import { create } from "zustand";

export type Output = {
  block?: bigint | undefined;
  timestamp?: Date | undefined;
  message: Any;
};

export type Stream = {
  status: string;
  error?: unknown;
  messages?: Output[];
  block?: bigint | undefined;
  cursor?: string | undefined;
  timestamp?: Date | undefined;
};

export function StreamRunner({
  request,
  registry,
  reset,
}: { request: Request; registry: Registry; reset: () => void }) {
  const [store, state] = useThrottledStore(() => create<Stream>(() => ({ status: "idle" })));
  const cancel = useSubstream({
    request,
    transport,
    handlers: {
      onResponse: (response) => {
        store.setState((previous) => {
          // const message = extractMessage(response.response, registry);
          let message: Output | undefined = undefined;
          if (response.message.case === "blockScopedData") {
            const msg = response.message.value;
            const output = msg.output?.mapOutput;

            if (output !== undefined && output.value.byteLength > 0) {
              message = {
                block: msg.clock?.number,
                timestamp: msg.clock?.timestamp?.toDate(),
                message: output,
              };
            }
          }

          const messages: Output[] = (previous as any).messages ?? [];
          if (message !== undefined) {
            messages.push(message);
          }

          const next: Stream & { status: "streaming" } = {
            ...previous,
            status: "streaming",
            messages: messages.slice(-10),
          };

          if (response.message.case === "blockScopedData") {
            const message = response.message.value;
            next.block = message.clock?.number;
            next.timestamp = message.clock?.timestamp?.toDate();
            next.cursor = message.cursor;
          }

          return next;
        });
      },
      onError: (cause) => {
        store.setState((previous) => ({
          ...previous,
          status: "error",
          error: cause,
        }));
      },
      onFinish: () => {
        store.setState((previous) => ({
          ...previous,
          status: "finished",
        }));
      },
      onAbort: () => {
        store.setState((previous) => ({
          ...previous,
          status: "aborted",
        }));
      },
    },
  });

  const messages = state.messages?.map((message) =>
    message.message.toJson({ typeRegistry: registry, emitDefaultValues: true }),
  );

  const stopped = state.status === "finished" || state.status === "aborted" || state.status === "error";

  return (
    <>
      <Card>
        <CardContent className="p-4 space-x-4">
          <Button disabled={stopped} onClick={() => cancel()}>
            Stop
          </Button>
          <Button disabled={!stopped} onClick={() => reset()}>
            Reset
          </Button>
        </CardContent>
      </Card>
      <StreamStats state={state} />
      {messages ? (
        <JsonViewer
          rootName="data"
          theme="auto"
          value={messages}
          highlightUpdates={true}
          maxDisplayLength={3}
          defaultInspectDepth={3}
        />
      ) : null}
    </>
  );
}
