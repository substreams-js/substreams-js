import { readLocalProtos } from "../protobuf/readLocalProtos.js";
import { readSystemProtos } from "../protobuf/readSystemProtos.js";
import { expandEnv } from "../utils/expandEnv.js";
import {
  isManifestFile,
  isPackageFile,
  isReadableLocalFile,
  isRemotePath,
  resolveLocalFile,
  resolveLocalProtoPath,
} from "../utils/pathUtils.js";
import { createPackageFromManifest } from "./createPackageFromManifest.js";
import { type Manifest, ManifestType } from "./manifestSchema.js";
import { createSubstream, fetchSubstream } from "@substreams/core";
import { type Module, Modules, type Package } from "@substreams/core/proto";
import * as fs from "node:fs";
import * as path from "node:path";
import { parse as parseYaml } from "yaml";

function parseManifestJson(input: unknown): Manifest.Manifest {
  return ManifestType.assert(input);
}

function readManifestFile(absolutePath: string): Manifest.Manifest {
  const json = parseYaml(fs.readFileSync(absolutePath, "utf-8"));
  if (typeof json !== "object" || json === null) {
    throw new Error(`Failed to load manifest ${absolutePath}`);
  }

  return parseManifestJson({ ...json, workDir: path.dirname(absolutePath) });
}

export function readManifest(inputPath: string): Manifest.Manifest {
  const manifest = readManifestFile(inputPath);
  if (manifest.specVersion !== "v0.1.0") {
    throw new Error("Invalid 'specVersion', must be v0.1.0");
  }

  for (const [key, value] of Object.entries(manifest.imports)) {
    manifest.imports[key] = expandEnv(value);
  }

  for (const [key, value] of manifest.protobuf.importPaths.entries()) {
    manifest.protobuf.importPaths[key] = expandEnv(value);
  }

  for (const module of manifest.modules) {
    switch (module.kind) {
      case "map": {
        if (!module.output?.type) {
          throw new Error(`Stream ${module.name}: missing 'output.type' for kind 'map'`);
        }

        break;
      }

      case "store": {
        if (!module.updatePolicy) {
          throw new Error("missing 'output.updatePolicy' for kind 'store'");
        }

        if (!module.valueType) {
          throw new Error("missing 'output.valueType' for kind 'store'");
        }

        const combinations: string[] = [
          "max:bigint",
          "max:int64",
          "max:bigdecimal",
          "max:bigfloat",
          "max:float64",
          "min:bigint",
          "min:int64",
          "min:bigdecimal",
          "min:bigfloat",
          "min:float64",
          "add:bigint",
          "add:int64",
          "add:bigdecimal",
          "add:bigfloat",
          "add:float64",
          "set:bytes",
          "set:string",
          "set:proto",
          "set:bigdecimal",
          "set:bigfloat",
          "set:bigint",
          "set:int64",
          "set:float64",
          "set_if_not_exists:bytes",
          "set_if_not_exists:string",
          "set_if_not_exists:proto",
          "set_if_not_exists:bigdecimal",
          "set_if_not_exists:bigfloat",
          "set_if_not_exists:bigint",
          "set_if_not_exists:int64",
          "set_if_not_exists:float64",
          "append:bytes",
          "append:string",
        ];

        const valueType = module.valueType.startsWith("proto:") ? "proto" : module.valueType;
        const combination = `${module.updatePolicy}:${valueType}`;
        if (!combinations.includes(combination)) {
          throw new Error(
            `Invalid 'output.updatePolicy' and 'output.valueType' combination, found ${combination} use one of: ${combinations}`,
          );
        }

        break;
      }

      default: {
        throw new Error(`Stream ${module.name}: invalid kind ${module.kind}`);
      }
    }

    for (const input of module.inputs) {
      parseInput(input);
    }
  }

  return manifest;
}

function inputIsMap(i: Manifest.Input) {
  return !!i.map && !i.store && !i.source && !i.params;
}

function inputIsStore(i: Manifest.Input) {
  return !!i.store && !i.map && !i.source && !i.params;
}

function inputIsSource(i: Manifest.Input) {
  return !!i.source && !i.map && !i.store && !i.params;
}

function inputIsParams(i: Manifest.Input) {
  return !!i.params && !i.source && !i.map && !i.store;
}

function parseInput(input: Manifest.Input) {
  if (inputIsMap(input) || inputIsSource(input)) {
    return;
  } else if (inputIsStore(input)) {
    if (!input.mode) {
      input.mode = "get";
    }

    if (input.mode !== "get" && input.mode !== "deltas") {
      throw new Error(`input store ${input.store} 'mode' parameter must be one of: 'get' or 'deltas'`);
    }

    return;
  } else if (inputIsParams(input)) {
    if (input.params !== "string") {
      throw new Error(
        "input 'params': 'string' is the only acceptable value here; specify the parameter's value under the top-level 'params' mapping",
      );
    }

    return;
  }

  throw new Error(
    "input has an unknown or mixed types; expect one, and only one of: 'params', 'map', 'store' or 'source'",
  );
}

export function readPackageFromFile(file: string): Package {
  const fileContents = fs.readFileSync(file);
  return createSubstream(fileContents);
}

export function readPackageFromRemote(file: string): Promise<Package> {
  // TODO: Align naming.
  return fetchSubstream(file);
}

export function readPackageFromManifest(path: string): Promise<Package> {
  const manifest = readManifest(path);
  return manifestToPkg(manifest);
}

export async function readPackage(path: string, cwd = process.cwd()): Promise<Package> {
  if (isRemotePath(path)) {
    if (isManifestFile(path)) {
      throw new Error("Remote manifest files are not supported");
    }

    return readPackageFromRemote(path);
  }

  const resolved = resolveLocalFile(path, cwd);
  return isPackageFile(resolved) ? readPackageFromFile(resolved) : readPackageFromManifest(resolved);
}

async function loadImports(pkg: Package, manifest: Manifest.Manifest) {
  const imports = await Promise.all(
    Object.entries(manifest.imports).map(async ([key, path]) => {
      const imported = await readPackage(path, manifest.workDir);
      if (imported.modules !== undefined) {
        prefixModules(imported.modules.modules, key);
      }

      return imported;
    }),
  );

  for (const imported of imports) {
    mergePackages(imported, pkg);
  }
}

function prefixModules(modules: Module[], prefix: string) {
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

function mergePackages(src: Package, dest: Package) {
  dest.modules = dest.modules ?? new Modules();
  src.modules = src.modules ?? new Modules();

  const newBasePackageIndex = BigInt(dest.packageMeta.length);
  const newBaseBinariesIndex = dest.modules.binaries.length;

  for (const modMeta of src.moduleMeta) {
    modMeta.packageIndex += newBasePackageIndex;
  }

  for (const mod of src.modules?.modules ?? []) {
    mod.binaryIndex += newBaseBinariesIndex;
  }

  dest.modules.modules.push(...src.modules.modules);
  dest.modules.binaries.push(...src.modules.binaries);
  dest.moduleMeta.push(...src.moduleMeta);
  dest.packageMeta.push(...src.packageMeta);
  dest.protoFiles.push(...src.protoFiles);
}

async function loadProtobufs(pkg: Package, manifest: Manifest.Manifest) {
  const system = readSystemProtos();
  for (const file of system.file) {
    // Ensure that the manifest doesn't include system protobufs.
    if (manifest.protobuf.files.find((inner) => inner === file.name)) {
      throw new Error(`Proto file ${file} already exists in system protobufs, do not include it in your manifest`);
    }

    pkg.protoFiles.push(file);
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
    pkg.protoFiles.push(...descriptor.file);
  }
}

export async function manifestToPkg(manifest: Manifest.Manifest): Promise<Package> {
  const pkg = createPackageFromManifest(manifest);
  await loadProtobufs(pkg, manifest);
  await loadImports(pkg, manifest);

  return pkg;
}
