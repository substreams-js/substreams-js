import * as fs from "node:fs";
import * as path from "node:path";

export function isManifestFile(file: string) {
  if (isRemotePath(file)) {
    return false;
  }

  return file.endsWith(".yaml") || file.endsWith(".yml");
}

export function isPackageFile(path: string) {
  return path.endsWith(".spkg");
}

export function isRemotePath(path: string): boolean {
  return path.startsWith("http://") || path.startsWith("https://");
}

export function isReadableLocalFile(filePath: string) {
  if (isRemotePath(filePath)) {
    return false;
  }

  try {
    if (path.isAbsolute(filePath)) {
      fs.accessSync(filePath, fs.constants.R_OK);
      return true;
    }
  } catch {}

  return false;
}

export function resolveLocalFile(file: string, cwd = process.cwd()): string {
  if (isRemotePath(file)) {
    throw new Error(`Expected a local file path, but received ${file}`);
  }

  if (path.isAbsolute(file)) {
    return file;
  }

  return path.resolve(cwd, file);
}
