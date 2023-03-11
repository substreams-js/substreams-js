import { createConnectTransport } from "@bufbuild/connect-web";
import { Substream, ModuleProgress, Clock } from "@enzymefinance/substreams";
import { useEffect, useState } from "react";

const SUBSTREAM = "/subtivity-ethereum-v0.2.0.spkg";
const MODULE = "map_block_stats";
const START = undefined;
const STOP = "+100000";
const LIMIT = 20;
const PRODUCTION = false;

async function fetchSubstream(url: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  const array = await blob.arrayBuffer();

  return new Substream(new Uint8Array(array));
}

interface State {
  clock: Clock | undefined;
  progress: ModuleProgress[];
  count: bigint | undefined;
  cursor: string | undefined;
  block: bigint | undefined;
  session: string | undefined;
  messages: string[];
}

export function App() {
  const [state, setState] = useState<State>({
    progress: [],
    clock: undefined,
    count: undefined,
    block: undefined,
    cursor: undefined,
    session: undefined,
    messages: [],
  });

  useEffect(() => {
    void (async () => {
      const substream = await fetchSubstream(SUBSTREAM);
      const stream = substream.streamBlocks({
        request: substream.createProxyRequest(MODULE, {
          stopBlockNum: STOP,
          startBlockNum: START,
          productionMode: PRODUCTION,
        }),
        transport: createConnectTransport({
          baseUrl: "http://localhost:3030",
          useBinaryFormat: true,
          jsonOptions: {
            typeRegistry: substream.registry,
          },
        }),
      });

      for await (const response of stream) {
        const message = response.message;

        switch (message.case) {
          case "data": {
            setState((prev) => {
              const state = { ...prev };
              const messages = message.value.outputs
                .filter((item) => {
                  if (item.name === MODULE && item.data.case === "mapOutput") {
                    if (item.data.value.value.byteLength > 0) {
                      return true;
                    }
                  }

                  return false;
                })
                .map((item) => {
                  return item.toJsonString({
                    typeRegistry: {
                      findMessage: (type) => {
                        // TODO: This should not be necessary and it appears to only be needed in production mode.
                        const trimmed = type.replace(/^proto:/, "");
                        return substream.registry.findMessage(trimmed);
                      },
                    },
                  });
                });

              state.count = (state.count ?? 0n) + BigInt(messages.length);
              state.clock = message.value.clock;
              state.cursor = message.value.cursor;
              state.messages =
                messages.length > 0
                  ? prev.messages.concat(...messages).slice(-LIMIT)
                  : prev.messages;

              return state;
            });

            break;
          }
          case "progress": {
            setState((prev) => {
              const state = { ...prev };
              state.progress = message.value.modules;

              return state;
            });

            break;
          }

          case "session": {
            setState((prev) => {
              const state = { ...prev };
              state.session = message.value.traceId;

              return state;
            });

            break;
          }
        }
      }
    })();
  }, [setState]);

  return (
    <div>
      <div>Browser substreams, weeeeeeeeeh!</div>
      <br />
      <div>Session: {state.session ?? ""}</div>
      <div>Counter: {state.count?.toString() ?? ""}</div>
      <div>Block: {state.clock?.number.toString() ?? ""}</div>
      <div>Time: {state.clock?.timestamp?.toDate().toString()}</div>
      <div>Cursor: {state.cursor ?? ""}</div>
      <div>Output:</div>
      <ul>
        {state.messages.map((item, index) => (
          <li key={index}>
            <pre>{item}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
