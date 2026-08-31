import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../src/app.js';

async function registerAndLogin(name: string, email: string) {
  const password = 'Password123!';

  await request(app)
    .post('/api/v1/auth/register')
    .send({
      name,
      email,
      password,
    })
    .expect(201);

  const loginResponse = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email,
      password,
    })
    .expect(200);

  return loginResponse.body.accessToken;
}

describe('Transfers', () => {
  it('should create a transfer between two accounts', async () => {
    const email = `transfer-${Date.now()}@example.com`;

    const token = await registerAndLogin('Transfer User', email);

    const fromAccountResponse = await request(app)
      .post('/api/v1/account')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Main Bank',
        type: 'BANK',
      })
      .expect(201);

    const fromAccountId = fromAccountResponse.body.account.id;

    const toAccountResponse = await request(app)
      .post('/api/v1/account')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Savings',
        type: 'SAVINGS',
      })
      .expect(201);

    const toAccountId = toAccountResponse.body.account.id;

    const transferResponse = await request(app)
      .post('/api/v1/transfers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        fromAccountId,
        toAccountId,
        amount: 250,
        description: 'Move money to savings',
        transferDate: new Date().toISOString(),
      })
      .expect(201);

    const transfer = transferResponse.body.transfer;

    expect(transfer).toBeDefined();
    expect(transfer.amount).toBe('250.00');
    expect(transfer.description).toBe('Move money to savings');

    // Get all transactions belonging to this user
    const transactionsResponse = await request(app)
      .get('/api/v1/transactions')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const transactions = transactionsResponse.body.transactions;

    // Find the two transactions created by this transfer
    const transferTransactions = transactions.filter(
      (transaction: { transferId: string | null }) =>
        transaction.transferId === transfer.id,
    );

    expect(transferTransactions).toHaveLength(2);

    // Find outgoing transaction
    const outgoing = transferTransactions.find(
      (transaction: { accountId: string; direction: string }) =>
        transaction.accountId === fromAccountId &&
        transaction.direction === 'OUT',
    );

    // Find incoming transaction
    const incoming = transferTransactions.find(
      (transaction: { accountId: string; direction: string }) =>
        transaction.accountId === toAccountId && transaction.direction === 'IN',
    );

    expect(outgoing).toBeDefined();
    expect(incoming).toBeDefined();

    expect(outgoing.amount).toBe('250.00');
    expect(incoming.amount).toBe('250.00');

    expect(outgoing.transferId).toBe(transfer.id);

    expect(incoming.transferId).toBe(transfer.id);
  });

  it('should not allow a user to transfer using another user account', async () => {
    const userAEmail = `transfer-a-${Date.now()}@example.com`;

    const userBEmail = `transfer-b-${Date.now()}@example.com`;

    const userAToken = await registerAndLogin('Transfer User A', userAEmail);

    const userBToken = await registerAndLogin('Transfer User B', userBEmail);

    // User A creates an account
    const userAAccountResponse = await request(app)
      .post('/api/v1/account')
      .set('Authorization', `Bearer ${userAToken}`)
      .send({
        name: 'User A Bank',
        type: 'BANK',
      })
      .expect(201);

    const userAAccountId = userAAccountResponse.body.account.id;

    // User B creates their own account
    const userBAccountResponse = await request(app)
      .post('/api/v1/account')
      .set('Authorization', `Bearer ${userBToken}`)
      .send({
        name: 'User B Bank',
        type: 'BANK',
      })
      .expect(201);

    const userBAccountId = userBAccountResponse.body.account.id;

    // User B tries to transfer FROM User A's account
    const response = await request(app)
      .post('/api/v1/transfers')
      .set('Authorization', `Bearer ${userBToken}`)
      .send({
        fromAccountId: userAAccountId,
        toAccountId: userBAccountId,
        amount: 100,
        description: 'Unauthorized transfer',
        transferDate: new Date().toISOString(),
      });

    expect(response.status).toBe(404);

    expect(response.body.error.code).toBe('FROM_ACCOUNT_NOT_FOUND');
  });

  it('should not allow a user to transfer to another user account', async () => {
    const userAEmail = `destination-a-${Date.now()}@example.com`;

    const userBEmail = `destination-b-${Date.now()}@example.com`;

    const userAToken = await registerAndLogin('Destination User A', userAEmail);

    const userBToken = await registerAndLogin('Destination User B', userBEmail);

    // User A creates an account
    const userAAccountResponse = await request(app)
      .post('/api/v1/account')
      .set('Authorization', `Bearer ${userAToken}`)
      .send({
        name: 'User A Savings',
        type: 'SAVINGS',
      })
      .expect(201);

    const userAAccountId = userAAccountResponse.body.account.id;

    // User B creates their own account
    const userBAccountResponse = await request(app)
      .post('/api/v1/account')
      .set('Authorization', `Bearer ${userBToken}`)
      .send({
        name: 'User B Bank',
        type: 'BANK',
      })
      .expect(201);

    const userBAccountId = userBAccountResponse.body.account.id;

    // User B tries to transfer TO User A's account
    const response = await request(app)
      .post('/api/v1/transfers')
      .set('Authorization', `Bearer ${userBToken}`)
      .send({
        fromAccountId: userBAccountId,
        toAccountId: userAAccountId,
        amount: 100,
        description: 'Unauthorized destination',
        transferDate: new Date().toISOString(),
      });

    expect(response.status).toBe(404);

    expect(response.body.error.code).toBe('TO_ACCOUNT_NOT_FOUND');
  });
});
