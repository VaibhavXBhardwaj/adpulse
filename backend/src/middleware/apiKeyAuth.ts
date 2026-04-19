import { Response, NextFunction } from 'express';
import { validateApiKey } from '../services/apikey.service';
import { AuthenticatedRequest } from './auth';
import { AppError } from './errorHandler';

export const authenticateApiKey = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    throw new AppError('No API key provided', 401);
  }

  try {
    const user = await validateApiKey(apiKey);

    if (!user) {
      throw new AppError('Invalid API key', 401);
    }

    req.user = {
      userId: user.id,
      tenantId: user.tenantId,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};