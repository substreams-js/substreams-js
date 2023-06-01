import { readLocalProtos } from "../protobuf/readLocalProtos.js";
import { readSystemProtos } from "../protobuf/readSystemProtos.js";
import { readPackage } from "../reader/readPackage.js";
import { isReadableLocalFile, isRemotePath, resolveLocalFile, resolveLocalProtoPath } from "../utils/pathUtils.js";
import { createPackageFromManifest } from "./createPackageFromManifest.js";
import type { Manifest } from "./manifestSchema.js";
import type { FileDescriptorProto } from "@bufbuild/protobuf";
import { type Module, Modules, type Package } from "@substreams/core/proto";
import * as path from "node:path";

export async function converManifestToPackage(manifest: Manifest.Manifest): Promise<Package> {
  const pkg = createPackageFromManifest(manifest);
  pkg.protoFiles.push(...(await readImportedProtos(manifest)));

  // TODO: Should we prevent recursive dependencies? What about duplicates? Should we merge & deduplicate those?
  for (const [key, value] of Object.entries(manifest.imports)) {
    const imported = await readImportedPackage(key, resolveImportedPackagePath(value, manifest.workDir));
    imported.modules = imported.modules ?? new Modules();
    pkg.modules = pkg.modules ?? new Modules();

    for (const meta of imported.moduleMeta) {
      meta.packageIndex += BigInt(pkg.packageMeta.length);
    }

    for (const mod of imported.modules?.modules ?? []) {
      mod.binaryIndex += pkg.modules.binaries.length;
    }

    pkg.modules.modules.push(...imported.modules.modules);
    pkg.modules.binaries.push(...imported.modules.binaries);
    pkg.moduleMeta.push(...imported.moduleMeta);
    pkg.packageMeta.push(...imported.packageMeta);
    pkg.protoFiles.push(...imported.protoFiles);
  }

  return pkg;
}

function resolveImportedPackagePath(path: string, context: string) {
  if (isRemotePath(path)) {
    return path;
  }

  return resolveLocalFile(path, context);
}

async function readImportedPackage(key: string, path: string) {
  const imported = await readPackage(path);
  if (imported.modules !== undefined) {
    prefixImportedModules(imported.modules.modules, key);
  }

  return imported;
}

function prefixImportedModules(modules: Module[], prefix: string) {
  for (const module of modules) {
    module.name = `${prefix}:${module.name}`;
    for (const [index, input] of module.inputs.entries()) {
      switch (input.input.case) {
        case "store": {
          input.input.value.moduleName = `${prefix}:${input.input.value.moduleName}`;
          break;
        }

        case "map": {
          input.input.value.moduleName = `${prefix}:${input.input.value.moduleName}`;
          break;
        }

        case "source":
        case "params": {
          break;
        }

        default: {
          throw new Error(
            `Module ${module.name} input index ${index}: unsupported module input type ${input.input.case}`,
          );
        }
      }
    }
  }
}

async function readImportedProtos(manifest: Manifest.Manifest) {
  const output: FileDescriptorProto[] = [];

  const system = readSystemProtos();
  for (const file of system.file) {
    // Ensure that the manifest doesn't include system protobufs.
    if (manifest.protobuf.files.find((inner) => inner === file.name)) {
      throw new Error(`Proto file ${file} already exists in system protobufs, do not include it in your manifest`);
    }

    output.push(file);
  }

  const paths = new Set<string>();
  for (const imp of manifest.protobuf.importPaths) {
    paths.add(path.resolve(manifest.workDir, imp));
  }

  // The manifest's root directory is always added to the list of import paths so that
  // files specified relative to the manifest's directory work properly. It is added last
  // so that if the user-specified import paths contain the file, it's picked from their
  // import paths instead of the implicitly added folder.
  paths.add(manifest.workDir);

  for (const file of manifest.protobuf.files) {
    const resolved = resolveLocalProtoPath(file, Array.from(paths));
    if (!isReadableLocalFile(resolved)) {
      throw new Error(`Proto file ${resolved} does not exist or is not readable`);
    }

    const descriptor = await readLocalProtos(resolved);
    output.push(...descriptor.file);
  }

  return output;
}
