import {
  Module,
  Module_BlockFilter,
  Module_Input,
  Module_Input_Store_Mode,
  Module_KindBlockIndex,
  Module_KindMap,
  Module_KindStore,
  Module_KindStore_UpdatePolicy,
  Module_Output,
  Module_QueryFromParams,
} from "@substreams/core/proto";
import type { BlockFilter as BlockFilterSchema, Module as ModuleSchema } from "./manifest-schema.js";

const MAX_UINT_64 = BigInt("18446744073709551615");

function createBlockFilterFromManifest(filter: BlockFilterSchema): Module_BlockFilter {
  const bf = new Module_BlockFilter({
    module: filter.module,
  });

  if (filter.query.string !== undefined && filter.query.string !== "") {
    bf.query = {
      case: "queryString",
      value: filter.query.string,
    };
  } else if (filter.query.params) {
    bf.query = {
      case: "queryFromParams",
      value: new Module_QueryFromParams(),
    };
  }

  return bf;
}

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

      if (module.blockFilter) {
        out.blockFilter = createBlockFilterFromManifest(module.blockFilter);
      }

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

      if (module.blockFilter) {
        out.blockFilter = createBlockFilterFromManifest(module.blockFilter);
      }

      break;
    }

    case "blockIndex": {
      out.kind = {
        case: "kindBlockIndex",
        value: new Module_KindBlockIndex({ outputType: module.output.type }),
      };

      out.output = new Module_Output({
        type: module.output.type,
      });

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
