"use client";

import { StreamRequester } from "@/components/substreams/stream-requester";
import { useUploadedPackage } from "@/hooks/use-uploaded-package";

export default function () {
  const pkg = useUploadedPackage();

  return <StreamRequester pkg={pkg} />;
}
