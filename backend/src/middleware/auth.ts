import type { NextFunction, Request, Response } from 'express';

import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import { AppError } from '../errors/app-error.js';

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return next(
      new AppError('Authentication required', 401, 'AUTHENTICATION_REQUIRED'),
    );
  }

  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(
      new AppError(
        'Invalid authorization header',
        401,
        'INVALID_AUTHORIZATION_HEADER',
      ),
    );
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as jwt.JwtPayload;

    if (!decoded.sub || typeof decoded.sub !== 'string') {
      return next(
        new AppError('Invalid authentication token', 401, 'INVALID_TOKEN'),
      );
    }

    req.userId = decoded.sub;

    next();
  } catch {
    return next(new AppError('Invalid or expired token', 401, 'INVALID_TOKEN'));
  }
}
