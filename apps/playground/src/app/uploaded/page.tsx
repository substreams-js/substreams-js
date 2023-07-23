"use client";

import { useUploadedPackage } from "@/hooks/use-uploaded-package";

export default function () {
  const pkg = useUploadedPackage();

  return <div className="container w-full space-y-10 p-10 pb-16">{pkg.toJsonString()}</div>;
}
