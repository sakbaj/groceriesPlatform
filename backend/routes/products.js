const express = require('express');
const router = express.Router();
const { Product } = require('../models/Store');

// GET /api/products - List all products (with optional category/search filters)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = new RegExp(`^${category}$`, 'i');
    }

    if (search) {
      const q = new RegExp(search, 'i');
      query.$or = [
        { name: q },
        { description: q },
        { category: q }
      ];
    }

    const products = Product.find(query);
    res.json({ success: true, data: products, count: products.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/products/categories - List all unique categories
router.get('/categories', async (req, res) => {
  try {
    const categories = Product.distinct('category');
    res.json({ success: true, data: categories.sort() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    // using 'id' field, not _id
    const product = Product.findOne({ id: parseInt(req.params.id) });
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
