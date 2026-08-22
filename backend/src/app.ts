import express from 'express';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/error-handler.js';

const app = express();

app.use(express.json());

app.use('/api/v1', apiRouter);

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
  });
});

app.use(errorHandler);

export default app;
