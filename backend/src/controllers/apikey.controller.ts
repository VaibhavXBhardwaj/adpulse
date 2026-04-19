import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import {
  createApiKey,
  listApiKeys,
  revokeApiKey,
} from '../services/apikey.service';

export const generate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ status: 'error', message: 'name is required' });
      return;
    }

    const apiKey = await createApiKey(req.user!.userId, name);

    res.status(201).json({
      status: 'success',
      message: 'Store this key securely. It will not be shown again.',
      data: apiKey,
    });
  } catch (error) {
    next(error);
  }
};

export const list = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const keys = await listApiKeys(req.user!.userId);
    res.json({ status: 'success', data: keys });
  } catch (error) {
    next(error);
  }
};

export const revoke = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const result = await revokeApiKey(id, req.user!.userId);
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};