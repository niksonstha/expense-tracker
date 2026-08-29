import { and, eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import { accounts } from '../db/schema.js';

export async function createAccount(data: {
  userId: string;
  name: string;
  type: 'BANK' | 'SAVINGS' | 'CASH' | 'CREDIT_CARD';
  initialBalance: string;
}) {
  const result = await db.insert(accounts).values(data).returning();

  return result[0];
}

export async function findAccountsByUserId(userId: string) {
  return db.select().from(accounts).where(eq(accounts.userId, userId));
}

export async function findAccountById(accountId: string, userId: string) {
  const result = await db
    .select()
    .from(accounts)
    .where(and(eq(accounts.id, accountId), eq(accounts.userId, userId)))
    .limit(1);

  return result[0] ?? null;
}

export async function updateAccountById(
  accountId: string,
  userId: string,
  data: {
    name?: string;
    type?: 'BANK' | 'SAVINGS' | 'CASH' | 'CREDIT_CARD';
    initialBalance?: string;
  },
) {
  const result = await db
    .update(accounts)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(accounts.id, accountId), eq(accounts.userId, userId)))
    .returning();

  return result[0] ?? null;
}

export async function deleteAccountById(accountId: string, userId: string) {
  const result = await db
    .delete(accounts)
    .where(and(eq(accounts.id, accountId), eq(accounts.userId, userId)))
    .returning({
      id: accounts.id,
    });

  return result[0] ?? null;
}
