import { ProxyService } from "../proto/substreams/proxy/v1/proxy_connect.js";
import type { ProxyRequest } from "../proto/substreams/proxy/v1/proxy_pb.js";
import { type CallOptions, type Transport, createPromiseClient } from "@bufbuild/connect";
import { type StatefulResponse, createStateTracker } from "@substreams/core";

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
