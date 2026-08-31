import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/error-handler.js';
import { env } from './config/env.js';

const app = express();

app.use(cors({ origin: env.frontendURL }));

app.use(helmet());

app.use(express.json());

app.use('/api/v1', apiRouter);

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
  });
});

app.use(errorHandler);

export default app;
