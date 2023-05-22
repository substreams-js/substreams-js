import { token } from "./token.js";
import { createGrpcTransport } from "@bufbuild/connect-node";
import {
  createAuthInterceptor,
  createRegistry,
  createRequest,
  fetchSubstream,
  isEmptyMessage,
  streamBlocks,
  unpackMapOutput,
} from "@substreams/core";

(async () => {
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
    stopBlockNum: "+10000",
  });

  for await (const response of streamBlocks(transport, request)) {
    const output = unpackMapOutput(response.response, registry);
    if (output !== undefined && !isEmptyMessage(output)) {
      console.dir(output.toJson({ typeRegistry: registry }));
    }
  }
})();
