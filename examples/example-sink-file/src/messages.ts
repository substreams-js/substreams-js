import * as Context from "@effect/data/Context";
import * as Effect from "@effect/io/Effect";
import * as Layer from "@effect/io/Layer";
import * as Fs from "@effect/platform-node/FileSystem";

export interface MessageStorage {
  readonly append: (message: string) => Effect.Effect<never, never, void>;
}

export const MessageStorage = Context.Tag<MessageStorage>();
export const MessageStorageLive = Effect.gen(function* (_) {
  const path = ".messages";
  const fs = yield* _(Fs.FileSystem);
  const db = yield* _(fs.open(path, { flag: "a+" }).pipe(Effect.orDie));

  return Layer.succeed(
    MessageStorage,
    MessageStorage.of({
      append: (message) => db.write(new TextEncoder().encode(`${message}\n`)).pipe(Effect.orDie, Effect.asUnit),
    }),
  );
}).pipe(Layer.unwrapScoped);

export const layer = Layer.provide(Fs.layer, MessageStorageLive);
