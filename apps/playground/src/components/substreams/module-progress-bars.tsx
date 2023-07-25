import { Card, CardContent } from "../ui/card";
import { ModuleProgress, Progress } from "@substreams/core";

export function ModuleProgressBars({
  progress,
}: {
  progress: Progress;
}) {
  if (progress.moduleProgress.size === 0) {
    return null;
  }

  const [min, max] = calculateRange(progress);
  const bars = Array.from(progress.moduleProgress.entries());
  return (
    <Card>
      <CardContent className="space-y-2 p-4">
        {bars.map(([module, progress]) => (
          <ModuleProgressBar key={module} module={module} state={progress} min={min} max={max} />
        ))}
      </CardContent>
    </Card>
  );
}

function ModuleProgressBar({
  module,
  state,
  min,
  max,
}: {
  module: string;
  state: ModuleProgress;
  min: bigint;
  max: bigint;
}) {
  return (
    <div className="relative w-full h-5 bg-gray-900">
      <div className="absolute z-10 text-sm left-1">{module}</div>
      {state.rangeList.map(([start, stop]) => (
        <ModuleProgressBarRange key={`${start}`} min={min} max={max} start={start} stop={stop} />
      ))}
    </div>
  );
}

function ModuleProgressBarRange({
  start,
  stop,
  min,
  max,
}: {
  start: bigint;
  stop: bigint;
  min: bigint;
  max: bigint;
}) {
  const total = max - min;
  if (total === 0n) {
    return null;
  }

  const width = Number((stop - start) * 100n) / Number(total);
  const left = Number((start - min) * 100n) / Number(total);

  return <div className="absolute bg-green-800 h-5 top-0 bottom-0" style={{ left: `${left}%`, width: `${width}%` }} />;
}

function calculateRange(progress: Progress): [min: bigint, max: bigint] {
  let min: bigint | undefined = progress.resolvedStartBlock;
  let max: bigint | undefined = progress.linearHandoffBlock;

  for (const module of progress.moduleProgress.values()) {
    const first = module.rangeList[0];
    const last = module.rangeList[module.rangeList.length - 1];

    if (first !== undefined) {
      min = min === undefined ? first[0] : first[0] < min ? first[0] : min;
    }

    if (last !== undefined) {
      max = max === undefined ? last[1] : last[1] > max ? last[1] : max;
    }
  }

  return [min, max];
}
