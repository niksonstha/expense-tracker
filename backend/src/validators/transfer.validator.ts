import { z } from 'zod';

export const createTransferSchema = z
  .object({
    fromAccountId: z.uuid(),

    toAccountId: z.uuid(),

    amount: z.number().finite().positive('Amount must be greater than 0'),

    description: z.string().trim().max(500).optional(),

    transferDate: z.coerce.date(),
  })
  .refine((data) => data.fromAccountId !== data.toAccountId, {
    message: 'Source and destination accounts must be different',
    path: ['toAccountId'],
  });
