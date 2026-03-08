import express, { type Application } from 'express';
import morgan from 'morgan';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { globalErrorHandler } from './middleware/globalErrorHandler.js';
import authRoutes from './routes/authRoutes.js';

const app: Application = express();

// MIDDLEWARE
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ROUTES
app.use('/auth', authRoutes);

// GLOBAL 404 HANDLER
app.use(notFoundHandler);

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;
