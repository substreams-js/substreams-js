import { createGrpcTransport } from "@bufbuild/connect-node";
import { Substream } from "@enzymefinance/substreams";

if (process.env.SUBSTREAMS_API_TOKEN === undefined) {
  throw new Error('Missing "SUBSTREAMS_API_TOKEN" environment variable');
}

const ENDPOINT = "https://mainnet.eth.streamingfast.io";
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const BEARER = process.env.SUBSTREAMS_API_TOKEN;
const SUBSTREAM =
  "https://github.com/pinax-network/subtivity-substreams/releases/download/v0.2.0/subtivity-ethereum-v0.2.0.spkg";
const MODULE = "map_block_stats";
const START = undefined;
const STOP = "+100000";
const PRODUCTION = false;

async function fetchSubstream(url: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  const array = await blob.arrayBuffer();

  return new Substream(new Uint8Array(array));
}

const substream = await fetchSubstream(SUBSTREAM);
const stream = substream.streamBlocks({
  request: substream.createRequest(MODULE, {
    stopBlockNum: STOP,
    startBlockNum: START,
    productionMode: PRODUCTION,
  }),
  transport: createGrpcTransport({
    baseUrl: ENDPOINT,
    httpVersion: "2",
  }),
  options: {
    headers: {
      Authorization: BEARER,
    },
  },
});

for await (const response of stream) {
  const message = response.message;

  switch (message.case) {
    case "data": {
      const outputs = message.value.outputs;

      for (const output of outputs) {
        if (
          output.name === MODULE &&
          output.data.case === "mapOutput" &&
          output.data.value.value.byteLength > 0
        ) {
          const json = output.toJson({
            typeRegistry: {
              findMessage: (type) => {
                // TODO: This should not be necessary and it appears to only be needed in production mode.
                const trimmed = type.replace(/^proto:/, "");
                return substream.registry.findMessage(trimmed);
              },
            },
          });

          console.dir(json, { depth: 3, colors: true });
        }
      }
    }
  }
}
