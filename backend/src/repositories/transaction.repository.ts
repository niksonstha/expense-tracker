import { and, eq, gte, lte } from 'drizzle-orm';

import { db } from '../db/index.js';
import { transactions } from '../db/schema.js';

export async function createTransaction(data: {
  userId: string;
  accountId: string;
  categoryId?: string;
  type: 'INCOME' | 'EXPENSE';
  direction: 'IN' | 'OUT';
  amount: string;
  description?: string;
  transactionDate: Date;
}) {
  const result = await db.insert(transactions).values(data).returning();

  return result[0];
}

export async function findTransactionsByUserId(
  userId: string,
  filters: {
    accountId?: string;
    categoryId?: string;
    type?: 'INCOME' | 'EXPENSE' | 'TRANSFER';
    from?: Date;
    to?: Date;
  },
) {
  const conditions = [eq(transactions.userId, userId)];

  if (filters.accountId) {
    conditions.push(eq(transactions.accountId, filters.accountId));
  }

  if (filters.categoryId) {
    conditions.push(eq(transactions.categoryId, filters.categoryId));
  }

  if (filters.type) {
    conditions.push(eq(transactions.type, filters.type));
  }

  if (filters.from) {
    conditions.push(gte(transactions.transactionDate, filters.from));
  }

  if (filters.to) {
    conditions.push(lte(transactions.transactionDate, filters.to));
  }

  return db
    .select()
    .from(transactions)
    .where(and(...conditions))
    .orderBy(transactions.transactionDate);
}
