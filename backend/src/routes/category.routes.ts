import { Router } from 'express';

import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from '../controllers/category.controller.js';

import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/', createCategory);

router.get('/', getCategories);

router.get('/:id', getCategory);

router.patch('/:id', updateCategory);

router.delete('/:id', deleteCategory);

export default router;
