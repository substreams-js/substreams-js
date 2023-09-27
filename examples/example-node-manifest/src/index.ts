import * as url from "node:url";
import { createGrpcTransport } from "@connectrpc/connect-node";
import {
  createAuthInterceptor,
  createRegistry,
  createRequest,
  isEmptyMessage,
  streamBlocks,
  unpackMapOutput,
} from "@substreams/core";
import { readPackage } from "@substreams/manifest";

if (typeof process.env.SUBSTREAMS_API_TOKEN !== "string") {
  throw new Error('Missing "SUBSTREAMS_API_TOKEN" environment variable');
}

const TOKEN = process.env.SUBSTREAMS_API_TOKEN;
const SUBSTREAM = url.fileURLToPath(new URL("../substream/substreams.yaml", import.meta.url));
const MODULE = "map_pools_created";

const substream = await readPackage(SUBSTREAM);
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
