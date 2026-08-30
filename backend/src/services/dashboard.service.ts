import {
  getUserFinancialSummary,
  getUserSpendingByCategory,
} from '../repositories/summary.repository.js';

import { findAccountsWithBalance } from '../repositories/account.repository.js';

import { findTransactionsByUserId } from '../repositories/transaction.repository.js';

export async function getUserDashboard(userId: string) {
  const now = new Date();

  const monthStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
  );

  const nextMonthStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
  );

  const [summary, accounts, transactions, spending] = await Promise.all([
    getUserFinancialSummary(userId),

    findAccountsWithBalance(userId),

    findTransactionsByUserId(userId, {
      page: 1,
      limit: 10,
      sort: 'desc',
    }),

    getUserSpendingByCategory(userId, monthStart, nextMonthStart),
  ]);

  return {
    summary,

    accounts,

    recentTransactions: transactions.data,

    spending: spending.data,

    spendingTotal: spending.total,

    period: {
      year: now.getUTCFullYear(),
      month: now.getUTCMonth() + 1,
    },
  };
}
