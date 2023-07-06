// @generated by protoc-gen-es v1.2.0 with parameter "target=ts"
// @generated from file pinax/substreams/sink/prometheus/v1/prometheus.proto (package pinax.substreams.sink.prometheus.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";

/**
 * Vector of Prometheus metrics
 *
 * @generated from message pinax.substreams.sink.prometheus.v1.PrometheusOperations
 */
export class PrometheusOperations extends Message<PrometheusOperations> {
  /**
   * @generated from field: repeated pinax.substreams.sink.prometheus.v1.PrometheusOperation operations = 1;
   */
  operations: PrometheusOperation[] = [];

  constructor(data?: PartialMessage<PrometheusOperations>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "pinax.substreams.sink.prometheus.v1.PrometheusOperations";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "operations", kind: "message", T: PrometheusOperation, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): PrometheusOperations {
    return new PrometheusOperations().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): PrometheusOperations {
    return new PrometheusOperations().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): PrometheusOperations {
    return new PrometheusOperations().fromJsonString(jsonString, options);
  }

  static equals(a: PrometheusOperations | PlainMessage<PrometheusOperations> | undefined, b: PrometheusOperations | PlainMessage<PrometheusOperations> | undefined): boolean {
    return proto3.util.equals(PrometheusOperations, a, b);
  }
}

/**
 * @generated from message pinax.substreams.sink.prometheus.v1.PrometheusOperation
 */
export class PrometheusOperation extends Message<PrometheusOperation> {
  /**
   * Name of the Prometheus metric
   *
   * @generated from field: string name = 1;
   */
  name = "";

  /**
   * Labels represents a collection of label name -> value mappings. 
   *
   * @generated from field: map<string, string> labels = 2;
   */
  labels: { [key: string]: string } = {};

  /**
   * @generated from oneof pinax.substreams.sink.prometheus.v1.PrometheusOperation.operation
   */
  operation: {
    /**
     * @generated from field: pinax.substreams.sink.prometheus.v1.GaugeOp gauge = 3;
     */
    value: GaugeOp;
    case: "gauge";
  } | {
    /**
     * @generated from field: pinax.substreams.sink.prometheus.v1.CounterOp counter = 4;
     */
    value: CounterOp;
    case: "counter";
  } | {
    /**
     * @generated from field: pinax.substreams.sink.prometheus.v1.HistogramOp histogram = 5;
     */
    value: HistogramOp;
    case: "histogram";
  } | {
    /**
     * @generated from field: pinax.substreams.sink.prometheus.v1.SummaryOp summary = 6;
     */
    value: SummaryOp;
    case: "summary";
  } | { case: undefined; value?: undefined } = { case: undefined };

  constructor(data?: PartialMessage<PrometheusOperation>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "pinax.substreams.sink.prometheus.v1.PrometheusOperation";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "labels", kind: "map", K: 9 /* ScalarType.STRING */, V: {kind: "scalar", T: 9 /* ScalarType.STRING */} },
    { no: 3, name: "gauge", kind: "message", T: GaugeOp, oneof: "operation" },
    { no: 4, name: "counter", kind: "message", T: CounterOp, oneof: "operation" },
    { no: 5, name: "histogram", kind: "message", T: HistogramOp, oneof: "operation" },
    { no: 6, name: "summary", kind: "message", T: SummaryOp, oneof: "operation" },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): PrometheusOperation {
    return new PrometheusOperation().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): PrometheusOperation {
    return new PrometheusOperation().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): PrometheusOperation {
    return new PrometheusOperation().fromJsonString(jsonString, options);
  }

  static equals(a: PrometheusOperation | PlainMessage<PrometheusOperation> | undefined, b: PrometheusOperation | PlainMessage<PrometheusOperation> | undefined): boolean {
    return proto3.util.equals(PrometheusOperation, a, b);
  }
}

/**
 * @generated from message pinax.substreams.sink.prometheus.v1.GaugeOp
 */
export class GaugeOp extends Message<GaugeOp> {
  /**
   * @generated from field: pinax.substreams.sink.prometheus.v1.GaugeOp.Operation operation = 1;
   */
  operation = GaugeOp_Operation.UNSPECIFIED;

  /**
   * Value (Float) to be used in the operation
   *
   * @generated from field: double value = 2;
   */
  value = 0;

  constructor(data?: PartialMessage<GaugeOp>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "pinax.substreams.sink.prometheus.v1.GaugeOp";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "operation", kind: "enum", T: proto3.getEnumType(GaugeOp_Operation) },
    { no: 2, name: "value", kind: "scalar", T: 1 /* ScalarType.DOUBLE */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GaugeOp {
    return new GaugeOp().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GaugeOp {
    return new GaugeOp().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GaugeOp {
    return new GaugeOp().fromJsonString(jsonString, options);
  }

  static equals(a: GaugeOp | PlainMessage<GaugeOp> | undefined, b: GaugeOp | PlainMessage<GaugeOp> | undefined): boolean {
    return proto3.util.equals(GaugeOp, a, b);
  }
}

/**
 * @generated from enum pinax.substreams.sink.prometheus.v1.GaugeOp.Operation
 */
export enum GaugeOp_Operation {
  /**
   * Protobuf default should not be used, this is used so that the consume can ensure that the value was actually specified
   *
   * @generated from enum value: OPERATION_UNSPECIFIED = 0;
   */
  UNSPECIFIED = 0,

  /**
   * Inc increments the Gauge by 1. Use Add to increment it by arbitrary values.
   *
   * @generated from enum value: OPERATION_INC = 1;
   */
  INC = 1,

  /**
   * Add adds the given value to the Gauge. (The value can be negative, resulting in a decrease of the Gauge.)
   *
   * float
   *
   * @generated from enum value: OPERATION_ADD = 2;
   */
  ADD = 2,

  /**
   * Set sets the Gauge to an arbitrary value. 
   *
   * float
   *
   * @generated from enum value: OPERATION_SET = 3;
   */
  SET = 3,

  /**
   * Dec decrements the Gauge by 1. Use Sub to decrement it by arbitrary values.
   *
   * @generated from enum value: OPERATION_DEC = 4;
   */
  DEC = 4,

  /**
   * Sub subtracts the given value from the Gauge. (The value can be negative, resulting in an increase of the Gauge.)
   *
   * float
   *
   * @generated from enum value: OPERATION_SUB = 5;
   */
  SUB = 5,

  /**
   * SetToCurrentTime sets the Gauge to the current Unix time in seconds.
   *
   * @generated from enum value: OPERATION_SET_TO_CURRENT_TIME = 6;
   */
  SET_TO_CURRENT_TIME = 6,

  /**
   * Remove metrics for the given label values
   *
   * @generated from enum value: OPERATION_REMOVE = 7;
   */
  REMOVE = 7,

  /**
   * Reset gauge values
   *
   * @generated from enum value: OPERATION_RESET = 8;
   */
  RESET = 8,
}
// Retrieve enum metadata with: proto3.getEnumType(GaugeOp_Operation)
proto3.util.setEnumType(GaugeOp_Operation, "pinax.substreams.sink.prometheus.v1.GaugeOp.Operation", [
  { no: 0, name: "OPERATION_UNSPECIFIED" },
  { no: 1, name: "OPERATION_INC" },
  { no: 2, name: "OPERATION_ADD" },
  { no: 3, name: "OPERATION_SET" },
  { no: 4, name: "OPERATION_DEC" },
  { no: 5, name: "OPERATION_SUB" },
  { no: 6, name: "OPERATION_SET_TO_CURRENT_TIME" },
  { no: 7, name: "OPERATION_REMOVE" },
  { no: 8, name: "OPERATION_RESET" },
]);

/**
 * @generated from message pinax.substreams.sink.prometheus.v1.CounterOp
 */
export class CounterOp extends Message<CounterOp> {
  /**
   * @generated from field: pinax.substreams.sink.prometheus.v1.CounterOp.Operation operation = 1;
   */
  operation = CounterOp_Operation.UNSPECIFIED;

  /**
   * Value (Float) to be used in the operation
   *
   * @generated from field: double value = 2;
   */
  value = 0;

  constructor(data?: PartialMessage<CounterOp>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "pinax.substreams.sink.prometheus.v1.CounterOp";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "operation", kind: "enum", T: proto3.getEnumType(CounterOp_Operation) },
    { no: 2, name: "value", kind: "scalar", T: 1 /* ScalarType.DOUBLE */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CounterOp {
    return new CounterOp().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CounterOp {
    return new CounterOp().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CounterOp {
    return new CounterOp().fromJsonString(jsonString, options);
  }

  static equals(a: CounterOp | PlainMessage<CounterOp> | undefined, b: CounterOp | PlainMessage<CounterOp> | undefined): boolean {
    return proto3.util.equals(CounterOp, a, b);
  }
}

/**
 * @generated from enum pinax.substreams.sink.prometheus.v1.CounterOp.Operation
 */
export enum CounterOp_Operation {
  /**
   * Protobuf default should not be used, this is used so that the consume can ensure that the value was actually specified
   *
   * @generated from enum value: OPERATION_UNSPECIFIED = 0;
   */
  UNSPECIFIED = 0,

  /**
   * Increments the Counter by 1.
   *
   * @generated from enum value: OPERATION_INC = 1;
   */
  INC = 1,

  /**
   * Adds an arbitrary value to a Counter. (Returns an error if the value is < 0.)
   *
   * float
   *
   * @generated from enum value: OPERATION_ADD = 2;
   */
  ADD = 2,

  /**
   * Remove metrics for the given label values
   *
   * @generated from enum value: OPERATION_REMOVE = 7;
   */
  REMOVE = 7,

  /**
   * Reset counter values
   *
   * @generated from enum value: OPERATION_RESET = 8;
   */
  RESET = 8,
}
// Retrieve enum metadata with: proto3.getEnumType(CounterOp_Operation)
proto3.util.setEnumType(CounterOp_Operation, "pinax.substreams.sink.prometheus.v1.CounterOp.Operation", [
  { no: 0, name: "OPERATION_UNSPECIFIED" },
  { no: 1, name: "OPERATION_INC" },
  { no: 2, name: "OPERATION_ADD" },
  { no: 7, name: "OPERATION_REMOVE" },
  { no: 8, name: "OPERATION_RESET" },
]);

/**
 * @generated from message pinax.substreams.sink.prometheus.v1.SummaryOp
 */
export class SummaryOp extends Message<SummaryOp> {
  /**
   * @generated from field: pinax.substreams.sink.prometheus.v1.SummaryOp.Operation operation = 1;
   */
  operation = SummaryOp_Operation.UNSPECIFIED;

  /**
   * Value (Float) to be used in the operation
   *
   * @generated from field: double value = 2;
   */
  value = 0;

  constructor(data?: PartialMessage<SummaryOp>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "pinax.substreams.sink.prometheus.v1.SummaryOp";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "operation", kind: "enum", T: proto3.getEnumType(SummaryOp_Operation) },
    { no: 2, name: "value", kind: "scalar", T: 1 /* ScalarType.DOUBLE */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SummaryOp {
    return new SummaryOp().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SummaryOp {
    return new SummaryOp().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SummaryOp {
    return new SummaryOp().fromJsonString(jsonString, options);
  }

  static equals(a: SummaryOp | PlainMessage<SummaryOp> | undefined, b: SummaryOp | PlainMessage<SummaryOp> | undefined): boolean {
    return proto3.util.equals(SummaryOp, a, b);
  }
}

/**
 * @generated from enum pinax.substreams.sink.prometheus.v1.SummaryOp.Operation
 */
export enum SummaryOp_Operation {
  /**
   * Protobuf default should not be used, this is used so that the consume can ensure that the value was actually specified
   *
   * @generated from enum value: OPERATION_UNSPECIFIED = 0;
   */
  UNSPECIFIED = 0,

  /**
   * Observe adds a single observation to the summary.
   * Observations are usually positive or zero.
   * Negative observations are accepted but prevent current versions of Prometheus from properly detecting counter resets in the sum of observations
   *
   * @generated from enum value: OPERATION_OBSERVE = 1;
   */
  OBSERVE = 1,

  /**
   * Start a timer. Calling the returned function will observe the duration in seconds in the summary.
   *
   * @generated from enum value: OPERATION_START_TIMER = 2;
   */
  START_TIMER = 2,

  /**
   * Remove metrics for the given label values
   *
   * @generated from enum value: OPERATION_REMOVE = 7;
   */
  REMOVE = 7,

  /**
   * Reset counter values
   *
   * @generated from enum value: OPERATION_RESET = 8;
   */
  RESET = 8,
}
// Retrieve enum metadata with: proto3.getEnumType(SummaryOp_Operation)
proto3.util.setEnumType(SummaryOp_Operation, "pinax.substreams.sink.prometheus.v1.SummaryOp.Operation", [
  { no: 0, name: "OPERATION_UNSPECIFIED" },
  { no: 1, name: "OPERATION_OBSERVE" },
  { no: 2, name: "OPERATION_START_TIMER" },
  { no: 7, name: "OPERATION_REMOVE" },
  { no: 8, name: "OPERATION_RESET" },
]);

/**
 * @generated from message pinax.substreams.sink.prometheus.v1.HistogramOp
 */
export class HistogramOp extends Message<HistogramOp> {
  /**
   * @generated from field: pinax.substreams.sink.prometheus.v1.HistogramOp.Operation operation = 1;
   */
  operation = HistogramOp_Operation.UNSPECIFIED;

  /**
   * Value (Float) to be used in the operation
   *
   * @generated from field: double value = 2;
   */
  value = 0;

  constructor(data?: PartialMessage<HistogramOp>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "pinax.substreams.sink.prometheus.v1.HistogramOp";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "operation", kind: "enum", T: proto3.getEnumType(HistogramOp_Operation) },
    { no: 2, name: "value", kind: "scalar", T: 1 /* ScalarType.DOUBLE */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): HistogramOp {
    return new HistogramOp().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): HistogramOp {
    return new HistogramOp().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): HistogramOp {
    return new HistogramOp().fromJsonString(jsonString, options);
  }

  static equals(a: HistogramOp | PlainMessage<HistogramOp> | undefined, b: HistogramOp | PlainMessage<HistogramOp> | undefined): boolean {
    return proto3.util.equals(HistogramOp, a, b);
  }
}

/**
 * @generated from enum pinax.substreams.sink.prometheus.v1.HistogramOp.Operation
 */
export enum HistogramOp_Operation {
  /**
   * Protobuf default should not be used, this is used so that the consume can ensure that the value was actually specified
   *
   * @generated from enum value: OPERATION_UNSPECIFIED = 0;
   */
  UNSPECIFIED = 0,

  /**
   * Observe adds a single observation to the histogram.
   * Observations are usually positive or zero.
   * Negative observations are accepted but prevent current versions of Prometheus from properly detecting counter resets in the sum of observations. 
   *
   * @generated from enum value: OPERATION_OBSERVE = 1;
   */
  OBSERVE = 1,

  /**
   * Start a timer. Calling the returned function will observe the duration in seconds in the summary.
   *
   * @generated from enum value: OPERATION_START_TIMER = 2;
   */
  START_TIMER = 2,

  /**
   * Initialize the metrics for the given combination of labels to zero
   *
   * @generated from enum value: OPERATION_ZERO = 3;
   */
  ZERO = 3,

  /**
   * Remove metrics for the given label values
   *
   * @generated from enum value: OPERATION_REMOVE = 7;
   */
  REMOVE = 7,

  /**
   * Reset counter values
   *
   * @generated from enum value: OPERATION_RESET = 8;
   */
  RESET = 8,
}
// Retrieve enum metadata with: proto3.getEnumType(HistogramOp_Operation)
proto3.util.setEnumType(HistogramOp_Operation, "pinax.substreams.sink.prometheus.v1.HistogramOp.Operation", [
  { no: 0, name: "OPERATION_UNSPECIFIED" },
  { no: 1, name: "OPERATION_OBSERVE" },
  { no: 2, name: "OPERATION_START_TIMER" },
  { no: 3, name: "OPERATION_ZERO" },
  { no: 7, name: "OPERATION_REMOVE" },
  { no: 8, name: "OPERATION_RESET" },
]);
