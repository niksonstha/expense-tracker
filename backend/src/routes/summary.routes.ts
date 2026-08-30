import { Router } from 'express';

import {
  getSpending,
  getMonthlySummary,
  getSummary,
} from '../controllers/summary.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getSummary);

router.get('/monthly', getMonthlySummary);

router.get('/spending', getSpending);

export default router;
