"use client";

import { QueryClient, QueryClientProvider as ReactQueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

export function QueryClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [client] = useState(() => new QueryClient());

  return <ReactQueryClientProvider client={client}>{children}</ReactQueryClientProvider>;
}
