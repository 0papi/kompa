"use client";

import React, { useState } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
  dehydrate,
  type DehydratedState,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Keep data fresh for 2 minutes by default
        staleTime: 1000 * 60 * 2,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: false,
        // Retry failed requests with exponential backoff (cap at 30s)
        retry: 2,
        retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30_000),
      },
      mutations: {
        // Retry mutations only once (idempotency depends on API design)
        retry: 1,
        retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30_000),
      },
    },
  });
}

export type QueryProviderProps = {
  children: React.ReactNode;
  // Pass dehydrated state from server-side rendering (optional)
  dehydratedState?: DehydratedState | null;
};


export default function TanStackQueryProvider({
  children,
  dehydratedState = null,
}: QueryProviderProps) {
  // Persist QueryClient for the lifetime of the React tree
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
      {process.env.NODE_ENV === 'development' ? (
        // Devtools only in development
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  );
}

// Server helper to create a fresh QueryClient for SSR/SSG prefetching
export function createServerQueryClient() {
  const qc = createQueryClient();
  // Optional: disable automatic retries on server rendering to fail fast
  qc.setDefaultOptions({
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
    },
  });
  return qc;
}

// Utility to dehydrate a QueryClient after prefetching on the server
export function extractDehydratedState(queryClient: QueryClient) {
  return dehydrate(queryClient);
}
