import * as fs from "node:fs";
import * as url from "node:url";
import { createSubstream } from "../../../src/utils/create-substream.js";

export function createSubstreamFixture(name: string) {
  const handle = fs.readFileSync(url.fileURLToPath(new URL(`./${name}.spkg`, import.meta.url)));
  return createSubstream(handle);
}
