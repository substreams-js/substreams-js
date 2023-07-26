"use client";

import { SubstreamNav } from "@/components/substream-nav";
import { Separator } from "@/components/ui/separator";
import { useUploadedPackage } from "@/hooks/use-uploaded-package";
import type { ReactNode } from "react";

export default function ({
  children,
}: {
  children: ReactNode;
}) {
  const pkg = useUploadedPackage();
  const [metadata] = pkg.packageMeta;

  return (
    <>
      <div className="container w-full p-10 space-y-5">
        <h1 className="text-2xl font-bold tracking-tight">{metadata?.name}</h1>
        <p>{metadata?.doc}</p>
        <SubstreamNav parent="/uploaded" />
        <Separator />
      </div>
      <div className="container w-full space-y-10 p-10 pb-16">{children}</div>
    </>
  );
}
