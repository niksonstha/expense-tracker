import { Router } from 'express';
import { db } from '../db/index.js';
import { sql } from 'drizzle-orm';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    message: 'Expense Tracker API',
    version: '1.0.0',
  });
});

router.get('/db-test', async (_req, res) => {
  const result = await db.execute(sql`SELECT 1`);

  res.json({
    database: 'connected',
    result,
  });
});

export default router;
