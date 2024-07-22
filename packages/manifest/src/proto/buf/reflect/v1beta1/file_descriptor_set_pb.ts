// Copyright 2022-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// @generated by protoc-gen-es v1.10.0 with parameter "target=ts"
// @generated from file buf/reflect/v1beta1/file_descriptor_set.proto (package buf.reflect.v1beta1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { FileDescriptorSet, Message, proto3 } from "@bufbuild/protobuf";

/**
 * @generated from message buf.reflect.v1beta1.GetFileDescriptorSetRequest
 */
export class GetFileDescriptorSetRequest extends Message<GetFileDescriptorSetRequest> {
  /**
   * The name of the module that contains the schema of interest.
   *
   * Some servers may host multiple modules and thus require this field. Others may host a
   * single module and not support this field. The format of the module name depends on the
   * server implementation.
   *
   * For Buf Schema Registries, the module name is required. An "Invalid Argument" error
   * will occur if it is missing. Buf Schema Registries require the module name to be in
   * the following format (note that the domain name of the registry must be included):
   *    buf.build/acme/weather
   *
   * If the given module is not known to the server, a "Not Found" error is returned. If
   * a module name is given but not supported by this server or if the module name is in
   * an incorrect format, an "Invalid Argument" error is returned.
   *
   * @generated from field: string module = 1;
   */
  module = "";

  /**
   * The version of the module to use.
   *
   * Some servers may not support multiple versions and thus not support this field. If
   * the field is supported by the server but not provided by the client, the server will
   * respond with the latest version of the requested module and indicate the version in
   * the response. The format of the module version depends on the server implementation.
   *
   * For Buf Schema Registries, this field can be a commit. But it can also be a tag, a
   * draft name, or "main" (which is the same as omitting it, since it will also resolve
   * to the latest version).
   *
   * If specified but the requested module has no such version, a "Not Found" error is
   * returned.
   *
   * @generated from field: string version = 2;
   */
  version = "";

  /**
   * Zero or more symbol names. The names may refer to packages, messages, enums,
   * services, methods, or extensions. All names must be fully-qualified but should
   * NOT start with a period. If any name is invalid, the request will fail with an
   * "Invalid Argument" error. If any name is unresolvable/not present in the
   * requested module, the request will fail with a "Failed Precondition" error.
   *
   * If no names are provided, the full schema for the module is returned.
   * Otherwise, the resulting schema contains only the named elements and all of
   * their dependencies. This is enough information for the caller to construct
   * a dynamic message for any requested message types or to dynamically invoke
   * an RPC for any requested methods or services. If a package is named, that is
   * equivalent to specifying the names of all messages, enums, extensions, and
   * services defined in that package.
   *
   * @generated from field: repeated string symbols = 3;
   */
  symbols: string[] = [];

  constructor(data?: PartialMessage<GetFileDescriptorSetRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "buf.reflect.v1beta1.GetFileDescriptorSetRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "module", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "version", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "symbols", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetFileDescriptorSetRequest {
    return new GetFileDescriptorSetRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetFileDescriptorSetRequest {
    return new GetFileDescriptorSetRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetFileDescriptorSetRequest {
    return new GetFileDescriptorSetRequest().fromJsonString(jsonString, options);
  }

  static equals(a: GetFileDescriptorSetRequest | PlainMessage<GetFileDescriptorSetRequest> | undefined, b: GetFileDescriptorSetRequest | PlainMessage<GetFileDescriptorSetRequest> | undefined): boolean {
    return proto3.util.equals(GetFileDescriptorSetRequest, a, b);
  }
}

/**
 * @generated from message buf.reflect.v1beta1.GetFileDescriptorSetResponse
 */
export class GetFileDescriptorSetResponse extends Message<GetFileDescriptorSetResponse> {
  /**
   * The schema, which is a set of file descriptors that include the requested symbols
   * and their dependencies.
   *
   * The returned file descriptors will be topologically sorted.
   *
   * @generated from field: google.protobuf.FileDescriptorSet file_descriptor_set = 1;
   */
  fileDescriptorSet?: FileDescriptorSet;

  /**
   * The version of the returned schema. May not be set, such as if the server does not
   * support multiple versions of schemas. May be different from the requested version,
   * such as if the requested version was a name or tag that is resolved to another form.
   *
   * For Buf Schema Registries, if the requested version is a tag, draft name, or "main",
   * the returned version will be the corresponding commit.
   *
   * @generated from field: string version = 2;
   */
  version = "";

  constructor(data?: PartialMessage<GetFileDescriptorSetResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "buf.reflect.v1beta1.GetFileDescriptorSetResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "file_descriptor_set", kind: "message", T: FileDescriptorSet },
    { no: 2, name: "version", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetFileDescriptorSetResponse {
    return new GetFileDescriptorSetResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetFileDescriptorSetResponse {
    return new GetFileDescriptorSetResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetFileDescriptorSetResponse {
    return new GetFileDescriptorSetResponse().fromJsonString(jsonString, options);
  }

  static equals(a: GetFileDescriptorSetResponse | PlainMessage<GetFileDescriptorSetResponse> | undefined, b: GetFileDescriptorSetResponse | PlainMessage<GetFileDescriptorSetResponse> | undefined): boolean {
    return proto3.util.equals(GetFileDescriptorSetResponse, a, b);
  }
}
