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

describe('Account ownership', () => {
  it('should not allow one user to access another user account', async () => {
    const userAEmail = `user-a-${Date.now()}@example.com`;

    const userBEmail = `user-b-${Date.now()}@example.com`;

    const userAToken = await registerAndLogin('User A', userAEmail);

    const userBToken = await registerAndLogin('User B', userBEmail);

    const accountResponse = await request(app)
      .post('/api/v1/account')
      .set('Authorization', `Bearer ${userAToken}`)
      .send({
        name: 'User A Bank',
        type: 'BANK',
      })
      .expect(201);

    const accountId = accountResponse.body.account.id;

    const response = await request(app)
      .get(`/api/v1/account/${accountId}`)
      .set('Authorization', `Bearer ${userBToken}`);

    expect(response.status).toBe(404);

    expect(response.body.error.code).toBe('ACCOUNT_NOT_FOUND');
  });
});

it('should allow a user to access their own account', async () => {
  const email = `owner-${Date.now()}@example.com`;
  const token = await registerAndLogin('Account Owner', email);
  const accountResponse = await request(app)
    .post('/api/v1/account')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'My Bank', type: 'BANK' })
    .expect(201);
  const accountId = accountResponse.body.account.id;
  const response = await request(app)
    .get(`/api/v1/account/${accountId}`)
    .set('Authorization', `Bearer ${token}`);
  expect(response.status).toBe(200);
  expect(response.body.account.id).toBe(accountId);
  expect(response.body.account.name).toBe('My Bank');
});
