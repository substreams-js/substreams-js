// @generated by protoc-gen-es v1.10.0 with parameter "target=ts"
// @generated from file sf/substreams/options.proto (package sf.substreams, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { FieldOptions as FieldOptions$1, Message, proto3 } from "@bufbuild/protobuf";

/**
 * @generated from message sf.substreams.FieldOptions
 */
export class FieldOptions extends Message<FieldOptions> {
  /**
   * this option informs the `substreams pack` command that it should treat the corresponding manifest value as a path to a file, putting its content as bytes in this field. 
   * must be applied to a `bytes` or `string` field
   *
   * @generated from field: bool load_from_file = 1;
   */
  loadFromFile = false;

  /**
   * this option informs the `substreams pack` command that it should treat the corresponding manifest value as a path to a folder, zipping its content and putting the zip content as bytes in this field.
   * must be applied to a `bytes` field
   *
   * @generated from field: bool zip_from_folder = 2;
   */
  zipFromFolder = false;

  constructor(data?: PartialMessage<FieldOptions>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "sf.substreams.FieldOptions";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "load_from_file", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 2, name: "zip_from_folder", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): FieldOptions {
    return new FieldOptions().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): FieldOptions {
    return new FieldOptions().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): FieldOptions {
    return new FieldOptions().fromJsonString(jsonString, options);
  }

  static equals(a: FieldOptions | PlainMessage<FieldOptions> | undefined, b: FieldOptions | PlainMessage<FieldOptions> | undefined): boolean {
    return proto3.util.equals(FieldOptions, a, b);
  }
}

/**
 * @generated from extension: optional sf.substreams.FieldOptions options = 2200;
 */
export const options = proto3.makeExtension<FieldOptions$1, FieldOptions>(
  "sf.substreams.options", 
  FieldOptions$1, 
  () => ({ no: 2200, kind: "message", T: FieldOptions, opt: true }),
);

