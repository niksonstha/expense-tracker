import { and, asc, count, desc, eq, gte, lte } from 'drizzle-orm';

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
    page: number;
    limit: number;
    sort: 'asc' | 'desc';
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

  const offset = (filters.page - 1) * filters.limit;

  const order =
    filters.sort === 'asc'
      ? asc(transactions.transactionDate)
      : desc(transactions.transactionDate);

  const whereClause = and(...conditions);

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(transactions)
      .where(whereClause)
      .orderBy(order)
      .limit(filters.limit)
      .offset(offset),

    db
      .select({
        count: count(),
      })
      .from(transactions)
      .where(whereClause),
  ]);

  return {
    data,
    total: totalResult[0]?.count ?? 0,
  };
}
