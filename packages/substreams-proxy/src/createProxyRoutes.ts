import {
  type CallOptions,
  Code,
  ConnectError,
  type ConnectRouter,
  createPromiseClient,
  type HandlerContext,
  type Transport,
} from "@bufbuild/connect";
import { createDescriptorSet, createRegistryFromDescriptors } from "@bufbuild/protobuf";
import { Stream, Request, ProxyService } from "@fubhy/substreams";
import type { Awaitable } from "./types.js";

export function createProxyRoutes(
  upstream: Transport,
  options?: ((context: HandlerContext) => Awaitable<CallOptions | undefined>) | CallOptions,
) {
  const client = createPromiseClient(Stream, upstream);

  return function connectSubstreams(router: ConnectRouter) {
    router.rpc(ProxyService, ProxyService.methods.proxy, (proxied, context) => {
      if (proxied.package === undefined) {
        throw new ConnectError("Missing package in request", Code.InvalidArgument);
      }

      if (proxied.package.modules === undefined) {
        throw new ConnectError("Missing or empty package modules in request", Code.InvalidArgument);
      }

      const descriptor = createDescriptorSet(proxied.package.protoFiles);
      const registry = createRegistryFromDescriptors(descriptor);
      const request = new Request({
        ...proxied,
        modules: proxied.package.modules,
      });

      return {
        [Symbol.asyncIterator]: async function* () {
          const opts = typeof options === "function" ? await options(context) : options;
          const stream = client.blocks(request, opts);

          for await (const message of stream) {
            const originalToJson = message.toJson.bind(message);
            message.toJson = (options) => originalToJson({ ...options, typeRegistry: registry });

            yield message;
          }
        },
      };
    });
  };
}
