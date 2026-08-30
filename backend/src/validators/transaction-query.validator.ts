import { z } from 'zod';

export const transactionQuerySchema = z.object({
  accountId: z.uuid().optional(),

  categoryId: z.uuid().optional(),

  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']).optional(),

  from: z.coerce.date().optional(),

  to: z.coerce.date().optional(),
});
