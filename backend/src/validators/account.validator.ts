import { z } from 'zod';

export const createAccountSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Account name must be at least 2 characters')
    .max(100, 'Account name must be at most 100 characters'),

  type: z.enum(['BANK', 'SAVINGS', 'CASH', 'CREDIT_CARD']),

  initialBalance: z.number().finite().default(0),
});
