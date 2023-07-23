"use client";

import { useQuery } from "@tanstack/react-query";
import mermaid from "mermaid";
import { useLayoutEffect, useRef } from "react";
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

export function MermaidGraph({
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
        {/* rome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
        <div ref={ref} dangerouslySetInnerHTML={{ __html: data.svg }} />
      </TransformComponent>
    </TransformWrapper>
  );
}
