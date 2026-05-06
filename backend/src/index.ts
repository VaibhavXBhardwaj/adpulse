import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './config/db';
import { connectRedis, redisClient } from './config/redis';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import apiKeyRoutes from './routes/apikey.routes';
import productRoutes from './routes/product.routes';

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

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

app.use('/api/auth', authRoutes);
app.use('/api/apikeys', apiKeyRoutes);
app.use('/api/products', productRoutes);

app.use(errorHandler);

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