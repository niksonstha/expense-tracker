import type { Request, Response } from 'express';

import { AppError } from '../errors/app-error.js';

import {
  getFinancialSummary,
  getMonthlyFinancialSummary,
  getSpendingSummary,
} from '../services/summary.service.js';
import { monthlySummaryQuerySchema } from '../validators/monthly-summary.validator.js';
import { spendingSummaryQuerySchema } from '../validators/spending-summary.validator.js';

export async function getSummary(req: Request, res: Response) {
  if (!req.userId) {
    throw new AppError(
      'Authentication required',
      401,
      'AUTHENTICATION_REQUIRED',
    );
  }

  const summary = await getFinancialSummary(req.userId);

  return res.status(200).json({
    summary,
  });
}

export async function getMonthlySummary(req: Request, res: Response) {
  if (!req.userId) {
    throw new AppError(
      'Authentication required',
      401,
      'AUTHENTICATION_REQUIRED',
    );
  }

  const { year, month } = monthlySummaryQuerySchema.parse(req.query);

  const summary = await getMonthlyFinancialSummary(req.userId, year, month);

  return res.status(200).json({
    summary,
  });
}

export async function getSpending(req: Request, res: Response) {
  if (!req.userId) {
    throw new AppError(
      'Authentication required',
      401,
      'AUTHENTICATION_REQUIRED',
    );
  }

  const { year, month } = spendingSummaryQuerySchema.parse(req.query);

  const result = await getSpendingSummary(req.userId, year, month);

  return res.status(200).json({
    spending: result.data,
    total: result.total,
    year,
    month,
  });
}
