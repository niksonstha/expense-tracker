import { findAccountById } from '../repositories/account.repository.js';

import { findCategoryById } from '../repositories/category.repository.js';

import {
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
  },
) {
  return findTransactionsByUserId(userId, filters);
}
