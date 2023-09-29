import * as App from "@effect/cli/CliApp";
import * as Span from "@effect/cli/HelpDoc/Span";
import * as ValidationError from "@effect/cli/ValidationError";
import { Effect } from "effect";

import * as RootCommand from "./commands/root.js";

const cli = App.make({
  name: "Substreams File Sink",
  version: "0.0.0",
  command: RootCommand.command,
  summary: Span.text("A simple file sink for substreams"),
});

Effect.sync(() => process.argv.slice(2)).pipe(
  Effect.flatMap((_) => App.run(cli, _, RootCommand.handle)),
  // Command validation errors are handled by `@effect/cli` and logged to stderr already.
  Effect.catchIf(ValidationError.isValidationError, () => Effect.unit),
  // Log all other errors to stderr.
  Effect.catchAllCause((_) => Effect.logError(_)),
  Effect.runPromise,
);

// TODO: Add all the remaining cli options (start block, stop block, cursor, etc. ... ).
// TODO: Add an option to specify the output location (for .messages and .cursor files).
// TODO: Add spans and logging.
// TODO: Add metrics to log prints.
