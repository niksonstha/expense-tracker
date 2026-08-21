import { Router } from 'express';
import authRoutes from './auth.routes.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    message: 'Expense Tracker API',
    version: '1.0.0',
  });
});

router.use('/auth', authRoutes);

export default router;
