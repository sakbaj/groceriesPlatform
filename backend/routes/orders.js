const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// POST /api/orders - Place an order from current cart
router.post('/', (req, res) => {
  try {
    const { customerName, address, phone } = req.body;
    const cart = Cart.getCart();

    if (cart.items.length === 0) {
      return res.status(400).json({ success: false, error: 'Cart is empty' });
    }

    const order = Order.createOrder(
      Cart.getRawItems(),
      cart.total,
      { customerName, address, phone }
    );

    // Clear cart after successful order
    Cart.clearCart();

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /api/orders - List all orders
router.get('/', (req, res) => {
  const orders = Order.getAll();
  res.json({ success: true, data: orders, count: orders.length });
});

// GET /api/orders/:id - Get single order
router.get('/:id', (req, res) => {
  const order = Order.getById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  res.json({ success: true, data: order });
});

module.exports = router;
