import { AppError } from '../errors/app-error.js';
import {
  createUser,
  findUserByEmail,
  findUserByEmailWithPassword,
} from '../repositories/user.repository.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { generateAccessToken } from '../utils/jwt.js';

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new AppError(
      'A user with this email already exists',
      409,
      'EMAIL_ALREADY_EXISTS',
    );
  }

  const passwordHash = await hashPassword(data.password);

  const user = await createUser({
    name: data.name,
    email: data.email,
    passwordHash,
  });

  return user;
}

export async function loginUser(data: { email: string; password: string }) {
  const user = await findUserByEmailWithPassword(data.email);

  if (!user) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const passwordMatches = await comparePassword(
    data.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const accessToken = generateAccessToken(user.id);

  return {
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}
