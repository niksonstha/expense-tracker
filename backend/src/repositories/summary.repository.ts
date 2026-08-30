import { and, eq, gte, isNotNull, lt, sql } from 'drizzle-orm';

import { db } from '../db/index.js';

import { categories, accounts, transactions } from '../db/schema.js';

export async function getUserFinancialSummary(userId: string) {
  const [balanceResult, transactionResult] = await Promise.all([
    db
      .select({
        totalInitialBalance: sql<string>`
            COALESCE(
              SUM(${accounts.initialBalance}),
              0
            )
          `,
      })
      .from(accounts)
      .where(eq(accounts.userId, userId)),

    db
      .select({
        totalIncome: sql<string>`
            COALESCE(
              SUM(
                CASE
                  WHEN ${transactions.type} = 'INCOME'
                  THEN ${transactions.amount}
                  ELSE 0
                END
              ),
              0
            )
          `,

        totalExpense: sql<string>`
            COALESCE(
              SUM(
                CASE
                  WHEN ${transactions.type} = 'EXPENSE'
                  THEN ${transactions.amount}
                  ELSE 0
                END
              ),
              0
            )
          `,
      })
      .from(transactions)
      .where(eq(transactions.userId, userId)),
  ]);

  const totalInitialBalance = Number(
    balanceResult[0]?.totalInitialBalance ?? 0,
  );

  const totalIncome = Number(transactionResult[0]?.totalIncome ?? 0);

  const totalExpense = Number(transactionResult[0]?.totalExpense ?? 0);

  return {
    totalBalance: (totalInitialBalance + totalIncome - totalExpense).toFixed(2),

    totalIncome: totalIncome.toFixed(2),

    totalExpense: totalExpense.toFixed(2),
  };
}

export async function getUserMonthlySummary(
  userId: string,
  from: Date,
  to: Date,
) {
  const result = await db
    .select({
      income: sql<string>`
        COALESCE(
          SUM(
            CASE
              WHEN ${transactions.type} = 'INCOME'
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
              WHEN ${transactions.type} = 'EXPENSE'
              THEN ${transactions.amount}
              ELSE 0
            END
          ),
          0
        )
      `,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, userId),
        gte(transactions.transactionDate, from),
        lt(transactions.transactionDate, to),
      ),
    );

  const income = Number(result[0]?.income ?? 0);

  const expense = Number(result[0]?.expense ?? 0);

  return {
    income: income.toFixed(2),
    expense: expense.toFixed(2),
    net: (income - expense).toFixed(2),
  };
}

export async function getUserSpendingByCategory(
  userId: string,
  from: Date,
  to: Date,
) {
  const result = await db
    .select({
      categoryId: categories.id,
      categoryName: categories.name,

      amount: sql<string>`
        COALESCE(
          SUM(${transactions.amount}),
          0
        )
      `,
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
      and(
        eq(transactions.userId, userId),
        eq(transactions.type, 'EXPENSE'),
        isNotNull(transactions.categoryId),
        gte(transactions.transactionDate, from),
        lt(transactions.transactionDate, to),
      ),
    )
    .groupBy(categories.id, categories.name)
    .orderBy(sql`SUM(${transactions.amount}) DESC`);

  const total = result.reduce((sum, row) => sum + Number(row.amount), 0);

  return {
    data: result.map((row) => {
      const amount = Number(row.amount);

      return {
        categoryId: row.categoryId,
        category: row.categoryName,
        amount: amount.toFixed(2),
        percentage: total === 0 ? '0.00' : ((amount / total) * 100).toFixed(2),
      };
    }),

    total: total.toFixed(2),
  };
}
