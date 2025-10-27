"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

export const TanStackQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const client = new QueryClient();
  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
};
