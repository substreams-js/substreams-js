import type {
  BlockScopedData,
  InitialSnapshotComplete,
  InitialSnapshotData,
  ModulesProgress,
  Response,
  SessionInit,
} from "../generated/sf/substreams/v1/substreams_pb.js";
import type { Any, AnyMessage, IMessageTypeRegistry } from "@bufbuild/protobuf";

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
      const messages = value.outputs.flatMap<AnyMessage>((item) => {
        const { case: kind, value } = item.data;

        switch (kind) {
          case "mapOutput": {
            if (value.value.byteLength > 0) {
              const message = (value as Any).unpack(registry);
              if (message === undefined) {
                return [];
              }

              // Check if the field is just a repeated field of a single type. If so, we
              // unwrap further. This is usually the case for a map module that returns
              // multiple messages through a pluralized wrapper.
              const type = message.getType();
              const [first, ...rest] = type.fields.list();
              if (first !== undefined && rest.length === 0) {
                if (first.repeated && first.kind === "message") {
                  const nested = message[first.name as keyof typeof message] as unknown as AnyMessage[] | undefined;
                  if (nested !== undefined) {
                    return nested;
                  }

                  return [];
                }
              }

              return [message];
            }

            return [];
          }

          case "debugStoreDeltas": {
            return [value];
          }
        }

        return [];
      });

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
