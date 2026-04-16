import { createClient } from 'redis';
import { env } from './env';
import { logger } from './logger';

export const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on('error', (err) => {
  logger.error('Redis client error', { error: err.message });
});

redisClient.on('connect', () => {
  logger.info('Redis connected successfully');
});

redisClient.on('reconnecting', () => {
  logger.warn('Redis reconnecting...');
});

export const connectRedis = async (): Promise<void> => {
  await redisClient.connect();
};