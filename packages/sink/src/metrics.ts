import * as Metric from "@effect/io/Metric";

export const HeadBlockNumber = Metric.gauge("substreams_sink_head_block_number", "The current block number");
export const HeadBlockTime = Metric.gauge("substreams_sink_head_block_time", "The current block time in seconds");
export const HeadBlockTimeDrift = Metric.gauge(
  "substreams_sink_head_block_time_drift",
  "The current head block time drift in seconds",
);

export const MessageSizeBytes = Metric.counter(
  "substreams_sink_message_size_bytes",
  "The number of total bytes of messages received from the Substreams backend",
);

export const DataMessageCount = Metric.counter("substreams_sink_data_message", "The number of data messages received");
export const DataMessageSizeBytes = Metric.counter(
  "substreams_sink_data_message_size_bytes",
  "The total size of in bytes of all data messages received",
);

export const UndoMessageCount = Metric.counter(
  "substreams_sink_undo_message",
  "The number of block undo messages received",
);
export const UndoMessageSizeBytes = Metric.counter(
  "substreams_sink_undo_message_size_bytes",
  "The total size of in bytes of all undo messages received",
);

export const ProgressMessageCount = Metric.counter(
  "substreams_sink_progress_message",
  "The number of block progress messages received",
);
export const ProgressMessageSizeBytes = Metric.counter(
  "substreams_sink_progress_message_size_bytes",
  "The total size of in bytes of all progress messages received",
);

export const UnknownMessageCount = Metric.counter(
  "substreams_sink_unknown_message",
  "The number of unknown messages received",
);
export const UnknownMessageSizeBytes = Metric.counter(
  "substreams_sink_unknown_message_size_bytes",
  "The total size of in bytes of all unknown messages received",
);

export const SubstreamsErrorCount = Metric.counter(
  "substreams_sink_error",
  "The error count we encountered when interacting with Substreams for which we had to restart the connection loop",
);
