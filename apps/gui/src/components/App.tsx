import { UploadDropzone } from "./UploadDropzone.js";
import { ModuleList } from "./substreams/ModuleList.js";
import { StreamingCard } from "./substreams/StreamingCard.js";
import type { MapModule } from "@substreams/core";
import type { Package } from "@substreams/core/proto";
import { useKey } from "@substreams/react";
import { Col, Grid } from "@tremor/react";
import { useState } from "react";

const endpoint = import.meta.env.VITE_PROXY_ENDPOINT ?? "https://substreams.fly.dev";

export function App() {
  const [uploaded, setUploaded] = useState<Package | undefined>(undefined);
  const key = useKey(uploaded);

  return (
    <main className="justify-center p-6">
      <UploadDropzone setUploaded={setUploaded} className="w-full align-middle cursor-pointer self-center" />
      {uploaded ? <Substream key={key} pkg={uploaded} /> : null}
    </main>
  );
}

export function Substream({ pkg }: { pkg: Package }) {
  const [module, setModule] = useState<MapModule>();
  const key = useKey(pkg, module);

  return (
    <Grid numCols={1} numColsLg={5} className="gap-6 mt-6">
      <Col numColSpan={1} numColSpanLg={3}>
        {module ? <StreamingCard key={key} endpoint={endpoint} substream={pkg} module={module} /> : null}
      </Col>
      <Col numColSpan={1} numColSpanLg={2}>
        <ModuleList pkg={pkg} select={setModule} />
      </Col>
    </Grid>
  );
}
