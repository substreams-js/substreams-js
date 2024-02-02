import { Args, Command, Options } from "@effect/cli";
import { HelpDoc, ValidationError } from "@effect/cli";
import { Path } from "@effect/platform-node";
import { Schema, TreeFormatter } from "@effect/schema";
import { Duration, Effect, Layer } from "effect";
import { Either } from "effect";
import * as Stream from "../stream/stream.js";

function parseSchema<From, To>(schema: Schema.Schema<never, From, To>) {
  const decode =  Schema.decodeUnknownEither(schema)

  return (value: unknown): Either.Either<ValidationError.ValidationError, To> => {
    const result = decode(value, {
      errors: "all",
    });

    return Either.mapLeft(result, (error) =>
      ValidationError.invalidValue(HelpDoc.p(TreeFormatter.formatIssue(error.error))),
    );
  };
}

export const command = Command.make("run", {
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
      Options.mapOrFail(parseSchema(Schema.NumberFromString)),
      Options.map(Duration.seconds),
    ),
  }),
}).pipe(
  Command.withDescription("Runs a substream module"),
  Command.withHandler(({ options, args: packagePath }) => {
    return Effect.gen(function* (_) {
      if (!(packagePath.startsWith("http://") || packagePath.startsWith("https://"))) {
        const path = yield* _(Path.Path);
        if (!path.isAbsolute(packagePath)) {
          packagePath = path.join(process.cwd(), packagePath);
        }
      }

      const stream = Stream.runStream({
        packagePath,
        outputModule: options.outputModule,
      });

      return yield* _(Effect.provide(stream, Layer.merge(Stream.layer, Path.layer)));
    });
  }),
);
