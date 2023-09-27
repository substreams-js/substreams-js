import { type CallOptions, type Transport, createPromiseClient } from "@connectrpc/connect";
import { type Request, type Response, Stream } from "../proto.js";

export function streamBlocks(
  transport: Transport,
  request: Request,
  options?: CallOptions | undefined,
): AsyncIterable<Response> {
  const client = createPromiseClient(Stream, transport);
  return client.blocks(request, options);
}
