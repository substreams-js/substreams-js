import { SubstreamRunner } from "@/components/substream-runner";
import { featured } from "@/lib/featured";
import { invariant } from "@/lib/utils";
import { serializeMessage } from "@/lib/utils/message-serde";
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
  const serialized = serializeMessage(pkg);

  return <SubstreamRunner pkg={serialized} />;
}
