import { Router, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { injectTenant, TenantRequest } from '../middleware/tenant';
import { prisma } from '../config/db';
import { generateMockPrices } from '../utils/mockPriceGenerator';
import {
  create,
  list,
  getById,
  getPriceHistory,
  getCompetitors,
  remove,
} from '../controllers/product.controller';

const router = Router();

router.use(authenticate, injectTenant);

router.get('/', list);
router.post('/', requireRole('ADMIN'), create);
router.get('/:id', getById);
router.get('/:id/prices', getPriceHistory);
router.get('/:id/competitors', getCompetitors);
router.delete('/:id', requireRole('ADMIN'), remove);

router.post(
  '/:id/seed-prices',
  requireRole('ADMIN'),
  async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
      const product = await prisma.product.findFirst({
        where: { id: req.params.id as string, tenantId: req.tenantId! },
      });

      if (!product) {
        res.status(404).json({ status: 'error', message: 'Product not found' });
        return;
      }

      const basePrice = parseFloat(req.body.basePrice) || 99.99;

      await generateMockPrices({
        productId: product.id,
        basePrice,
        days: 30,
        intervalHours: 6,
      });

      res.json({
        status: 'success',
        message: '30 days of mock price data generated',
        data: { productId: product.id, basePrice },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;