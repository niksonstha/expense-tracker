import {
  createAccount,
  findAccountsByUserId,
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
