import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorMiddleware from '@packages/backend/middlewares/error';
import dotenv from 'dotenv';
import manageRouter from './routers/manager';
import vendorRouter from './routers/vendors';
import type { Express } from 'express';

dotenv.config();

const port = process.env.ADMIN_SERVICE_PORT ? Number(process.env.ADMIN_SERVICE_PORT) : 8083;
const isProduction = process.env.NODE_ENV === 'production';
const host = isProduction ? '0.0.0.0' : 'localhost';
const app:Express = express();

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

app.use(cookieParser());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Admin Service is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Routes
app.use('/manager', manageRouter);
app.use('/vendor', vendorRouter);

// Error handling middleware
app.use(errorMiddleware);

// Start server
const server = app.listen(port, host, () => {
  console.log(`🚀 Admin Service listening at http://${host}:${port}`);
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

export default app;
