import { Router } from 'express';
import { register, login, me } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, me);

// Test RBAC routes — remove these after testing
router.get('/admin-only', authenticate, requireRole('ADMIN'), (req, res) => {
  res.json({ status: 'success', message: 'You are an admin' });
});

router.get('/analyst-up', authenticate, requireRole('ANALYST'), (req, res) => {
  res.json({ status: 'success', message: 'You are analyst or above' });
});

export default router;