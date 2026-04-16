import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './config/db';
import { connectRedis, redisClient } from './config/redis';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security middleware
app.use(helmet());

// CORS — allow frontend to talk to backend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Health check
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const redisPing = await redisClient.ping();

    res.json({
      status: 'ok',
      message: 'AdPulse backend is running',
      services: {
        database: 'connected',
        redis: redisPing === 'PONG' ? 'connected' : 'error',
      },
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'One or more services are down',
      timestamp: new Date().toISOString(),
    });
  }
});

// Error handler — must be last
app.use(errorHandler);

// Start server
const start = async (): Promise<void> => {
  try {
    await connectRedis();
    logger.info('Redis connected');

    app.listen(env.PORT, () => {
      logger.info(`AdPulse backend running`, {
        port: env.PORT,
        environment: env.NODE_ENV,
      });
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
};

start();

export default app;