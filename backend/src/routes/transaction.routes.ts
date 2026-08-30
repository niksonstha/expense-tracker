import { Router } from 'express';

import {
  getTransactions,
  createTransaction,
} from '../controllers/transaction.controller.js';

import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/', createTransaction);

router.get('/', getTransactions);

export default router;
