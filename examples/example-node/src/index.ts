import { createGrpcTransport } from "@connectrpc/connect-node";
import {
  createAuthInterceptor,
  createRegistry,
  createRequest,
  fetchSubstream,
  isEmptyMessage,
  streamBlocks,
  unpackMapOutput,
} from "@substreams/core";

if (typeof process.env.SUBSTREAMS_API_TOKEN !== "string") {
  throw new Error('Missing "SUBSTREAMS_API_TOKEN" environment variable');
}

const TOKEN = process.env.SUBSTREAMS_API_TOKEN;
const SUBSTREAM = "https://github.com/streamingfast/substreams-uniswap-v3/releases/download/v0.2.7/substreams.spkg";
const MODULE = "map_pools_created";

const substream = await fetchSubstream(SUBSTREAM);
const registry = createRegistry(substream);

// The `grpc` transport is usually preferable in environments that support it (e.g. Node.js).
// In browser environments or alternative runtimes, the `connect` transport should be used.
const transport = createGrpcTransport({
  baseUrl: "https://mainnet.eth.streamingfast.io",
  httpVersion: "2",
  interceptors: [createAuthInterceptor(TOKEN)],
  jsonOptions: {
    typeRegistry: registry,
  },
});

const request = createRequest({
  substreamPackage: substream,
  outputModule: MODULE,
  productionMode: false, // Set to `true` in production.
  stopBlockNum: "+10000", // Stream the first 10000 blocks. Will follow chain head if not set.
});

for await (const response of streamBlocks(transport, request)) {
  const output = unpackMapOutput(response, registry);
  if (output !== undefined && !isEmptyMessage(output)) {
    console.dir(output.toJson({ typeRegistry: registry }));
  }
}
