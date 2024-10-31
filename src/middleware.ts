import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Rate limiting configuration
const rateLimit = 100; // requests per minute
const rateLimitWindow = 60 * 1000; // 1 minute in milliseconds
const ipRequestMap = new Map();

export default withAuth(
  function middleware(req) {
    // Rate limiting logic
    const ip = req.ip ?? '127.0.0.1';
    const now = Date.now();
    const requestLog = ipRequestMap.get(ip) ?? [];
    const recentRequests = requestLog.filter(time => now - time < rateLimitWindow);

    if (recentRequests.length >= rateLimit) {
      return new NextResponse('Too Many Requests', { 
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Limit': rateLimit.toString(),
          'X-RateLimit-Remaining': '0'
        }
      });
    }

    recentRequests.push(now);
    ipRequestMap.set(ip, recentRequests);

    // Add security headers
    const res = NextResponse.next();
    res.headers.set("X-DNS-Prefetch-Control", "on");
    res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    res.headers.set("X-XSS-Protection", "1; mode=block");
    res.headers.set("X-Frame-Options", "DENY");
    res.headers.set("X-Content-Type-Options", "nosniff");
    res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    res.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
    );

    return res;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/api/auth/:path*",
    "/dashboard/:path*",
    "/api/generate/:path*",
    "/api/user/:path*",
  ],
};