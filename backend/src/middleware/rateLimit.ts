import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../config/redis';
import { AppError } from './errorHandler';

interface RateLimitOptions {
  windowSeconds: number;  // time window in seconds
  maxRequests: number;    // max requests allowed in that window
}

export const rateLimitByApiKey = (options: RateLimitOptions) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      next();
      return;
    }

    const redisKey = `rate_limit:${apiKey}`;

    try {
      const current = await redisClient.incr(redisKey);

      if (current === 1) {
        // First request in this window — set expiry
        await redisClient.expire(redisKey, options.windowSeconds);
      }

      // Set rate limit headers so the client knows their usage
      res.setHeader('X-RateLimit-Limit', options.maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, options.maxRequests - current));

      if (current > options.maxRequests) {
        throw new AppError(
          `Rate limit exceeded. Max ${options.maxRequests} requests per ${options.windowSeconds} seconds.`,
          429
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};