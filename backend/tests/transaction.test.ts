import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../src/app.js';
async function registerAndLogin(name: string, email: string) {
  const password = 'Password123!';
  await request(app)
    .post('/api/v1/auth/register')
    .send({ name, email, password })
    .expect(201);
  const loginResponse = await request(app)
    .post('/api/v1/auth/login')
    .send({ email, password })
    .expect(200);
  return loginResponse.body.accessToken;
}
describe('Transaction ownership', () => {
  it('should allow a user to access their own transaction', async () => {
    const email = `transaction-owner-${Date.now()}@example.com`;
    const token = await registerAndLogin('Transaction Owner', email);
    const accountResponse = await request(app)
      .post('/api/v1/account')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Transaction Account', type: 'BANK' })
      .expect(201);
    const accountId = accountResponse.body.account.id;
    const transactionResponse = await request(app)
      .post('/api/v1/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        accountId,
        type: 'INCOME',
        amount: 500,
        description: 'Salary',
        transactionDate: new Date().toISOString(),
      })
      .expect(201);
    const transactionId = transactionResponse.body.transaction.id;
    const response = await request(app)
      .get(`/api/v1/transactions/${transactionId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.transaction.id).toBe(transactionId);
  });
  it('should not allow one user to access another user transaction', async () => {
    const userAEmail = `transaction-a-${Date.now()}@example.com`;
    const userBEmail = `transaction-b-${Date.now()}@example.com`;
    const userAToken = await registerAndLogin('Transaction User A', userAEmail);
    const userBToken = await registerAndLogin('Transaction User B', userBEmail);
    const accountResponse = await request(app)
      .post('/api/v1/account')
      .set('Authorization', `Bearer ${userAToken}`)
      .send({ name: 'User A Bank', type: 'BANK' })
      .expect(201);
    const accountId = accountResponse.body.account.id;
    const transactionResponse = await request(app)
      .post('/api/v1/transactions')
      .set('Authorization', `Bearer ${userAToken}`)
      .send({
        accountId,
        type: 'EXPENSE',
        amount: 100,
        description: 'Test Expense',
        transactionDate: new Date().toISOString(),
      })
      .expect(201);
    const transactionId = transactionResponse.body.transaction.id;
    const response = await request(app)
      .get(`/api/v1/transactions/${transactionId}`)
      .set('Authorization', `Bearer ${userBToken}`);
    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('TRANSACTION_NOT_FOUND');
  });
});
