import { createModuleFromManifest } from "./createModuleFromManifest.js";
import type { Manifest } from "./manifestSchema.js";
import { Binary, ModuleMetadata, Modules, Package, PackageMetadata } from "@substreams/core/proto";
import * as fs from "node:fs";
import * as path from "node:path";

export type ConvertToPackageOptions = {
  skipSourceCodeImportValidation?: boolean;
};

export function createPackageFromManifest(
  manifest: Manifest.Manifest,
  { skipSourceCodeImportValidation = false }: ConvertToPackageOptions = {},
) {
  const meta = new PackageMetadata({
    version: manifest.package.version,
    url: manifest.package.url,
    name: manifest.package.name,
    doc: manifest.package.doc,
  });

  const pkg = new Package({
    version: 1n,
    packageMeta: [meta],
    modules: new Modules(),
    ...(manifest.network && { network: manifest.network }),
  });

  // rome-ignore lint/style/noNonNullAssertion: guaranteed
  const modules = pkg.modules!;

  const code = new Map<string, number>();
  for (const module of manifest.modules) {
    const moduleMeta = new ModuleMetadata({
      doc: module.doc ?? "",
      packageIndex: 0n,
    });

    const binaryDefinition = manifest.binaries[module.binary || "default"];
    if (!binaryDefinition) {
      const binary = module.binary !== "" ? `(implicit) binary "${module.binary}"` : "default binary";
      throw new Error(
        `Module "${module.name}" refers to the ${binary}, which is not defined in the "binaries" section of the manifest`,
      );
    }

    switch (binaryDefinition.type) {
      case "wasm/rust-v1": {
        let index = code.get(binaryDefinition.file);

        if (index === undefined) {
          index = modules.binaries.length;

          if (skipSourceCodeImportValidation) {
            modules.binaries.push(new Binary({ type: binaryDefinition.type }));
          } else {
            const data = fs.readFileSync(path.join(manifest.workDir, binaryDefinition.file));
            modules.binaries.push(
              new Binary({
                type: binaryDefinition.type,
                content: new Uint8Array(data),
              }),
            );
          }

          code.set(binaryDefinition.file, index);
        }

        modules.modules.push(createModuleFromManifest(module, index));
        break;
      }

      default: {
        throw new Error(`Module "${module.name}": invalid code type "${binaryDefinition.type}"`);
      }
    }

    pkg.moduleMeta.push(moduleMeta);
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
