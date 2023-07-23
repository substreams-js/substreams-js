"use client";

import { ModuleList } from "@/components/module-list";
import { useUploadedPackage } from "@/hooks/use-uploaded-package";

export default function () {
  const pkg = useUploadedPackage();

  return (
    <div>
      <ModuleList pkg={pkg} />
    </div>
  );
}
