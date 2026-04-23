const express = require('express');
const router = express.Router();
const { Order } = require('../models/Store');
const { protect } = require('../middleware/authMiddleware');

// GET /api/analytics
router.get('/', protect, async (req, res) => {
  try {
    const result = Order.find();
    const orders = result._data || [];
    
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    // Calculate popular items
    const itemCounts = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!itemCounts[item.productId]) {
          itemCounts[item.productId] = { name: item.name, count: 0 };
        }
        itemCounts[item.productId].count += item.quantity;
      });
    });

    const popularItems = Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // top 5

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: +totalRevenue.toFixed(2),
        popularItems
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
