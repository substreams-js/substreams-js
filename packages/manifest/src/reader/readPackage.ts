import { converManifestToPackage } from "../manifest/converManifestToPackage.js";
import { parseManifestJson } from "../manifest/manifestSchema.js";
import { isManifestFile, isPackageFile, isRemotePath } from "../utils/pathUtils.js";
import { createSubstream, fetchSubstream } from "@substreams/core";
import type { Package } from "@substreams/core/proto";
import * as fs from "node:fs";
import * as path from "node:path";
import { parse as parseYaml } from "yaml";

export function readPackageFromFile(file: string): Package {
  const fileContents = fs.readFileSync(file);
  return createSubstream(fileContents);
}

export function readPackageFromRemote(file: string): Promise<Package> {
  // TODO: Align naming.
  return fetchSubstream(file);
}

export function readPackageFromManifest(file: string): Promise<Package> {
  const json = parseYaml(fs.readFileSync(file, "utf-8"));
  if (typeof json !== "object" || json === null) {
    throw new Error(`Failed to load manifest ${file}`);
  }

  const manifest = parseManifestJson({ ...json, workDir: path.dirname(file) });
  return converManifestToPackage(manifest);
}

export async function readPackage(file: string): Promise<Package> {
  if (isRemotePath(file)) {
    if (isManifestFile(file)) {
      throw new Error("Remote manifest files are not supported");
    }

    return readPackageFromRemote(file);
  }

  return isPackageFile(file) ? readPackageFromFile(file) : readPackageFromManifest(file);
}
