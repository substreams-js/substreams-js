import { Context, Effect, Layer } from "./common.js";
import type { Transport as ConnectTransport } from "@bufbuild/connect";

// rome-ignore lint/suspicious/noEmptyInterface: <explanation>
export interface Transport extends ConnectTransport {}
export const Transport = Context.Tag<Transport>();

export function succeed(transport: Transport) {
  return Layer.succeed(Transport, Transport.of(transport));
}

export function effect<R, E>(effect: Effect.Effect<R, E, Transport>) {
  return Layer.effect(Transport, effect);
}
