"use client";

import { ModuleGraph } from "@/components/substreams/module-graph";
import { useUploadedPackage } from "@/hooks/use-uploaded-package";

export default function () {
  const pkg = useUploadedPackage();

  return <ModuleGraph pkg={pkg} />;
}
