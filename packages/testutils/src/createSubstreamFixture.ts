import { createSubstream } from "@substreams/core";
import * as fs from "node:fs";
import * as url from "node:url";

export function createSubstreamFixture(name: string) {
  const handle = fs.readFileSync(url.fileURLToPath(new URL(`../fixtures/${name}.spkg`, import.meta.url)));
  return createSubstream(handle);
}
