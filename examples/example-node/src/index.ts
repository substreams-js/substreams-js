import { token } from "./token.js";
import { createConnectTransport, createGrpcTransport } from "@bufbuild/connect-node";
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
const transport = (() => {
  switch (process.env.SUBSTREAMS_MODE ?? "connect") {
    case "grpc": {
      // It's usually preferable to use the standard `grpc` transport whenever you are in an environment that supports it.
      return createGrpcTransport({
        baseUrl: "https://mainnet.eth.streamingfast.io",
        httpVersion: "2",
        interceptors: [createAuthInterceptor(token)],
        jsonOptions: {
          typeRegistry: registry,
        },
      });
    }

    case "connect": {
      // The `connect` transport can be used in browser environments or alternative runtimes.
      return createConnectTransport({
        baseUrl: "http://0.0.0.0:8080",
        httpVersion: "2",
        interceptors: [createAuthInterceptor(token)],
        jsonOptions: {
          typeRegistry: registry,
        },
      });
    }

    default: {
      throw new Error('Invalid transport mode. Must be either "grpc" or "connect".');
    }
  }
})();

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
