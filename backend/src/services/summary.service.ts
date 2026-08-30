import {
  getUserFinancialSummary,
  getUserMonthlySummary,
  getUserSpendingByCategory,
} from '../repositories/summary.repository.js';

export async function getFinancialSummary(userId: string) {
  return getUserFinancialSummary(userId);
}

export async function getMonthlyFinancialSummary(
  userId: string,
  year: number,
  month: number,
) {
  const from = new Date(Date.UTC(year, month - 1, 1));

  const to = new Date(Date.UTC(year, month, 1));

  const summary = await getUserMonthlySummary(userId, from, to);

  return {
    year,
    month,
    ...summary,
  };
}

export async function getSpendingSummary(
  userId: string,
  year: number,
  month: number,
) {
  const from = new Date(Date.UTC(year, month - 1, 1));

  const to = new Date(Date.UTC(year, month, 1));

  return getUserSpendingByCategory(userId, from, to);
}
