require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const { seedProducts } = require('./models/Store');

const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── CORS Configuration ────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3001',
  'http://127.0.0.1:5173',
];

// Add Vercel deployment URL
if (process.env.VERCEL_URL) {
  allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
}

// Add custom origin from env
if (process.env.CORS_ORIGIN) {
  allowedOrigins.push(process.env.CORS_ORIGIN);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman, same-origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // In production on Vercel, the frontend and API share the same origin
    // so most requests will have no origin or match VERCEL_URL
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());

// Request logging (skip in production to reduce noise)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
    next();
  });
}

// ─── Security check ────────────────────────────────────────
if (process.env.NODE_ENV === 'production' &&
    (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('supersecret'))) {
  console.warn('⚠️  WARNING: JWT_SECRET is not set or is using the default value. Set a secure JWT_SECRET environment variable for production!');
}

// Swagger Setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Quickbasket API',
      version: '1.0.0',
      description: 'Quickbasket Grocery Platform API Documentation',
    },
    servers: [
      { url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${PORT}` }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: [path.join(__dirname, 'routes', '*.js')],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Quickbasket API is running', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Seed products (on startup / cold start)
seedProducts();

// Export the app for Vercel
module.exports = app;

// Only start the server if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`
    ╔══════════════════════════════════════════╗
    ║   🛒  Quickbasket API Server             ║
    ║   Running on http://localhost:${PORT}      ║
    ║   Docs: http://localhost:${PORT}/api-docs  ║
    ║   Press Ctrl+C to stop                   ║
    ╚══════════════════════════════════════════╝
    `);
  });
}
