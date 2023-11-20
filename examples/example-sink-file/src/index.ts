#!/usr/bin/env node

import { CliApp, HelpDoc, Span, ValidationError } from "@effect/cli";
import { NodeContext, Runtime } from "@effect/platform-node";
import { Effect, Match, Option } from "effect";
import * as RootCommand from "./commands/root.js";
import * as RunCommand from "./commands/run.js";

const cli = CliApp.make({
  name: "Substreams File Sink",
  version: "0.0.0",
  command: RootCommand.command,
  summary: Span.text("A simple file sink for substreams"),
});

const program = Effect.sync(() => process.argv.slice(2)).pipe(
  Effect.flatMap((_) =>
    CliApp.run(
      cli,
      _,
      Effect.unifiedFn(({ subcommand, options: { logLevel } }) =>
        Option.match(subcommand, {
          onNone: () => Effect.fail(ValidationError.missingSubcommand(HelpDoc.p("Missing subcommand"))),
          onSome: (_) => {
            const subcommand = Match.value(_).pipe(
              Match.tagsExhaustive({
                RunCommand: (_) => new RunCommand.RunCommand(_),
              }),
            );

            return RootCommand.handle(new RootCommand.RootCommand({ logLevel, subcommand }));
          },
        }),
      ),
    ),
  ),
  // Command validation errors are handled by `@effect/cli` and logged to stderr already.
  Effect.catchIf(ValidationError.isValidationError, () => Effect.unit),
  // Log all other errors to stderr.
  Effect.catchAllCause((_) => Effect.logError(_)),
);

Runtime.runMain(Effect.provide(program, NodeContext.layer));

// TODO: Add all the remaining cli options (start block, stop block, cursor, etc. ... ).
// TODO: Add an option to specify the output location (for .messages and .cursor files).
// TODO: Add spans and logging.
// TODO: Add metrics to log prints.
