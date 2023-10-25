import {
  Module,
  Module_Input,
  Module_Input_Store_Mode,
  Module_KindMap,
  Module_KindStore,
  Module_KindStore_UpdatePolicy,
  Module_Output,
} from "@substreams/core/proto";
import type { Module as ModuleSchema } from "./manifest-schema.js";

const MAX_UINT_64 = BigInt("18446744073709551615");

export function createModuleFromManifest(module: ModuleSchema, index: number): Module {
  const out = new Module({
    name: module.name,
    binaryIndex: index,
    binaryEntrypoint: module.name,
    initialBlock: module.initialBlock ?? MAX_UINT_64,
  });

  switch (module.kind) {
    case "map": {
      out.kind = {
        case: "kindMap",
        value: new Module_KindMap(module.output?.type ? { outputType: module.output.type } : {}),
      };

      out.output = new Module_Output({
        type: module.output.type,
      });

      break;
    }

    case "store": {
      let updatePolicy: Module_KindStore_UpdatePolicy;
      switch (module.updatePolicy) {
        case "set": {
          updatePolicy = Module_KindStore_UpdatePolicy.SET;
          break;
        }

        case "set_if_not_exists": {
          updatePolicy = Module_KindStore_UpdatePolicy.SET_IF_NOT_EXISTS;
          break;
        }

        case "add": {
          updatePolicy = Module_KindStore_UpdatePolicy.ADD;
          break;
        }

        case "max": {
          updatePolicy = Module_KindStore_UpdatePolicy.MAX;
          break;
        }

        case "min": {
          updatePolicy = Module_KindStore_UpdatePolicy.MIN;
          break;
        }

        case "append": {
          updatePolicy = Module_KindStore_UpdatePolicy.APPEND;
          break;
        }

        default: {
          throw new Error(`Invalid update policy ${module.updatePolicy}`);
        }
      }

      out.kind = {
        case: "kindStore",
        value: new Module_KindStore({
          updatePolicy: updatePolicy,
          ...(module.valueType ? { valueType: module.valueType } : {}),
        }),
      };

      break;
    }
  }

  for (const [index, input] of module.inputs.entries()) {
    if ("source" in input) {
      out.inputs.push(
        new Module_Input({
          input: {
            case: "source",
            value: {
              type: input.source,
            },
          },
        }),
      );

      continue;
    }

    if ("map" in input) {
      out.inputs.push(
        new Module_Input({
          input: {
            case: "map",
            value: {
              moduleName: input.map,
            },
          },
        }),
      );

      continue;
    }

    if ("store" in input) {
      let mode: Module_Input_Store_Mode;

      switch (input.mode) {
        case "get": {
          mode = Module_Input_Store_Mode.GET;
          break;
        }

        case "deltas": {
          mode = Module_Input_Store_Mode.DELTAS;
          break;
        }

        default: {
          throw new Error(`Invalid input mode ${input.mode}`);
        }
      }

      out.inputs.push(
        new Module_Input({
          input: {
            case: "store",
            value: {
              moduleName: input.store,
              mode: mode,
            },
          },
        }),
      );

      continue;
    }

    if (input.params) {
      if (index !== 0) {
        throw new Error("Params must be the first input");
      }

      out.inputs.push(
        new Module_Input({
          input: {
            case: "params",
            value: {
              value: "",
            },
          },
        }),
      );

      continue;
    }

    throw new Error("Invalid input");
  }

  return out;
}
