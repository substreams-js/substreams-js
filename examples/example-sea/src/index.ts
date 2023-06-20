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
  if (process.env.SUBSTREAMS_API_TOKEN === undefined) {
    throw new Error('Missing "SUBSTREAMS_API_TOKEN" environment variable');
  }

  const TOKEN = process.env.SUBSTREAMS_API_TOKEN;
  const SUBSTREAM = "https://github.com/streamingfast/substreams-uniswap-v3/releases/download/v0.2.7/substreams.spkg";
  const MODULE = "map_pools_created";

  const substream = await fetchSubstream(SUBSTREAM);
  const registry = createRegistry(substream);
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
    productionMode: true,
    stopBlockNum: "+10000",
  });

  for await (const response of streamBlocks(transport, request)) {
    const output = unpackMapOutput(response.response, registry);
    if (output !== undefined && !isEmptyMessage(output)) {
      console.dir(output.toJson({ typeRegistry: registry }));
    }
  }
})();
