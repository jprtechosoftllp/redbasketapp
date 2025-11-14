import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import proxy from 'express-http-proxy';
import dotenv from 'dotenv';
// import { createImage, removeImage } from './controllers/images';
dotenv.config();

const port = process.env.API_GATEWAY_PORT ? Number(process.env.API_GATEWAY_PORT) : 8080;
const isProduction = process.env.NODE_ENV === 'production';
const host = isProduction ? '0.0.0.0' : 'localhost';

const app = express();

// // CORS configuration
// const allowedOrigins = isProduction
//   ? [
//     'https://meatonew-backend-vendor-ui.vercel.app',
//     'https://meatonew-backend-admin-ui.vercel.app',
//     'https://meatonew-backend-manager-ui.vercel.app',
//     'https://meatonew-backend.vercel.app',
//   ]
//   :
//   [
//     'http://localhost:3000',
//     'http://localhost:3001',
//     'http://localhost:3002',
//     'http://localhost:3003',
//     'http://localhost:8085',
//     'http://localhost:8086',
//     'http://localhost:8087'
//   ];

// app.use(
//   cors({
//     origin: allowedOrigins,
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
//   })
// );

app.use(cors());

app.use(cookieParser());
app.use(morgan(isProduction ? 'combined' : 'dev'));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.set('trust proxy', isProduction ? 'loopback' : 1);

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: true,
    message: { error: 'Too many requests, please try again later.' },
    keyGenerator: (req: any) => (req.user ? req.user.id : ipKeyGenerator(req)), // ✅ safe fallback
    skip: (req) => req.path === '/',
  })
);

// app.post('/upload-image', createImage);
// app.delete('/delete-image', removeImage)

app.use('/auth', proxy('http://localhost:8081')); // Proxy all requests to the URL
app.use('/product', proxy('http://localhost:8082')); // Proxy all requests to the URL
app.use('/admin', proxy('http://localhost:8083')); // Proxy all requests to the URL
app.use('/manager', proxy('http://localhost:8084')); // Proxy all requests to the URL


// // Service URL resolver
// const getServiceUrl = (serviceName: string, port: number) => {
//   return isProduction
//     ? `http://${serviceName}:${port}`
//     : `http://localhost:${port}`;
// };

// // Proxy middleware factory
// const createProxyMiddleware = (serviceUrl: string, serviceName: string) => {
//   return proxy(serviceUrl, {
//     timeout: 30000,
//     proxyReqOptDecorator: (proxyReqOpts, req) => {
//       proxyReqOpts.headers['x-Forwarded-For'] = req.ip;
//       proxyReqOpts.headers['x-Original-Host'] = req.get('host');
//       return proxyReqOpts;
//     },
//     proxyErrorHandler: (err, res, next) => {
//       console.error(`Proxy error for ${serviceName}:`, err.message);
//       if (!res.headersSent) {
//         res.status(503).json({
//           error: 'Service temporarily unavailable',
//           service: serviceName,
//           timestamp: new Date().toISOString(),
//         });
//       }
//     },
//   });
// };

// // Proxy routes
// app.use('/admin', createProxyMiddleware(getServiceUrl('admin-service', 8083), 'admin-service'));
// app.use('/product', createProxyMiddleware(getServiceUrl('product-service', 8082), 'product-service'));
// app.use('/manager', createProxyMiddleware(getServiceUrl('manager-service', 8084), 'manager-service'));
// // app.use('/vendor', createProxyMiddleware(getServiceUrl('vendor-service', 8085), 'vendor-service'));
// app.use('/auth', createProxyMiddleware(getServiceUrl('auth-service', 8081), 'auth-service'));

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);
  if (!res.headersSent) {
    res.status(500).json({
      error: isProduction ? 'Internal server error' : err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Health check
app.get('/gateway-health', (req, res) => {
  res.status(200).json({
    message: 'API Gateway is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
});

// Start server
const server = app.listen(port, host, () => {
  console.log(`🚀 API Gateway listening at http://${host}:${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  // console.log(`🔐 CORS Origins: ${JSON.stringify(allowedOrigins)}`);
  console.log('✅ Site config initialized successfully');
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