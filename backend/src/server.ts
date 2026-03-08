import type { Server } from 'node:http';
import app from './app.js';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';

process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

const SHUTDOWN_TIMEOUT_MS = 10_000;

let server: Server;

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(env.PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

const gracefulShutdown = async (signal: string) => {
  console.log(`\nCaught ${signal}. Starting graceful shutdown...`);

  if (server) {
    server.close(async () => {
      console.log('✅ HTTP server closed.');
      await disconnectDB();
      console.log('👋 Process terminated.');
      process.exit(0);
    });

    // If graceful shutdown takes too long, force it
    setTimeout(() => {
      console.error('⚠️ Forcefully shutting down (timeout)');
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
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);

  gracefulShutdown('unhandledRejection');
});

startServer();
