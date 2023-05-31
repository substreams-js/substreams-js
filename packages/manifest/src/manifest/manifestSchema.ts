import { semverRegExp } from "@substreams/core";
import { Problems, type Type, arrayOf, instanceOf, narrow, type } from "arktype";

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

export const BinaryType = type({
  file: "string",
  type: "string",
  "native?": "string",
  "content?": instanceOf(Uint8Array),
  "entrypoint?": "string",
  "protoPackageMapping?": partialRecord(type("string"), type("string")),
});

export const PackageMetaType = type({
  name: "string",
  version: semverRegExp,
  url: "string",
  doc: "string",
});

export const ProtobufType = type({
  files: "string[]",
  importPaths: "string[]",
});

export const InputType = type({
  "source?": "string",
  "store?": "string",
  "map?": "string",
  "params?": "string",
  "mode?": "string",
});

export const StreamOutputType = type({
  type: "string",
});

export const SinkType = type({
  type: "string",
  module: "string",
  config: "any",
});

export const ModuleType = type({
  name: "string",
  kind: "string",
  inputs: arrayOf(InputType),
  "doc?": "string",
  "initialBlock?": "number",
  "updatePolicy?": "string",
  "valueType?": "string",
  "binary?": "string",
  "output?": StreamOutputType,
});

export const ManifestType = type({
  workDir: "string",
  specVersion: semverRegExp,
  package: PackageMetaType,
  protobuf: ProtobufType,
  imports: partialRecord(type("string"), type("string")),
  binaries: partialRecord(type("string"), BinaryType),
  modules: arrayOf(ModuleType),
  "network?": "string",
  "params?": partialRecord(type("string"), type("string")),
  "sink?": SinkType,
});

// rome-ignore lint/style/noNamespace: <explanation>
export namespace Manifest {
  export type Manifest = typeof ManifestType.infer;
  export type PackageMeta = typeof PackageMetaType.infer;
  export type Protobuf = typeof ProtobufType.infer;
  export type Binary = typeof BinaryType.infer;
  export type Input = typeof InputType.infer;
  export type StreamOutput = typeof StreamOutputType.infer;
  export type Sink = typeof SinkType.infer;
  export type Module = typeof ModuleType.infer;
}
