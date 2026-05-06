import { Router, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth';
import { injectTenant, TenantRequest } from '../middleware/tenant';

const router = Router();

// All product routes require auth + tenant injection
router.use(authenticate, injectTenant);

// GET /api/products — returns only this tenant's products
router.get('/', async (req: TenantRequest, res: Response, next: NextFunction) => {
  try {
    const products = await req.tenant!.products.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      status: 'success',
      data: products,
      meta: {
        tenantId: req.tenantId,
        count: products.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;