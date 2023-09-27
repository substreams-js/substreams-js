import * as Fs from "@effect/platform-node/FileSystem";
import { Context, Effect, Layer, Option } from "effect";

export interface CursorStorage {
  readonly read: () => Effect.Effect<never, never, Option.Option<string>>;
  readonly write: (cursor: Option.Option<string>) => Effect.Effect<never, never, void>;
}

export const CursorStorage = Context.Tag<CursorStorage>();
export const CursorStorageLive = Effect.gen(function* (_) {
  const path = ".cursor";
  const fs = yield* _(Fs.FileSystem);

  // Read the current cursor from the file, if any.
  let current = yield* _(fs.readFileString(path), Effect.option, Effect.map(Option.filter((value) => value !== "")));
  // Open the file for writing. This truncates the file.
  const db = yield* _(fs.open(path, { flag: "w" }).pipe(Effect.orDie));
  // If we had a cursor, write it back to the file.
  if (Option.isSome(current)) {
    yield* _(db.write(new TextEncoder().encode(current.value)), Effect.orDie);
  }

  return Layer.succeed(
    CursorStorage,
    CursorStorage.of({
      read: () => Effect.succeed(current),
      write: (cursor) => {
        current = cursor;

        return Option.match(cursor, {
          onNone: () => db.truncate().pipe(Effect.orDie),
          onSome: (cursor) =>
            Effect.gen(function* (_) {
              const bytes = new TextEncoder().encode(cursor);
              yield* _(db.seek(Fs.Size(0), "start"));
              yield* _(db.write(bytes));
              yield* _(db.truncate(Fs.Size(bytes.byteLength)));
            }).pipe(Effect.orDie),
        });
      },
    }),
  );
}).pipe(Layer.unwrapScoped);

export const layer = Layer.provide(Fs.layer, CursorStorageLive);
