import { Module } from "../../../src/proto.js";

export const STANDARD_TEST_MODULES = [
  new Module({
    name: "As",
    initialBlock: 0n,
    kind: {
      case: "kindStore",
      value: {},
    },
  }),
  new Module({
    name: "Am",
    initialBlock: 0n,
    kind: {
      case: "kindMap",
      value: {},
    },
  }),
  new Module({
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
  new Module({
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
    ],
  }),
  new Module({
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
  new Module({
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
  new Module({
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
  new Module({
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
  new Module({
    name: "H",
    kind: {
      case: "kindMap",
      value: {},
    },
  }),
  new Module({
    name: "SimpleStore",
    kind: {
      case: "kindStore",
      value: {},
    },
  }),
  new Module({
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
