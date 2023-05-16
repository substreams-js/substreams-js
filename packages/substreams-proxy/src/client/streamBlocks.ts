import { type ProxyRequest, ProxyService } from "./index.js";
import { type CallOptions, type Transport, createPromiseClient } from "@bufbuild/connect";
import { type StatefulResponse, createStateTracker } from "@fubhy/substreams";

export async function* streamBlocks(
  transport: Transport,
  request: ProxyRequest,
  options?: CallOptions | undefined,
): AsyncIterable<StatefulResponse> {
  const track = createStateTracker(request);
  const client = createPromiseClient(ProxyService, transport);

  for await (const response of client.proxy(request, options)) {
    const state = track(response);

    yield { state, response };
  }
}
