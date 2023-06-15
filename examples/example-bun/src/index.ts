import { token } from "./token.js";
import { createConnectTransport } from "@bufbuild/connect-web";
import {
  createAuthInterceptor,
  createRegistry,
  createRequest,
  fetchSubstream,
  isEmptyMessage,
  streamBlocks,
  unpackMapOutput,
} from "@substreams/core";

const SUBSTREAM = "https://github.com/streamingfast/substreams-uniswap-v3/releases/download/v0.2.7/substreams.spkg";
const MODULE = "map_pools_created";

const substream = await fetchSubstream(SUBSTREAM);
const registry = createRegistry(substream);
const transport = createConnectTransport({
  baseUrl: "https://substreams.fly.dev",
  interceptors: [createAuthInterceptor(token)],
  useBinaryFormat: true,
  jsonOptions: {
    typeRegistry: registry,
  },
});

const request = createRequest({
  substreamPackage: substream,
  outputModule: MODULE,
  productionMode: false,
  startBlockNum: 17255000n,
  stopBlockNum: "+10000",
});

for await (const response of streamBlocks(transport, request)) {
  const output = unpackMapOutput(response.response, registry);
  if (output !== undefined && !isEmptyMessage(output)) {
    console.dir(output.toJson({ typeRegistry: registry }));
  }
}
