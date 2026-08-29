import type { Request, Response } from 'express';

import { AppError } from '../errors/app-error.js';

import {
  createUserCategory,
  deleteUserCategory,
  getUserCategories,
  getUserCategory,
  updateUserCategory,
} from '../services/category.service.js';

import {
  createCategorySchema,
  updateCategorySchema,
} from '../validators/category.validator.js';

export async function createCategory(req: Request, res: Response) {
  if (!req.userId) {
    throw new AppError(
      'Authentication required',
      401,
      'AUTHENTICATION_REQUIRED',
    );
  }

  const data = createCategorySchema.parse(req.body);

  const category = await createUserCategory({
    userId: req.userId,
    ...data,
  });

  return res.status(201).json({
    category,
  });
}

export async function getCategories(req: Request, res: Response) {
  if (!req.userId) {
    throw new AppError(
      'Authentication required',
      401,
      'AUTHENTICATION_REQUIRED',
    );
  }

  const categories = await getUserCategories(req.userId);

  return res.status(200).json({
    categories,
  });
}

export async function getCategory(req: Request<{ id: string }>, res: Response) {
  if (!req.userId) {
    throw new AppError(
      'Authentication required',
      401,
      'AUTHENTICATION_REQUIRED',
    );
  }

  const { id } = req.params;

  const category = await getUserCategory(id, req.userId);

  if (!category) {
    throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
  }

  return res.status(200).json({
    category,
  });
}

export async function updateCategory(
  req: Request<{ id: string }>,
  res: Response,
) {
  if (!req.userId) {
    throw new AppError(
      'Authentication required',
      401,
      'AUTHENTICATION_REQUIRED',
    );
  }

  const { id } = req.params;

  const data = updateCategorySchema.parse(req.body);

  const category = await updateUserCategory(id, req.userId, data);

  if (!category) {
    throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
  }

  return res.status(200).json({
    category,
  });
}

export async function deleteCategory(
  req: Request<{ id: string }>,
  res: Response,
) {
  if (!req.userId) {
    throw new AppError(
      'Authentication required',
      401,
      'AUTHENTICATION_REQUIRED',
    );
  }

  const { id } = req.params;

  const category = await deleteUserCategory(id, req.userId);

  if (!category) {
    throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
  }

  return res.status(204).send();
}
