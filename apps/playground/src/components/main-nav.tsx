"use client";

import { Logo } from "@/components/icons";
import { config } from "@/lib/config";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function MainNav() {
  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Logo className="h-6 w-6" />
        <span className="font-bold">{config.name}</span>
      </Link>
      <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
        <Link href="https://substreams.streamingfast.io" className={cn("transition-colors hover:text-foreground/80")}>
          Documentation
        </Link>
      </nav>
    </div>
  );
}
