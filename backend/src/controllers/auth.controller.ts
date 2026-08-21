import { Request, Response } from 'express';
import { registerSchema } from '../validators/auth.validator.js';
import { registerUser } from '../services/auth.service.js';

export async function register(req: Request, res: Response) {
  const data = registerSchema.parse(req.body);

  const user = await registerUser(data);

  return res.status(201).json({
    message: 'User registered successfully',
    user,
  });
}
