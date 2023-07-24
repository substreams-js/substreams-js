import "./globals.css";

import { QueryClientProvider } from "@/components/query-client-provider";
import { SiteHeader } from "@/components/site-header";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { config } from "@/lib/config";
import { sans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { ReactNode } from "react";

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
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <div className="flex-1">{children}</div>
            </div>
            <TailwindIndicator />
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
