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

(async () => {
  if (typeof process.env.SUBSTREAMS_API_TOKEN !== "string") {
    throw new Error('Missing "SUBSTREAMS_API_TOKEN" environment variable');
  }

  const token = process.env.SUBSTREAMS_API_TOKEN;
  const SUBSTREAM = "https://github.com/streamingfast/substreams-uniswap-v3/releases/download/v0.2.7/substreams.spkg";
  const module = "map_pools_created";

  const substream = await fetchSubstream(SUBSTREAM);
  const registry = createRegistry(substream);
  const transport = createGrpcTransport({
    baseUrl: "https://mainnet.eth.streamingfast.io",
    httpVersion: "2",
    interceptors: [createAuthInterceptor(token)],
    jsonOptions: {
      typeRegistry: registry,
    },
  });

  const request = createRequest({
    substreamPackage: substream,
    outputModule: module,
    productionMode: true,
    stopBlockNum: "+10000",
  });

  for await (const response of streamBlocks(transport, request)) {
    const output = unpackMapOutput(response, registry);
    if (output !== undefined && !isEmptyMessage(output)) {
      console.dir(output.toJson({ typeRegistry: registry }));
    }
  }
})();
