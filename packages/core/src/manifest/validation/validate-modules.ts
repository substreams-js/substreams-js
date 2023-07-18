import { Module_Input_Store_Mode, Modules } from "../../proto.js";
import { isMapModule } from "../../utils/is-map-module.js";
import { isStoreModule } from "../../utils/is-store-module.js";
import { storeModeName } from "../../utils/store-mode-name.js";
import { nameRegExp } from "./validate-package.js";

export type ValidatePackageOptions = {
  skipModuleOutputTypeValidation?: boolean | undefined;
};

export function validateModules(modules: Modules) {
  const codeSize = modules.binaries.reduce((carry, binary) => carry + binary.content.length, 0);
  if (codeSize > 100_000_000) {
    throw new Error("Limit of 100MB of module code size reached");
  }

  if (modules.modules.length > 100) {
    throw new Error("Limit of 100 modules reached");
  }

  for (const mod of modules.modules) {
    for (const segment of mod.name.split(":")) {
      if (!nameRegExp.test(segment)) {
        throw new Error(`Module "${mod.name}": segment "${segment}" does not match regex ${nameRegExp.toString()}`);
      }
    }

    if (mod.inputs.length > 30) {
      throw new Error(`Limit of 30 inputs for a given module ("${mod.name}") reached`);
    }

    for (const [index, input] of mod.inputs.entries()) {
      if (input.input.case === "params") {
        if (index !== 0) {
          throw new Error(`Module "${mod.name}": input ${index}: params must be first input`);
        }
      } else if (input.input.case === "source") {
        if (!input.input.value.type) {
          throw new Error(`Module "${mod.name}": input ${index}: source type empty`);
        }
      } else if (input.input.case === "map") {
        const seek = input.input.value.moduleName;
        const target = modules.modules.find((inner) => inner.name === seek);

        if (target === undefined) {
          throw new Error(`Module "${mod.name}": input ${index}: map input named "${seek}" not found`);
        }

        if (!isMapModule(target)) {
          throw new Error(`Module "${mod.name}": input ${index}: referenced module "${seek}" not of 'map' kind`);
        }
      } else if (input.input.case === "store") {
        const seek = input.input.value.moduleName;
        const target = modules.modules.find((inner) => inner.name === seek);

        if (target === undefined) {
          throw new Error(`Module "${mod.name}": input ${index}: store input named "${seek}" not found`);
        }

        if (!isStoreModule(target)) {
          throw new Error(`Module "${mod.name}": input ${index}: referenced module "${seek}" not of 'store' kind`);
        }

        switch (input.input.value.mode) {
          case Module_Input_Store_Mode.GET:
          case Module_Input_Store_Mode.DELTAS:
            break;

          default: {
            const mode = storeModeName(input.input.value.mode);
            throw new Error(`Module "${mod.name}": input ${index}: unknown store mode value ${mode}`);
          }
        }
      }
    }
  }

  return null;
}
