import { createGrpcTransport } from "@connectrpc/connect-node";
import { createAuthInterceptor, createRegistry } from "@substreams/core";
import { readPackage } from "@substreams/manifest";
import { createSink, createStream } from "@substreams/sink";
import { Config, Data, Effect, Layer, Option, Stream } from "effect";
import * as CursorStorage from "./cursor.js";
import * as MessageStorage from "./messages.js";

export class InvalidPackageError extends Data.TaggedClass("InvalidPackageError")<{
  readonly cause: unknown;
  readonly message: string;
}> {}

export function runStream({
  packagePath,
  outputModule,
}: {
  packagePath: string;
  outputModule: string;
}) {
  const program = Effect.gen(function* (_) {
    const db = yield* _(MessageStorage.MessageStorage);
    const cursor = yield* _(CursorStorage.CursorStorage);
    const pkg = yield* _(
      Effect.tryPromise({
        try: () => readPackage(packagePath),
        catch: (cause) =>
          new InvalidPackageError({
            cause,
            message: `Could not read package at path ${packagePath}`,
          }),
      }),
    );

    const token = yield* _(Effect.config(Config.string("SUBSTREAMS_API_TOKEN")));
    const transport = createGrpcTransport({
      baseUrl: "https://mainnet.eth.streamingfast.io",
      httpVersion: "2",
      interceptors: [createAuthInterceptor(token)],
    });

    const registry = createRegistry(pkg);
    const stream = createStream({
      connectTransport: transport,
      substreamPackage: pkg,
      outputModule,
      startCursor: yield* _(Effect.map(cursor.read(), Option.getOrUndefined)),
    });

    const sink = createSink({
      handleBlockScopedData: (message) =>
        Effect.annotateLogs({
          block: message.clock?.number.toString() ?? "???",
          time: message.clock?.timestamp?.toDate().toLocaleString() ?? "???",
          size: `${message.output?.mapOutput?.value?.byteLength ?? 0} bytes`,
        })(
          Effect.gen(function* (_) {
            yield* _(cursor.write(Option.some(message.cursor)));

            if (message.output?.mapOutput?.value?.byteLength === 0) {
              yield* _(Effect.logDebug("received empty message"));
            } else {
              yield* _(Effect.logInfo(`received message of type ${message.output?.mapOutput?.typeUrl}`));
              yield* _(db.append(message.toJsonString({ typeRegistry: registry })));
            }
          }),
        ),
      handleBlockUndoSignal: (message) =>
        Effect.gen(function* (_) {
          yield* _(cursor.write(Option.some(message.lastValidCursor)));
        }),
    });

    return yield* _(Stream.run(stream, sink));
  });

  return program;
}

export const layer = Layer.merge(CursorStorage.layer, MessageStorage.layer);
