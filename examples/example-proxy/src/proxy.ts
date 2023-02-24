import {
  CallOptions,
  ConnectRouter,
  createPromiseClient,
  HandlerContext,
  Transport,
} from "@bufbuild/connect";
import { Stream } from "@enzymefinance/substreams";

export function createSubstreamsProxy(
  upstream: Transport,
  options?: ((context: HandlerContext) => CallOptions) | CallOptions
) {
  const client = createPromiseClient(Stream, upstream);

  return function connectSubstreams(router: ConnectRouter) {
    router.rpc(Stream, Stream.methods.blocks, (request, context) => {
      const opts = typeof options === "function" ? options(context) : options;
      return client.blocks(request, opts);
    });
  };
}
