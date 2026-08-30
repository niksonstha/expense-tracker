import type { Request, Response } from 'express';

import { AppError } from '../errors/app-error.js';
import { transactionQuerySchema } from '../validators/transaction-query.validator.js';

import {
  deleteUserTransaction,
  getUserTransaction,
  getUserTransactions,
  createUserTransaction,
  updateUserTransaction,
} from '../services/transaction.service.js';

import {
  updateTransactionSchema,
  createTransactionSchema,
} from '../validators/transaction.validator.js';

export async function createTransaction(req: Request, res: Response) {
  if (!req.userId) {
    throw new AppError(
      'Authentication required',
      401,
      'AUTHENTICATION_REQUIRED',
    );
  }

  const data = createTransactionSchema.parse(req.body);

  const result = await createUserTransaction({
    userId: req.userId,
    ...data,
  });

  if (result.error === 'ACCOUNT_NOT_FOUND') {
    throw new AppError('Account not found', 404, 'ACCOUNT_NOT_FOUND');
  }

  if (result.error === 'CATEGORY_NOT_FOUND') {
    throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
  }

  if (result.error === 'CATEGORY_TYPE_MISMATCH') {
    throw new AppError(
      'Category type does not match transaction type',
      400,
      'CATEGORY_TYPE_MISMATCH',
    );
  }

  return res.status(201).json({
    transaction: result.transaction,
  });
}

export async function getTransactions(req: Request, res: Response) {
  if (!req.userId) {
    throw new AppError(
      'Authentication required',
      401,
      'AUTHENTICATION_REQUIRED',
    );
  }

  const filters = transactionQuerySchema.parse(req.query);

  const result = await getUserTransactions(req.userId, filters);

  const totalPages = Math.ceil(result.total / filters.limit);

  return res.status(200).json({
    transactions: result.data,

    pagination: {
      page: filters.page,
      limit: filters.limit,
      total: result.total,
      totalPages,
      hasNextPage: filters.page < totalPages,
      hasPreviousPage: filters.page > 1,
    },
  });
}

export async function getTransaction(
  req: Request<{ id: string }>,
  res: Response,
) {
  if (!req.userId) {
    throw new AppError(
      'Authentication required',
      401,
      'AUTHENTICATION_REQUIRED',
    );
  }

  const { id } = req.params;

  const transaction = await getUserTransaction(id, req.userId);

  if (!transaction) {
    throw new AppError('Transaction not found', 404, 'TRANSACTION_NOT_FOUND');
  }

  return res.status(200).json({
    transaction,
  });
}

export async function updateTransaction(
  req: Request<{ id: string }>,
  res: Response,
) {
  if (!req.userId) {
    throw new AppError(
      'Authentication required',
      401,
      'AUTHENTICATION_REQUIRED',
    );
  }

  const { id } = req.params;

  const data = updateTransactionSchema.parse(req.body);

  const result = await updateUserTransaction(id, req.userId, data);

  if (result.error === 'TRANSACTION_NOT_FOUND') {
    throw new AppError('Transaction not found', 404, 'TRANSACTION_NOT_FOUND');
  }

  if (result.error === 'ACCOUNT_NOT_FOUND') {
    throw new AppError('Account not found', 404, 'ACCOUNT_NOT_FOUND');
  }

  if (result.error === 'CATEGORY_NOT_FOUND') {
    throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
  }

  if (result.error === 'CATEGORY_TYPE_MISMATCH') {
    throw new AppError(
      'Category type does not match transaction type',
      400,
      'CATEGORY_TYPE_MISMATCH',
    );
  }

  return res.status(200).json({
    transaction: result.transaction,
  });
}

export async function deleteTransaction(
  req: Request<{ id: string }>,
  res: Response,
) {
  if (!req.userId) {
    throw new AppError(
      'Authentication required',
      401,
      'AUTHENTICATION_REQUIRED',
    );
  }

  const { id } = req.params;

  const transaction = await deleteUserTransaction(id, req.userId);

  if (!transaction) {
    throw new AppError('Transaction not found', 404, 'TRANSACTION_NOT_FOUND');
  }

  return res.status(200).json({
    message: 'Transaction deleted successfully',
  });
}
