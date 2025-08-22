// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 임시로 middleware 비활성화하여 개발 서버 문제 해결
export async function middleware(request: NextRequest) {
  // 개발 환경에서는 모든 요청 통과
  return NextResponse.next()
}

// 미들웨어가 실행될 경로 설정 (개발 시에는 최소한으로)
export const config = {
  matcher: [
    // API 라우트만 적용
    '/api/((?!health).*)'
  ],
}
