import express, { type Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from './config/swagger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { globalErrorHandler } from './middleware/globalErrorHandler.js';
import healthRoute from './routes/healthRoute.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import corsOptions from './config/corsOptions.js';

const app: Application = express();

// MIDDLEWARE
app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// HEALTH CHECK
app.use('/health', healthRoute);

// API DOCUMENTATION
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ROUTES
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/notes', noteRoutes);

// GLOBAL 404 HANDLER
app.use(notFoundHandler);

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;
