import * as Context from "@effect/data/Context";
import * as Option from "@effect/data/Option";
import * as Effect from "@effect/io/Effect";
import * as Layer from "@effect/io/Layer";
import * as Fs from "@effect/platform-node/FileSystem";

export interface CursorStorage {
  readonly read: () => Effect.Effect<never, never, Option.Option<string>>;
  readonly write: (cursor: Option.Option<string>) => Effect.Effect<never, never, void>;
}

export const CursorStorage = Context.Tag<CursorStorage>();
export const CursorStorageLive = Effect.gen(function* (_) {
  const path = ".cursor";
  const fs = yield* _(Fs.FileSystem);
  const db = yield* _(fs.open(path, { flag: "a+" }).pipe(Effect.orDie));

  return Layer.succeed(
    CursorStorage,
    CursorStorage.of({
      read: () => Effect.option(fs.readFileString(path)),
      write: (cursor) => {
        return Option.match(cursor, {
          // TODO: Use `.seek` instead of `.truncate` to simply override the cursor once https://github.com/Effect-TS/platform/pull/46 is merged.
          onNone: () => db.truncate().pipe(Effect.orDie, Effect.asUnit),
          onSome: (cursor) => {
            const encoded = new TextEncoder().encode(cursor);
            return Effect.all([db.truncate(), db.write(encoded)]).pipe(Effect.orDie, Effect.asUnit);
          },
        });
      },
    }),
  );
}).pipe(Layer.unwrapScoped);

export const layer = Layer.provide(Fs.layer, CursorStorageLive);
