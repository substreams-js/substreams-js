import { invariant } from "@/lib/utils";
import { createConnectTransport } from "@connectrpc/connect-web";
import { createAuthInterceptor } from "@substreams/core";

invariant(process.env.NEXT_PUBLIC_SUBSTREAMS_API_TOKEN, "Missing substreams api token");

export const transport = createConnectTransport({
  baseUrl: "https://mainnet.eth.streamingfast.io",
  interceptors: [createAuthInterceptor(process.env.NEXT_PUBLIC_SUBSTREAMS_API_TOKEN)],
  useBinaryFormat: true,
});
