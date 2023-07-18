const placeholderRegExp = new RegExp(/((?!(?<=\\))\${?([\w]+)(?::-([^}\\]*))?}?)/, "g");
const escapedPlaceholderRegExp = new RegExp(/\\(\${?[\w]+:?[^}\\]*}?)/, "g");

export function expandEnv(subject: string, environment = process.env) {
  // Replace placeholders with environment variables.
  const expanded = subject.replace(placeholderRegExp, (_, __, key, def) => {
    const value = environment[key];

    if (value === undefined) {
      if (def !== undefined) {
        return def;
      }

      throw new Error(`Environment variable "${key}" is not defined`);
    }

    return value;
  });

  // Clean up escaped placeholders.
  return expanded.replace(escapedPlaceholderRegExp, "$1");
}
