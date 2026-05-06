import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { createTenantContext, TenantContext } from '../utils/tenantContext';
import { AppError } from './errorHandler';

export interface TenantRequest extends AuthenticatedRequest {
  tenant?: TenantContext;
  tenantId?: string;
}

export const injectTenant = (
  req: TenantRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user?.tenantId) {
    throw new AppError('Tenant context not found', 400);
  }

  req.tenantId = req.user.tenantId;
  req.tenant = createTenantContext(req.user.tenantId);

  next();
};