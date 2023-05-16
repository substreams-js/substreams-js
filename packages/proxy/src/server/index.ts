export * from "../proto/substreams/proxy/v1/proxy_pb.js";
export * from "../proto/substreams/proxy/v1/proxy_connect.js";

export { createProxyRoutes } from "./createProxyRoutes.js";

export {
  defaultCorsAllowHeaders,
  defaultCorsExposeHeaders,
  defaultCorsHeaders,
  createProxyHandler,
  type CreateProxyHandlerOptions,
} from "./createProxyHandler.js";

export {
  defaultSubstreamsEndpoint,
  createProxyServer,
  type ProxyServerOptions,
} from "./createProxyServer.js";
