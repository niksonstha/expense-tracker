import { and, eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import type { DbTransaction } from '../db/index.js';
import { transfers, transactions } from '../db/schema.js';

export async function createTransfer(
  tx: DbTransaction,
  data: {
    userId: string;
    amount: string;
    description?: string;
    transferDate: Date;
  },
) {
  const result = await tx.insert(transfers).values(data).returning();

  return result[0];
}

export async function findTransferById(transferId: string, userId: string) {
  const transfer = await db
    .select()
    .from(transfers)
    .where(and(eq(transfers.id, transferId), eq(transfers.userId, userId)))
    .limit(1);

  return transfer[0] ?? null;
}

export async function findTransferTransactions(
  transferId: string,
  userId: string,
) {
  return db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.transferId, transferId),
        eq(transactions.userId, userId),
      ),
    );
}
