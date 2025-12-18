"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";

// Cache time constants (in milliseconds)
const STALE_TIME = 5 * 60 * 1000; // 5 minutes - data is fresh for this duration
const GC_TIME = 30 * 60 * 1000; // 30 minutes - unused data stays in cache

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data remains fresh for 5 minutes (won't refetch during this time)
        staleTime: STALE_TIME,
        // Keep unused data in cache for 30 minutes
        gcTime: GC_TIME,
        // Retry failed requests up to 2 times
        retry: 2,
        // Delay between retries (exponential backoff)
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Don't refetch on window focus (reduces unnecessary requests)
        refetchOnWindowFocus: false,
        // Don't refetch on reconnect unless data is stale
        refetchOnReconnect: "always",
        // Don't refetch on mount if data exists and is fresh
        refetchOnMount: false,
      },
      mutations: {
        // Retry mutations once on failure
        retry: 1,
      },
    },
  });
}

// Singleton for browser - prevents multiple QueryClient instances
let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: reuse existing query client or create new one
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export const TanStackQueryProvider = ({ children }: { children: React.ReactNode }) => {
  // Use useState to ensure stable client across renders
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
