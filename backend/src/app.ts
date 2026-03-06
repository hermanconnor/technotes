import express, { type Application } from 'express';
import morgan from 'morgan';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { globalErrorHandler } from './middleware/globalErrorHandler.js';

const app: Application = express();

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GLOBAL 404 HANDLER
app.use(notFoundHandler);

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;
