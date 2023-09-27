import * as App from "@effect/cli/CliApp";
import * as Span from "@effect/cli/HelpDoc/Span";
import * as Func from "@effect/data/Function";
import * as Effect from "@effect/io/Effect";

import * as RootCommand from "./commands/root";

const cli = App.make({
  name: "Substreams File Sink",
  version: "0.0.0",
  command: RootCommand.command,
  summary: Span.text("A simple file sink for substreams"),
});

Func.pipe(
  Effect.sync(() => process.argv.slice(2)),
  Effect.flatMap((args) => App.run(cli, args, RootCommand.handle)),
  Effect.runPromise,
);

// TODO: Add all the remaining cli options (start block, stop block, cursor, etc. ... ).
// TODO: Add an option to specify the output location (for .messages and .cursor files).
// TODO: Add spans and logging.
// TODO: Add metrics to log prints.
