import "./globals.css";

import { QueryClientProvider } from "@/components/providers/query-client-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { config } from "@/lib/config";
import { sans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: config.name,
    template: `%s - ${config.name}`,
  },
  description: config.description,
  keywords: ["The Graph", "Substreams", "Blockchain", "Ethereum"],
  authors: [
    {
      name: "fubhy",
      url: "https://twitter.com/thefubhy",
    },
  ],
  creator: "fubhy",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: config.url,
    title: config.name,
    description: config.description,
    siteName: config.name,
  },
  twitter: {
    card: "summary_large_image",
    title: config.name,
    description: config.description,
    creator: "@thefubhy",
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function ({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head />
      <body className={cn("min-h-screen bg-background font-sans antialiased", sans.variable)}>
        <QueryClientProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <div className="flex-1">{children}</div>
            </div>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
