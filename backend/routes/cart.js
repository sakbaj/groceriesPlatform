const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// GET /api/cart - Get current cart
router.get('/', (req, res) => {
  const cart = Cart.getCart();
  res.json({ success: true, data: cart });
});

// POST /api/cart - Add item to cart
router.post('/', (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, error: 'productId is required' });
    }
    const cart = Cart.addItem(productId, quantity || 1);
    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT /api/cart/:productId - Update item quantity
router.put('/:productId', (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity === undefined) {
      return res.status(400).json({ success: false, error: 'quantity is required' });
    }
    const cart = Cart.updateItem(req.params.productId, quantity);
    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /api/cart/:productId - Remove item from cart
router.delete('/:productId', (req, res) => {
  try {
    const cart = Cart.removeItem(req.params.productId);
    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /api/cart - Clear entire cart
router.delete('/', (req, res) => {
  const cart = Cart.clearCart();
  res.json({ success: true, data: cart });
});

module.exports = router;
