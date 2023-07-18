import type { Module } from "../../proto.js";
import { getModuleOrThrow } from "../../utils/get-module.js";

export function applyParams(params: string[], modules: Module[]) {
  for (const param of params) {
    const [module, value] = param.split("=", 2);
    if (module === undefined || value === undefined) {
      throw new Error(`Invalid param ${param}. Must be in the form of "module=value" or "imported:module=value"`);
    }

    const match = getModuleOrThrow(modules, module);
    const [input] = match.inputs;
    if (input === undefined) {
      throw new Error(`Missing required params input definition for module ${module}`);
    }

    if (input.input.case !== "params") {
      throw new Error(`First input definition of module ${module} is not a params input`);
    }

    // Assign the parameter value to the input.
    input.input.value.value = value;
  }
}
