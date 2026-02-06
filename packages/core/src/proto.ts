// V2 RPC exports (default, backward compatible)
// Export message types (as types), schemas (as values), and service definitions
export type {
  Request,
  Response,
  BlockUndoSignal,
  BlockScopedData,
  SessionInit,
  InitialSnapshotComplete,
  InitialSnapshotData,
  MapModuleOutput,
  StoreModuleOutput,
  OutputDebugInfo,
  ModulesProgress,
  ProcessedBytes,
  Error,
  Job,
  Stage,
  ModuleStats,
  ExternalCallMetric,
  StoreDelta,
  BlockRange,
} from "./proto/sf/substreams/rpc/v2/service_pb.js";
export {
  RequestSchema,
  ResponseSchema,
  BlockUndoSignalSchema,
  BlockScopedDataSchema,
  SessionInitSchema,
  InitialSnapshotCompleteSchema,
  InitialSnapshotDataSchema,
  MapModuleOutputSchema,
  StoreModuleOutputSchema,
  OutputDebugInfoSchema,
  ModulesProgressSchema,
  ProcessedBytesSchema,
  ErrorSchema,
  JobSchema,
  StageSchema,
  ModuleStatsSchema,
  ExternalCallMetricSchema,
  StoreDeltaSchema,
  StoreDelta_Operation,
  BlockRangeSchema,
  // Service definitions (used with createClient)
  Stream,
  EndpointInfo,
} from "./proto/sf/substreams/rpc/v2/service_pb.js";

// V3 RPC exports (namespaced to avoid conflicts)
export * as v3 from "./proto/sf/substreams/rpc/v3/service_pb.js";
export { Stream as StreamV3 } from "./proto/sf/substreams/rpc/v3/service_pb.js";

// Common types (v1)
export * from "./proto/sf/substreams/v1/clock_pb.js";
export * from "./proto/sf/substreams/v1/modules_pb.js";
export * from "./proto/sf/substreams/v1/package_pb.js";
export * from "./proto/sf/substreams/options_pb.js";
