import { type Package, type MapModule } from "@fubhy/substreams";
import { useCallback, useState } from "react";
import { Grid } from "@tremor/react";
import { UploadDropzone } from "./UploadDropzone.js";
import { StreamingCard } from "./substreams/StreamingCard.js";
import { ModuleCards } from "./substreams/ModuleCards.js";

type Selection = {
  pkg: Package;
  module: MapModule;
};

export function App() {
  const [uploaded, setUploaded] = useState<Package | undefined>(undefined);
  const [selected, setSelection] = useState<Selection | undefined>();

  const setModule = useCallback(
    (module: MapModule) => {
      uploaded && setSelection({ pkg: uploaded, module });
    },
    [uploaded],
  );

  return (
    <main className="justify-center p-6">
      <UploadDropzone setUploaded={setUploaded} className="w-full align-middle cursor-pointer self-center" />
      <Grid numCols={1} numColsSm={2} numColsLg={3} className="gap-6 mt-6">
        {uploaded ? <ModuleCards pkg={uploaded} select={setModule} /> : null}
      </Grid>

      {selected ? (
        <StreamingCard endpoint="https://substreams.fly.dev" substream={selected.pkg} module={selected.module} />
      ) : null}
    </main>
  );
}
