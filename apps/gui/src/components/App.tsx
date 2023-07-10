import { UploadDropzone } from "./UploadDropzone.js";
import { ModuleList } from "./substreams/ModuleList.js";
import { StreamingCard } from "./substreams/StreamingCard.js";
import { type MapModule, fetchSubstream } from "@substreams/core";
import type { Package } from "@substreams/core/proto";
import { useKey } from "@substreams/react";
import { Button, Col, Grid } from "@tremor/react";
import { useState } from "react";

if (typeof import.meta.env.SUBSTREAMS_API_TOKEN !== "string") {
  throw new Error('Missing "SUBSTREAMS_API_TOKEN" environment variable');
}

const TOKEN = import.meta.env.SUBSTREAMS_API_TOKEN;
const ENDPOINT = "https:/mainnet.eth.streamingfast.io";

const packages = [
  {
    name: "Eth Block Metadata (v0.5.1)",
    url: "/eth-block-meta-v0.5.1.spkg",
  },
  {
    name: "Uniswap v3 (v0.2.8)",
    url: "/uniswap-v3-v0.2.8.spkg",
  },
] as const;

export function App() {
  const [uploaded, setUploaded] = useState<Package>();
  const key = useKey(uploaded);

  return (
    <main className="justify-center">
      <Grid numCols={1} numColsLg={6} className="gap-6 m-6">
        <Col numColSpan={1} numColSpanLg={6}>
          <UploadDropzone setUploaded={setUploaded} className="w-full align-middle cursor-pointer self-center" />
        </Col>

        {packages.map((pkg) => (
          <Col key={pkg.url} numColSpan={1} numColSpanLg={1}>
            <Button
              size="xl"
              variant="secondary"
              className="w-full"
              onClick={async () => fetchSubstream(pkg.url).then(setUploaded)}
            >
              {pkg.name}
            </Button>
          </Col>
        ))}
      </Grid>

      {uploaded ? <Substream key={key} pkg={uploaded} /> : null}
    </main>
  );
}

export function Substream({ pkg }: { pkg: Package }) {
  const [module, setModule] = useState<MapModule>();
  const key = useKey(pkg, module);

  return (
    <Grid numCols={1} numColsLg={6} className="gap-6 m-6">
      <Col numColSpan={1} numColSpanLg={4}>
        {module ? <StreamingCard key={key} endpoint={ENDPOINT} token={TOKEN} substream={pkg} module={module} /> : null}
      </Col>
      <Col numColSpan={1} numColSpanLg={2}>
        <ModuleList pkg={pkg} select={setModule} />
      </Col>
    </Grid>
  );
}
