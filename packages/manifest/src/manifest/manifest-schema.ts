import * as Schema from "@effect/schema/Schema";
import { nameRegExp, semverRegExp } from "@substreams/core";

export const BinaryTypeSchema = Schema.Union(Schema.Literal("wasip1/tinygo-v1"), Schema.Literal("wasm/rust-v1"));
export type BinaryType = typeof BinaryTypeSchema.Type;

export const ManifestSpecVersionSchema = Schema.Literal("v0.1.0");
export type ManifestSpecVersion = typeof ManifestSpecVersionSchema.Type;

export const ProtobufSchema = Schema.Struct({
  files: Schema.optional(Schema.Array(Schema.String.pipe(Schema.pattern(/\.proto$/)))),
  importPaths: Schema.optional(Schema.Array(Schema.String)),
});
export type Protobuf = typeof ProtobufSchema.Type;

export const PackageSchema = Schema.Struct({
  name: Schema.String.pipe(Schema.pattern(nameRegExp)),
  version: Schema.String.pipe(Schema.pattern(semverRegExp)),
  url: Schema.optional(Schema.String),
  doc: Schema.optional(Schema.String),
});
export type Package = typeof PackageSchema.Type;

export const InputSchema = Schema.Union(
  Schema.Struct({
    map: Schema.String,
  }),
  Schema.Struct({
    source: Schema.String,
  }),
  Schema.Struct({
    params: Schema.String,
  }),
  Schema.Struct({
    store: Schema.String,
    mode: Schema.optionalWith(Schema.Literal("get", "deltas"), {
      default: () => "get" as const,
    }),
  }),
);
export type Input = typeof InputSchema.Type;

// Would it be possible to represent this as InputSchema.omit("params") or something like this?
export const BlockIndexInputSchema = Schema.Union(
  Schema.Struct({
    map: Schema.String,
  }),
  Schema.Struct({
    source: Schema.String,
  }),
  Schema.Struct({
    store: Schema.String,
    mode: Schema.optionalWith(Schema.Literal("get", "deltas"), {
      default: () => "get" as const,
    }),
  }),
);
export type BlockIndexInput = typeof BlockIndexInputSchema.Type;

export const InitialBlockSchema = Schema.compose(
  Schema.Union(Schema.BigInt, Schema.BigIntFromSelf, Schema.BigIntFromNumber),
  Schema.NonNegativeBigIntFromSelf,
);

export type InitialBlock = typeof InitialBlockSchema.Type;

export const StoreModuleSchema = Schema.Struct({
  kind: Schema.Literal("store"),
  doc: Schema.optional(Schema.String),
  binary: Schema.optional(Schema.String),
  initialBlock: Schema.optional(Schema.suspend(() => InitialBlockSchema)),
  blockFilter: Schema.optional(Schema.suspend(() => BlockFilterSchema)),
  inputs: Schema.Array(Schema.suspend(() => InputSchema)),
  name: Schema.String.pipe(Schema.pattern(nameRegExp)),
  valueType: Schema.Union(
    Schema.Literal("bytes", "string", "int64", "float64", "bigint", "bigfloat", "bigdecimal"),
    Schema.TemplateLiteral(Schema.Literal("proto:"), Schema.String),
  ),
  updatePolicy: Schema.Literal("set", "set_if_not_exists", "append", "add", "min", "max"),
}).pipe(
  Schema.filter((value) => {
    const combinations: string[] = [
      "max:bigint",
      "max:int64",
      "max:bigdecimal",
      "max:bigfloat",
      "max:float64",
      "min:bigint",
      "min:int64",
      "min:bigdecimal",
      "min:bigfloat",
      "min:float64",
      "add:bigint",
      "add:int64",
      "add:bigdecimal",
      "add:bigfloat",
      "add:float64",
      "set:bytes",
      "set:string",
      "set:proto",
      "set:bigdecimal",
      "set:bigfloat",
      "set:bigint",
      "set:int64",
      "set:float64",
      "set_if_not_exists:bytes",
      "set_if_not_exists:string",
      "set_if_not_exists:proto",
      "set_if_not_exists:bigdecimal",
      "set_if_not_exists:bigfloat",
      "set_if_not_exists:bigint",
      "set_if_not_exists:int64",
      "set_if_not_exists:float64",
      "append:bytes",
      "append:string",
    ];

    const valueType = value.valueType.startsWith("proto:") ? "proto" : value.valueType;
    const combination = `${value.updatePolicy}:${valueType}`;
    return combinations.includes(combination);
  }),
);
export type StoreModule = typeof StoreModuleSchema.Type;

export const MapModuleSchema = Schema.Struct({
  kind: Schema.Literal("map"),
  doc: Schema.optional(Schema.String),
  binary: Schema.optional(Schema.String),
  initialBlock: Schema.optional(Schema.suspend(() => InitialBlockSchema)),
  blockFilter: Schema.optional(Schema.suspend(() => BlockFilterSchema)),
  inputs: Schema.Array(Schema.suspend(() => InputSchema)).pipe(Schema.minItems(1)),
  name: Schema.String.pipe(Schema.pattern(nameRegExp)),
  output: Schema.Struct({
    type: Schema.String,
  }),
});
export type MapModule = typeof MapModuleSchema.Type;

// FIXME: BlockFilter module's should be validated to ensure it references a valid Module in the
// manifest and that this referenced module is a `kind: BlockIndex` module.
export const BlockFilterSchema = Schema.Struct({
  module: Schema.String,
  query: Schema.suspend(() => BlockFilterQuerySchema),
});
export type BlockFilter = typeof BlockFilterSchema.Type;

export const BlockFilterQuerySchema = Schema.Struct({
  string: Schema.optional(Schema.String),
  params: Schema.optional(Schema.Boolean),
});
export type BlockFilterQuery = typeof BlockFilterQuerySchema.Type;

export const BlockIndexModuleSchema = Schema.Struct({
  kind: Schema.Literal("blockIndex"),
  doc: Schema.optional(Schema.String),
  binary: Schema.optional(Schema.String),
  initialBlock: Schema.optional(Schema.suspend(() => InitialBlockSchema)),
  inputs: Schema.Array(Schema.suspend(() => BlockIndexInputSchema)).pipe(Schema.minItems(1)),
  name: Schema.String.pipe(Schema.pattern(nameRegExp)),
  output: Schema.Struct({
    type: Schema.Literal("proto:sf.substreams.index.v1.Keys"),
  }),
});
export type BlockIndexModule = typeof BlockIndexModuleSchema.Type;

export const ModuleSchema = Schema.Union(StoreModuleSchema, MapModuleSchema, BlockIndexModuleSchema);
export type Module = typeof ModuleSchema.Type;

export const BinarySchema = Schema.Struct({
  file: Schema.String,
  type: Schema.suspend(() => BinaryTypeSchema),
  native: Schema.optional(Schema.String),
  content: Schema.optional(Schema.instanceOf(Uint8Array)),
  entrypoint: Schema.optional(Schema.String),
  protoPackageMapping: Schema.optional(Schema.Record({ key: Schema.String, value: Schema.String })),
});
export type Binary = typeof BinarySchema.Type;

export const SinkSchema = Schema.Struct({
  type: Schema.String,
  module: Schema.String,
  config: Schema.Any,
});
export type Sink = typeof SinkSchema.Type;

export const ManifestSchema = Schema.Struct({
  network: Schema.optional(Schema.String),
  specVersion: Schema.suspend(() => ManifestSpecVersionSchema),
  binaries: Schema.optional(
    Schema.Record({
      key: Schema.String,
      value: Schema.suspend(() => BinarySchema),
    }),
  ),
  imports: Schema.optional(
    Schema.Record({
      key: Schema.String.pipe(Schema.pattern(/^[A-Za-z_][A-Za-z0-9_-]*$/)),
      value: Schema.String,
    }),
  ),
  modules: Schema.Array(Schema.suspend(() => ModuleSchema)).pipe(Schema.minItems(1)),
  package: Schema.suspend(() => PackageSchema),
  protobuf: Schema.optional(Schema.suspend(() => ProtobufSchema)),
  params: Schema.optional(
    Schema.Record({
      key: Schema.String,
      value: Schema.String,
    }),
  ),
  sink: Schema.optional(Schema.suspend(() => SinkSchema)),
});
export type Manifest = typeof ManifestSchema.Type;

export function parseManifestJson(input: unknown): Manifest {
  const parse = Schema.decodeUnknownSync(ManifestSchema);
  return parse(input, { errors: "all" });
}
