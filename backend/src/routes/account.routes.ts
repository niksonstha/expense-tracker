import { Router } from 'express';

import {
  createAccount,
  deleteAccount,
  getAccount,
  getAccounts,
  updateAccount,
} from '../controllers/account.controller.js';

import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/', createAccount);

router.get('/', getAccounts);

router.get('/:id', getAccount);

router.patch('/:id', updateAccount);

router.delete('/:id', deleteAccount);

export default router;
