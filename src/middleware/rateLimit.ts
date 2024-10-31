import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

interface RateLimitConfig {
  windowMs: number;
  max: number;
}

const defaultConfig: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per windowMs
};

const ipRequestMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimiter(config: RateLimitConfig = defaultConfig) {
  return function(req: NextApiRequest, res: NextApiResponse, next: () => void) {
    const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();
    const requestData = ipRequestMap.get(ip);

    if (!requestData || now > requestData.resetTime) {
      ipRequestMap.set(ip, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return next();
    }

    requestData.count++;

    if (requestData.count > config.max) {
      return res.status(429).json({
        error: 'Too many requests, please try again later.',
        retryAfter: Math.ceil((requestData.resetTime - now) / 1000)
      });
    }

    ipRequestMap.set(ip, requestData);
    return next();
  };
}

export function edgeRateLimiter(config: RateLimitConfig = defaultConfig) {
  return async function(req: Request) {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    const requestData = ipRequestMap.get(ip);

    if (!requestData || now > requestData.resetTime) {
      ipRequestMap.set(ip, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return null;
    }

    requestData.count++;

    if (requestData.count > config.max) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((requestData.resetTime - now) / 1000).toString(),
          'X-RateLimit-Limit': config.max.toString(),
          'X-RateLimit-Remaining': '0'
        }
      });
    }

    ipRequestMap.set(ip, requestData);
    return null;
  };
}

export function clearRateLimits() {
  ipRequestMap.clear();
}