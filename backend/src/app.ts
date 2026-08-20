import express from 'express';
import apiRouter from './routes/index.js';

const app = express();

app.use(express.json());

app.use('/api/v1', apiRouter);

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
  });
});

app.use((_req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
  });
});

export default app;
