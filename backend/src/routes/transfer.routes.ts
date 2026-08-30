import { Router } from 'express';

import {
  createTransferController,
  getTransferController,
} from '../controllers/transfer.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/', createTransferController);

router.get('/:id', getTransferController);

export default router;
