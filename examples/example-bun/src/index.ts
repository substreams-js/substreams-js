import { fetchSubstream } from "./fetch.js";
import { token } from "./token.js";
import { createPromiseClient } from "@bufbuild/connect";
import { createConnectTransport } from "@bufbuild/connect-web";
import { createAuthInterceptor, createRegistry, getModuleOrThrow } from "@fubhy/substreams";
import { ProxyService, createProxyRequest } from "@fubhy/substreams-proxy/client";

const SUBSTREAM = "https://github.com/streamingfast/substreams-uniswap-v3/releases/download/v0.2.1/substreams.spkg";
const MODULE = "map_pools_created";

const substream = await fetchSubstream(SUBSTREAM);
const module = getModuleOrThrow(substream, MODULE);
const registry = createRegistry(substream);
const transport = createConnectTransport({
  // NOTE: We have to use our connect proxy here because bun doesn't support connect-node yet (zlib, http2, etc.)
  // as discussed in https://github.com/oven-sh/bun/issues/887 and https://github.com/oven-sh/bun/issues/267.
  baseUrl: "https://substreams.fly.dev",
  interceptors: [createAuthInterceptor(token)],
  useBinaryFormat: true,
  jsonOptions: {
    typeRegistry: registry,
  },
});

const client = createPromiseClient(ProxyService, transport);
const request = createProxyRequest(substream, module, {
  productionMode: true,
});

const stream = client.proxy(request);

for await (const response of stream) {
  const message = response.message;

  switch (message.case) {
    case "blockScopedData": {
      const output = message.value.output?.mapOutput;

      if (output !== undefined && output.value.byteLength > 0) {
        const json = output.toJson({
          typeRegistry: registry,
        });

        console.dir(json);
      }
    }
  }
}
