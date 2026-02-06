import { create } from "@bufbuild/protobuf";
import {
  type Module,
  type Module_BlockFilter,
  Module_BlockFilterSchema,
  Module_InputSchema,
  Module_Input_Store_Mode,
  Module_KindBlockIndexSchema,
  Module_KindMapSchema,
  Module_KindStoreSchema,
  Module_KindStore_UpdatePolicy,
  Module_OutputSchema,
  Module_QueryFromParamsSchema,
  ModuleSchema as ProtoModuleSchema,
} from "@substreams/core/proto";
import type { BlockFilter as BlockFilterSchema, Module as ManifestModule } from "./manifest-schema.js";

const MAX_UINT_64 = BigInt("18446744073709551615");

function createBlockFilterFromManifest(filter: BlockFilterSchema): Module_BlockFilter {
  const bf = create(Module_BlockFilterSchema, {
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
      value: create(Module_QueryFromParamsSchema, {}),
    };
  }

  return bf;
}

export function createModuleFromManifest(module: ManifestModule, index: number): Module {
  const out = create(ProtoModuleSchema, {
    name: module.name,
    binaryIndex: index,
    binaryEntrypoint: module.name,
    initialBlock: module.initialBlock ?? MAX_UINT_64,
  });

  switch (module.kind) {
    case "map": {
      out.kind = {
        case: "kindMap",
        value: create(Module_KindMapSchema, module.output?.type ? { outputType: module.output.type } : {}),
      };

      out.output = create(Module_OutputSchema, {
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
        value: create(Module_KindStoreSchema, {
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
        value: create(Module_KindBlockIndexSchema, { outputType: module.output.type }),
      };

      out.output = create(Module_OutputSchema, {
        type: module.output.type,
      });

      break;
    }
  }

  for (const [index, input] of module.inputs.entries()) {
    if ("source" in input) {
      out.inputs.push(
        create(Module_InputSchema, {
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
        create(Module_InputSchema, {
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
        create(Module_InputSchema, {
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
        create(Module_InputSchema, {
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
