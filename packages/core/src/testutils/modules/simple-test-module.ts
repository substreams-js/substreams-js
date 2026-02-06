import { create } from "@bufbuild/protobuf";
import { type Module, ModuleSchema } from "@substreams/core/proto";

export const SIMPLE_TEST_MODULES: Module[] = [
  create(ModuleSchema, {
    name: "A",
    initialBlock: 0n,
    kind: {
      case: "kindMap",
      value: {},
    },
  }),
  create(ModuleSchema, {
    name: "B",
    initialBlock: 0n,
    kind: {
      case: "kindStore",
      value: {},
    },
    inputs: [
      {
        input: {
          case: "map",
          value: {
            moduleName: "A",
          },
        },
      },
    ],
  }),
  create(ModuleSchema, {
    name: "C",
    initialBlock: 0n,
    kind: {
      case: "kindStore",
      value: {},
    },
    inputs: [
      {
        input: {
          case: "map",
          value: {
            moduleName: "A",
          },
        },
      },
    ],
  }),
  create(ModuleSchema, {
    name: "D",
    initialBlock: 0n,
    kind: {
      case: "kindMap",
      value: {},
    },
    inputs: [
      {
        input: {
          case: "store",
          value: {
            moduleName: "B",
          },
        },
      },
      {
        input: {
          case: "store",
          value: {
            moduleName: "C",
          },
        },
      },
    ],
  }),
  create(ModuleSchema, {
    name: "E",
    initialBlock: 0n,
    kind: {
      case: "kindStore",
      value: {},
    },
    inputs: [
      {
        input: {
          case: "store",
          value: {
            moduleName: "B",
          },
        },
      },
      {
        input: {
          case: "map",
          value: {
            moduleName: "D",
          },
        },
      },
      {
        input: {
          case: "map",
          value: {
            moduleName: "X",
          },
        },
      },
    ],
  }),
  create(ModuleSchema, {
    name: "F",
    initialBlock: 0n,
    kind: {
      case: "kindStore",
      value: {},
    },
    inputs: [
      {
        input: {
          case: "map",
          value: {
            moduleName: "D",
          },
        },
      },
    ],
  }),
  create(ModuleSchema, {
    name: "X",
    kind: {
      case: "kindMap",
      value: {},
    },
  }),
];
