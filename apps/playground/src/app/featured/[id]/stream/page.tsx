import { StreamRequester } from "@/components/substreams/stream-requester";
import { featured } from "@/lib/featured";
import { invariant } from "@/lib/utils";
import { fetchSubstream } from "@substreams/core";
import { serializeMessage } from "@substreams/react";

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

  return <StreamRequester pkg={serialized} />;
}
