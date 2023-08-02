import * as Data from "@effect/data/Data";
import * as Func from "@effect/data/Function";
import * as Cause from "@effect/io/Cause";
import * as Effect from "@effect/io/Effect";
import * as Match from "@effect/match";
import * as Sink from "@effect/stream/Sink";

import type { BlockScopedData, BlockUndoSignal, Response } from "@substreams/core/proto";

export class BlockScopedDataSinkError extends Data.TaggedClass("BlockScopedDataSinkError")<{
  readonly cause: Cause.Cause<unknown>;
  readonly message: BlockScopedData;
}> {}

export class BlockUndoSignalSinkError extends Data.TaggedClass("BlockUndoSignalSinkError")<{
  readonly cause: Cause.Cause<unknown>;
  readonly message: BlockUndoSignal;
}> {}

export type CreateSinkOptions<R1, R2> = {
  handleBlockScopedData: (message: BlockScopedData) => Effect.Effect<R1, unknown, void>;
  handleBlockUndoSignal: (message: BlockUndoSignal) => Effect.Effect<R2, unknown, void>;
};

export function createSink<R1, R2>({ handleBlockScopedData, handleBlockUndoSignal }: CreateSinkOptions<R1, R2>) {
  // rome-ignore lint/nursery/noForEach: this is not even an array ...
  return Sink.forEach((response: Response) => {
    return Func.pipe(
      Match.value(response.message),
      Match.discriminator("case")("blockScopedData", (message) =>
        handleBlockScopedData(message.value).pipe(
          Effect.catchAllCause((cause) => Effect.die(new BlockScopedDataSinkError({ cause, message: message.value }))),
        ),
      ),
      Match.discriminator("case")("blockUndoSignal", (message) =>
        handleBlockUndoSignal(message.value).pipe(
          Effect.catchAllCause((cause) => Effect.die(new BlockUndoSignalSinkError({ cause, message: message.value }))),
        ),
      ),
      Match.orElse(() => Effect.unit),
    );
  });
}
