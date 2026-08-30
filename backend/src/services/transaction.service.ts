import { findAccountById } from '../repositories/account.repository.js';

import { findCategoryById } from '../repositories/category.repository.js';

import {
  deleteTransactionById,
  updateTransactionById,
  findTransactionById,
  findTransactionsByUserId,
  createTransaction,
} from '../repositories/transaction.repository.js';

export async function createUserTransaction(data: {
  userId: string;
  accountId: string;
  categoryId?: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description?: string;
  transactionDate: Date;
}) {
  const account = await findAccountById(data.accountId, data.userId);

  if (!account) {
    return {
      error: 'ACCOUNT_NOT_FOUND',
    };
  }

  // eslint-disable-next-line no-useless-assignment
  let category = null;

  if (data.categoryId) {
    category = await findCategoryById(data.categoryId, data.userId);

    if (!category) {
      return {
        error: 'CATEGORY_NOT_FOUND',
      };
    }

    if (category.type !== data.type) {
      return {
        error: 'CATEGORY_TYPE_MISMATCH',
      };
    }
  }

  const direction = data.type === 'INCOME' ? 'IN' : 'OUT';

  const transaction = await createTransaction({
    userId: data.userId,
    accountId: data.accountId,
    categoryId: data.categoryId,
    type: data.type,
    direction,
    amount: data.amount.toFixed(2),
    description: data.description,
    transactionDate: data.transactionDate,
  });

  return {
    transaction,
  };
}

export async function getUserTransactions(
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
  function endOfDay(date: Date) {
    const result = new Date(date);

    result.setHours(23, 59, 59, 999);

    return result;
  }

  const normalizedFilters = {
    ...filters,

    to: filters.to ? endOfDay(filters.to) : undefined,
  };
  return findTransactionsByUserId(userId, normalizedFilters);
}

export async function getUserTransaction(
  transactionId: string,
  userId: string,
) {
  return findTransactionById(transactionId, userId);
}

export async function updateUserTransaction(
  transactionId: string,
  userId: string,
  data: {
    accountId?: string;
    categoryId?: string | null;
    type?: 'INCOME' | 'EXPENSE';
    amount?: number;
    description?: string | null;
    transactionDate?: Date;
  },
) {
  const existing = await findTransactionById(transactionId, userId);

  if (!existing) {
    return {
      error: 'TRANSACTION_NOT_FOUND',
    };
  }

  if (data.accountId) {
    const account = await findAccountById(data.accountId, userId);

    if (!account) {
      return {
        error: 'ACCOUNT_NOT_FOUND',
      };
    }
  }

  if (data.categoryId) {
    const category = await findCategoryById(data.categoryId, userId);

    if (!category) {
      return {
        error: 'CATEGORY_NOT_FOUND',
      };
    }

    const transactionType = data.type ?? existing.type;

    if (category.type !== transactionType) {
      return {
        error: 'CATEGORY_TYPE_MISMATCH',
      };
    }
  }

  if (data.type && data.categoryId === undefined && existing.categoryId) {
    const category = await findCategoryById(existing.categoryId, userId);

    if (category && category.type !== data.type) {
      return {
        error: 'CATEGORY_TYPE_MISMATCH',
      };
    }
  }

  const type = data.type ?? existing.type;

  const direction = type === 'INCOME' ? 'IN' : 'OUT';

  return {
    transaction: await updateTransactionById(transactionId, userId, {
      ...data,
      amount: data.amount !== undefined ? data.amount.toFixed(2) : undefined,
      direction,
    }),
  };
}

export async function deleteUserTransaction(
  transactionId: string,
  userId: string,
) {
  const transaction = await deleteTransactionById(transactionId, userId);

  if (!transaction) {
    return null;
  }

  return transaction;
}
