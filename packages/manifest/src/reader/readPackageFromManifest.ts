import { converManifestToPackage } from "../manifest/converManifestToPackage.js";
import { parseManifestJson } from "../manifest/manifestSchema.js";
import type { Package } from "@substreams/core/proto";
import * as fs from "node:fs";
import * as path from "node:path";
import { parse as parseYaml } from "yaml";

export function readPackageFromManifest(file: string): Promise<Package> {
  const json = parseYaml(fs.readFileSync(file, "utf-8"));
  if (typeof json !== "object" || json === null) {
    throw new Error(`Failed to load manifest ${file}`);
  }

  const manifest = parseManifestJson({ ...json, workDir: path.dirname(file) });
  return converManifestToPackage(manifest);
}
