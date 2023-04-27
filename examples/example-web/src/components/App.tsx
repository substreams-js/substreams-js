import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stream } from "./Stream.js";

const client = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={client}>
      <main>
        <Stream />
      </main>
    </QueryClientProvider>
  );
}
