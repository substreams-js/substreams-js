import { Module } from "../../../src/proto.js";

export const SIMPLE_TEST_MODULES = [
  new Module({
    name: "A",
    initialBlock: 0n,
    kind: {
      case: "kindMap",
      value: {},
    },
  }),
  new Module({
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
  new Module({
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
  new Module({
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
  new Module({
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
  new Module({
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
  new Module({
    name: "X",
    kind: {
      case: "kindMap",
      value: {},
    },
  }),
];
