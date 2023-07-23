"use client";

import { ModuleGraph } from "@/components/module-graph";
import { Card } from "@/components/ui/card";
import { useUploadedPackage } from "@/hooks/use-uploaded-package";

export default function () {
  const pkg = useUploadedPackage();

  return (
    <Card>
      <ModuleGraph pkg={pkg} />
    </Card>
  );
}
