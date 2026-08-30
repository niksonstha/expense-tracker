import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import accountRoutes from './account.routes.js';
import categoryRoutes from './category.routes.js';
import transactionRoutes from './transaction.routes.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    message: 'Expense Tracker API',
    version: '1.0.0',
  });
});

router.use('/auth', authRoutes);
router.use('/', userRoutes);
router.use('/account', accountRoutes);
router.use('/categories', categoryRoutes);
router.use('/transactions', transactionRoutes);

export default router;
