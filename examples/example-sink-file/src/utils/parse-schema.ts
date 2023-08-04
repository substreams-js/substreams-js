import * as HelpDoc from "@effect/cli/HelpDoc";
import * as ValidationError from "@effect/cli/ValidationError";
import * as Either from "@effect/data/Either";
import * as Schema from "@effect/schema/Schema";
import * as TreeFormatter from "@effect/schema/TreeFormatter";

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
