import * as path from "node:path";
import type { FileDescriptorProto } from "@bufbuild/protobuf";
import { createModuleGraph } from "@substreams/core";
import { type Module, Modules, type Package } from "@substreams/core/proto";
import { readLocalProtos } from "../protobuf/read-local-protos.js";
import { readSystemProtos } from "../protobuf/read-system-protos.js";
import { readPackage } from "../reader/read-package.js";
import { isReadableLocalFile, isRemotePath, resolveLocalFile } from "../utils/path-utils.js";
import { createPackageFromManifest } from "./create-package-from-manifest.js";
import type { Manifest } from "./manifest-schema.js";

export async function convertManifestToPackage(manifest: Manifest, cwd: string): Promise<Package> {
  const pkg = createPackageFromManifest(manifest, cwd);
  pkg.protoFiles.push(...(await readImportedProtos(manifest, cwd)));

  // TODO: Should we prevent recursive dependencies? What about duplicates? Should we merge & deduplicate those?
  for (const [key, value] of Object.entries(manifest.imports ?? {})) {
    const imported = await readImportedPackage(key, resolveImportedPackagePath(value, cwd));
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

    // Deduplicate proto files. First wins.
    for (const file of imported.protoFiles) {
      // TODO: Verify that this is the same approach used by the go package.
      if (file.name !== undefined && pkg.protoFiles.findIndex((inner) => inner.name === file.name) !== -1) {
        continue;
      }

      pkg.protoFiles.push(file);
    }
  }

  const modules = pkg.modules?.modules ?? [];
  const graph = createModuleGraph(modules);
  for (const module of modules) {
    module.initialBlock = graph.startBlockFor(module);
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

async function readImportedProtos(manifest: Manifest, cwd: string) {
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
    paths.add(path.resolve(cwd, imp));
  }

  // The manifest's root directory is always added to the list of import paths so that
  // files specified relative to the manifest's directory work properly. It is added last
  // so that if the user-specified import paths contain the file, it's picked from their
  // import paths instead of the implicitly added folder.
  paths.add(cwd);

  for (const file of manifest.protobuf.files) {
    // Find the first readable file in the import paths.
    let context: string | undefined = undefined;
    for (const candidate of paths) {
      const resolved = path.resolve(candidate, file);
      if (isReadableLocalFile(resolved)) {
        context = candidate;
        break;
      }
    }

    if (context === undefined) {
      throw new Error(`Proto file ${file} does not exist or is not readable`);
    }

    const descriptor = await readLocalProtos(context, file);
    output.push(...descriptor.file);
  }

  return output;
}
