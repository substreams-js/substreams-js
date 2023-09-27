import { expect, test } from "vitest";
import { type ProgressRange, mergeProgressRanges } from "./merge-progress-ranges.js";

test.each([
  {
    input: [
      [0n, 1n],
      [1n, 2n],
      [4n, 5n],
    ],
    expected: [
      [0n, 2n],
      [4n, 5n],
    ],
  },
  {
    input: [
      [0n, 1n],
      [2n, 3n],
    ],
    expected: [[0n, 3n]],
  },
  {
    input: [
      [0n, 2n],
      [2n, 3n],
    ],
    expected: [[0n, 3n]],
  },
  {
    input: [
      [0n, 123n],
      [200n, 500n],
      [124n, 200n],
    ],
    expected: [[0n, 500n]],
  },
] as {
  input: ProgressRange[];
  expected: ProgressRange[];
}[])("mergeProgressRanges($input) === $expected", ({ input, expected }) => {
  const merged = mergeProgressRanges(input);
  expect(merged).toMatchObject(expected);
});
