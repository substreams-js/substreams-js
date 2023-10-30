import * as Schema from "@effect/schema/Schema";
import { nameRegExp, semverRegExp } from "@substreams/core";

export const BinaryTypeSchema = Schema.literal("wasm/rust-v1");
export type BinaryType = Schema.Schema.To<typeof BinaryTypeSchema>;

export const ManifestSpecVersionSchema = Schema.literal("v0.1.0");
export type ManifestSpecVersion = Schema.Schema.To<typeof ManifestSpecVersionSchema>;

export const ProtobufSchema = Schema.struct({
  files: Schema.array(Schema.string.pipe(Schema.pattern(/\.proto$/))),
  importPaths: Schema.array(Schema.string),
});
export type Protobuf = Schema.Schema.To<typeof ProtobufSchema>;

export const PackageSchema = Schema.struct({
  name: Schema.string.pipe(Schema.pattern(nameRegExp)),
  version: Schema.string.pipe(Schema.pattern(semverRegExp)),
  url: Schema.optional(Schema.string),
  doc: Schema.optional(Schema.string),
});
export type Package = Schema.Schema.To<typeof PackageSchema>;

export const InputSchema = Schema.union(
  Schema.struct({
    map: Schema.string,
  }),
  Schema.struct({
    source: Schema.string,
  }),
  Schema.struct({
    params: Schema.string,
  }),
  Schema.struct({
    store: Schema.string,
    mode: Schema.optional(Schema.literal("get", "deltas")).withDefault(() => "get"),
  }),
);
export type Input = Schema.Schema.To<typeof InputSchema>;

export const InitialBlockSchema = Schema.compose(
  Schema.union(Schema.bigint, Schema.bigintFromSelf, Schema.BigintFromNumber),
  Schema.NonNegativeBigintFromSelf,
);

export type InitialBlock = Schema.Schema.To<typeof InitialBlockSchema>;

export const StoreModuleSchema = Schema.struct({
  kind: Schema.literal("store"),
  doc: Schema.optional(Schema.string),
  binary: Schema.optional(Schema.string),
  initialBlock: Schema.optional(Schema.lazy(() => InitialBlockSchema)),
  inputs: Schema.array(Schema.lazy(() => InputSchema)),
  name: Schema.string.pipe(Schema.pattern(nameRegExp)),
  valueType: Schema.union(
    Schema.literal("bytes", "string", "int64", "float64", "bigint", "bigfloat", "bigdecimal"),
    Schema.templateLiteral(Schema.literal("proto:"), Schema.string),
  ),
  updatePolicy: Schema.literal("set", "set_if_not_exists", "append", "add", "min", "max"),
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
export type StoreModule = Schema.Schema.To<typeof StoreModuleSchema>;

export const MapModuleSchema = Schema.struct({
  kind: Schema.literal("map"),
  doc: Schema.optional(Schema.string),
  binary: Schema.optional(Schema.string),
  initialBlock: Schema.optional(Schema.lazy(() => InitialBlockSchema)),
  inputs: Schema.array(Schema.lazy(() => InputSchema)).pipe(Schema.minItems(1)),
  name: Schema.string.pipe(Schema.pattern(nameRegExp)),
  output: Schema.struct({
    type: Schema.string,
  }),
});
export type MapModule = Schema.Schema.To<typeof MapModuleSchema>;

export const ModuleSchema = Schema.union(StoreModuleSchema, MapModuleSchema);
export type Module = Schema.Schema.To<typeof ModuleSchema>;

export const BinarySchema = Schema.struct({
  file: Schema.string,
  type: Schema.lazy(() => BinaryTypeSchema),
  native: Schema.optional(Schema.string),
  content: Schema.optional(Schema.instanceOf(Uint8Array)),
  entrypoint: Schema.optional(Schema.string),
  protoPackageMapping: Schema.optional(Schema.record(Schema.string, Schema.string)),
});
export type Binary = Schema.Schema.To<typeof BinarySchema>;

export const SinkSchema = Schema.struct({
  type: Schema.string,
  module: Schema.string,
  config: Schema.any,
});
export type Sink = Schema.Schema.To<typeof SinkSchema>;

export const ManifestSchema = Schema.struct({
  network: Schema.optional(Schema.string),
  specVersion: Schema.lazy(() => ManifestSpecVersionSchema),
  binaries: Schema.optional(
    Schema.record(
      Schema.string,
      Schema.lazy(() => BinarySchema),
    ),
  ),
  imports: Schema.optional(
    Schema.record(Schema.string.pipe(Schema.pattern(/^[A-Za-z_][A-Za-z0-9_-]*$/)), Schema.string),
  ),
  modules: Schema.array(Schema.lazy(() => ModuleSchema)).pipe(Schema.minItems(1)),
  package: Schema.lazy(() => PackageSchema),
  protobuf: Schema.lazy(() => ProtobufSchema),
  params: Schema.optional(Schema.record(Schema.string, Schema.string)),
  sink: Schema.optional(Schema.lazy(() => SinkSchema)),
});
export type Manifest = Schema.Schema.To<typeof ManifestSchema>;

export function parseManifestJson(input: unknown): Manifest {
  const parse = Schema.parseSync(ManifestSchema);
  return parse(input, { errors: "all" });
}
