// @generated by protoc-gen-es v1.7.2 with parameter "target=ts"
// @generated from file sf/substreams/intern/v2/service.proto (package sf.substreams.internal.v2, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, protoInt64 } from "@bufbuild/protobuf";
import { Modules } from "../../v1/modules_pb.js";

/**
 * @generated from message sf.substreams.internal.v2.ProcessRangeRequest
 */
export class ProcessRangeRequest extends Message<ProcessRangeRequest> {
  /**
   * @generated from field: uint64 start_block_num = 1;
   */
  startBlockNum = protoInt64.zero;

  /**
   * @generated from field: uint64 stop_block_num = 2;
   */
  stopBlockNum = protoInt64.zero;

  /**
   * @generated from field: string output_module = 3;
   */
  outputModule = "";

  /**
   * @generated from field: sf.substreams.v1.Modules modules = 4;
   */
  modules?: Modules;

  /**
   * 0-based index of stage to execute up to
   *
   * @generated from field: uint32 stage = 5;
   */
  stage = 0;

  constructor(data?: PartialMessage<ProcessRangeRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "sf.substreams.internal.v2.ProcessRangeRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "start_block_num", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 2, name: "stop_block_num", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 3, name: "output_module", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "modules", kind: "message", T: Modules },
    { no: 5, name: "stage", kind: "scalar", T: 13 /* ScalarType.UINT32 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ProcessRangeRequest {
    return new ProcessRangeRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ProcessRangeRequest {
    return new ProcessRangeRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ProcessRangeRequest {
    return new ProcessRangeRequest().fromJsonString(jsonString, options);
  }

  static equals(a: ProcessRangeRequest | PlainMessage<ProcessRangeRequest> | undefined, b: ProcessRangeRequest | PlainMessage<ProcessRangeRequest> | undefined): boolean {
    return proto3.util.equals(ProcessRangeRequest, a, b);
  }
}

/**
 * @generated from message sf.substreams.internal.v2.ProcessRangeResponse
 */
export class ProcessRangeResponse extends Message<ProcessRangeResponse> {
  /**
   * @generated from oneof sf.substreams.internal.v2.ProcessRangeResponse.type
   */
  type: {
    /**
     * @generated from field: sf.substreams.internal.v2.Failed failed = 4;
     */
    value: Failed;
    case: "failed";
  } | {
    /**
     * @generated from field: sf.substreams.internal.v2.Completed completed = 5;
     */
    value: Completed;
    case: "completed";
  } | {
    /**
     * @generated from field: sf.substreams.internal.v2.Update update = 6;
     */
    value: Update;
    case: "update";
  } | { case: undefined; value?: undefined } = { case: undefined };

  constructor(data?: PartialMessage<ProcessRangeResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "sf.substreams.internal.v2.ProcessRangeResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 4, name: "failed", kind: "message", T: Failed, oneof: "type" },
    { no: 5, name: "completed", kind: "message", T: Completed, oneof: "type" },
    { no: 6, name: "update", kind: "message", T: Update, oneof: "type" },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ProcessRangeResponse {
    return new ProcessRangeResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ProcessRangeResponse {
    return new ProcessRangeResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ProcessRangeResponse {
    return new ProcessRangeResponse().fromJsonString(jsonString, options);
  }

  static equals(a: ProcessRangeResponse | PlainMessage<ProcessRangeResponse> | undefined, b: ProcessRangeResponse | PlainMessage<ProcessRangeResponse> | undefined): boolean {
    return proto3.util.equals(ProcessRangeResponse, a, b);
  }
}

/**
 * @generated from message sf.substreams.internal.v2.Update
 */
export class Update extends Message<Update> {
  /**
   * @generated from field: uint64 duration_ms = 1;
   */
  durationMs = protoInt64.zero;

  /**
   * @generated from field: uint64 processed_blocks = 2;
   */
  processedBlocks = protoInt64.zero;

  /**
   * @generated from field: uint64 total_bytes_read = 3;
   */
  totalBytesRead = protoInt64.zero;

  /**
   * @generated from field: uint64 total_bytes_written = 4;
   */
  totalBytesWritten = protoInt64.zero;

  /**
   * @generated from field: repeated sf.substreams.internal.v2.ModuleStats modules_stats = 5;
   */
  modulesStats: ModuleStats[] = [];

  constructor(data?: PartialMessage<Update>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "sf.substreams.internal.v2.Update";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "duration_ms", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 2, name: "processed_blocks", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 3, name: "total_bytes_read", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 4, name: "total_bytes_written", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 5, name: "modules_stats", kind: "message", T: ModuleStats, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Update {
    return new Update().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Update {
    return new Update().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Update {
    return new Update().fromJsonString(jsonString, options);
  }

  static equals(a: Update | PlainMessage<Update> | undefined, b: Update | PlainMessage<Update> | undefined): boolean {
    return proto3.util.equals(Update, a, b);
  }
}

/**
 * @generated from message sf.substreams.internal.v2.ModuleStats
 */
export class ModuleStats extends Message<ModuleStats> {
  /**
   * @generated from field: string name = 1;
   */
  name = "";

  /**
   * @generated from field: uint64 processing_time_ms = 2;
   */
  processingTimeMs = protoInt64.zero;

  /**
   * @generated from field: uint64 store_operation_time_ms = 3;
   */
  storeOperationTimeMs = protoInt64.zero;

  /**
   * @generated from field: uint64 store_read_count = 4;
   */
  storeReadCount = protoInt64.zero;

  /**
   * @generated from field: repeated sf.substreams.internal.v2.ExternalCallMetric external_call_metrics = 5;
   */
  externalCallMetrics: ExternalCallMetric[] = [];

  /**
   * store-specific (will be 0 on mappers)
   *
   * @generated from field: uint64 store_write_count = 10;
   */
  storeWriteCount = protoInt64.zero;

  /**
   * @generated from field: uint64 store_deleteprefix_count = 11;
   */
  storeDeleteprefixCount = protoInt64.zero;

  /**
   * @generated from field: uint64 store_size_bytes = 12;
   */
  storeSizeBytes = protoInt64.zero;

  constructor(data?: PartialMessage<ModuleStats>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "sf.substreams.internal.v2.ModuleStats";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "processing_time_ms", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 3, name: "store_operation_time_ms", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 4, name: "store_read_count", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 5, name: "external_call_metrics", kind: "message", T: ExternalCallMetric, repeated: true },
    { no: 10, name: "store_write_count", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 11, name: "store_deleteprefix_count", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 12, name: "store_size_bytes", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ModuleStats {
    return new ModuleStats().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ModuleStats {
    return new ModuleStats().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ModuleStats {
    return new ModuleStats().fromJsonString(jsonString, options);
  }

  static equals(a: ModuleStats | PlainMessage<ModuleStats> | undefined, b: ModuleStats | PlainMessage<ModuleStats> | undefined): boolean {
    return proto3.util.equals(ModuleStats, a, b);
  }
}

/**
 * @generated from message sf.substreams.internal.v2.ExternalCallMetric
 */
export class ExternalCallMetric extends Message<ExternalCallMetric> {
  /**
   * @generated from field: string name = 1;
   */
  name = "";

  /**
   * @generated from field: uint64 count = 2;
   */
  count = protoInt64.zero;

  /**
   * @generated from field: uint64 time_ms = 3;
   */
  timeMs = protoInt64.zero;

  constructor(data?: PartialMessage<ExternalCallMetric>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "sf.substreams.internal.v2.ExternalCallMetric";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "count", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 3, name: "time_ms", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ExternalCallMetric {
    return new ExternalCallMetric().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ExternalCallMetric {
    return new ExternalCallMetric().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ExternalCallMetric {
    return new ExternalCallMetric().fromJsonString(jsonString, options);
  }

  static equals(a: ExternalCallMetric | PlainMessage<ExternalCallMetric> | undefined, b: ExternalCallMetric | PlainMessage<ExternalCallMetric> | undefined): boolean {
    return proto3.util.equals(ExternalCallMetric, a, b);
  }
}

/**
 * @generated from message sf.substreams.internal.v2.Completed
 */
export class Completed extends Message<Completed> {
  /**
   * @generated from field: repeated sf.substreams.internal.v2.BlockRange all_processed_ranges = 1;
   */
  allProcessedRanges: BlockRange[] = [];

  /**
   * TraceId represents the producer's trace id that produced the partial files.
   * This is present here so that the consumer can use it to identify the
   * right partial files that needs to be squashed together.
   *
   * The TraceId can be empty in which case it should be assumed by the tier1
   * consuming this message that the tier2 that produced those partial files
   * is not yet updated to produce a trace id and a such, the tier1 should
   * generate a legacy partial file name.
   *
   * @generated from field: string trace_id = 2;
   */
  traceId = "";

  constructor(data?: PartialMessage<Completed>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "sf.substreams.internal.v2.Completed";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "all_processed_ranges", kind: "message", T: BlockRange, repeated: true },
    { no: 2, name: "trace_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Completed {
    return new Completed().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Completed {
    return new Completed().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Completed {
    return new Completed().fromJsonString(jsonString, options);
  }

  static equals(a: Completed | PlainMessage<Completed> | undefined, b: Completed | PlainMessage<Completed> | undefined): boolean {
    return proto3.util.equals(Completed, a, b);
  }
}

/**
 * @generated from message sf.substreams.internal.v2.Failed
 */
export class Failed extends Message<Failed> {
  /**
   * @generated from field: string reason = 1;
   */
  reason = "";

  /**
   * @generated from field: repeated string logs = 2;
   */
  logs: string[] = [];

  /**
   * FailureLogsTruncated is a flag that tells you if you received all the logs or if they
   * were truncated because you logged too much (fixed limit currently is set to 128 KiB).
   *
   * @generated from field: bool logs_truncated = 3;
   */
  logsTruncated = false;

  constructor(data?: PartialMessage<Failed>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "sf.substreams.internal.v2.Failed";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "reason", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "logs", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 3, name: "logs_truncated", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Failed {
    return new Failed().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Failed {
    return new Failed().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Failed {
    return new Failed().fromJsonString(jsonString, options);
  }

  static equals(a: Failed | PlainMessage<Failed> | undefined, b: Failed | PlainMessage<Failed> | undefined): boolean {
    return proto3.util.equals(Failed, a, b);
  }
}

/**
 * @generated from message sf.substreams.internal.v2.BlockRange
 */
export class BlockRange extends Message<BlockRange> {
  /**
   * @generated from field: uint64 start_block = 2;
   */
  startBlock = protoInt64.zero;

  /**
   * @generated from field: uint64 end_block = 3;
   */
  endBlock = protoInt64.zero;

  constructor(data?: PartialMessage<BlockRange>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "sf.substreams.internal.v2.BlockRange";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 2, name: "start_block", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 3, name: "end_block", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): BlockRange {
    return new BlockRange().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): BlockRange {
    return new BlockRange().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): BlockRange {
    return new BlockRange().fromJsonString(jsonString, options);
  }

  static equals(a: BlockRange | PlainMessage<BlockRange> | undefined, b: BlockRange | PlainMessage<BlockRange> | undefined): boolean {
    return proto3.util.equals(BlockRange, a, b);
  }
}

