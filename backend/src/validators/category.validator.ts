import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Category name must be at least 2 characters')
    .max(100, 'Category name must be at most 100 characters'),

  type: z.enum(['INCOME', 'EXPENSE']),
});

export const updateCategorySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Category name must be at least 2 characters')
      .max(100, 'Category name must be at most 100 characters')
      .optional(),

    type: z.enum(['INCOME', 'EXPENSE']).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });
