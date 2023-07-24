import { GitHub, Twitter } from "@/components/icons";
import { MainNav } from "@/components/main-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { config } from "@/lib/config";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <MainNav />

        <div className="flex flex-1 items-center space-x-2 justify-end">
          <nav className="flex items-center">
            <Link href={config.links.github} target="_blank" rel="noreferrer">
              <div className={cn(buttonVariants({ variant: "ghost" }), "w-9 px-0")}>
                <GitHub className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link href={config.links.twitter} target="_blank" rel="noreferrer">
              <div className={cn(buttonVariants({ variant: "ghost" }), "w-9 px-0")}>
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </div>
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
