import { and, eq, sql } from 'drizzle-orm';

import { db } from '../db/index.js';
import { accounts, transactions } from '../db/schema.js';

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

export async function getAccountBalance(accountId: string, userId: string) {
  const result = await db
    .select({
      initialBalance: accounts.initialBalance,

      income: sql<string>`
        COALESCE(
          SUM(
            CASE
              WHEN ${transactions.direction} = 'IN'
              THEN ${transactions.amount}
              ELSE 0
            END
          ),
          0
        )
      `,

      expense: sql<string>`
        COALESCE(
          SUM(
            CASE
              WHEN ${transactions.direction} = 'OUT'
              THEN ${transactions.amount}
              ELSE 0
            END
          ),
          0
        )
      `,
    })
    .from(accounts)
    .leftJoin(transactions, eq(transactions.accountId, accounts.id))
    .where(and(eq(accounts.id, accountId), eq(accounts.userId, userId)))
    .groupBy(accounts.id, accounts.initialBalance);

  const row = result[0];

  if (!row) {
    return null;
  }

  const balance =
    Number(row.initialBalance) + Number(row.income) - Number(row.expense);

  return {
    initialBalance: row.initialBalance,
    income: row.income,
    expense: row.expense,
    balance: balance.toFixed(2),
  };
}

export async function findAccountsWithBalance(userId: string) {
  const rows = await db
    .select({
      id: accounts.id,
      userId: accounts.userId,
      name: accounts.name,
      type: accounts.type,
      initialBalance: accounts.initialBalance,
      createdAt: accounts.createdAt,
      updatedAt: accounts.updatedAt,

      income: sql<string>`
        COALESCE(
          SUM(
            CASE
              WHEN ${transactions.direction} = 'IN'
              THEN ${transactions.amount}
              ELSE 0
            END
          ),
          0
        )
      `,

      expense: sql<string>`
        COALESCE(
          SUM(
            CASE
              WHEN ${transactions.direction} = 'OUT'
              THEN ${transactions.amount}
              ELSE 0
            END
          ),
          0
        )
      `,
    })
    .from(accounts)
    .leftJoin(transactions, eq(transactions.accountId, accounts.id))
    .where(eq(accounts.userId, userId))
    .groupBy(
      accounts.id,
      accounts.userId,
      accounts.name,
      accounts.type,
      accounts.initialBalance,
      accounts.createdAt,
      accounts.updatedAt,
    );

  return rows.map((account) => {
    const balance =
      Number(account.initialBalance) +
      Number(account.income) -
      Number(account.expense);

    return {
      id: account.id,
      userId: account.userId,
      name: account.name,
      type: account.type,
      initialBalance: account.initialBalance,
      balance: balance.toFixed(2),
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  });
}
