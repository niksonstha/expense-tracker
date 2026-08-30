import { Router } from 'express';

import {
  deleteTransaction,
  updateTransaction,
  getTransaction,
  getTransactions,
  createTransaction,
} from '../controllers/transaction.controller.js';

import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/', createTransaction);

router.get('/', getTransactions);

router.get('/:id', getTransaction);

router.patch('/:id', updateTransaction);

router.delete('/:id', deleteTransaction);

export default router;
