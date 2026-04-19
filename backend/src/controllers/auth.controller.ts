import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, getMe } from '../services/auth.service';
import { AuthenticatedRequest } from '../middleware/auth';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, name, tenantName } = req.body;

    if (!email || !password || !name || !tenantName) {
      res.status(400).json({
        status: 'error',
        message: 'email, password, name, and tenantName are required',
      });
      return;
    }

    const result = await registerUser({ email, password, name, tenantName });

    res.status(201).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        status: 'error',
        message: 'email and password are required',
      });
      return;
    }

    const result = await loginUser({ email, password });

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const user = await getMe(userId);

    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};