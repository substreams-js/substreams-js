import { ModuleProgressBars } from "./module-progress-bars";
import { StreamStats } from "./stream-stats";
import { Registry } from "@/hooks/use-message-registry";
import { useSubstream } from "@/hooks/use-substream";
import { useThrottledStore } from "@/hooks/use-throttled-store";
import { transport } from "@/lib/transport";
import { Any } from "@bufbuild/protobuf";
import { Progress, StatefulResponse } from "@substreams/core";
import { Request } from "@substreams/core/proto";
import { JsonViewer } from "@textea/json-viewer";
import { create } from "zustand";

export type Output = {
  block?: bigint | undefined;
  timestamp?: Date | undefined;
  message: Any;
};

export type StreamIdle = {
  status: "idle";
};

export type StreamStreaming = {
  status: "streaming";
  progress: Progress;
  messages: Output[];
  block?: bigint | undefined;
  cursor?: string | undefined;
  timestamp?: Date | undefined;
};

export type StreamFinished = {
  status: "finished";
  progress?: Progress;
  messages?: Output[];
  block?: bigint | undefined;
  cursor?: string | undefined;
  timestamp?: Date | undefined;
};

export type StreamError = {
  status: "error";
  error: unknown;
  progress?: Progress;
  messages?: Output[];
  block?: bigint | undefined;
  cursor?: string | undefined;
  timestamp?: Date | undefined;
};

export type Stream = StreamIdle | StreamStreaming | StreamFinished | StreamError;

export function StreamRunner({ request, registry }: { request: Request; registry: Registry }) {
  const [store, state] = useThrottledStore(() => create<Stream>(() => ({ status: "idle" })));

  useSubstream({
    request,
    transport,
    handlers: {
      onResponse: ({ response, progress }: StatefulResponse) => {
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

          // rome-ignore lint/suspicious/noExplicitAny: <explanation>
          const messages: Output[] = (previous as any).messages ?? [];
          if (message !== undefined) {
            messages.push(message);
          }

          const next: Stream & { status: "streaming" } = {
            ...previous,
            progress,
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
    },
  });

  if (state.status !== "streaming") {
    return null;
  }

  const messages = state.messages.map((message) =>
    message.message.toJson({ typeRegistry: registry, emitDefaultValues: true }),
  );

  return (
    <>
      <StreamStats state={state} />
      <ModuleProgressBars progress={state.progress} />
      <JsonViewer rootName="data" theme="auto" value={messages} highlightUpdates={true} />
    </>
  );
}
