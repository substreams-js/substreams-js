import { createPromiseClient } from "@bufbuild/connect";
import { createGrpcTransport } from "@bufbuild/connect-node";
import { Stream, createRegistry, createRequest, createSubstream } from "@fubhy/substreams";

const ENDPOINT = "https://api.streamingfast.io";
const SUBSTREAM = "https://github.com/streamingfast/substreams-uniswap-v3/releases/download/v0.2.1/substreams.spkg";
const MODULE = "map_pools_created";

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
    case "blockScopedData": {
      const output = message.value.output?.mapOutput;

      if (output !== undefined && output.value.byteLength > 0) {
        const json = output.toJson({
          typeRegistry: registry,
        });

        console.dir(json, { depth: 3, colors: true });
      }
    }
  }
}
