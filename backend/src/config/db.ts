import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../middleware/logger.js';

mongoose.set('strictQuery', true);

mongoose.connection.on('connected', () => {
  logger.info(`✅ MongoDB connected to: ${mongoose.connection.name}`);
});

mongoose.connection.on('error', (err) => {
  logger.error(`❌ MongoDB connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('⚠️ MongoDB disconnected.');
});

export const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) return;

  const mongoUri = env.MONGODB_URI;

  try {
    await mongoose.connect(mongoUri, {
      autoIndex: process.env.NODE_ENV !== 'production',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  } catch (error) {
    logger.error(`❌ Initial MongoDB connection failed: ${error}`);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState === 0) return;

  try {
    await mongoose.disconnect();
    logger.info('✅ MongoDB connection closed gracefully');
  } catch (error) {
    logger.error(`❌ Error during MongoDB disconnection: ${error}`);
  }
};
