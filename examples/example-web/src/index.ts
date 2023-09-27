import { createConnectTransport } from "@connectrpc/connect-web";
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
  if (typeof import.meta.env.SUBSTREAMS_API_TOKEN !== "string") {
    throw new Error('Missing "SUBSTREAMS_API_TOKEN" environment variable');
  }

  const token = import.meta.env.SUBSTREAMS_API_TOKEN;
  const SUBSTREAM = "streamingfast/substreams-uniswap-v3/releases/download/v0.2.7/substreams.spkg";
  const module = "map_pools_created";

  // NOTE: We are proxying requests to github.com to circumvent CORS. See `vite.config.ts` for details.
  const substream = await fetchSubstream(`${window.location.origin}/proxy/${SUBSTREAM}`);
  const registry = createRegistry(substream);

  // The `connect` transport can be used in browser environments or alternative runtimes. We are
  // using it here (within Node.js) for demonstration purposes only. Note that JSON format is not
  // supported by the service, so we are using the binary wire format and marshal the response
  // into JSON on the client side instead. Considering the additional payload overhead of JSON,
  // the binary format should be prefered anyways.
  const transport = createConnectTransport({
    // NOTE: Support for the `connect` protocol is currently still work in progress.
    baseUrl: "https://api.streamingfast.io",
    interceptors: [createAuthInterceptor(token)],
    useBinaryFormat: true,
    jsonOptions: {
      typeRegistry: registry,
    },
  });

  const request = createRequest({
    substreamPackage: substream,
    outputModule: module,
    productionMode: false, // Set to `true` in production.
    stopBlockNum: "+10000", // Stream the first 10000 blocks. Will follow chain head if not set.
  });

  const element = document.getElementById("output");
  if (!element) {
    throw new Error("Missing output element");
  }

  element.textContent = "";
  for await (const response of streamBlocks(transport, request)) {
    const output = unpackMapOutput(response, registry);
    if (output !== undefined && !isEmptyMessage(output)) {
      element.textContent += `${output.toJsonString({
        typeRegistry: registry,
      })}\n`;
    }
  }
})();
