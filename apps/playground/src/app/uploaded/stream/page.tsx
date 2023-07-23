"use client";

import { SubstreamRunner } from "@/components/substream-runner";
import { useUploadedPackage } from "@/hooks/use-uploaded-package";

export default function () {
  const pkg = useUploadedPackage();

  return <SubstreamRunner pkg={pkg} />;
}
