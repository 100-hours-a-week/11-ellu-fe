'use client';

import React, { useState } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { env } from 'next-runtime-env';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        // react-query 전역 설정
        queries: {
          refetchOnWindowFocus: false,
          retryOnMount: true,
          refetchOnReconnect: false,
          retry: false,
          staleTime: 5 * 60 * 1000, // 5분
        },
      },
    })
  );

  // 환경 모드 확인
  const mode = env('NEXT_PUBLIC_MODE');

  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={mode === 'development'} />
    </QueryClientProvider>
  );
}
