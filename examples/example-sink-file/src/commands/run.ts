import * as Args from "@effect/cli/Args";
import * as Command from "@effect/cli/Command";
import * as Options from "@effect/cli/Options";
import * as Schema from "@effect/schema/Schema";
import { Data, Duration, Effect, Option } from "effect";

import * as Stream from "../stream/stream.js";
import { parseSchema } from "../utils/parse-schema.js";

const Param = Schema.templateLiteral(Schema.string, Schema.literal("="), Schema.string).pipe(
  Schema.description("A parameter in the form of `module=value`"),
  Schema.transform(
    Schema.tuple(Schema.string, Schema.string),
    (item) => {
      const index = item.indexOf("=");
      const module = item.slice(0, index);
      const value = item.slice(index + 1);
      return [module, value] as const;
    },
    ([module, value]) => `${module}=${value}` as const,
  ),
  Schema.brand("Param"),
);

const Params = Schema.chunkFromSelf(Param);

const MaxRetryDuration = Schema.NumberFromString;

export class RunCommand extends Data.TaggedClass("RunCommand")<{
  readonly packagePath: string;
  readonly outputModule: string;
  readonly endpoint: string;
  readonly finalBlocksOnly: boolean;
  readonly developmentMode: boolean;
  readonly maxRetryDuration: Duration.Duration;
  readonly params: Schema.Schema.To<typeof Params>;
}> {}

export const command: Command.Command<RunCommand> = Command.make("run", {
  args: Args.text({ name: "substream" }).pipe(
    Args.addDescription("The path to a substream package (.spkg) or substreams.yaml file"),
    Args.between(0, 1),
    Args.map((_) => Option.getOrElse(Option.fromIterable(_), () => "./substreams.yaml")),
  ),
  options: Options.all({
    outputModule: Options.text("output-module").pipe(Options.alias("o"), Options.withDescription("Output module name")),
    params: Options.text("params").pipe(
      Options.alias("p"),
      Options.repeat,
      Options.withDescription(
        "Set params for parameterizable modules in the form of `-p <module>=<value>`. Can be specified multiple times (e.g. `-p module1=valA -p module2=valX&valY`)",
      ),
      Options.mapOrFail(parseSchema(Params)),
    ),
    endpoint: Options.text("endpoint").pipe(
      Options.alias("e"),
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
  const program = Stream.runStream({
    packagePath: command.packagePath,
    outputModule: command.outputModule,
  });

  return Effect.provide(program, Stream.layer);
}
