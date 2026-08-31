import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../src/app.js';

describe('Authentication', () => {
  it('should register, login, and access /me', async () => {
    const email = `test-${Date.now()}@example.com`;

    const registerResponse = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Test User',
        email,
        password: 'Password123!',
      });

    expect(registerResponse.status).toBe(201);

    const loginResponse = await request(app).post('/api/v1/auth/login').send({
      email,
      password: 'Password123!',
    });

    expect(loginResponse.status).toBe(200);

    expect(loginResponse.body.accessToken).toBeDefined();

    const token = loginResponse.body.accessToken;

    const meResponse = await request(app)
      .get('/api/v1/me')
      .set('Authorization', `Bearer ${token}`);

    expect(meResponse.status).toBe(200);

    expect(meResponse.body.user.email).toBe(email);
  });
});
