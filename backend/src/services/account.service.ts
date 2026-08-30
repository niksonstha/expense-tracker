import {
  findAccountsWithBalance,
  getAccountBalance,
  createAccount,
  deleteAccountById,
  findAccountById,
  findAccountsByUserId,
  updateAccountById,
} from '../repositories/account.repository.js';

export async function createUserAccount(data: {
  userId: string;
  name: string;
  type: 'BANK' | 'SAVINGS' | 'CASH' | 'CREDIT_CARD';
  initialBalance: number;
}) {
  return createAccount({
    userId: data.userId,
    name: data.name,
    type: data.type,
    initialBalance: data.initialBalance.toFixed(2),
  });
}

export async function getUserAccounts(userId: string) {
  return findAccountsByUserId(userId);
}

export async function getUserAccount(accountId: string, userId: string) {
  return findAccountById(accountId, userId);
}

export async function updateUserAccount(
  accountId: string,
  userId: string,
  data: {
    name?: string;
    type?: 'BANK' | 'SAVINGS' | 'CASH' | 'CREDIT_CARD';
    initialBalance?: number;
  },
) {
  return updateAccountById(accountId, userId, {
    ...(data.name !== undefined && {
      name: data.name,
    }),

    ...(data.type !== undefined && {
      type: data.type,
    }),

    ...(data.initialBalance !== undefined && {
      initialBalance: data.initialBalance.toFixed(2),
    }),
  });
}

export async function deleteUserAccount(accountId: string, userId: string) {
  return deleteAccountById(accountId, userId);
}

export async function getUserAccountBalance(accountId: string, userId: string) {
  return getAccountBalance(accountId, userId);
}

export async function getUserAccountsWithBalance(userId: string) {
  return findAccountsWithBalance(userId);
}
