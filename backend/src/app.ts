import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { apiRateLimiter } from './middleware/rate-limit.js';
import { requestId } from './middleware/request-id.js';
import { requestLogger } from './middleware/request-logger.js';

import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/error-handler.js';
import { env } from './config/env.js';

const app = express();

app.use(cors({ origin: env.frontendURL }));

app.use(helmet());

app.use(express.json());

app.use(requestId);

app.use(requestLogger);

app.use(apiRateLimiter);

app.use('/api/v1', apiRouter);

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
  });
});

app.use(errorHandler);

export default app;
