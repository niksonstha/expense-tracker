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
