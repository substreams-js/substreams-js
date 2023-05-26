import type { Modules } from "../../proto/sf/substreams/v1/modules_pb.js";
import { generateMermaidGraph } from "./generateMermaidGraph.js";
import { deflate } from "pako";

export function generateMermaidLiveUrl(modules: Modules) {
  const mermaid = JSON.stringify({
    code: generateMermaidGraph(modules),
    mermaid: `{"theme":"default"}`,
    autoSync: true,
    updateDiagram: true,
  });

  const encoder = new TextEncoder();
  const data = encoder.encode(mermaid);
  const compressed = deflate(data, { level: 9 });
  const serialized = btoa(String.fromCharCode(...compressed));
  return `https://mermaid.live/edit#pako:${serialized}`;
}
