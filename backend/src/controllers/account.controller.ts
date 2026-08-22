import type { Request, Response } from 'express';

import { AppError } from '../errors/app-error.js';

import {
  createUserAccount,
  getUserAccounts,
} from '../services/account.service.js';

import { createAccountSchema } from '../validators/account.validator.js';

export async function createAccount(req: Request, res: Response) {
  if (!req.userId) {
    throw new AppError(
      'Authentication required',
      401,
      'AUTHENTICATION_REQUIRED',
    );
  }

  const data = createAccountSchema.parse(req.body);

  const account = await createUserAccount({
    userId: req.userId,
    ...data,
  });

  return res.status(201).json({
    account,
  });
}

export async function getAccounts(req: Request, res: Response) {
  if (!req.userId) {
    throw new AppError(
      'Authentication required',
      401,
      'AUTHENTICATION_REQUIRED',
    );
  }

  console.log(req);

  const accounts = await getUserAccounts(req.userId);

  return res.status(200).json({
    accounts,
  });
}
