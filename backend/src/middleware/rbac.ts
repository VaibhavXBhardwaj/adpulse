import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { AppError } from './errorHandler';

type Role = 'ADMIN' | 'ANALYST' | 'VIEWER';

// Role hierarchy — higher index means more permissions
const roleHierarchy: Role[] = ['VIEWER', 'ANALYST', 'ADMIN'];

export const requireRole = (...allowedRoles: Role[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const userRole = req.user.role as Role;

    const hasPermission = allowedRoles.some((allowedRole) => {
      const userRoleIndex = roleHierarchy.indexOf(userRole);
      const requiredRoleIndex = roleHierarchy.indexOf(allowedRole);
      return userRoleIndex >= requiredRoleIndex;
    });

    if (!hasPermission) {
      throw new AppError(
        `Access denied. Required role: ${allowedRoles.join(' or ')}`,
        403
      );
    }

    next();
  };
};