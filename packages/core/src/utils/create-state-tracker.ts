import type { Response } from "../proto.js";
import { invariant } from "./invariant.js";
import { type ProgressRange, mergeProgressRanges } from "./merge-progress-ranges.js";

export type ModuleProgress = {
  moduleName: string;
  rangeList: ProgressRange[];
  totalBlocks: bigint;
};

export type Progress = {
  resolvedStartBlock: bigint;
  linearHandoffBlock: bigint;
  progressUpdates: bigint;
  dataPayloads: bigint;
  updatedSecond: bigint;
  updatesPerSecond: bigint;
  updatesThisSecond: bigint;
  maxParallelWorkers: bigint;
  moduleProgress: Map<string, ModuleProgress>;
  moduleProgressTotalBlocks: bigint;
};

export function createStateTracker() {
  let initialized = false;
  const state: Progress = {
    resolvedStartBlock: 0n,
    linearHandoffBlock: 0n,
    progressUpdates: 0n,
    dataPayloads: 0n,
    updatedSecond: 0n,
    updatesPerSecond: 0n,
    updatesThisSecond: 0n,
    maxParallelWorkers: 0n,
    moduleProgress: new Map(),
    moduleProgressTotalBlocks: 0n,
  };

  return function trackState(response: Response): Readonly<Progress> {
    const { case: kind, value } = response.message;

    if (kind === "session") {
      initialized = true;

      state.resolvedStartBlock = value.resolvedStartBlock;
      state.linearHandoffBlock = value.linearHandoffBlock;
      state.maxParallelWorkers = value.maxParallelWorkers;

      return state;
    }

    invariant(initialized, "Session wasn't initialized properly");

    if (kind === "blockScopedData") {
      state.dataPayloads += 1n;
    } else if (kind === "progress") {
      state.progressUpdates += 1n;

      const thisSecond = BigInt(Date.now()) / 1000n;
      if (state.updatedSecond !== thisSecond) {
        state.updatesPerSecond = state.updatesThisSecond;
        state.updatesThisSecond = 0n;
        state.updatedSecond = thisSecond;
      }

      state.updatesThisSecond += 1n;

      for (const module of value.modules) {
        const current: ModuleProgress = state.moduleProgress.get(module.name) ?? {
          moduleName: module.name,
          totalBlocks: 0n,
          rangeList: [],
        };

        if (module.type.case === "processedRanges") {
          const value = module.type.value;
          const ranges = value.processedRanges.map((range) => [range.startBlock, range.endBlock] as ProgressRange);
          current.rangeList = mergeProgressRanges([...current.rangeList, ...ranges]);

          let totalBlocks = 0n;
          for (const [start, end] of current.rangeList) {
            totalBlocks += end - start;
          }

          current.totalBlocks = totalBlocks;
        }

        state.moduleProgress.set(module.name, current);
      }
    }

    return state;
  };
}
