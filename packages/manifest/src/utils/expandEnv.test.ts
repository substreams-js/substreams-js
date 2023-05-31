import { expandEnv } from "./expandEnv.js";
import { expect, test } from "vitest";

test("replaces environment variables", () => {
  expect(expandEnv("$BAR", { BAR: "bar" })).toBe("bar");
  expect(expandEnv("foo $BAR baz", { BAR: "bar" })).toBe("foo bar baz");
});

test("replaces multiple environment variables", () => {
  expect(expandEnv("foo $BAR baz $QUX", { BAR: "bar", QUX: "qux" })).toBe("foo bar baz qux");
});

test("throws if environment variable is not defined", () => {
  expect(() => expandEnv("$BAR", {})).toThrowErrorMatchingInlineSnapshot(
    '"Environment variable \\"BAR\\" is not defined"',
  );
});

test("doesn't throw if environment variable is not defined but default value is provided", () => {
  expect(expandEnv("$BAR:-baz", {})).toBe("baz");
});

test("doesn't throw if environment variable is not defined but default value is empty", () => {
  expect(expandEnv("$BAR:-", {})).toBe("");
});

test("doesn't replace (but cleans up) escaped environment variables", () => {
  expect(expandEnv("\\$BAR", { BAR: "bar" })).toBe("$BAR");
});
