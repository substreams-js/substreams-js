import { createSubstream } from "@substreams/core";
import type { Package } from "@substreams/core/proto";
import * as fs from "node:fs";

export function readPackageFromFile(file: string): Package {
  const fileContents = fs.readFileSync(file);
  return createSubstream(fileContents);
}
