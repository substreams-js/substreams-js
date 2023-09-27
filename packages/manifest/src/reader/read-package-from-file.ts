import * as fs from "node:fs";
import { createSubstream } from "@substreams/core";
import type { Package } from "@substreams/core/proto";

export function readPackageFromFile(file: string): Package {
  const fileContents = fs.readFileSync(file);
  return createSubstream(fileContents);
}
