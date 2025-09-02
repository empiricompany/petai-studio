import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Clone the request headers to be able to modify them
  const newHeaders = new Headers(request.headers);

  // Dynamically determine the Referer for API calls.
  // 1. Use APP_URL from environment variables if available (recommended for production).
  // 2. Fall back to the request's 'host' header.
  // 3. Default to 'localhost:3000' for local development.
  const host = process.env.APP_URL || request.headers.get('host') || 'localhost:3000';
  const protocol = host.startsWith('localhost') ? 'http' : 'https';
  const httpReferer = `${protocol}://${host}`;

  // Set a custom header that API routes can easily access
  newHeaders.set('X-App-Referer', httpReferer);

  // Return the response with the new headers
  return NextResponse.next({
    request: {
      headers: newHeaders,
    },
  });
}

// Configure the middleware to run only on API routes
export const config = {
  matcher: '/api/:path*',
};