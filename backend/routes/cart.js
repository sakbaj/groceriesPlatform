const express = require('express');
const router = express.Router();
const { Cart, Product } = require('../models/Store');
const { protect } = require('../middleware/authMiddleware');

// Get cart for user
router.get('/', protect, async (req, res) => {
  try {
    let cart = Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = Cart.create({ user: req.user.id, items: [] });
    }

    // Populate product details and compute totals
    let total = 0;
    let itemCount = 0;
    const items = [];

    for (let item of cart.items) {
      const product = Product.findOne({ id: item.productId });
      if (product) {
        const subtotal = +(product.price * item.quantity).toFixed(2);
        total += subtotal;
        itemCount += item.quantity;
        items.push({
          productId: item.productId,
          quantity: item.quantity,
          subtotal,
          product
        });
      }
    }

    res.json({
      success: true,
      data: {
        items,
        total: +total.toFixed(2),
        itemCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add item to cart
router.post('/items', protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId) return res.status(400).json({ success: false, error: 'Product ID required' });

    let cart = Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = Cart.create({ user: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(i => i.productId === parseInt(productId));
    const qty = parseInt(quantity) || 1;

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += qty;
    } else {
      cart.items.push({ productId: parseInt(productId), quantity: qty });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update item quantity
router.put('/items/:productId', protect, async (req, res) => {
  try {
    const { quantity } = req.body;
    const productId = parseInt(req.params.productId);
    
    const cart = Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ success: false, error: 'Cart not found' });

    const itemIndex = cart.items.findIndex(i => i.productId === productId);
    if (itemIndex === -1) return res.status(404).json({ success: false, error: 'Item not in cart' });

    const qty = parseInt(quantity);
    if (qty <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = qty;
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Remove item from cart
router.delete('/items/:productId', protect, async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const cart = Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ success: false, error: 'Cart not found' });

    cart.items = cart.items.filter(i => i.productId !== productId);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Clear cart
router.delete('/', protect, async (req, res) => {
  try {
    const cart = Cart.findOne({ user: req.user.id });
    if (cart) {
      cart.items = [];
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
