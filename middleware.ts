// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Temporarily disable middleware to resolve dev server issues
export async function middleware(request: NextRequest) {
  // Allow all requests in development environment
  return NextResponse.next()
}

// Configure paths where middleware runs (minimal for development)
export const config = {
  matcher: [
    // Apply only to API routes
    '/api/((?!health).*)'
  ],
}
