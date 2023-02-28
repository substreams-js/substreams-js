import {
  CallOptions,
  Code,
  ConnectError,
  ConnectRouter,
  createPromiseClient,
  HandlerContext,
  Transport,
} from "@bufbuild/connect";
import {
  createDescriptorSet,
  createRegistryFromDescriptors,
} from "@bufbuild/protobuf";
import { Stream, Request, ProxyService } from "@enzymefinance/substreams";

export function createSubstreamsProxy(
  upstream: Transport,
  options?: ((context: HandlerContext) => CallOptions) | CallOptions
) {
  const client = createPromiseClient(Stream, upstream);

  return function connectSubstreams(router: ConnectRouter) {
    router.rpc(ProxyService, ProxyService.methods.proxy, (proxied, context) => {
      if (proxied.package === undefined) {
        throw new ConnectError(
          "Missing package in request",
          Code.InvalidArgument
        );
      }

      if (proxied.package.modules === undefined) {
        throw new ConnectError(
          "Missing or empty package modules in request",
          Code.InvalidArgument
        );
      }

      const opts = typeof options === "function" ? options(context) : options;
      const descriptor = createDescriptorSet(proxied.package.protoFiles);
      const registry = createRegistryFromDescriptors(descriptor);
      const request = new Request({
        ...proxied,
        modules: proxied.package.modules,
      });

      return {
        [Symbol.asyncIterator]: async function* () {
          const stream = client.blocks(request, opts);
          for await (const message of stream) {
            // @Timo: Yes, this is ugly. :-P
            const originalToJson = message.toJson.bind(message);
            message.toJson = (options) =>
              originalToJson({ ...options, typeRegistry: registry });

            yield message;
          }
        },
      };
    });
  };
}
