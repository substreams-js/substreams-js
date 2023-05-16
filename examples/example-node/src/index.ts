import { fetchSubstream } from "./fetch.js";
import { token } from "./token.js";
import { createGrpcTransport } from "@bufbuild/connect-node";
import { createAuthInterceptor, createRegistry, createRequest, streamBlocks, unpackMapOutput } from "@fubhy/substreams";

const SUBSTREAM = "https://github.com/streamingfast/substreams-uniswap-v3/releases/download/v0.2.1/substreams.spkg";
const MODULE = "map_pools_created";

const substream = await fetchSubstream(SUBSTREAM);
const registry = createRegistry(substream);
const transport = createGrpcTransport({
  baseUrl: "https://api.streamingfast.io",
  httpVersion: "2",
  interceptors: [createAuthInterceptor(token)],
  jsonOptions: {
    typeRegistry: registry,
  },
});

const request = createRequest({
  substreamPackage: substream,
  outputModule: MODULE,
  productionMode: true,
  startBlockNum: 17250000n,
  stopBlockNum: 17260000n,
});

for await (const item of streamBlocks(transport, request)) {
  const message = unpackMapOutput(item.response, registry);
  if (message !== undefined) {
    console.dir(message);
  }
}
