import type { Server } from 'node:http';
import app from './app.js';
import { connectDB, disconnectDB, testConnection } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './middleware/logger.js';

process.on('uncaughtException', (err: Error) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(`ERROR NAME: ${err.name}, MESSAGE: ${err.message}`);
  process.exit(1);
});

const SHUTDOWN_TIMEOUT_MS = 10_000;

let server: Server;

const startServer = async () => {
  try {
    logger.info('🔌 Connecting to MongoDB...');
    await connectDB();

    const dbHealthy = await testConnection();

    if (!dbHealthy) {
      logger.error(
        '❌ Database is connected but not responding to ping. Exiting...',
      );
      process.exit(1);
    }

    server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server is running at http://localhost:${env.PORT}`);
    });
  } catch (error) {
    logger.error(`❌ Failed to start server: ${error}`);
    process.exit(1);
  }
};

const gracefulShutdown = async (signal: string) => {
  logger.info(`\nCaught ${signal}. Starting graceful shutdown...`);

  if (server) {
    server.close(async () => {
      logger.info('✅ HTTP server closed.');
      await disconnectDB();
      logger.info('👋 Process terminated.');
      process.exit(0);
    });

    // If graceful shutdown takes too long, force it
    setTimeout(() => {
      logger.error('⚠️ Forcefully shutting down (timeout)');
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS).unref();
  } else {
    process.exit(0);
  }
};

// Listen for system signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Catch unhandled errors
process.on('unhandledRejection', (err: Error) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(`ERROR NAME: ${err.name}, MESSAGE: ${err.message}`);

  gracefulShutdown('unhandledRejection');
});

startServer();
