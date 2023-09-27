"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";

function activePath(path: string) {
  if (path.endsWith("/stream")) {
    return "stream";
  }

  if (path.endsWith("/graph")) {
    return "graph";
  }

  return "inspect";
}

export function SubstreamNav({ parent }: { parent: string }) {
  const path = activePath(usePathname());

  return (
    <NavigationMenu suppressHydrationWarning={true} className="p-1 bg-muted rounded-lg">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href={parent} legacyBehavior={true} passHref={true}>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle({
                className: { "bg-transparent": path === "inspect" },
              })}
            >
              Inspect
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={`${parent}/stream`} legacyBehavior={true} passHref={true}>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle({
                className: { "bg-transparent": path === "stream" },
              })}
            >
              Stream
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={`${parent}/graph`} legacyBehavior={true} passHref={true}>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle({
                className: { "bg-transparent": path === "graph" },
              })}
            >
              Flowchart
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
