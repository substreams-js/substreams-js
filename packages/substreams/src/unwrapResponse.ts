import type { Any, AnyMessage, IMessageTypeRegistry } from "@bufbuild/protobuf";
import type {
  BlockScopedData,
  InitialSnapshotComplete,
  InitialSnapshotData,
  ModulesProgress,
  Response,
  SessionInit,
} from "./generated/sf/substreams/v1/substreams_pb.js";

export type DataMessage = {
  type: "data";
  data: BlockScopedData;
  messages: AnyMessage[];
};

export type ProgressMessage = {
  type: "progress";
  data: ModulesProgress;
};

export type SessionMessage = {
  type: "session";
  data: SessionInit;
};

export type DebugSnapshotCompleteMessage = {
  type: "debugSnapshotComplete";
  data: InitialSnapshotComplete;
};

export type DebugSnapshotDataMessage = {
  type: "debugSnapshotData";
  data: InitialSnapshotData;
};

export type Message =
  | DataMessage
  | ProgressMessage
  | SessionMessage
  | DebugSnapshotCompleteMessage
  | DebugSnapshotDataMessage;

export function unwrapResponse(response: Response, registry: IMessageTypeRegistry): Message {
  const { case: kind, value } = response.message;

  switch (kind) {
    case "data": {
      const messages = value.outputs
        .map((item) => {
          const { case: kind, value } = item.data;

          switch (kind) {
            case "mapOutput": {
              if (value.value.byteLength > 0) {
                return (value as Any).unpack(registry);
              }

              return undefined;
            }

            case "debugStoreDeltas": {
              return value;
            }
          }

          return undefined;
        })
        .filter((item) => item !== undefined) as AnyMessage[];

      return {
        type: "data",
        data: value,
        messages,
      };
    }

    case "progress": {
      return {
        type: "progress",
        data: value,
      };
    }

    case "session": {
      return {
        type: "session",
        data: value,
      };
    }

    case "debugSnapshotComplete": {
      return {
        type: "debugSnapshotComplete",
        data: value,
      };
    }

    case "debugSnapshotData": {
      return {
        type: "debugSnapshotData",
        data: value,
      };
    }

    default: {
      throw new Error(`Unexpected response kind ${kind}`);
    }
  }
}
