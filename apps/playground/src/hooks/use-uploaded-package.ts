"use client";

import { Package } from "@substreams/core/proto";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export function useUploadedPackage() {
  const { data } = useQuery({
    // This is a bit of a workaround atm. while there are no actual server uploaded packages yet. We are
    // only reading from the query cache here which is somewhat equivalent to simply using basic state
    // management. The cache is set in the `UploadPackage` component.
    enabled: false,
    throwOnError: true,
    queryKey: ["substream", "uploaded"],
    select: (data: Package) => data,
  });

  if (!data) {
    redirect("/");
  }

  return data;
}
