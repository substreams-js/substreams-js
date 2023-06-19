import type { Awaitable } from "../types.js";
import {
  type CallOptions,
  type ConnectRouter,
  type HandlerContext,
  type Transport,
  createPromiseClient,
} from "@bufbuild/connect";
import { Stream } from "@substreams/core/proto";

export function createProxyRoutes(
  upstream: Transport,
  options?: ((context: HandlerContext) => Awaitable<CallOptions | undefined>) | CallOptions,
) {
  const client = createPromiseClient(Stream, upstream);

  return function connectSubstreams(router: ConnectRouter) {
    router.rpc(Stream, Stream.methods.blocks, async function* (proxied, context) {
      const opts = typeof options === "function" ? await options(context) : options;
      for await (const message of client.blocks(proxied, opts)) {
        yield message;
      }
    });
  };
}
