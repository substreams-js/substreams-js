import { create } from "@bufbuild/protobuf";
import { type Module, ModuleSchema } from "@substreams/core/proto";

export const STANDARD_TEST_MODULES: Module[] = [
  create(ModuleSchema, {
    name: "As",
    initialBlock: 0n,
    kind: {
      case: "kindStore",
      value: {},
    },
  }),
  create(ModuleSchema, {
    name: "Am",
    initialBlock: 0n,
    kind: {
      case: "kindMap",
      value: {},
    },
  }),
  create(ModuleSchema, {
    name: "B",
    initialBlock: 10n,
    kind: {
      case: "kindStore",
      value: {},
    },
    inputs: [
      {
        input: {
          case: "map",
          value: {
            moduleName: "Am",
          },
        },
      },
    ],
  }),
  create(ModuleSchema, {
    name: "C",
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
            moduleName: "As",
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
    ],
  }),
  create(ModuleSchema, {
    name: "E",
    initialBlock: 5n,
    kind: {
      case: "kindStore",
      value: {},
    },
    inputs: [
      {
        input: {
          case: "map",
          value: {
            moduleName: "C",
          },
        },
      },
    ],
  }),
  create(ModuleSchema, {
    name: "F",
    kind: {
      case: "kindStore",
      value: {},
    },
    inputs: [
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
    name: "G",
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
      {
        input: {
          case: "store",
          value: {
            moduleName: "E",
          },
        },
      },
    ],
  }),
  create(ModuleSchema, {
    name: "K",
    kind: {
      case: "kindStore",
      value: {},
    },
    inputs: [
      {
        input: {
          case: "store",
          value: {
            moduleName: "G",
          },
        },
      },
    ],
  }),
  create(ModuleSchema, {
    name: "H",
    kind: {
      case: "kindMap",
      value: {},
    },
  }),
  create(ModuleSchema, {
    name: "SimpleStore",
    kind: {
      case: "kindStore",
      value: {},
    },
  }),
  create(ModuleSchema, {
    name: "MapDependsOnStore",
    kind: {
      case: "kindMap",
      value: {},
    },
    inputs: [
      {
        input: {
          case: "store",
          value: {
            moduleName: "SimpleStore",
          },
        },
      },
    ],
  }),
];
