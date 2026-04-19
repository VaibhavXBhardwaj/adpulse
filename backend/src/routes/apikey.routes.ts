import { Router } from 'express';
import { generate, list, revoke } from '../controllers/apikey.controller';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { rateLimitByApiKey } from '../middleware/rateLimit';

const router = Router();

// Rate limit: 100 requests per 60 seconds per API key
const rateLimit = rateLimitByApiKey({ windowSeconds: 60, maxRequests: 100 });

router.post('/', authenticate, requireRole('ADMIN'), rateLimit, generate);
router.get('/', authenticate, requireRole('ADMIN'), list);
router.delete('/:id', authenticate, requireRole('ADMIN'), revoke);

export default router;