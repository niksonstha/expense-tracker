import type { Request, Response } from 'express';

import { findUserById } from '../repositories/user.repository.js';
import { AppError } from '../errors/app-error.js';

export async function getMe(req: Request, res: Response) {
  if (!req.userId) {
    throw new AppError(
      'Authentication required',
      401,
      'AUTHENTICATION_REQUIRED',
    );
  }
  const user = await findUserById(req.userId);

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  return res.status(200).json({
    user,
  });
}
