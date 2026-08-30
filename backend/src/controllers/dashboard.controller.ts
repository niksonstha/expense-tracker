import type { Request, Response } from 'express';

import { AppError } from '../errors/app-error.js';

import { getUserDashboard } from '../services/dashboard.service.js';

export async function getDashboard(req: Request, res: Response) {
  if (!req.userId) {
    throw new AppError(
      'Authentication required',
      401,
      'AUTHENTICATION_REQUIRED',
    );
  }

  const dashboard = await getUserDashboard(req.userId);

  return res.status(200).json({
    dashboard,
  });
}
