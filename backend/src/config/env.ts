import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT) || 3000,

  nodeEnv: process.env.NODE_ENV || 'development',

  frontendURL: process.env.FRONTEND_URL,

  databaseUrl: process.env.DATABASE_URL || '',

  jwtSecret: process.env.JWT_SECRET || '',

  jwtExpiresIn: 60 * 60,
};
