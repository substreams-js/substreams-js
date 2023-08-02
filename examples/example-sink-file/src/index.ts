import * as Option from "@effect/data/Option";
import * as Config from "@effect/io/Config";
import * as Effect from "@effect/io/Effect";
import * as Layer from "@effect/io/Layer";
import * as Stream from "@effect/stream/Stream";

import { createGrpcTransport } from "@bufbuild/connect-node";
import { createAuthInterceptor, createRegistry } from "@substreams/core";
import { readPackage } from "@substreams/manifest";
import { createSink, createStream } from "@substreams/sink";

import * as CursorStorage from "./cursor.js";
import * as MessageStorage from "./messages.js";

const program = Effect.gen(function* (_) {
  const db = yield* _(MessageStorage.MessageStorage);
  const cursor = yield* _(CursorStorage.CursorStorage);
  const pkg = yield* _(
    Effect.promise(() => {
      const path = "https://github.com/streamingfast/substreams-uniswap-v3/releases/download/v0.2.8/substreams.spkg";
      return readPackage(path);
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
    outputModule: "map_pools_created",
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

const runnable = Effect.provideLayer(program, Layer.merge(CursorStorage.layer, MessageStorage.layer));

Effect.runPromise(runnable);
