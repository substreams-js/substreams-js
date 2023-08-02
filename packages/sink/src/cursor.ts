import { Context, Effect, Layer, Option, Ref } from "./common.js";

export interface Cursor {
  set: (next: string) => Effect.Effect<never, never, void>;
  get: Effect.Effect<never, never, Option.Option<string>>;
}

export const Cursor = Context.Tag<Cursor>();

export function succeed(initial: Option.Option<string> = Option.none()): Layer.Layer<never, never, Cursor> {
  return Layer.effect(
    Cursor,
    Ref.make(initial).pipe(
      Effect.map((ref) =>
        Cursor.of({
          set: (next) => Ref.update(ref, () => Option.some(next)),
          get: Ref.get(ref),
        }),
      ),
    ),
  );
}

export function effect<R, E>(initial: Effect.Effect<R, E, Option.Option<string>>) {
  return Layer.effect(
    Cursor,
    Effect.flatMap(initial, (initial) =>
      Ref.make(initial).pipe(
        Effect.map((ref) =>
          Cursor.of({
            set: (next) => Ref.update(ref, () => Option.some(next)),
            get: Ref.get(ref),
          }),
        ),
      ),
    ),
  );
}

export const current = Effect.flatMap(Cursor, (cursor) => cursor.get);
export function update(next: string) {
  return Effect.flatMap(Cursor, (cursor) => cursor.set(next));
}
