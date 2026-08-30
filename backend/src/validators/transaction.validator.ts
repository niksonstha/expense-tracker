import { z } from 'zod';

export const createTransactionSchema = z.object({
  accountId: z.uuid(),

  categoryId: z.uuid().optional(),

  type: z.enum(['INCOME', 'EXPENSE']),

  amount: z.number().positive('Amount must be greater than 0'),

  description: z
    .string()
    .trim()
    .max(500, 'Description must be at most 500 characters')
    .optional(),

  transactionDate: z.coerce.date(),
});

export const updateTransactionSchema = z
  .object({
    accountId: z.uuid().optional(),

    categoryId: z.uuid().nullable().optional(),

    type: z.enum(['INCOME', 'EXPENSE']).optional(),

    amount: z
      .number()
      .finite()
      .positive('Amount must be greater than 0')
      .optional(),

    description: z
      .string()
      .trim()
      .max(500, 'Description must be at most 500 characters')
      .nullable()
      .optional(),

    transactionDate: z.coerce.date().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });
