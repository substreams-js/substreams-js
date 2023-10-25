import * as Command from "@effect/cli/Command";
import * as HelpDoc from "@effect/cli/HelpDoc";
import * as Options from "@effect/cli/Options";
import * as ValidationError from "@effect/cli/ValidationError";
import { Data, Effect, Either, LogLevel, Logger, Match, Option } from "effect";

import * as RunCommand from "./run.js";

export type RootSubcommand = RunCommand.RunCommand;

export class RootCommand extends Data.TaggedClass("RootCommand")<{
  readonly logLevel: LogLevel.LogLevel;
  readonly subcommand: RootSubcommand;
}> {}

export const command: Command.Command<RootCommand> = Command.make("root", {
  options: Options.all({
    logLevel: Options.choiceWithValue("log-level", [
      ["off", "None"],
      ["info", "Info"],
      ["warn", "Warning"],
      ["error", "Error"],
      ["debug", "Debug"],
      ["trace", "Trace"],
    ] as const).pipe(Options.withDefault("Info" as const), Options.alias("l")),
  }),
}).pipe(
  Command.subcommands([RunCommand.command]),
  Command.mapOrFail(({ options, subcommand }) => {
    if (Option.isNone(subcommand)) {
      return Either.left(ValidationError.missingSubCommand(HelpDoc.p("No subcommand provided")));
    }

    return Either.right(
      new RootCommand({
        logLevel: LogLevel.fromLiteral(options.logLevel),
        subcommand: subcommand.value,
      }),
    );
  }),
);

export function handle(command: RootCommand) {
  const layer = Logger.minimumLogLevel(command.logLevel);
  const program = Match.value(command.subcommand).pipe(
    Match.tagsExhaustive({
      RunCommand: RunCommand.handle,
    }),
  );

  return Effect.provide(program, layer);
}
