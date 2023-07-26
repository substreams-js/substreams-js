import { SubstreamNav } from "@/components/substream-nav";
import { Separator } from "@/components/ui/separator";
import { featured } from "@/lib/featured";
import { invariant } from "@/lib/utils";
import { fetchSubstream } from "@substreams/core";
import type { ReactNode } from "react";

export async function generateStaticParams() {
  return featured.map(({ id }) => ({ id }));
}

export default async function ({
  children,
  params,
}: {
  children: ReactNode;
  params: {
    id: string;
  };
}) {
  const info = featured.find((item) => item.id === params.id);
  invariant(info !== undefined);

  const pkg = await fetchSubstream(info.spkg);
  const [metadata] = pkg.packageMeta;

  return (
    <>
      <div className="container w-full p-10 space-y-5">
        <h1 className="text-2xl font-bold tracking-tight">{metadata?.name}</h1>
        <p>{metadata?.doc}</p>
        <SubstreamNav parent={`/featured/${params.id}`} />
        <Separator />
      </div>
      <div className="container w-full space-y-10 p-10 pb-16">{children}</div>
    </>
  );
}
