import { db } from '../db/index.js';
import {
  createTransfer,
  findTransferById,
  findTransferTransactions,
} from '../repositories/transfer.repository.js';
import { createTransferTransaction } from '../repositories/transaction.repository.js';
import { findAccountById } from '../repositories/account.repository.js';

export type CreateTransferResult =
  | { error: 'FROM_ACCOUNT_NOT_FOUND' }
  | { error: 'TO_ACCOUNT_NOT_FOUND' }
  | {
      transfer: Awaited<ReturnType<typeof createTransfer>>;
      outgoing: Awaited<ReturnType<typeof createTransferTransaction>>;
      incoming: Awaited<ReturnType<typeof createTransferTransaction>>;
    };

export async function createUserTransfer(
  userId: string,
  data: {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    description?: string;
    transferDate: Date;
  },
): Promise<CreateTransferResult> {
  const fromAccount = await findAccountById(data.fromAccountId, userId);

  if (!fromAccount) {
    return { error: 'FROM_ACCOUNT_NOT_FOUND' };
  }

  const toAccount = await findAccountById(data.toAccountId, userId);
  if (!toAccount) {
    return { error: 'TO_ACCOUNT_NOT_FOUND' };
  }

  return db.transaction(async (tx) => {
    const transfer = await createTransfer(tx, {
      userId,
      amount: data.amount.toFixed(2),
      description: data.description,
      transferDate: data.transferDate,
    });

    const outgoing = await createTransferTransaction(tx, {
      userId,
      accountId: data.fromAccountId,
      transferId: transfer.id,
      type: 'TRANSFER',
      direction: 'OUT',
      amount: data.amount.toFixed(2),
      description: data.description,
      transactionDate: data.transferDate,
    });

    const incoming = await createTransferTransaction(tx, {
      userId,
      accountId: data.toAccountId,
      transferId: transfer.id,
      type: 'TRANSFER',
      direction: 'IN',
      amount: data.amount.toFixed(2),
      description: data.description,
      transactionDate: data.transferDate,
    });

    return { transfer, outgoing, incoming };
  });
}

export async function getUserTransfer(transferId: string, userId: string) {
  const transfer = await findTransferById(transferId, userId);

  if (!transfer) {
    return {
      error: 'TRANSFER_NOT_FOUND' as const,
    };
  }

  const transactionRows = await findTransferTransactions(transferId, userId);

  const outgoing = transactionRows.find(
    (transaction) => transaction.direction === 'OUT',
  );

  const incoming = transactionRows.find(
    (transaction) => transaction.direction === 'IN',
  );

  return {
    transfer,
    outgoing: outgoing ?? null,
    incoming: incoming ?? null,
  };
}
