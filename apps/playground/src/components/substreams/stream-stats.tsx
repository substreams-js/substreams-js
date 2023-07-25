import { StreamStreaming } from "./stream-runner";
import { Card, CardContent } from "@/components/ui/card";

export function StreamStats({
  state,
}: {
  state: StreamStreaming;
}) {
  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <pre className="text-sm text-muted-foreground">Start block: {state.progress.resolvedStartBlock.toString()}</pre>
        <pre className="text-sm text-muted-foreground">Stop block: {state.progress.linearHandoffBlock.toString()}</pre>
        <pre className="text-sm text-muted-foreground">
          Max parallel workers: {state.progress.maxParallelWorkers.toString()}
        </pre>
        <pre className="text-sm text-muted-foreground">
          Data payloads received: {state.progress.dataPayloads.toString()}
        </pre>
        <pre className="text-sm text-muted-foreground">
          Updates received: {state.progress.progressUpdates.toString()}
        </pre>
        <pre className="text-sm text-muted-foreground">
          Updates per second: {state.progress.updatesPerSecond.toString()}
        </pre>
        <pre className="text-sm text-muted-foreground">
          Updates this second: {state.progress.updatesThisSecond.toString()}
        </pre>
        <pre className="text-sm text-muted-foreground">Clock time: {state.timestamp?.toLocaleString() ?? null}</pre>
        <pre className="text-sm text-muted-foreground">Block number: {state.block?.toString() ?? null}</pre>
        <pre className="text-sm text-muted-foreground truncate">Latest cursor: {state.cursor}</pre>
      </CardContent>
    </Card>
  );
}
