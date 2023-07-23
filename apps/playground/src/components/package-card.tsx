"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface SubstreamPackageCardProps {
  name: string;
  version: string;
  description?: string;
  id: string;
}

export function PackageCard({ id, name, version, description }: SubstreamPackageCardProps) {
  return (
    <Card className="relative cursor-pointer transition-colors hover:bg-accent">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <Badge variant="default">{version}</Badge>
      </CardContent>
      <Link href={`/featured/${id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View package</span>
      </Link>
    </Card>
  );
}
