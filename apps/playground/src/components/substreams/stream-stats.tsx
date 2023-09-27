import type { Stream } from "@/components/substreams/stream-runner";
import { Card, CardContent } from "@/components/ui/card";

export function StreamStats({
  state,
}: {
  state: Stream;
}) {
  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <pre className="text-sm text-muted-foreground">Clock time: {state.timestamp?.toLocaleString() ?? null}</pre>
        <pre className="text-sm text-muted-foreground">Block number: {state.block?.toString() ?? null}</pre>
        <pre className="text-sm text-muted-foreground truncate">Latest cursor: {state.cursor}</pre>
      </CardContent>
    </Card>
  );
}
