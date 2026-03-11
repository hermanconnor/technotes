import mongoose from 'mongoose';
import { env } from './env.js';

mongoose.set('strictQuery', true);

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected to:', mongoose.connection.name);
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected.');
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
    console.error('❌ Initial MongoDB connection failed:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState === 0) return;

  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB connection closed gracefully');
  } catch (error) {
    console.error('❌ Error during MongoDB disconnection:', error);
  }
};
