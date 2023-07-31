import type { Module } from "../../proto.js";
import { getModuleOrThrow } from "../../utils/get-module.js";

export function applyParams(params: string[], modules: Module[]) {
  for (const param of params) {
    const index = param.indexOf("=");
    if (index <= 0) {
      throw new Error(`Invalid param ${param}. Must be in the form of "module=value" or "imported:module=value"`);
    }

    const module = param.slice(0, index);
    const value = param.slice(index + 1);

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
