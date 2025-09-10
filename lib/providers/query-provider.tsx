'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

// React Query 클라이언트 설정
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR에서는 데이터 re-fetch 방지
        staleTime: 60 * 1000, // 1분
        gcTime: 10 * 60 * 1000, // 10분 (이전 cacheTime)
        refetchOnWindowFocus: false, // 윈도우 포커스시 재요청 방지
        refetchOnMount: true, // 마운트시 재요청
        retry: 3, // 실패시 3번까지 재시도
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 지수 백오프
      },
      mutations: {
        retry: 1, // 뮤테이션은 1번만 재시도
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: 항상 새로운 클라이언트 생성
    return makeQueryClient()
  } else {
    // Browser: 클라이언트가 없다면 생성
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

interface QueryProviderProps {
  children: ReactNode
}

// Create a module-scoped client to avoid hook usage on server builds
const queryClientSingleton = getQueryClient()

export default function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClientSingleton}>
      {children}
    </QueryClientProvider>
  )
}
