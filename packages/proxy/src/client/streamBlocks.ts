import { type CallOptions, type Transport, createPromiseClient } from "@bufbuild/connect";
import { type StatefulResponse, createStateTracker } from "@substreams/core";
import { ProxyService } from "src/proto/substreams/proxy/v1/proxy_connect.js";
import type { ProxyRequest } from "src/proto/substreams/proxy/v1/proxy_pb.js";

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
