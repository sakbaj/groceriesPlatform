const express = require('express');
const cors = require('cors');
const path = require('path');

const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Categories endpoint (mounted under products for convenience)
const Product = require('./models/Product');
app.get('/api/categories', (req, res) => {
  const categories = Product.getCategories();
  res.json({ success: true, data: categories });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Quickbasket API is running', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║   🛒  Quickbasket API Server             ║
  ║   Running on http://localhost:${PORT}      ║
  ║   Press Ctrl+C to stop                   ║
  ╚══════════════════════════════════════════╝
  `);
});
