#!/usr/bin/env node

import { Command, Options, Span } from "@effect/cli";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Effect, LogLevel, Logger } from "effect";
import * as RunCommand from "./commands/run.js";

export const root = Command.make("root", {
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
}).pipe(
  Command.withSubcommands([RunCommand.command]),
  Command.provide(({ options }) => Logger.minimumLogLevel(options.logLevel)),
);

const cli = Command.run(root, {
  name: "Substreams File Sink",
  version: "0.0.0",
  summary: Span.text("A simple file sink for substreams"),
});

Effect.suspend(() => cli(process.argv)).pipe(Effect.provide(NodeContext.layer), NodeRuntime.runMain);

// TODO: Add all the remaining cli options (start block, stop block, cursor, etc. ... ).
// TODO: Add an option to specify the output location (for .messages and .cursor files).
// TODO: Add spans and logging.
// TODO: Add metrics to log prints.
