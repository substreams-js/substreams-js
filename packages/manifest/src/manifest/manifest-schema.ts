import { expandEnv } from "../utils/expand-env.js";
import { nameRegExp, semverRegExp } from "@substreams/core";
import { Problems, type Type, narrow, scope, type } from "arktype";

// TODO: Use generics once they are supported in arktype.
function partialRecord<K extends string | number, V>(keyType: Type<K>, valueType: Type<V>): Type<Record<K, V>> {
  return narrow(type("object"), (data, ctx): data is Record<K, V> => {
    const problems = ctx as unknown as Problems;
    if ((keyType as unknown as Type<never>).includesMorph) {
      problems.mustBe("without morph", { path: ["__keyType__"] });
      return false;
    }

    return Object.entries(data).every(([k, v]) => {
      const keyCheck = keyType(k);
      if (keyCheck.problems) {
        // rome-ignore lint/suspicious/noExplicitAny: <explanation>
        problems.addProblem(keyCheck.problems[0] as any);
        return false;
      }

      const valueCheck = valueType(v);
      if (valueCheck.problems) {
        // rome-ignore lint/suspicious/noExplicitAny: <explanation>
        problems.addProblem(valueCheck.problems[0] as any);
        return false;
      }

      if (valueCheck.data !== v) {
        // rome-ignore lint/suspicious/noExplicitAny: <explanation>
        (data as any)[k] = valueCheck.data;
      }

      return true;
    });
    // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  }) as any;
}

// TODO: Move this into `scope` once generics are supported in artkype.
const Binary = type({
  file: "string",
  type: "'wasm/rust-v1'",
  "native?": "string",
  "content?": ["instanceof", Uint8Array],
  "entrypoint?": "string",
  "protoPackageMapping?": partialRecord(type("string"), type("string")),
});

export const ManifestSchema = scope({
  Binary,
  PackageMeta: {
    name: nameRegExp,
    version: semverRegExp,
    "url?": "string",
    "doc?": "string",
  },
  Protobuf: {
    files: "string[]",
    importPaths: "string[]",
  },
  InputSource: {
    source: "string",
  },
  InputStore: {
    store: "string",
    // TODO: Use "get" as the default value here.
    "mode?": "'get'|'deltas'",
  },
  InputMap: {
    map: nameRegExp,
  },
  InputParams: {
    params: "string",
  },
  Input: "InputSource|InputStore|InputMap|InputParams",
  Sink: {
    type: "string",
    module: "string",
    config: "any",
  },
  UpdatePolicy: "'set'|'set_if_not_exists'|'add'|'max'|'min'|'append'",
  InitialBlock: ["number|bigint", "|>", (value) => BigInt(value)],
  StoreModule: {
    name: nameRegExp,
    kind: "'store'",
    inputs: "Input[]",
    updatePolicy: "UpdatePolicy",
    valueType: "string",
    "doc?": "string",
    "initialBlock?": "InitialBlock",
    "binary?": "string",
  },
  MapModule: {
    name: nameRegExp,
    kind: "'map'",
    inputs: "Input[]",
    output: { type: "string" },
    "doc?": "string",
    "initialBlock?": "InitialBlock",
    "binary?": "string",
  },
  Module: "StoreModule|MapModule",
  Manifest: {
    workDir: "string",
    specVersion: semverRegExp,
    package: "PackageMeta",
    binaries: partialRecord(type("string"), Binary),
    protobuf: "Protobuf",
    imports: partialRecord(type("string"), type("string")),
    modules: "Module[]",
    "network?": "string",
    "params?": partialRecord(type("string"), type("string")),
    "sink?": "Sink",
  },
}).compile();

// rome-ignore lint/style/noNamespace: this is acceptable here
export namespace Manifest {
  export type Binary = typeof ManifestSchema.Binary.infer;
  export type PackageMeta = typeof ManifestSchema.PackageMeta.infer;
  export type Protobuf = typeof ManifestSchema.Protobuf.infer;
  export type InputSource = typeof ManifestSchema.InputSource.infer;
  export type InputStore = typeof ManifestSchema.InputStore.infer;
  export type InputMap = typeof ManifestSchema.InputMap.infer;
  export type InputParams = typeof ManifestSchema.InputParams.infer;
  export type Input = typeof ManifestSchema.Input.infer;
  export type Sink = typeof ManifestSchema.Sink.infer;
  export type StoreModule = typeof ManifestSchema.StoreModule.infer;
  export type MapModule = typeof ManifestSchema.MapModule.infer;
  export type Module = typeof ManifestSchema.Module.infer;
  export type Manifest = typeof ManifestSchema.Manifest.infer;
}

export function parseManifestJson(input: unknown): Manifest.Manifest {
  const manifest = ManifestSchema.Manifest.assert(input);
  if (manifest.specVersion !== "v0.1.0") {
    // TODO: Should we handle this in the schema already?
    throw new Error("Invalid 'specVersion', must be v0.1.0");
  }

  for (const [key, value] of Object.entries(manifest.imports)) {
    manifest.imports[key] = expandEnv(value);
  }

  for (const [key, value] of manifest.protobuf.importPaths.entries()) {
    manifest.protobuf.importPaths[key] = expandEnv(value);
  }

  for (const module of manifest.modules) {
    if (module.kind === "store") {
      // TODO: Should we handle this in the schema already?
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

      const valueType = module.valueType.startsWith("proto:") ? "proto" : module.valueType;
      const combination = `${module.updatePolicy}:${valueType}`;
      if (!combinations.includes(combination)) {
        const options = combinations.join(", ");
        throw new Error(
          `Invalid 'output.updatePolicy' and 'output.valueType' combination, found ${combination} use one of: ${options}`,
        );
      }
    }

    for (const input of module.inputs) {
      // TODO: Handle this in the schema. Defaults are not supported in arktype yet.
      if ("store" in input) {
        input.mode = input.mode ?? "get";
      }
    }
  }

  return manifest;
}
