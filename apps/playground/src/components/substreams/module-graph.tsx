"use client";

import { Card } from "@/components/ui/card";
import { generateMermaidGraph } from "@substreams/core";
import { Package } from "@substreams/core/proto";
import { type MaybeSerializedMessage, useRehydrateMessage } from "@substreams/react";
import { useQuery } from "@tanstack/react-query";
import mermaid from "mermaid";
import { useLayoutEffect, useMemo, useRef } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

mermaid.initialize({
  startOnLoad: false,
  wrap: false,
  flowchart: {
    useMaxWidth: false,
    useWidth: 600,
    wrappingWidth: 600,
  },
});

export function ModuleGraph({
  pkg: ppkg,
}: {
  pkg: MaybeSerializedMessage<Package>;
}) {
  const pkg = useRehydrateMessage(Package, ppkg);
  const graph = useMemo(() => {
    const modules = pkg.modules?.modules;
    if (modules === undefined || modules.length === 0) {
      return undefined;
    }

    return generateMermaidGraph(modules);
  }, [pkg]);

  if (graph === undefined) {
    return null;
  }

  return (
    <Card>
      <MermaidGraph graph={graph} />
    </Card>
  );
}

function MermaidGraph({
  graph,
}: {
  graph: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { data } = useQuery({
    queryKey: ["mermaid", graph],
    queryFn: () => mermaid.render("graph-div", graph),
  });

  useLayoutEffect(() => {
    if (data && ref.current) {
      data.bindFunctions?.(ref.current);
    }
  }, [data]);

  if (!data) {
    return null;
  }

  return (
    <TransformWrapper minScale={0.1} limitToBounds={false}>
      <TransformComponent wrapperStyle={{ height: 800, width: "100%" }}>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
        <div ref={ref} dangerouslySetInnerHTML={{ __html: data.svg }} />
      </TransformComponent>
    </TransformWrapper>
  );
}
