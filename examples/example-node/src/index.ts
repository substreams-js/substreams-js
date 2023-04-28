import { createGrpcTransport } from "@bufbuild/connect-node";
import { createPromiseClient } from "@bufbuild/connect";
import { Stream, createRegistry, createSubstream, createRequest } from "@fubhy/substreams";

const ENDPOINT = "https://mainnet.eth.streamingfast.io";
const SUBSTREAM =
  "https://github.com/pinax-network/subtivity-substreams/releases/download/v0.2.0/subtivity-ethereum-v0.2.0.spkg";
const MODULE = "map_block_stats";

const token = process.env.SUBSTREAMS_API_TOKEN;
if (token === undefined) {
  throw new Error('Missing "SUBSTREAMS_API_TOKEN" environment variable');
}

async function fetchSubstream(url: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  const array = await blob.arrayBuffer();

  return createSubstream(array);
}

const substream = await fetchSubstream(SUBSTREAM);
const transport = createGrpcTransport({
  baseUrl: ENDPOINT,
  httpVersion: "2",
});

const client = createPromiseClient(Stream, transport);
const module = substream.modules?.modules.find((module) => module.name === MODULE);
if (module === undefined) {
  throw new Error(`Module "${MODULE}" not found in substream`);
}

const registry = createRegistry(substream);
const request = createRequest(substream, module, {
  productionMode: true,
});

const stream = client.blocks(request, {
  headers: {
    Authorization: token,
  },
});

for await (const response of stream) {
  const message = response.message;

  switch (message.case) {
    case "data": {
      const outputs = message.value.outputs;

      for (const output of outputs) {
        if (output.name === MODULE && output.data.case === "mapOutput" && output.data.value.value.byteLength > 0) {
          const json = output.toJson({
            typeRegistry: registry,
          });

          console.dir(json, { depth: 3, colors: true });
        }
      }
    }
  }
}
