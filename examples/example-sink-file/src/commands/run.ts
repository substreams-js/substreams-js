import { Args, Command, Options } from "@effect/cli";
import { Path } from "@effect/platform-node";
import { Schema } from "@effect/schema";
import { Duration, Effect, Layer } from "effect";
import * as Stream from "../stream/stream.js";
import { parseSchema } from "../utils/parse-schema.js";

const MaxRetryDuration = Schema.NumberFromString;

export const command = Command.make(
  "run",
  {
    args: Args.text({ name: "substream" }).pipe(
      Args.withDescription("The path to a substream package (.spkg) or substreams.yaml file"),
      Args.withDefault("substreams.yaml"),
    ),
    options: Options.all({
      outputModule: Options.text("output-module").pipe(
        Options.withAlias("o"),
        Options.withDescription("Output module name"),
      ),
      params: Options.keyValueMap("params").pipe(
        Options.optional,
        Options.withAlias("p"),
        Options.withDescription(
          "Set params for parameterizable modules in the form of `-p <module>=<value>`. Can be specified multiple times (e.g. `-p module1=valA -p module2=valX&valY`)",
        ),
      ),
      endpoint: Options.text("endpoint").pipe(
        Options.withAlias("e"),
        Options.withDescription("Endpoint to connect to"),
        Options.withDefault("https://mainnet.eth.streamingfast.io"),
      ),
      finalBlocksOnly: Options.boolean("final-blocks-only").pipe(
        Options.withDescription("Get only irreversible blocks"),
        Options.withDefault(false),
      ),
      developmentMode: Options.boolean("development-mode").pipe(
        Options.withDescription(
          "Enable development mode, use it for testing purpose only, should not be used for production workload",
        ),
        Options.withDefault(false),
      ),
      maxRetryDuration: Options.text("max-retry-duration").pipe(
        Options.withDescription("Maximum duration to retry for in seconds"),
        Options.withDefault("300"),
        Options.mapOrFail(parseSchema(MaxRetryDuration)),
        Options.map(Duration.seconds),
      ),
    }),
  },
  ({ options, args: packagePath }) => {
    const stream = Effect.gen(function* (_) {
      if (!(packagePath.startsWith("http://") || packagePath.startsWith("https://"))) {
        const path = yield* _(Path.Path);
        if (!path.isAbsolute(packagePath)) {
          packagePath = path.join(process.cwd(), packagePath);
        }
      }

      return yield* _(
        Stream.runStream({
          packagePath,
          outputModule: options.outputModule,
        }),
      );
    });

    return Effect.provide(stream, Layer.merge(Stream.layer, Path.layer));
  },
);

