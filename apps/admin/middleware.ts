import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for admin routes
 * 
 * Note: Environment variable validation is done in the login route,
 * not in middleware, to avoid edge runtime issues with env loading.
 */
export function middleware(request: NextRequest) {
  // Middleware just passes through - validation happens in routes
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};

