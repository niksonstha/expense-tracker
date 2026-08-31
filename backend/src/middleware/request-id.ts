import { randomUUID } from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';

export function requestId(req: Request, res: Response, next: NextFunction) {
  const id = req.header('X-Request-ID') ?? randomUUID();

  res.setHeader('X-Request-ID', id);

  res.locals.requestId = id;

  next();
}
