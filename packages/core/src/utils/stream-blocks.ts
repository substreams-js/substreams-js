import { type Request, type Response, Stream } from "../proto.js";
import { type Progress, createStateTracker } from "./create-state-tracker.js";
import { type CallOptions, type Transport, createPromiseClient } from "@bufbuild/connect";

export type StatefulResponse = {
  progress: Progress;
  response: Response;
};

export async function* streamBlocks(
  transport: Transport,
  request: Request,
  options?: CallOptions | undefined,
): AsyncIterable<StatefulResponse> {
  const progress = createStateTracker();
  const client = createPromiseClient(Stream, transport);

  for await (const response of client.blocks(request, options)) {
    yield {
      progress: progress(response),
      response,
    };
  }
}
