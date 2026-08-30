import type { Request, Response } from 'express';

import { AppError } from '../errors/app-error.js';

import {
  createUserTransfer,
  getUserTransfer,
} from '../services/transfer.service.js';

import { createTransferSchema } from '../validators/transfer.validator.js';

export async function createTransferController(req: Request, res: Response) {
  if (!req.userId) {
    throw new AppError(
      'Authentication required',
      401,
      'AUTHENTICATION_REQUIRED',
    );
  }

  const data = createTransferSchema.parse(req.body);

  const result = await createUserTransfer(req.userId, data);

  if ('error' in result) {
    if (result.error === 'FROM_ACCOUNT_NOT_FOUND') {
      throw new AppError(
        'Source account not found',
        404,
        'FROM_ACCOUNT_NOT_FOUND',
      );
    }

    if (result.error === 'TO_ACCOUNT_NOT_FOUND') {
      throw new AppError(
        'Destination account not found',
        404,
        'TO_ACCOUNT_NOT_FOUND',
      );
    }
  }

  return res.status(201).json({
    transfer: result.transfer,
  });
}

export async function getTransferController(
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

  const result = await getUserTransfer(id, req.userId);

  if ('error' in result) {
    throw new AppError('Transfer not found', 404, 'TRANSFER_NOT_FOUND');
  }

  return res.status(200).json({
    transfer: result.transfer,
    outgoing: result.outgoing,
    incoming: result.incoming,
  });
}
