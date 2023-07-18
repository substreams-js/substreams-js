import { isManifestFile, isPackageFile, isRemotePath } from "../utils/path-utils.js";
import { readPackageFromFile } from "./read-package-from-file.js";
import { readPackageFromManifest } from "./read-package-from-manifest.js";
import { fetchSubstream } from "@substreams/core";
import type { Package } from "@substreams/core/proto";

export async function readPackage(file: string): Promise<Package> {
  if (isRemotePath(file)) {
    if (isManifestFile(file)) {
      throw new Error("Remote manifest files are not supported");
    }

    return fetchSubstream(file);
  }

  return isPackageFile(file) ? readPackageFromFile(file) : readPackageFromManifest(file);
}
