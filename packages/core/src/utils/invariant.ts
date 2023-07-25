export function invariant(condition: unknown, description = "Invariant"): asserts condition {
  if (!condition) {
    throw new Error(description);
  }
}
