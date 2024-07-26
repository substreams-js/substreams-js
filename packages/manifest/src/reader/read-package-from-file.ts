import * as fs from "node:fs/promises";
import { createSubstream } from "@substreams/core";
import type { Package } from "@substreams/core/proto";

export async function readPackageFromFile(file: string): Promise<Package> {
  const fileContents = await fs.readFile(file);
  return createSubstream(fileContents);
}
