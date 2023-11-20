import { Command, Options } from "@effect/cli";
import { Data, Effect, LogLevel, Logger, Match } from "effect";
import * as RunCommand from "./run.js";

export type RootSubcommand = RunCommand.RunCommand;

export class RootCommand extends Data.TaggedClass("RootCommand")<{
  readonly logLevel: LogLevel.LogLevel;
  readonly subcommand: RootSubcommand;
}> {}

export const command = Command.standard("root", {
  options: Options.all({
    logLevel: Options.choiceWithValue("log-level", [
      ["off", LogLevel.None],
      ["info", LogLevel.Info],
      ["warn", LogLevel.Warning],
      ["error", LogLevel.Error],
      ["debug", LogLevel.Debug],
      ["trace", LogLevel.Trace],
    ]).pipe(Options.withDefault(LogLevel.Info), Options.withAlias("l")),
  }),
}).pipe(Command.withSubcommands([RunCommand.command]));

export function handle(command: RootCommand) {
  const layer = Logger.minimumLogLevel(command.logLevel);
  const program = Match.value(command.subcommand).pipe(
    Match.tagsExhaustive({
      RunCommand: (_) => RunCommand.handle(_),
    }),
  );

  return Effect.provide(program, layer);
}
