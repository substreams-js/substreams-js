import { type CallOptions, type Transport, createClient } from "@connectrpc/connect";
import { type Request, type Response, Stream } from "../proto.js";

/**
 * Stream blocks using the Substreams RPC V2 protocol.
 *
 * @deprecated Use `streamBlocks` (V3) instead. V3 sends the full .spkg package directly
 * and supports additional features like params, network selection, and partial blocks.
 */
export function streamBlocksV2(
  transport: Transport,
  request: Request,
  options?: CallOptions | undefined,
): AsyncIterable<Response> {
  const client = createClient(Stream, transport);
  return client.blocks(request, options);
}
