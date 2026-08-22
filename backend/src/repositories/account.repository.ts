import { eq } from 'drizzle-orm';

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
