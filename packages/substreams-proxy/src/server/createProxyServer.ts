import { createProxyHandler } from "./createProxyHandler.js";
import { createGrpcTransport } from "@bufbuild/connect-node";
import { createAuthInterceptor } from "@fubhy/substreams";
import { IncomingMessage, type OutgoingHttpHeaders, createServer } from "node:http";

export const defaultSubstreamsEndpoint = "https://mainnet.eth.streamingfast.io";

export type ProxyServerOptions = {
  substreamsToken?: string | undefined;
  substreamsEndpoint?: string | undefined;
  corsEnabled?: boolean | undefined;
  corsHeaders?: OutgoingHttpHeaders | ((req: IncomingMessage) => OutgoingHttpHeaders) | undefined;
};

export function createProxyServer({
  substreamsToken,
  substreamsEndpoint = defaultSubstreamsEndpoint,
  corsHeaders,
  corsEnabled,
}: ProxyServerOptions) {
  const substreamsTransport = createGrpcTransport({
    baseUrl: substreamsEndpoint,
    httpVersion: "2",
    interceptors: substreamsToken !== undefined ? [createAuthInterceptor(substreamsToken)] : [],
  });

  const handler = createProxyHandler({
    substreamsTransport,
    substreamsToken,
    corsHeaders,
    corsEnabled,
  });

  return createServer(handler);
}
