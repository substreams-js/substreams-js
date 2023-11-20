import { Args, Command, Options } from "@effect/cli";
import { Path } from "@effect/platform-node";
import { Schema } from "@effect/schema";
import { isRemotePath } from "@substreams/manifest/utils/path-utils";
import { Data, Duration, Effect, HashMap, Option } from "effect";
import * as Stream from "../stream/stream.js";
import { parseSchema } from "../utils/parse-schema.js";

const MaxRetryDuration = Schema.NumberFromString;

export class RunCommand extends Data.TaggedClass("RunCommand")<{
  readonly packagePath: string;
  readonly outputModule: string;
  readonly endpoint: string;
  readonly finalBlocksOnly: boolean;
  readonly developmentMode: boolean;
  readonly maxRetryDuration: Duration.Duration;
  readonly params: Option.Option<HashMap.HashMap<string, string>>;
}> {}

export const command: Command.Command<RunCommand> = Command.standard("run", {
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
}).pipe(
  Command.map(({ args: packagePath, options }) => {
    return new RunCommand({
      params: options.params,
      packagePath,
      outputModule: options.outputModule,
      endpoint: options.endpoint,
      finalBlocksOnly: options.finalBlocksOnly,
      developmentMode: options.developmentMode,
      maxRetryDuration: options.maxRetryDuration,
    });
  }),
);

export function handle(command: RunCommand) {
  return Effect.gen(function* (_) {
    let packagePath = command.packagePath;
    if (!isRemotePath(command.packagePath)) {
      const path = yield* _(Path.Path);
      if (!path.isAbsolute(packagePath)) {
        packagePath = path.join(process.cwd(), packagePath);
      }
    }

    const stream = Stream.runStream({
      packagePath,
      outputModule: command.outputModule,
    });

    yield* _(Effect.provide(stream, Stream.layer));
  });
}
