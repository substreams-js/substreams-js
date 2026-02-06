import { toJson } from "@bufbuild/protobuf";
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
const SUBSTREAM = "https://spkg.io/streamingfast/solana_common-v0.3.3.spkg";
const MODULE = "transactions_by_programid_and_account_without_votes";

const substream = await fetchSubstream(SUBSTREAM);
const registry = createRegistry(substream);

// The `grpc` transport is usually preferable in environments that support it (e.g. Node.js).
// In browser environments or alternative runtimes, the `connect` transport should be used.
const transport = createGrpcTransport({
  baseUrl: "https://mainnet.sol.streamingfast.io",
  interceptors: [createAuthInterceptor(TOKEN)],
});

const request = createRequest({
  substreamPackage: substream,
  outputModule: MODULE,
  productionMode: false, // Set to `true` in production.
  startBlockNum: 318876956,
  stopBlockNum: 318876966, // Stream the first 10000 blocks. Will follow chain head if not set.
});

for await (const response of streamBlocks(transport, request)) {
  const output = unpackMapOutput(response, registry);
  if (output !== undefined && !isEmptyMessage(output)) {
    // Get the message schema from the registry to convert to JSON
    const schema = registry.getMessage(output.$typeName);
    if (schema) {
      console.dir(toJson(schema, output));
    }
  }
}
