import { type CallOptions, type Transport, createClient } from "@connectrpc/connect";
import { type Response, StreamV3, type v3 } from "../proto.js";

/**
 * Stream blocks using the Substreams RPC V3 protocol.
 *
 * V3 sends the full .spkg package directly instead of extracting modules,
 * and supports additional features like params, network selection, and partial blocks.
 */
export function streamBlocks(
  transport: Transport,
  request: v3.Request,
  options?: CallOptions | undefined,
): AsyncIterable<Response> {
  const client = createClient(StreamV3, transport);
  return client.blocks(request, options);
}
