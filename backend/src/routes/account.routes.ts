import { Router } from 'express';

import {
  createAccount,
  getAccounts,
} from '../controllers/account.controller.js';

import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/createAccount', createAccount);

router.get('/getAccounts', getAccounts);

export default router;
