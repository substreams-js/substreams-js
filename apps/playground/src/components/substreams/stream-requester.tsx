"use client";

import { StreamForm } from "@/components/substreams/stream-form";
import { StreamRunner } from "@/components/substreams/stream-runner";
import { useMessageKey } from "@/hooks/use-message-key";
import { useMessageRegistry } from "@/hooks/use-message-registry";
import { useModuleGraph } from "@/hooks/use-module-graph";
import { Package, Request } from "@substreams/core/proto";
import { type MaybeSerializedMessage, useRehydrateMessage } from "@substreams/react";
import { useState } from "react";

export function StreamRequester({
  pkg: ppkg,
}: {
  pkg: MaybeSerializedMessage<Package>;
}) {
  const pkg = useRehydrateMessage(Package, ppkg);
  const registry = useMessageRegistry(pkg);
  const graph = useModuleGraph(pkg);

  const [request, setRequest] = useState<Request>();
  const requestKey = useMessageKey(request);

  return (
    <div className="space-y-4">
      {request ? (
        <StreamRunner key={requestKey} registry={registry} request={request} reset={() => setRequest(undefined)} />
      ) : (
        <StreamForm pkg={pkg} graph={graph} setRequest={setRequest} />
      )}
    </div>
  );
}
