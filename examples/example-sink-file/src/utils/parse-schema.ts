import { HelpDoc, ValidationError } from "@effect/cli";
import { Schema, TreeFormatter } from "@effect/schema";
import { Either } from "effect";

export function parseSchema<From, To>(schema: Schema.Schema<From, To>) {
  return (value: unknown): Either.Either<ValidationError.ValidationError, To> => {
    const result = Schema.parseEither(schema)(value, {
      errors: "all",
    });

    return Either.mapLeft(result, (error) =>
      ValidationError.invalidValue(HelpDoc.p(TreeFormatter.formatErrors(error.errors))),
    );
  };
}
