import { isManifestFile, isPackageFile, isRemotePath } from "../utils/pathUtils.js";
import { readPackageFromFile } from "./readPackageFromFile.js";
import { readPackageFromManifest } from "./readPackageFromManifest.js";
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
