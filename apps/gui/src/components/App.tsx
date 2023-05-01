import { useState } from "react";
import { Col, Grid } from "@tremor/react";
import { type Package, type MapModule } from "@fubhy/substreams";
import { useKey } from "@fubhy/substreams-react";
import { UploadDropzone } from "./UploadDropzone.js";
import { StreamingCard } from "./substreams/StreamingCard.js";
import { ModuleList } from "./substreams/ModuleList.js";

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
        {module ? (
          <StreamingCard key={key} endpoint="https://substreams.fly.dev" substream={pkg} module={module} />
        ) : null}
      </Col>
      <Col numColSpan={1} numColSpanLg={2}>
        <ModuleList pkg={pkg} select={setModule} />
      </Col>
    </Grid>
  );
}
