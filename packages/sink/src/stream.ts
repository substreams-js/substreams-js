import { type Transport, createPromiseClient } from "@bufbuild/connect";
import * as Data from "@effect/data/Data";
import * as Duration from "@effect/data/Duration";
import * as Func from "@effect/data/Function";
import * as Option from "@effect/data/Option";
import * as Effect from "@effect/io/Effect";
import * as Metric from "@effect/io/Metric";
import * as Schedule from "@effect/io/Schedule";
import * as Sink from "@effect/stream/Sink";
import * as Stream from "@effect/stream/Stream";
import { createRequest } from "@substreams/core";
import { type Module, type Package, type Response, Stream as StreamService } from "@substreams/core/proto";

import * as Metrics from "./metrics.js";

export class SourceStreamError extends Data.TaggedClass("SourceStreamError")<{
  readonly cause: unknown;
  readonly cursor: Option.Option<string>;
}> {}

export type CreateStreamOptions = {
  /**
   * The transport to use to connect to the backend service.
   */
  connectTransport: Transport;
  /**
   * The substream package.
   */
  substreamPackage: Package;
  /**
   * The module to stream.
   */
  outputModule: string | Module;
  /**
   * The block number to start streaming from.
   *
   * @default undefined `start from the initial block of the selected module`
   */
  startBlockNum?: number | bigint | undefined;
  /**
   * The block number to stop streaming at.
   *
   * @default undefined (follow the chain indefinitely)
   */
  stopBlockNum?: number | bigint | `+${number}` | undefined;
  /**
   * The cursor to start streaming from.
   *
   * Useful for continuing a stream from a specific point.
   *
   * @default undefined (start from the beginning)
   */
  startCursor?: string | undefined;
  /**
   * The maximum number of seconds to retry the stream for on failure.
   *
   * We track the current cursor of the last emitted response internally. Whenever the source stream fails
   * it is automatically restarted from the last recorded cursor.
   *
   * We employ a jittered, exponential backoff strategy for retries.
   *
   * @default 300 (5 minutes)
   */
  maxRetrySeconds?: number | undefined;
};

export function createStream({
  connectTransport,
  substreamPackage,
  outputModule,
  startBlockNum,
  stopBlockNum,
  startCursor,
  maxRetrySeconds = 300,
}: CreateStreamOptions) {
  let currentCursor: Option.Option<string> = startCursor ? Option.some(startCursor) : Option.none();

  // rome-ignore lint/nursery/noForEach: <explanation>
  const metrics = Sink.forEach((response: Response) =>
    Effect.gen(function* (_) {
      const size = response.toBinary().byteLength;
      yield* _(Metric.incrementBy(Metrics.MessageSizeBytes, size));

      const { case: kind, value: message } = response.message;

      switch (kind) {
        case "blockScopedData": {
          yield* _(Metric.increment(Metrics.DataMessageCount));
          yield* _(Metric.incrementBy(Metrics.DataMessageSizeBytes, size));

          const block = Number(message.clock?.number ?? 0);
          const timestamp = Number(message.clock?.timestamp?.seconds ?? 0);
          const now = Date.now() / 1000;

          yield* _(Metric.set(Metrics.HeadBlockNumber, block));
          yield* _(Metric.set(Metrics.HeadBlockTime, timestamp));
          yield* _(Metric.set(Metrics.HeadBlockTimeDrift, now - timestamp));
          return;
        }

        case "blockUndoSignal": {
          yield* _(Metric.increment(Metrics.UndoMessageCount));
          yield* _(Metric.incrementBy(Metrics.UndoMessageSizeBytes, size));
          return;
        }

        case "progress": {
          yield* _(Metric.increment(Metrics.ProgressMessageCount));
          yield* _(Metric.incrementBy(Metrics.ProgressMessageSizeBytes, size));
          return;
        }

        case "session": {
          // TODO: Tag metrics in scope with trace id?
          return;
        }

        case "debugSnapshotComplete":
        case "debugSnapshotData": {
          return;
        }

        default: {
          yield* _(Metric.increment(Metrics.UnknownMessageCount));
          yield* _(Metric.incrementBy(Metrics.UnknownMessageSizeBytes, size));
          return;
        }
      }
    }),
  );

  const aquire = Effect.orDie(
    Effect.sync(() => {
      const client = createPromiseClient(StreamService, connectTransport);
      const request = createRequest({
        substreamPackage,
        outputModule,
        startBlockNum,
        stopBlockNum,
        startCursor: Option.getOrUndefined(currentCursor),
      });

      const controller = new AbortController();
      const stream = Stream.fromAsyncIterable(client.blocks(request, { signal: controller.signal }), (cause) => {
        return new SourceStreamError({
          cause,
          cursor: currentCursor,
        });
      });

      return {
        stream,
        abort: () => controller.abort(),
      };
    }),
  );

  const stream = Stream.acquireRelease(aquire, (scope) => Effect.sync(scope.abort)).pipe(
    Stream.flatMap(({ stream }) => stream),
    Stream.tapSink(metrics),
    Stream.tap((response) =>
      Effect.sync(() => {
        if (response.message.case === "blockScopedData") {
          currentCursor = Option.some(response.message.value.cursor);
        } else if (response.message.case === "blockUndoSignal") {
          currentCursor = Option.some(response.message.value.lastValidCursor);
        }
      }),
    ),
  );

  const retry = Func.pipe(
    // Retry with jittered exponential backoff.
    Schedule.exponential(Duration.millis(100), 2),
    Schedule.jittered,
    // With a maximum delay of 10 seconds between retry.
    Schedule.either(Schedule.spaced(Duration.seconds(10))),
    // Retry for up to 3 minutes.
    Schedule.compose(Schedule.elapsed),
    Schedule.whileOutput(Duration.lessThanOrEqualTo(Duration.seconds(maxRetrySeconds ?? 300))),
  );

  return Stream.retry(stream, retry);
}
