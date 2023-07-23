import { ModuleList } from "@/components/module-list";
import { featured } from "@/lib/featured";
import { invariant } from "@/lib/utils";
import { fetchSubstream } from "@substreams/core";

export default async function ({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const info = featured.find((item) => item.id === params.id);
  invariant(info !== undefined);

  const pkg = await fetchSubstream(info.spkg);
  const binary = pkg.toBinary();

  return (
    <div>
      <ModuleList pkg={binary} />
    </div>
  );
}
