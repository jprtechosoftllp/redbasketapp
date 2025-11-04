import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import adminRouter from './routers/admin';
import managerRouter from './routers/manager';
import vendorRouter from './routers/vendor';
import userRouter from './routers/user';
import errorMiddleware from '@packages/backend/middlewares/error';

dotenv.config();

const port = process.env.AUTH_SERVICE_PORT ? Number(process.env.AUTH_SERVICE_PORT) : 8081;
const isProduction = process.env.NODE_ENV === 'production';
const host = isProduction ? '0.0.0.0' : 'localhost';

const app = express();

// CORS configuration
const allowedOrigins = isProduction
  ? [
      'https://meatonew-backend-vendor-ui.vercel.app',
      'https://meatonew-backend-admin-ui.vercel.app',
      'https://meatonew-backend-manager-ui.vercel.app',
      'https://meatonew-backend.vercel.app',
    ]
  : [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
    ];

app.use(
  cors({
    origin: allowedOrigins,
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Auth Service is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Route bindings
app.use('/admin', adminRouter);
app.use('/manager', managerRouter);
app.use('/vendor', vendorRouter);
app.use('/user', userRouter);

// Error handling middleware
app.use(errorMiddleware);

// Start server
const server = app.listen(port, host, () => {
  console.log(`🚀 Auth Service listening at http://${host}:${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 CORS Origins: ${JSON.stringify(allowedOrigins)}`);
});

// Graceful shutdown
const shutdown = (signal: string) => {
  console.log(`${signal} received, shutting down gracefully`);
  server.close(() => {
    console.log('Server terminated');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

server.on('error', (error: any) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use`);
    process.exit(1);
  }
});