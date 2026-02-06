import * as fs from "node:fs";
import * as path from "node:path";
import { create } from "@bufbuild/protobuf";
import {
  BinarySchema,
  ModuleMetadataSchema,
  ModulesSchema,
  type Package,
  PackageMetadataSchema,
  PackageSchema,
} from "@substreams/core/proto";
import { createModuleFromManifest } from "./create-module-from-manifest.js";
import type { Manifest } from "./manifest-schema.js";

export type ConvertToPackageOptions = {
  skipSourceCodeImportValidation?: boolean;
};

export function createPackageFromManifest(
  manifest: Manifest,
  cwd: string,
  { skipSourceCodeImportValidation = false }: ConvertToPackageOptions = {},
): Package {
  const meta = create(PackageMetadataSchema, {
    name: manifest.package.name,
    version: manifest.package.version,
    ...(manifest.package.url !== undefined ? { url: manifest.package.url } : undefined),
    ...(manifest.package.doc !== undefined ? { doc: manifest.package.doc } : undefined),
  });

  const pkg = create(PackageSchema, {
    version: BigInt(1),
    packageMeta: [meta],
    modules: create(ModulesSchema, { modules: [], binaries: [] }),
    ...(manifest.network !== undefined ? { network: manifest.network } : undefined),
  });

  // biome-ignore lint/style/noNonNullAssertion: guaranteed to be set above
  const modules = pkg.modules!;

  const code = new Map<string, number>();
  for (const module of manifest.modules) {
    pkg.moduleMeta.push(
      create(ModuleMetadataSchema, {
        packageIndex: BigInt(0), // Re-indexing happens later.
        ...(module.doc !== undefined ? { doc: module.doc } : undefined),
      }),
    );

    const binaryDefinition = manifest.binaries?.[module.binary || "default"];
    if (!binaryDefinition) {
      const binary = module.binary ? `(implicit) binary "${module.binary}"` : "default binary";
      throw new Error(
        `Module "${module.name}" refers to the ${binary}, which is not defined in the "binaries" section of the manifest`,
      );
    }

    let index = code.get(binaryDefinition.file);
    if (index === undefined) {
      index = modules.binaries.length;

      if (skipSourceCodeImportValidation) {
        modules.binaries.push(create(BinarySchema, { type: binaryDefinition.type }));
      } else {
        const data = fs.readFileSync(path.join(cwd, binaryDefinition.file));
        modules.binaries.push(
          create(BinarySchema, {
            type: binaryDefinition.type,
            content: new Uint8Array(data),
          }),
        );
      }

      code.set(binaryDefinition.file, index);
    }

    modules.modules.push(createModuleFromManifest(module, index));
  }

  if (manifest.params) {
    for (const [moduleName, paramValue] of Object.entries(manifest.params)) {
      const matchingModule = modules.modules.find((mod) => mod.name === moduleName);
      if (matchingModule === undefined) {
        throw new Error(`Params value defined for module ${moduleName}, but such module is not defined`);
      }

      const [firstInput] = matchingModule.inputs;
      if (firstInput === undefined) {
        throw new Error(
          `Params value defined for module ${moduleName} but module has no inputs defined, add 'params: string' to 'inputs' for module`,
        );
      }

      if (firstInput.input.case !== "params") {
        throw new Error(
          `Params value defined for module ${moduleName} but module does not have 'params' as its first input type`,
        );
      }

      firstInput.input.value.value = paramValue;
    }
  }

  return pkg;
}
