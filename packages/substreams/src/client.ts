import {
  createPromiseClient,
  PromiseClient,
  Transport,
} from "@bufbuild/connect";
import { Stream } from "./generated/sf/substreams/v1/substreams_connect";

export type SubstreamClient = PromiseClient<typeof Stream>;

export function createClient(connectTransport: Transport): SubstreamClient {
  return createPromiseClient(Stream, connectTransport);
}
