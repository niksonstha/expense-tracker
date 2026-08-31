import app from './app.js';
import { env } from './config/env.js';
import { pool } from './db/index.js';
import { logger } from './utils/logger.js';

const server = app.listen(env.port, () => {
  logger.info('Server started', {
    port: env.port,
    environment: env.nodeEnv,
  });
});

async function shutdown(signal: string) {
  logger.info('Shutdown signal received', {
    signal,
  });

  server.close(async () => {
    logger.info('HTTP server closed');

    try {
      await pool.end();

      logger.info('Database connection closed');

      process.exit(0);
    } catch (error) {
      logger.error('Failed to close database connection', {
        error,
      });

      process.exit(1);
    }
  });
}

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});
