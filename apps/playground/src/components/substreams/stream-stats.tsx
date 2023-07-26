import type { Stream } from "@/components/substreams/stream-runner";
import { Card, CardContent } from "@/components/ui/card";

export function StreamStats({
  state,
}: {
  state: Stream;
}) {
  const progress = state.progress;

  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <pre className="text-sm text-muted-foreground">Start block: {progress?.resolvedStartBlock.toString()}</pre>
        <pre className="text-sm text-muted-foreground">Stop block: {progress?.linearHandoffBlock.toString()}</pre>
        <pre className="text-sm text-muted-foreground">
          Max parallel workers: {progress?.maxParallelWorkers.toString()}
        </pre>
        <pre className="text-sm text-muted-foreground">Data payloads received: {progress?.dataPayloads.toString()}</pre>
        <pre className="text-sm text-muted-foreground">Updates received: {progress?.progressUpdates.toString()}</pre>
        <pre className="text-sm text-muted-foreground">Updates per second: {progress?.updatesPerSecond.toString()}</pre>
        <pre className="text-sm text-muted-foreground">
          Updates this second: {progress?.updatesThisSecond.toString()}
        </pre>
        <pre className="text-sm text-muted-foreground">Clock time: {state.timestamp?.toLocaleString() ?? null}</pre>
        <pre className="text-sm text-muted-foreground">Block number: {state.block?.toString() ?? null}</pre>
        <pre className="text-sm text-muted-foreground truncate">Latest cursor: {state.cursor}</pre>
      </CardContent>
    </Card>
  );
}
