import { createSubstream } from "../src/index.js";
import { readFileSync } from "node:fs";

export function createSubstreamFixture(name: string) {
  const handle = readFileSync(new URL(`./fixtures/spkgs/${name}.spkg`, import.meta.url));
  return createSubstream(handle);
}
