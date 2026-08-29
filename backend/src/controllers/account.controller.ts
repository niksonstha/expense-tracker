import type { Request, Response } from 'express';

import { AppError } from '../errors/app-error.js';

import {
  createUserAccount,
  deleteUserAccount,
  getUserAccount,
  getUserAccounts,
  updateUserAccount,
} from '../services/account.service.js';

import {
  createAccountSchema,
  updateAccountSchema,
} from '../validators/account.validator.js';

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

  const accounts = await getUserAccounts(req.userId);

  return res.status(200).json({
    accounts,
  });
}

export async function getAccount(req: Request<{ id: string }>, res: Response) {
  if (!req.userId) {
    throw new AppError(
      'Authentication required',
      401,
      'AUTHENTICATION_REQUIRED',
    );
  }

  const { id } = req.params;

  const account = await getUserAccount(id, req.userId);

  if (!account) {
    throw new AppError('Account not found', 404, 'ACCOUNT_NOT_FOUND');
  }

  return res.status(200).json({
    account,
  });
}

export async function updateAccount(
  req: Request<{ id: string }>,
  res: Response,
) {
  if (!req.userId) {
    throw new AppError(
      'Authentication required',
      401,
      'AUTHENTICATION_REQUIRED',
    );
  }

  const { id } = req.params;

  const data = updateAccountSchema.parse(req.body);

  const account = await updateUserAccount(id, req.userId, data);

  if (!account) {
    throw new AppError('Account not found', 404, 'ACCOUNT_NOT_FOUND');
  }

  return res.status(200).json({
    account,
  });
}

export async function deleteAccount(
  req: Request<{ id: string }>,
  res: Response,
) {
  if (!req.userId) {
    throw new AppError(
      'Authentication required',
      401,
      'AUTHENTICATION_REQUIRED',
    );
  }

  const { id } = req.params;

  const account = await deleteUserAccount(id, req.userId);

  if (!account) {
    throw new AppError('Account not found', 404, 'ACCOUNT_NOT_FOUND');
  }

  return res.status(204).send();
}
