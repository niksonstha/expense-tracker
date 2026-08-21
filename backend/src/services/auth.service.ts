import {
  createUser,
  findUserByEmail,
} from '../repositories/user.repository.js';
import { hashPassword } from '../utils/password.js';

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new Error('EMAIL_ALREADY_EXISTS');
  }

  const passwordHash = await hashPassword(data.password);

  const user = await createUser({
    name: data.name,
    email: data.email,
    passwordHash,
  });

  return user;
}
