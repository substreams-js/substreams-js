import { createConnectTransport } from "@bufbuild/connect-web";
import { Substream } from "@enzymefinance/substreams";
import { useEffect, useState } from "react";

const SUBSTREAM = "/subtivity-ethereum-v0.1.0.spkg";
const MODULE = "db_out";
const STOP = "+100";

async function fetchSubstream(url: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  const array = await blob.arrayBuffer();

  return new Substream(new Uint8Array(array));
}

export function App() {
  const [messages, setMessages] = useState<unknown[]>([]);

  useEffect(() => {
    void (async () => {
      const substream = await fetchSubstream(SUBSTREAM);
      const stream = substream.streamBlocks({
        request: substream.createProxyRequest(MODULE, {
          stopBlockNum: STOP,
        }),
        transport: createConnectTransport({
          // Local proxy for the substreams proxy.
          baseUrl: "/substreams",
          jsonOptions: {
            typeRegistry: substream.registry,
          },
        }),
      });

      for await (const response of stream) {
        setMessages((messages) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-return
          return [
            ...messages,
            response.toJson({ typeRegistry: substream.registry }),
          ];
        });
      }
    })();
  }, [setMessages]);

  return (
    <div>
      <div>Browser substreams, weeeeeeeeeh!</div>
      <ul>
        {messages.map((item, index) => (
          <li key={index}>
            <pre>{JSON.stringify(item)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
