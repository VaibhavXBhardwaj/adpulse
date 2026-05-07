import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { injectTenant } from '../middleware/tenant';
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

export default router;