import { Request, Response } from "../proto.js";
import { type ProgressRange, mergeProgressRanges } from "./merge-progress-ranges.js";

export type ModuleState = {
  name: string;
  failed: boolean;
  ranges: ProgressRange[];
};

export type State = {
  current: bigint;
  cursor: string | undefined;
  timestamp: Date | undefined;
  modules: {
    [key: string]: ModuleState;
  };
};

export function createStateTracker(request: Request) {
  const state: State = {
    modules: {},
    current: request.startBlockNum ?? 0n,
    cursor: undefined,
    timestamp: undefined,
  };

  return function trackState(response: Response) {
    const { case: kind, value } = response.message;

    if (kind === "blockScopedData") {
      state.cursor = value.cursor;
      state.current = value.clock?.number ?? 0n;
      state.timestamp = value.clock?.timestamp?.toDate() ?? undefined;
    } else if (kind === "progress") {
      for (const module of value.modules) {
        const previous = state.modules[module.name];
        const current: ModuleState = {
          name: previous?.name ?? module.name,
          failed: previous?.failed ?? false,
          ranges: previous?.ranges ?? [],
        };

        const { case: kind, value } = module.type;

        switch (kind) {
          case "failed": {
            current.failed = true;
            break;
          }

          case "initialState": {
            current.ranges = [[state.current, value.availableUpToBlock]];
            break;
          }

          case "processedRanges": {
            const ranges = value.processedRanges.map((range) => [range.startBlock, range.endBlock] as ProgressRange);
            current.ranges = mergeProgressRanges([...current.ranges, ...ranges]);
            break;
          }

          case "processedBytes": {
            // TODO: Not implemented.
            break;
          }
        }

        state.modules[module.name] = current;
      }
    }

    return { ...state };
  };
}
