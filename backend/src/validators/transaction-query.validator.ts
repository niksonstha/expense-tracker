import { z } from 'zod';

export const transactionQuerySchema = z
  .object({
    accountId: z.uuid().optional(),

    categoryId: z.uuid().optional(),

    type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']).optional(),

    from: z.coerce.date().optional(),

    to: z.coerce.date().optional(),

    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(20),

    sort: z.enum(['asc', 'desc']).default('desc'),
  })
  .refine((data) => !data.from || !data.to || data.from <= data.to, {
    message: '`from` must be before or equal to `to`',
    path: ['from'],
  });
