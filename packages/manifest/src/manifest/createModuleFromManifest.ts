import type { Manifest } from "./manifestSchema.js";
import {
  Module,
  Module_Input,
  Module_Input_Store_Mode,
  Module_KindMap,
  Module_KindStore,
  Module_KindStore_UpdatePolicy,
  Module_Output,
} from "@substreams/core/proto";

const MAX_UINT_64 = 18_446_744_073_709_551_615n;

export function createModuleFromManifest(module: Manifest.Module, index: number): Module {
  const out = new Module({
    name: module.name,
    binaryIndex: index,
    binaryEntrypoint: module.name,
    initialBlock: BigInt(module.initialBlock ?? MAX_UINT_64),
  });

  setOutputToProto(module, out);
  setKindToProto(module, out);
  setInputsToProto(module, out);

  return out;
}

function setInputsToProto(module: Manifest.Module, proto: Module) {
  for (const [index, input] of module.inputs.entries()) {
    if (input.source) {
      proto.inputs.push(
        new Module_Input({
          input: {
            case: "source",
            value: {
              type: input.source,
            },
          },
        }),
      );
    } else if (input.map) {
      proto.inputs.push(
        new Module_Input({
          input: {
            case: "map",
            value: {
              moduleName: input.map,
            },
          },
        }),
      );
    } else if (input.store) {
      let mode: Module_Input_Store_Mode;

      switch (input.mode) {
        case "": {
          mode = Module_Input_Store_Mode.UNSET;
          break;
        }

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

      proto.inputs.push(
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
    } else if (input.params) {
      if (index !== 0) {
        throw new Error("Params must be the first input");
      }

      proto.inputs.push(
        new Module_Input({
          input: {
            case: "params",
            value: {
              value: "",
            },
          },
        }),
      );
    } else {
      throw new Error("Invalid input");
    }
  }
}

function setKindToProto(module: Manifest.Module, proto: Module): void {
  switch (module.kind) {
    case "map": {
      proto.kind = {
        case: "kindMap",
        value: new Module_KindMap(module.output?.type ? { outputType: module.output.type } : {}),
      };

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

      proto.kind = {
        case: "kindStore",
        value: new Module_KindStore({
          updatePolicy: updatePolicy,
          ...(module.valueType ? { valueType: module.valueType } : {}),
        }),
      };

      break;
    }
  }
}

function setOutputToProto(module: Manifest.Module, proto: Module): void {
  if (module.output?.type) {
    proto.output = new Module_Output({
      type: module.output.type,
    });
  }
}
