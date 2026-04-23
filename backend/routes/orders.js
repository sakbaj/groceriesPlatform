const express = require('express');
const router = express.Router();
const { Order, Cart, Product } = require('../models/Store');
const { protect } = require('../middleware/authMiddleware');

// GET /api/orders - Get user orders
router.get('/', protect, async (req, res) => {
  try {
    const orders = Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/orders/:id - Get single order by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const order = Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/orders - Create an order from cart
router.post('/', protect, async (req, res) => {
  try {
    const { customerName, address, phone } = req.body;

    if (!customerName || !address || !phone) {
      return res.status(400).json({ success: false, error: 'Customer name, address, and phone are required' });
    }

    const cart = Cart.findOne({ user: req.user.id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, error: 'Cart is empty' });
    }

    let total = 0;
    const orderItems = [];

    for (let item of cart.items) {
      const product = Product.findOne({ id: item.productId });
      if (product) {
        const subtotal = +(product.price * item.quantity).toFixed(2);
        total += subtotal;
        orderItems.push({
          productId: item.productId,
          name: product.name,
          price: product.price,
          image: product.image,
          unit: product.unit,
          quantity: item.quantity,
          subtotal
        });
      }
    }

    const order = Order.create({
      user: req.user.id,
      items: orderItems,
      total: +total.toFixed(2),
      customerName,
      address,
      phone,
      status: 'confirmed'
    });

    // Clear cart after successful order
    cart.items = [];

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
