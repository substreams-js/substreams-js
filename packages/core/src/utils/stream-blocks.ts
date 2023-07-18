import { type Request, type Response, Stream } from "../proto.js";
import { type State, createStateTracker } from "./create-state-tracker.js";
import { type CallOptions, type Transport, createPromiseClient } from "@bufbuild/connect";

export type StatefulResponse = {
  state: State;
  response: Response;
};

export async function* streamBlocks(
  transport: Transport,
  request: Request,
  options?: CallOptions | undefined,
): AsyncIterable<StatefulResponse> {
  const track = createStateTracker(request);
  const client = createPromiseClient(Stream, transport);

  for await (const response of client.blocks(request, options)) {
    const state = track(response);

    yield { state, response };
  }
}
