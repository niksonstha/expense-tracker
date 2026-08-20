import { db } from '../db/index.js';
import { transactions, transfers } from '../db/schema.js';

export async function createTransfer({
  userId,
  fromAccountId,
  toAccountId,
  amount,
  description,
  transferDate,
}: {
  userId: string;
  fromAccountId: string;
  toAccountId: string;
  amount: string;
  description?: string;
  transferDate: Date;
}) {
  return db.transaction(async (tx) => {
    const [transfer] = await tx
      .insert(transfers)
      .values({
        userId,
        amount,
        description,
        transferDate,
      })
      .returning();

    const [outTransaction] = await tx
      .insert(transactions)
      .values({
        userId,
        accountId: fromAccountId,
        transferId: transfer.id,
        type: 'TRANSFER',
        direction: 'OUT',
        amount,
        description,
        transactionDate: transferDate,
      })
      .returning();

    const [inTransaction] = await tx
      .insert(transactions)
      .values({
        userId,
        accountId: toAccountId,
        transferId: transfer.id,
        type: 'TRANSFER',
        direction: 'IN',
        amount,
        description,
        transactionDate: transferDate,
      })
      .returning();

    return {
      transfer,
      outTransaction,
      inTransaction,
    };
  });
}
